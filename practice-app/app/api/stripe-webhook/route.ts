import { NextResponse } from "next/server";
import Stripe from "stripe";
import { grantEntitlement } from "@/lib/entitlements/grant";
import {
  PRICE_ID_TO_DECK_TYPE,
  SUBSCRIPTION_DECK_TYPES,
  SUBSCRIPTION_GRACE_PERIOD_HOURS,
} from "@/lib/entitlements/config";

// Members App spec R13/E1/E2. Every other product in this app is a
// one-time purchase, matched on sign-in against real Stripe checkout
// sessions (see resolve-purchase) — that pattern is correct for a
// permanent, one-time grant, but a subscription needs an ongoing signal:
// something has to notice when a renewal succeeds, or stop noticing when
// it doesn't. This webhook is that new capability, deliberately scoped to
// subscription deck_types only (SUBSCRIPTION_DECK_TYPES) — it does not
// touch or duplicate resolve-purchase's one-time-purchase matching.
//
// The whole 48-hour-grace rule (R13, E1 voluntary cancel, E2 failed
// renewal) is implemented with ONE mechanism, not two: every time a
// period is successfully paid for (invoice.paid — this fires for both the
// very first subscription payment and every renewal), expires_at is set
// to that period's end plus the grace window. If the member cancels, no
// further invoice.paid events ever arrive, so the expires_at already on
// file — the end of the period they did pay for, plus grace — is what
// naturally cuts them off (E1). If a renewal payment fails, the same is
// true: no new invoice.paid fires, so the previous period's expires_at
// (already in the past or about to be) is what ends access (E2). No
// separate "subscription.deleted" or "payment_failed" handler needed —
// both cases are just the absence of the one event that extends access.
export async function POST(req: Request) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_MEMBERS_APP_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error("stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_MEMBERS_APP_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "signature verification failed";
    console.error("stripe-webhook: signature check failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      // Ignore invoices for anything that isn't a subscription this app
      // grants entitlements for — a one-time purchase never generates an
      // "invoice" object in the first place, so in practice this filter
      // only ever excludes invoices from products entirely unrelated to
      // this app (e.g. anything else on the same Stripe account).
      const subscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : invoice.parent?.subscription_details?.subscription?.id;
      if (!subscriptionId) return NextResponse.json({ received: true, skipped: "not a subscription invoice" });

      const priceField = invoice.lines.data[0]?.pricing?.price_details?.price;
      const priceId = typeof priceField === "string" ? priceField : priceField?.id;
      const deckType = priceId ? PRICE_ID_TO_DECK_TYPE[priceId] : undefined;
      if (!deckType || !SUBSCRIPTION_DECK_TYPES.includes(deckType)) {
        return NextResponse.json({ received: true, skipped: "price not a known subscription deck_type" });
      }

      const email = invoice.customer_email;
      if (!email) {
        console.error("stripe-webhook: invoice.paid with no customer_email, invoice", invoice.id);
        return NextResponse.json({ received: true, skipped: "no customer email on invoice" });
      }

      const periodEndSeconds = invoice.lines.data[0]?.period?.end;
      if (!periodEndSeconds) {
        console.error("stripe-webhook: invoice.paid with no line-item period end, invoice", invoice.id);
        return NextResponse.json({ received: true, skipped: "no period end on invoice" });
      }

      const expiresAt = new Date(
        periodEndSeconds * 1000 + SUBSCRIPTION_GRACE_PERIOD_HOURS * 60 * 60 * 1000
      ).toISOString();

      await grantEntitlement(email, deckType, invoice.id ?? subscriptionId, undefined, expiresAt);

      return NextResponse.json({ received: true, granted: deckType, expires_at: expiresAt });
    }

    // Every other event type is intentionally a no-op — see the module
    // comment for why cancellation and failed-payment don't need their
    // own handlers.
    return NextResponse.json({ received: true, skipped: `unhandled event type ${event.type}` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("stripe-webhook: handler error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
