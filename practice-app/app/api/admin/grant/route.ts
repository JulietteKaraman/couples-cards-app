import { DOORS_OPEN } from "@/lib/confessions-clock";
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

  let body: { email?: string; deckType?: string; note?: string; length?: string; until?: string };
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
    // "One month free" (20 Nov 2026): access ends by itself after 30 days, nothing to remember.
    const month = body.length === "month";
    // "One week free" (21 Nov 2026): Juliette gives guests a free week in return for a testimonial.
    const week = body.length === "week";
    // "Three months free" (22 Nov 2026, Juliette): 90 days from doors open, ends by itself.
    const three = body.length === "three";
    const marker = body.length === "date" ? `admin-grant-until-${Date.now()}` : three ? `admin-grant-3months-${Date.now()}` : month ? `admin-grant-month-${Date.now()}` : week ? `admin-grant-week-${Date.now()}` : `admin-grant-${Date.now()}`;
    // A free month given before doors open counts from doors open (Juliette 20 Nov 2026: her 4 ladies to Wed 23 Dec).
    const startMs = Math.max(Date.now(), Date.parse(`${DOORS_OPEN}T00:00:00Z`));
    // "Pick an end date" (23 Nov 2026): access ends at the end of that day, UK time is close enough at 23:59 UTC.
    const untilMs = body.length === "date" && body.until ? Date.parse(`${body.until}T23:59:00Z`) : NaN;
    const expiresAt = !Number.isNaN(untilMs) ? new Date(untilMs).toISOString() : three ? new Date(startMs + 90 * 86400 * 1000).toISOString() : month ? new Date(startMs + 30 * 86400 * 1000).toISOString() : week ? new Date(startMs + 7 * 86400 * 1000).toISOString() : undefined;
    const userId = await grantEntitlement(email, deckType, marker, undefined, expiresAt);

    // A gifted Confessions member gets every member email, same as a paying one
    // (Juliette 22 Nov 2026: "they still get all the emails"). Before this, admin
    // grants never reached Kit, so gifted members got the app but no emails.
    // Member tag + the gift welcome + the daily emails.
    // Never blocks the grant.
    let kit = "skipped";
    if (deckType === "scrumptious-confessions" && process.env.KIT_API_KEY) {
      const headers = { "X-Kit-Api-Key": process.env.KIT_API_KEY, "Content-Type": "application/json", Accept: "application/json" };
      const payload = JSON.stringify({ email_address: email });
      try {
        await fetch("https://api.kit.com/v4/subscribers", { method: "POST", headers, body: payload });
        const t = await fetch("https://api.kit.com/v4/tags/25769563/subscribers", { method: "POST", headers, body: payload });
        // Gifted tag (Juliette 23 Nov 2026): keeps free members off the paying-member emails
        // (the "before your first £111" reminder goes to Kit segment 610264 = Member minus Gifted).
        await fetch("https://api.kit.com/v4/tags/26318266/subscribers", { method: "POST", headers, body: payload });
        // Gift welcome (no money in it) + the daily first week, then Mondays. Never the paid welcome 2968362,
        // which talks about the free week and payment.
        const q = await fetch("https://api.kit.com/v4/sequences/2981858/subscribers", { method: "POST", headers, body: payload });
        await fetch("https://api.kit.com/v4/sequences/2981859/subscribers", { method: "POST", headers, body: payload });
        kit = t.ok && q.ok ? "member emails on" : `kit ${t.status}/${q.status}`;
      } catch (e) {
        kit = "kit failed";
        console.error("admin/grant: kit failed", e instanceof Error ? e.message : e);
      }
    }

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
      kit,
      decks: decks ?? [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("admin/grant error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
