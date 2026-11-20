import { supabaseAdmin } from "@/lib/supabase/admin";

// The questions wall (Juliette 20 Nov 2026: "all the questions of that week are shown to all the members,
// and then I answer them"; questions show STRAIGHT AWAY, she hides or edits any at any time).
// Telegram is gone: the app is the one place. No new table: everything lives in confession_messages,
// told apart by kind, so nothing needs running in the database first.
//   kind "question"  a member's question (no name, ever)
//   kind "metoo"     one Me too tap, item_id = the question's id
//   kind "hidden"    Juliette took it off the wall, item_id = the question's id (deleted to show it again)
//   kind "answer"    her answer, item_id = the question's id, item_title = the question as shown
export const WALL_KINDS = ["metoo", "hidden", "answer"];

export type WallQuestion = { id: string; body: string; created_at: string; metoo: number; answered: boolean; hidden: boolean };
export type WallAnswer = { id: string; question_id: string; question: string; answer: string; created_at: string };

type Row = { id: string; item_id: string; item_title: string; body: string; kind: string; source: string; answered: boolean; created_at: string };

/** The Monday (UK) of this week, as an ISO timestamp for comparisons. */
export function weekStartISO(now = new Date()) {
  const uk = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now);
  const d = new Date(`${uk}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString();
}

export async function loadWall() {
  const { data, error } = await supabaseAdmin
    .from("confession_messages")
    .select("id, item_id, item_title, body, kind, source, answered, created_at")
    .in("kind", ["question", ...WALL_KINDS])
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(error.message);
  const rows = (data || []) as Row[];
  const metoo: Record<string, number> = {};
  const hidden = new Set<string>();
  const answers: WallAnswer[] = [];
  for (const r of rows) {
    if (r.kind === "metoo") metoo[r.item_id] = (metoo[r.item_id] || 0) + 1;
    else if (r.kind === "hidden") hidden.add(r.item_id);
    else if (r.kind === "answer") answers.push({ id: r.id, question_id: r.item_id, question: r.item_title, answer: r.body, created_at: r.created_at });
  }
  // Only questions asked in the app: old Telegram posts were tests and never go on the wall.
  const questions: WallQuestion[] = rows
    .filter((r) => r.kind === "question" && r.source === "app")
    .map((r) => ({ id: r.id, body: r.body, created_at: r.created_at, metoo: metoo[r.id] || 0, answered: r.answered, hidden: hidden.has(r.id) }));
  return { questions, answers };
}

/** What members see: every open question not hidden (most Me too first), this week's answers, and all answers. */
export async function memberWall() {
  const { questions, answers } = await loadWall();
  const since = weekStartISO();
  const open = questions
    .filter((q) => !q.hidden && !q.answered)
    .sort((a, b) => b.metoo - a.metoo || b.created_at.localeCompare(a.created_at))
    .slice(0, 60)
    .map(({ id, body, metoo, created_at }) => ({ id, body, metoo, created_at }));
  return {
    questions: open,
    thisWeek: answers.filter((a) => a.created_at >= since),
    answers,
  };
}
