import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin, userFromRequest } from "@/lib/drops-server";
import { CONFESSION_CARDS, CONFESSION_STORIES } from "@/lib/content/scrumptious-confessions";

// Juliette only: totals per story and card, plus every answer sent to her.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  const [{ data: counts, error: e1 }, { data: messages, error: e2 }] = await Promise.all([
    supabaseAdmin.from("confession_counts").select("item_id, kind, value").limit(50000),
    supabaseAdmin.from("confession_messages").select("id, item_title, body, member_email, emailed, created_at").order("created_at", { ascending: false }).limit(1000),
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
