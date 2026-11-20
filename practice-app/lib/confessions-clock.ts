// Scrumptious Confessions: each member's own clock (Juliette, 20 Nov 2026: "If someone joins in a month's
// time, they don't get the whole library that's open until then, but they start at month one").
//
// The dated lists (confessions, cards, poems, meditations, The Touch Map) are the LAUNCH group's
// schedule, which starts on DOORS_OPEN. Every other member gets the same schedule moved forward by
// whole weeks, so their week one is the week they joined (from that week's Monday). Weekdays stay
// as promised: confessions Mondays, cards Mondays and Thursdays, poems Wednesdays, meditations Fridays.
//
// The start date lives in the member's auth app_metadata (confessions_start, a UK date), written once
// by grantEntitlement. No start = the launch group (shift 0): everyone who joined before doors opened,
// and the How to Feel Like a Woman women.

export const DOORS_OPEN = "2026-11-23";
export const START_KEY = "confessions_start";
/** Juliette 20 Nov 2026: "You can go 2 days ahead, but you can't go much further than that." */
export const PEEK_DAYS = 2;

const DAY = 86_400_000;
const toMs = (d: string) => Date.parse(`${d}T12:00:00Z`);
const toDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const addDays = (d: string, n: number) => toDate(toMs(d) + n * DAY);

/** The Monday on or before this date. */
export function mondayOf(d: string) {
  const dow = new Date(toMs(d)).getUTCDay(); // 0 Sunday
  return addDays(d, -((dow + 6) % 7));
}

/** Whole weeks between the launch Monday and the Monday of this start date (never below 0). */
export function weeksFromStart(start?: string | null) {
  if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return 0;
  const diff = Math.round((toMs(mondayOf(start)) - toMs(DOORS_OPEN)) / DAY);
  return diff > 0 ? Math.floor(diff / 7) : 0;
}

/** This member's shift in weeks, read from the signed-in user. */
export function memberWeeks(user: { app_metadata?: Record<string, unknown> } | null | undefined) {
  return weeksFromStart((user?.app_metadata?.[START_KEY] as string | undefined) ?? null);
}

/** A launch date moved onto this member's clock. */
export const onMyClock = (publishOn: string, weeks: number) => (weeks ? addDays(publishOn, weeks * 7) : publishOn);

/** Items with publish_on moved onto this member's clock. */
export const shiftAll = <T extends { publish_on: string }>(items: T[], weeks: number): T[] =>
  weeks ? items.map((i) => ({ ...i, publish_on: onMyClock(i.publish_on, weeks) })) : items;
