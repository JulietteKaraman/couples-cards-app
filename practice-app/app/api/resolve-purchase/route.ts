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
    // real completed checkout, not "unpaid"). Pulls the most recent 100
    // checkout sessions WITH line items expanded in the same call (covers
    // Payment Link purchases too, since Stripe creates a real Checkout
    // Session behind every Payment Link payment) and filters client-side
    // by email, since Stripe's list endpoint doesn't reliably filter by
    // customer email. Expanding line_items up front avoids one extra
    // Stripe API round-trip per candidate session — an account with many
    // past purchases (e.g. the business's own email, used for testing)
    // was timing out the function doing those serially.
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.line_items"],
    });

    const candidates = sessions.data.filter(
      (s) =>
        (s.payment_status === "paid" || s.payment_status === "no_payment_required") &&
        s.customer_details?.email?.toLowerCase() === normalizedEmail
    );

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
