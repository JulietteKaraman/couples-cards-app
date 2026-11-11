import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin, userFromRequest } from "@/lib/drops-server";
import { CONFESSION_CARDS, CONFESSION_STORIES } from "@/lib/content/scrumptious-confessions";

// Juliette only: totals per story and card, Touch Base days, and the questions bank:
// every answer, question and confession sent from the app or posted in her Telegram group.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  const [{ data: counts, error: e1 }, { data: messages, error: e2 }] = await Promise.all([
    supabaseAdmin.from("confession_counts").select("item_id, kind, value").limit(50000),
    supabaseAdmin.from("confession_messages").select("id, item_title, body, kind, source, answered, created_at").order("created_at", { ascending: false }).limit(1000),
  ]);
  if (e1 || e2) return NextResponse.json({ error: (e1 || e2)?.message }, { status: 500 });

  const totals: Record<string, Record<string, Record<string, number>>> = {};
  for (const c of counts || []) {
    const item = (totals[c.item_id] ??= {});
    const kind = (item[c.kind] ??= {});
    kind[c.value] = (kind[c.value] || 0) + 1;
  }
  const items = [
    ...CONFESSION_STORIES.map((s) => ({ id: s.id, title: s.title, type: "story", publish_on: s.publish_on })),
    ...CONFESSION_CARDS.map((c) => ({ id: c.id, title: c.prompt, type: "card", publish_on: c.publish_on })),
  ].sort((a, b) => b.publish_on.localeCompare(a.publish_on));
  return NextResponse.json({ items, totals, messages: messages || [] });
}

// Mark one as answered (or not). Nothing is ever deleted.
export async function PATCH(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const id = String(b.id || "");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("confession_messages").update({ answered: b.answered === true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
