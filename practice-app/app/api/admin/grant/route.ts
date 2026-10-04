import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { deckTypesForApp } from "@/lib/entitlements/config";

// Hand-granting access, added 4 Oct 2026.
//
// Why this exists: on 1 Oct four women redeemed a 100% promo code on the
// 31 Touch Points payment link. All four completed a real Stripe checkout
// and all four were tagged in Kit, but not one of them got app access —
// the site webhook's grant step failed silently inside its own try/catch.
// Before this route there was no way to put a person in without the
// Supabase service role key, which lives only in Netlify. Juliette hands
// out comped access at retreats routinely, so that gap was going to keep
// costing her.
//
// Trust model matches app/api/admin/buyers: the service role key bypasses
// RLS, so the caller's own Supabase session is verified SERVER-side and
// checked against ADMIN_EMAIL. The client-side page gate is not trusted.
// Never loosen this to accept an email in the body as proof of identity.
//
// grantEntitlement get-or-creates the Supabase auth user, so granting to
// someone who has never signed in works: the entitlement sits waiting and
// the first magic link they request lands them straight inside.
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (userData.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  }

  let body: { email?: string; deckType?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = (body.email || "").toLowerCase().trim();
  const deckType = (body.deckType || "").trim();

  // Deliberately strict: a typo'd email silently creates a real account
  // nobody owns, and the person still can't get in.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That doesn't look like an email address." },
      { status: 400 }
    );
  }
  if (!deckTypesForApp().includes(deckType)) {
    return NextResponse.json(
      { error: `Unknown product "${deckType}".` },
      { status: 400 }
    );
  }

  try {
    // Marker instead of a Stripe checkout id, so a comped grant is always
    // tellable from a real purchase in the user_decks row itself.
    const marker = `admin-grant-${Date.now()}`;
    const userId = await grantEntitlement(email, deckType, marker);

    // Read back what this person now holds, so the screen proves the grant
    // landed rather than just claiming it did.
    const { data: decks } = await supabaseAdmin
      .from("user_decks")
      .select("deck_type, purchased_at, stripe_checkout_session_id")
      .eq("user_id", userId)
      .in("deck_type", deckTypesForApp());

    return NextResponse.json({
      ok: true,
      email,
      granted: deckType,
      decks: decks ?? [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("admin/grant error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
