import { NextResponse } from "next/server";
import { canSee, isAdmin, todayUK, userFromRequest } from "@/lib/drops-server";
import { PEEK_DAYS, addDays, memberWeeks, shiftAll } from "@/lib/confessions-clock";
import { CONFESSION_STORIES } from "@/lib/content/scrumptious-confessions";
import { CONFESSION_POEMS } from "@/lib/content/confession-poems";
import { MEDITATIONS } from "@/lib/content/meditations";

// "Coming this month" (Juliette 20 Nov 2026: "we should always know at least 2 weeks, or even per month, ahead
// what is coming, except for the questions"). Titles and dates only, on this member's own clock, for the 30 days
// after what they can already open. Nothing playable is sent.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await canSee(user.id, user.email, "scrumptious-confessions"))) return NextResponse.json({ error: "Not on your account" }, { status: 403 });
  const weeks = isAdmin(user.email) ? 0 : memberWeeks(user);
  const from = addDays(todayUK(), PEEK_DAYS);
  const to = addDays(from, 30);
  const within = (d: string) => d > from && d <= to;
  const items = [
    ...shiftAll(CONFESSION_STORIES, weeks).filter((s) => within(s.publish_on)).map((s) => ({ date: s.publish_on, kind: "Confession", title: s.title })),
    ...shiftAll(CONFESSION_POEMS, weeks).filter((p) => within(p.publish_on)).map((p) => ({ date: p.publish_on, kind: "Poem", title: p.title })),
    ...shiftAll(MEDITATIONS, weeks).filter((m) => within(m.publish_on)).map((m) => ({ date: m.publish_on, kind: "Meditation", title: m.title })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json({ from, to, items });
}
