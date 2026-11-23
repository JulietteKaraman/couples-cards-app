import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { deckTypesForApp } from "@/lib/entitlements/config";

// Reads via the service role key (bypasses RLS by design), so this route
// verifies the caller's own Supabase session server-side rather than
// trusting the client-side page gate alone.
export async function GET(req: Request) {
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

  const { data: decks, error: decksError } = await supabaseAdmin
    .from("user_decks")
    .select("user_id, deck_type, purchased_at, stripe_checkout_session_id, expires_at")
    .in("deck_type", deckTypesForApp());

  if (decksError) {
    return NextResponse.json({ error: decksError.message }, { status: 500 });
  }

  const userIds = Array.from(new Set((decks ?? []).map((d) => d.user_id)));
  // One paged read of every account instead of one request per person: the per-person
  // lookups made the admin list hang on "Loading…" (23 Nov 2026).
  const emailsByUserId: Record<string, string> = {};
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) break;
    for (const u of data.users) if (u.email) emailsByUserId[u.id] = u.email;
    if (data.users.length < 1000) break;
  }

  const { data: progressRows } = await supabaseAdmin
    .from("practice_progress")
    .select("user_id, deck_type, entry_slug")
    .in(
      "user_id",
      userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]
    );

  const progressCount: Record<string, number> = {};
  for (const row of progressRows ?? []) {
    const key = `${row.user_id}:${row.deck_type}`;
    progressCount[key] = (progressCount[key] ?? 0) + 1;
  }

  const buyers = (decks ?? []).map((d) => ({
    user_id: d.user_id,
    expires_at: d.expires_at,
    // Only access Juliette gave (or a free place) can be changed from the admin page; paying is Stripe's.
    changeable: /^(admin-grant-|free-)/.test(String(d.stripe_checkout_session_id || "")),
    email: emailsByUserId[d.user_id] ?? "(unknown)",
    deck_type: d.deck_type,
    purchased_at: d.purchased_at,
    // How they hold it (19 Nov 2026): free week, paying, given by Juliette, free, or ended.
    status: d.expires_at && new Date(d.expires_at) <= new Date() ? "Ended"
      : String(d.stripe_checkout_session_id || "").startsWith("trial-") ? "Free week"
      : String(d.stripe_checkout_session_id || "").startsWith("admin-grant-") ? "Given by you"
      : String(d.stripe_checkout_session_id || "").startsWith("free-") ? "Free"
      : "Paying",
    completed_count: progressCount[`${d.user_id}:${d.deck_type}`] ?? 0,
  }));

  return NextResponse.json({ buyers });
}
