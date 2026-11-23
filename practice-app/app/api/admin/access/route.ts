import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// Change how long someone keeps access Juliette gave them (23 Nov 2026).
// Same trust model as /api/admin/grant: the caller's own session is checked server-side.
// Only rows she gave (admin-grant-*) or free places (free-*) can change: paying access belongs to Stripe.
export async function POST(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { data: me, error: meError } = await supabaseAdmin.auth.getUser(token);
  if (meError || !me?.user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (me.user.email?.toLowerCase() !== ADMIN_EMAIL) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  let body: { userId?: string; deckType?: string; length?: string; until?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { userId, deckType, length, until } = body;
  if (!userId || !deckType || !length) return NextResponse.json({ error: "Missing details" }, { status: 400 });

  const { data: row, error: rowError } = await supabaseAdmin
    .from("user_decks").select("stripe_checkout_session_id")
    .eq("user_id", userId).eq("deck_type", deckType).maybeSingle();
  if (rowError || !row) return NextResponse.json({ error: "Couldn't find that access." }, { status: 404 });
  if (!/^(admin-grant-|free-)/.test(String(row.stripe_checkout_session_id || ""))) {
    return NextResponse.json({ error: "This one is paid through Stripe, so it can't be changed here." }, { status: 400 });
  }

  const day = 86400 * 1000;
  let expiresAt: string | null;
  if (length === "forever") expiresAt = null;
  else if (length === "three") expiresAt = new Date(Date.now() + 90 * day).toISOString();
  else if (length === "month") expiresAt = new Date(Date.now() + 30 * day).toISOString();
  else if (length === "week") expiresAt = new Date(Date.now() + 7 * day).toISOString();
  else if (length === "end") expiresAt = new Date(Date.now() - 1000).toISOString();
  else if (length === "date" && until && !Number.isNaN(Date.parse(`${until}T23:59:00Z`))) expiresAt = new Date(Date.parse(`${until}T23:59:00Z`)).toISOString();
  else return NextResponse.json({ error: "Pick how long." }, { status: 400 });

  const { error: upError } = await supabaseAdmin
    .from("user_decks").update({ expires_at: expiresAt })
    .eq("user_id", userId).eq("deck_type", deckType);
  if (upError) return NextResponse.json({ error: upError.message }, { status: 500 });
  return NextResponse.json({ ok: true, expires_at: expiresAt });
}
