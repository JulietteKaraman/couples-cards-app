import { NextResponse } from "next/server";
import { telegramSecret } from "@/lib/telegram/secret";
import { loadWall } from "@/lib/confessions-wall";
import { tellOwner } from "@/lib/telegram/owner";

// Thursday 07:00 UTC (netlify/functions/confessions-thursday.mts): tell Juliette on Telegram which questions are
// waiting, most Me too first, with the link to answer them (26 Nov 2026: "why did I not get a reminder?").
export async function POST(req: Request) {
  const secret = telegramSecret();
  if (!secret || req.headers.get("x-sweep-secret") !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  const { questions, answers } = await loadWall();
  const done = new Set(answers.map((a) => a.question_id));
  const open = questions
    .filter((q) => !q.hidden && !q.answered && !done.has(q.id))
    .sort((a, b) => b.metoo - a.metoo || a.created_at.localeCompare(b.created_at));
  const link = "https://app.feelfullyyou.com/admin/confessions";
  const text = open.length
    ? [`It's Thursday. ${open.length} question${open.length === 1 ? " is" : "s are"} waiting for you in Scrumptious Confessions:`, "",
       ...open.slice(0, 15).map((q, i) => `${i + 1}. ${q.body.replace(/\s+/g, " ").trim().slice(0, 300)}${q.metoo ? `  (Me too: ${q.metoo})` : ""}`),
       ...(open.length > 15 ? ["", `and ${open.length - 15} more.`] : []), "", `Answer them here: ${link}`].join("\n")
    : `It's Thursday. No new questions are waiting in Scrumptious Confessions this week. ${link}`;
  const sent = await tellOwner(text);
  return NextResponse.json({ ok: sent.ok, open: open.length, note: sent.description });
}
