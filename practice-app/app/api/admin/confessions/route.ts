import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin, userFromRequest } from "@/lib/drops-server";
import { CONFESSION_CARDS, CONFESSION_STORIES } from "@/lib/content/scrumptious-confessions";
import { WALL_KINDS, loadWall } from "@/lib/confessions-wall";

// Juliette only: totals per story and card, Touch Base days, and the questions bank:
// every answer, question and confession sent from the app or posted in her Telegram group.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  const [{ data: counts, error: e1 }, { data: messages, error: e2 }] = await Promise.all([
    supabaseAdmin.from("confession_counts").select("item_id, kind, value").limit(50000),
    supabaseAdmin.from("confession_messages").select("id, item_title, body, kind, source, answered, created_at").not("kind", "in", `(${[...WALL_KINDS, "system"].join(",")})`).order("created_at", { ascending: false }).limit(1000),
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
  // The questions wall (20 Nov 2026): Me too counts, hidden, and her answers, per question.
  let wall: Record<string, { metoo: number; hidden: boolean; answer: string | null }> = {};
  const sharedMap: Record<string, string> = {};
  try {
    const { questions, answers } = await loadWall();
    const all = await loadWall();
    wall = Object.fromEntries(questions.map((q) => [q.id, { metoo: q.metoo, hidden: q.hidden, answer: answers.find((a) => a.question_id === q.id)?.answer ?? null }]));
    for (const s of all.shared) sharedMap[s.confession_id] = s.body;
  } catch {}
  const { data: nightly } = await supabaseAdmin.from("confession_messages").select("body, created_at").eq("kind", "system").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return NextResponse.json({ items, totals, messages: messages || [], wall, shared: sharedMap, nightly: nightly || null });
}

// Mark one as answered (or not). Questions are never deleted (only their hidden flag or answer is replaced).
export async function PATCH(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const id = String(b.id || "");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

  // The questions wall (20 Nov 2026): answer, hide or show, edit the wording.
  if (b.action === "hide" || b.action === "show") {
    await supabaseAdmin.from("confession_messages").delete().eq("kind", "hidden").eq("item_id", id);
    if (b.action === "hide") {
      const { error } = await supabaseAdmin.from("confession_messages").insert({ item_id: id, item_title: "Hidden", body: "-", member_email: null, kind: "hidden", source: "app", answered: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }
  if (b.action === "share" || b.action === "unshare") {
    await supabaseAdmin.from("confession_messages").delete().eq("kind", "shared").eq("item_id", id);
    if (b.action === "share") {
      const text = String(b.body || "").trim();
      if (!text) return NextResponse.json({ error: "Nothing to share" }, { status: 400 });
      const { error } = await supabaseAdmin.from("confession_messages").insert({ item_id: id, item_title: "Shared confession", body: text, member_email: null, kind: "shared", source: "app", answered: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }
  if (b.action === "edit") {
    const body = String(b.body || "").trim();
    if (!body) return NextResponse.json({ error: "Nothing to save" }, { status: 400 });
    const { error } = await supabaseAdmin.from("confession_messages").update({ body }).eq("id", id).eq("kind", "question");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "answer") {
    const answer = String(b.answer || "").trim();
    const { data: q } = await supabaseAdmin.from("confession_messages").select("body").eq("id", id).eq("kind", "question").maybeSingle();
    if (!q) return NextResponse.json({ error: "Unknown question" }, { status: 400 });
    // One answer per question: a new one replaces the old.
    await supabaseAdmin.from("confession_messages").delete().eq("kind", "answer").eq("item_id", id);
    if (answer) {
      const { error } = await supabaseAdmin.from("confession_messages").insert({ item_id: id, item_title: q.body, body: answer, member_email: null, kind: "answer", source: "app", answered: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await supabaseAdmin.from("confession_messages").update({ answered: !!answer }).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin.from("confession_messages").update({ answered: b.answered === true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
