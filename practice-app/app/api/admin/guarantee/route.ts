import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// 31 Touch Points "do the work" guarantee (Juliette, 9 Nov 2026).
// Refund if at least 21 of the 31 days are done, claimed between day 31 and
// day 60 after purchase. Buyers ask by email; Juliette looks them up here.
// Shows THAT days were done and when, never anything they wrote.
// Admin only, checked on the server against her own session.
const DECK = "31-touch-points";
const NEEDED = 21;
// The "filled in before it counts" check went live with this build. Days ticked
// before it were counted on "I did it" alone.
const FILL_CHECK_FROM = "2026-11-09";

export async function GET(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { data: me } = await supabaseAdmin.auth.getUser(token);
  if (me?.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  }

  const email = (new URL(req.url).searchParams.get("email") || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Type their email" }, { status: 400 });

  // Find the buyer by email.
  let userId: string | null = null;
  for (let page = 1; page <= 20 && !userId; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) break;
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    if (data.users.length < 200) break;
  }
  if (!userId) return NextResponse.json({ found: false, email });

  const { data: deck } = await supabaseAdmin
    .from("user_decks")
    .select("purchased_at")
    .eq("user_id", userId)
    .eq("deck_type", DECK)
    .maybeSingle();

  const { data: rows } = await supabaseAdmin
    .from("practice_progress")
    .select("entry_slug, completed_at")
    .eq("user_id", userId)
    .eq("deck_type", DECK);

  const byDay = new Map<number, string>();
  for (const r of rows ?? []) {
    const m = String(r.entry_slug).match(/^day-(\d+)/);
    if (!m) continue;
    const day = parseInt(m[1], 10);
    const at = r.completed_at as string;
    if (!byDay.has(day) || (at && at < (byDay.get(day) as string))) byDay.set(day, at);
  }
  const days = [...byDay.entries()].sort((a, b) => a[0] - b[0]).map(([day, at]) => ({ day, at }));

  const purchasedAt: string | null = deck?.purchased_at ?? null;
  const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * 86400000).toISOString();
  const windowOpens = purchasedAt ? addDays(purchasedAt, 31) : null;
  const windowCloses = purchasedAt ? addDays(purchasedAt, 60) : null;
  const now = new Date().toISOString();

  return NextResponse.json({
    found: true,
    email,
    owns: !!deck,
    purchasedAt,
    windowOpens,
    windowCloses,
    inWindow: !!(windowOpens && windowCloses && now >= windowOpens && now <= windowCloses),
    needed: NEEDED,
    doneCount: days.length,
    meets: days.length >= NEEDED,
    fillCheckFrom: FILL_CHECK_FROM,
    days,
  });
}
