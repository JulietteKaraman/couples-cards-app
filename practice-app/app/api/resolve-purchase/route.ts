import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { deckTypesForApp } from "@/lib/entitlements/config";

// Spec R5: someone who bought 10 Touch Rituals before this system existed
// resolves automatically the first time they sign in with that email —
// matched against a REAL Stripe purchase, never against Kit tags or
// manually-granted (Pleasure Bundle / comped) access (spec R6).
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const TEN_TOUCH_RITUALS_PRICE_ID = "price_1Tlpu0CCw18geY15b8J3jlBW";

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

    if (existingDecks && existingDecks.length > 0) {
      return NextResponse.json({
        resolved: false,
        already_entitled: true,
        decks: existingDecks.map((d) => d.deck_type),
      });
    }

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    // Real Stripe purchases only (spec R6 — free/comped access is never
    // matched here, since it never created a Stripe charge).
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      customer_details: { email: normalizedEmail } as never,
    });

    const paidMatch = sessions.data.find(
      (s) =>
        s.payment_status === "paid" &&
        s.customer_details?.email?.toLowerCase() === normalizedEmail &&
        s.line_items?.data?.some(
          (li) => li.price?.id === TEN_TOUCH_RITUALS_PRICE_ID
        )
    );

    // Stripe's list API doesn't expand line_items by default; fall back to
    // checking each candidate session's price via metadata or a direct
    // session retrieve if the quick filter above found nothing.
    let matchedSessionId: string | null = paidMatch?.id ?? null;

    if (!matchedSessionId) {
      const candidates = sessions.data.filter(
        (s) =>
          s.payment_status === "paid" &&
          s.customer_details?.email?.toLowerCase() === normalizedEmail
      );
      for (const candidate of candidates) {
        const full = await stripe.checkout.sessions.retrieve(candidate.id, {
          expand: ["line_items"],
        });
        const hasRituals = full.line_items?.data?.some(
          (li) => li.price?.id === TEN_TOUCH_RITUALS_PRICE_ID
        );
        if (hasRituals) {
          matchedSessionId = full.id;
          break;
        }
      }
    }

    if (!matchedSessionId) {
      return NextResponse.json({ resolved: false, already_entitled: false });
    }

    await grantEntitlement(normalizedEmail, "ten-touch-rituals", matchedSessionId);

    return NextResponse.json({ resolved: true, deck_type: "ten-touch-rituals" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("resolve-purchase error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
