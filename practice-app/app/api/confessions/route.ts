import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canSee, todayUK, userFromRequest } from "@/lib/drops-server";
import { CONFESSION_CARDS, CONFESSION_STORIES } from "@/lib/content/scrumptious-confessions";

// Scrumptious Confessions membership (specs/scrumptious-confessions-membership.md).
//   GET                               opened stories and cards, plus what's next
//   POST {action:"count", ...}        anonymous tally, no name, email or typed words
//   POST {action:"send", ...}         an answer for Juliette, saved with no name
const SLUG = "scrumptious-confessions";
const LANDED = ["ick", "nothing", "nice", "mmm", "goosebumps", "toes-curl"];
const WHERE = ["chest", "belly", "genitals", "elsewhere", "nowhere"];
const MAX = 2000;

async function member(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return { err: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  if (!(await canSee(user.id, user.email, SLUG))) return { err: NextResponse.json({ error: "Not on your account" }, { status: 403 }) };
  return { user };
}

const opened = <T extends { publish_on: string }>(items: T[], today: string) =>
  items.filter((i) => i.publish_on <= today).sort((a, b) => b.publish_on.localeCompare(a.publish_on));

export async function GET(req: Request) {
  const m = await member(req);
  if (m.err) return m.err;
  const today = todayUK();
  const upcoming = [
    ...CONFESSION_STORIES.filter((s) => s.publish_on > today).map((s) => ({ kind: "story", publish_on: s.publish_on })),
    ...CONFESSION_CARDS.filter((c) => c.publish_on > today).map((c) => ({ kind: "card", publish_on: c.publish_on })),
  ].sort((a, b) => a.publish_on.localeCompare(b.publish_on));
  return NextResponse.json({
    today,
    stories: opened(CONFESSION_STORIES, today),
    cards: opened(CONFESSION_CARDS, today),
    nextStory: upcoming.find((u) => u.kind === "story")?.publish_on ?? null,
    nextCard: upcoming.find((u) => u.kind === "card")?.publish_on ?? null,
  });
}

export async function POST(req: Request) {
  const m = await member(req);
  if (m.err) return m.err;
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const itemId = String(b.item || "");
  const today = todayUK();
  const story = CONFESSION_STORIES.find((s) => s.id === itemId && s.publish_on <= today);
  const card = CONFESSION_CARDS.find((c) => c.id === itemId && c.publish_on <= today);
  if (!story && !card) return NextResponse.json({ error: "Unknown item" }, { status: 400 });

  if (b.action === "count") {
    const kind = String(b.kind || "");
    const value = String(b.value || "");
    const ok = (kind === "landed" && LANDED.includes(value)) || (kind === "where" && WHERE.includes(value)) || (kind === "card_answered" && value === "yes");
    if (!ok) return NextResponse.json({ error: "Invalid count" }, { status: 400 });
    await supabaseAdmin.from("confession_counts").insert({ item_id: itemId, kind, value });
    return NextResponse.json({ ok: true });
  }

  if (b.action === "send") {
    const body = String(b.body || "").trim();
    if (!body) return NextResponse.json({ error: "Nothing to send" }, { status: 400 });
    if (body.length > MAX) return NextResponse.json({ error: "Too long" }, { status: 400 });
    // Always anonymous (5 Nov 2026, Juliette): no name or email is stored with her words.
    const title = story ? `${story.title}: what she'd love next` : `Card: ${card!.prompt}`;
    const { error } = await supabaseAdmin
      .from("confession_messages")
      .insert({ item_id: itemId, item_title: title, body, member_email: null });
    if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
