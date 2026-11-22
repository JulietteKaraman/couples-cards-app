import { NextResponse } from "next/server";
import Stripe from "stripe";
import { userFromRequest } from "@/lib/drops-server";
import { stripeClient } from "@/lib/confessions-access";

// POST /api/confessions/manage: the "Manage or cancel my membership" button (Juliette, 22 Nov 2026:
// "a lot will cancel... this should all be able to be done by you and agents").
// Opens Stripe's own page for the SIGNED-IN member only, where they can cancel, change their card or
// see their payments. Only the member can cancel their own membership: never by email.
// Cancelling stops at the end of the period they paid for; the webhook's expires_at (period end + 48h)
// then closes access by itself, and everything opened in a paid month stays theirs.
const RETURN = "https://app.feelfullyyou.com/practice/scrumptious-confessions";

async function portalConfig(stripe: Stripe): Promise<string | undefined> {
  // Use the account's default portal settings if they exist; otherwise make one, once, for Confessions.
  const list = await stripe.billingPortal.configurations.list({ limit: 20 });
  const mine = list.data.find((c) => c.metadata?.purpose === "scrumptious-confessions" && c.active);
  if (mine) return mine.id;
  if (list.data.some((c) => c.is_default && c.active && c.features.subscription_cancel.enabled)) return undefined;
  const c = await stripe.billingPortal.configurations.create({
    business_profile: { headline: "Scrumptious Confessions" },
    features: {
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "unused", "missing_features", "other"],
        },
      },
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "name"] },
    },
    metadata: { purpose: "scrumptious-confessions" },
  });
  return c.id;
}

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const stripe = stripeClient();
  if (!stripe) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  try {
    const customers = await stripe.customers.list({ email: user.email.toLowerCase().trim(), limit: 10 });
    // The customer who has (or had) a Confessions subscription, newest first.
    let customer: string | null = null;
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 10 });
      if (subs.data.length) { customer = c.id; break; }
    }
    // Gifted members have no Stripe customer: there is nothing to pay and nothing to cancel.
    if (!customer) return NextResponse.json({ gift: true });
    const configuration = await portalConfig(stripe);
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: RETURN,
      ...(configuration ? { configuration } : {}),
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("confessions manage:", (e as Error).message);
    return NextResponse.json({ error: "Could not open right now" }, { status: 500 });
  }
}
