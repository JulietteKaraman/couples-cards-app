import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canSee, isAdmin, todayUK, userFromRequest } from "@/lib/drops-server";
import { CONFESSION_CARDS as LAUNCH_CARDS, CONFESSION_STORIES as LAUNCH_STORIES } from "@/lib/content/scrumptious-confessions";
import { PEEK_DAYS, addDays, memberWeeks, shiftAll } from "@/lib/confessions-clock";

// Scrumptious Confessions membership (specs/scrumptious-confessions-membership.md).
//   GET                               opened stories and cards, plus what's next
//   POST {action:"count", ...}        anonymous tally, no name, email or typed words
//   POST {action:"send", ...}         an answer, question or confession for Juliette, saved with no name
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
  // Each member's own clock (lib/confessions-clock.ts): the launch schedule moved to the week they joined.
  const weeks = isAdmin(m.user!.email) ? 0 : memberWeeks(m.user);
  const CONFESSION_STORIES = shiftAll(LAUNCH_STORIES, weeks);
  const CONFESSION_CARDS = shiftAll(LAUNCH_CARDS, weeks);
  let today = todayUK();
  // Owner preview (Juliette 17 Nov 2026, to film the app): she sees the app as it will look
  // on the next confession's Monday. Members always see only what has opened.
  if (isAdmin(m.user!.email)) {
    const next = CONFESSION_STORIES.map((s) => s.publish_on).filter((d) => d > today).sort()[0];
    if (next) today = next;
  }
  // Juliette 20 Nov 2026: members can open up to two days ahead, never further.
  today = addDays(today, PEEK_DAYS);
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
    weeks,
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
  const today = addDays(todayUK(), PEEK_DAYS);
  const weeks = isAdmin(m.user!.email) ? 0 : memberWeeks(m.user);
  const CONFESSION_STORIES = shiftAll(LAUNCH_STORIES, weeks);
  const CONFESSION_CARDS = shiftAll(LAUNCH_CARDS, weeks);
  const story = CONFESSION_STORIES.find((s) => s.id === itemId && s.publish_on <= today);
  const card = CONFESSION_CARDS.find((c) => c.id === itemId && c.publish_on <= today);
  // 11 Nov 2026: members ask questions and add confessions of their own, not tied to a story.
  const open = itemId === "question" || itemId === "confession" || itemId === "touchbase";
  if (!story && !card && !open) return NextResponse.json({ error: "Unknown item" }, { status: 400 });

  if (b.action === "count") {
    const kind = String(b.kind || "");
    const value = String(b.value || "");
    const ok =
      (!!story && kind === "landed" && LANDED.includes(value)) ||
      (!!story && kind === "where" && WHERE.includes(value)) ||
      (!!card && kind === "card_answered" && value === "yes") ||
      (itemId === "touchbase" && kind === "touchbase_done" && value === "yes");
    if (!ok) return NextResponse.json({ error: "Invalid count" }, { status: 400 });
    await supabaseAdmin.from("confession_counts").insert({ item_id: itemId, kind, value });
    return NextResponse.json({ ok: true });
  }

  if (b.action === "send") {
    const body = String(b.body || "").trim();
    if (!body) return NextResponse.json({ error: "Nothing to send" }, { status: 400 });
    if (body.length > MAX) return NextResponse.json({ error: "Too long" }, { status: 400 });
    // Always anonymous (5 Nov 2026, Juliette): no name or email is stored with her words.
    if (itemId === "touchbase") return NextResponse.json({ error: "Nothing to send" }, { status: 400 });
    const kind = story ? "love_next" : card ? "card" : itemId;
    const title = story ? `${story.title}: what they'd love next` : card ? `Card: ${card.prompt}` : itemId === "question" ? "A question" : "A confession";
    const { data: saved, error } = await supabaseAdmin
      .from("confession_messages")
      .insert({ item_id: itemId, item_title: title, body, member_email: null, kind, source: "app" })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
    // The id goes back to that phone only, so it can show "I answered you" later. Still no name stored.
    return NextResponse.json({ ok: true, id: saved?.id ?? null });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
