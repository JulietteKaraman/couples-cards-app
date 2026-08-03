import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { deckTypesForApp, PRICE_ID_TO_DECK_TYPE } from "@/lib/entitlements/config";

// Spec R5 (Rituals) / R4 (Unspoken Distance): someone who bought a real
// product before this system existed, or before they first signed in,
// resolves automatically the first time they sign in with that email —
// matched against a REAL Stripe purchase, never against Kit tags or
// manually-granted (Pleasure Bundle / comped) access (spec R6/R8).
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Already entitled to something in this app? Nothing to resolve.
    const { data: existingDecks } = await supabaseAdmin
      .from("user_decks")
      .select("deck_type")
      .eq("user_id", userId)
      .in("deck_type", deckTypesForApp());

    const alreadyEntitledDeckTypes = new Set(
      (existingDecks ?? []).map((d) => d.deck_type)
    );

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    // Real Stripe purchases only (spec R6/R8 — free/comped access is never
    // matched here, since it never created a Stripe charge, though a 100%-
    // off coupon still counts: Stripe marks that "no_payment_required", a
    // real completed checkout, not "unpaid"). Stripe's list endpoint doesn't
    // reliably filter by customer email, so this paginates through recent
    // sessions (created in the last 30 days, up to 500) and filters
    // client-side. A single un-paginated call for "the most recent 100"
    // silently failed for real buyers whenever 100+ OTHER checkout sessions
    // happened anywhere on the account afterwards (any product, including
    // our own repeated test checkouts while building this) — their session
    // aged out of the window before they ever clicked their magic link, and
    // resolve-purchase found nothing with no error, no retry, forever
    // (Juliette, 3 Aug 2026 — free 10 Touch Rituals buyers signing in but
    // never getting the guide). Expanding line_items up front avoids one
    // extra Stripe API round-trip per candidate session.
    const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
    const createdAfter = Math.floor(Date.now() / 1000) - THIRTY_DAYS_SECONDS;
    const MAX_PAGES = 5; // up to 500 sessions, ~30 days back

    const candidates: Stripe.Checkout.Session[] = [];
    let startingAfter: string | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await stripe.checkout.sessions.list({
        limit: 100,
        created: { gte: createdAfter },
        expand: ["data.line_items"],
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

      for (const s of result.data) {
        if (
          (s.payment_status === "paid" || s.payment_status === "no_payment_required") &&
          s.customer_details?.email?.toLowerCase() === normalizedEmail
        ) {
          candidates.push(s);
        }
      }

      if (!result.has_more || result.data.length === 0) break;
      startingAfter = result.data[result.data.length - 1].id;
    }

    // Match each candidate session's line items against every known
    // product price ID, granting every product actually paid for that
    // this account doesn't already have — not just the first match.
    const grantedDeckTypes: string[] = [];

    for (const candidate of candidates) {
      const priceIds = (candidate.line_items?.data ?? []).map(
        (li) => li.price?.id
      );

      for (const priceId of priceIds) {
        if (!priceId) continue;
        const deckType = PRICE_ID_TO_DECK_TYPE[priceId];
        if (!deckType) continue;
        if (alreadyEntitledDeckTypes.has(deckType)) continue;
        if (grantedDeckTypes.includes(deckType)) continue;

        // Same fix as ensure-free-access: this route already has the real
        // authenticated userId, so pass it straight through instead of
        // making grantEntitlement re-find it via a paginated email lookup.
        await grantEntitlement(normalizedEmail, deckType, candidate.id, userId);
        grantedDeckTypes.push(deckType);
      }
    }

    if (grantedDeckTypes.length === 0) {
      return NextResponse.json({
        resolved: false,
        already_entitled: alreadyEntitledDeckTypes.size > 0,
        decks: Array.from(alreadyEntitledDeckTypes),
      });
    }

    return NextResponse.json({ resolved: true, deck_types: grantedDeckTypes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("resolve-purchase error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
