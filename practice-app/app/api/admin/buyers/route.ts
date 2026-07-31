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
    .select("user_id, deck_type, purchased_at")
    .in("deck_type", deckTypesForApp());

  if (decksError) {
    return NextResponse.json({ error: decksError.message }, { status: 500 });
  }

  const userIds = Array.from(new Set((decks ?? []).map((d) => d.user_id)));
  const emailsByUserId: Record<string, string> = {};
  for (const uid of userIds) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(uid);
    if (data?.user?.email) emailsByUserId[uid] = data.user.email;
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
    email: emailsByUserId[d.user_id] ?? "(unknown)",
    deck_type: d.deck_type,
    purchased_at: d.purchased_at,
    completed_count: progressCount[`${d.user_id}:${d.deck_type}`] ?? 0,
  }));

  return NextResponse.json({ buyers });
}
