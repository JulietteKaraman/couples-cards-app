// THE DRIP for 31 Touch Points, in one place.
//
// Extracted 30 Sep 2026. The rule used to live inside the [slug] page only.
// The Month screen needs exactly the same answer, and two copies of a rule
// this fiddly would drift apart within a week. Both screens now call this.
//
// The rule, ported from the cards app so the two products never behave
// differently: the next day opens at whichever is LATER, twelve hours after
// you marked the last day done, or the start of the next calendar day.
// Counting from the last advance rather than from first ever open means time
// away never piles up into a backlog of days to catch up on.
//
// Juliette, 30 Sep: "If it says done, then they can go to the next day. I
// would like there to be at least a few hours in between." Twelve hours plus
// a new calendar day is the floor, so the shortest real gap is twelve hours
// and the usual gap is overnight.

import type { PracticeEntry } from "./ten-touch-rituals";

export const ADV_KEY = "ffy.31tp.lastadvance";
export const ASBUYER_KEY = "ffy.31tp.asbuyer";
export const TWELVE_H = 12 * 60 * 60 * 1000;

/** Day number from a slug, or 0 for the five opening essays. */
export function dayOf(slug: string): number {
  const m = slug.match(/^day-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

export function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

export function lsSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private window, or storage full. The gate then falls open, which is the
       kinder failure: never lock a paying buyer out over a storage quirk. */
  }
}

export function lsRemove(k: string) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* same as above */
  }
}

export function nextDayStart(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime() + 86400000;
}

/** Human phrasing for a moment in the near future. Never states a clock time. */
export function whenItOpens(dueAt: number): string {
  const hrs = Math.max(1, Math.round((dueAt - Date.now()) / 3600000));
  if (hrs <= 1) return "in about an hour";
  if (hrs < 20) return `in about ${hrs} hours`;
  return "tomorrow";
}

export type DripState = {
  /** Days done back to back from day 1. */
  consecutive: number;
  /** The highest day number currently open. */
  unlockedThrough: number;
  /** When the next day comes due, or 0 if nothing is waiting on the clock. */
  dueAt: number;
  /** True when the wait is over, or when nothing has been done yet. */
  clockPassed: boolean;
};

export function computeDrip(args: {
  entries: PracticeEntry[];
  doneSlugs: string[];
  /** Newest DAY completion timestamp from the database, or null. */
  lastDone: number | null;
  now: number;
}): DripState {
  const { entries, doneSlugs, lastDone, now } = args;

  let consecutive = 0;
  while (consecutive < 31) {
    const e = entries.find((x) => dayOf(x.slug) === consecutive + 1);
    if (e && doneSlugs.includes(e.slug)) consecutive += 1;
    else break;
  }

  // The database timestamp is the authority, because it is the same on every
  // device and it survives a cleared browser. localStorage is only a fallback
  // for the minutes before the row has been read back.
  const localAdv = parseInt(lsGet(ADV_KEY) ?? "0", 10) || 0;
  const lastAdv = Math.max(lastDone ?? 0, localAdv);
  const dueAt = lastAdv ? Math.max(lastAdv + TWELVE_H, nextDayStart(lastAdv)) : 0;
  const clockPassed = !lastAdv || now >= dueAt;
  const unlockedThrough = consecutive === 0 ? 1 : clockPassed ? consecutive + 1 : consecutive;

  return { consecutive, unlockedThrough, dueAt, clockPassed };
}

// THE FIVE WEEKS, named the same as the sales page so a buyer recognises where
// they are. Days 22-26 and 27-31 are short on purpose: the practices get longer.
export const WEEKS: Array<{ name: string; from: number; to: number; line: string }> = [
  {
    name: "Play",
    from: 1,
    to: 7,
    line: "Almost nothing asks anything of your body yet.",
  },
  {
    name: "Noticing",
    from: 8,
    to: 14,
    line: "You start to feel what is actually happening while it happens.",
  },
  {
    name: "Giving",
    from: 15,
    to: 21,
    line: "Touch with somewhere to go, and someone deciding where.",
  },
  {
    name: "Opening",
    from: 22,
    to: 26,
    line: "Slower, longer, and asking out loud for the thing you want.",
  },
  {
    name: "Staying",
    from: 27,
    to: 31,
    line: "The longest containers in the month.",
  },
];

export function weekOf(day: number) {
  return WEEKS.find((w) => day >= w.from && day <= w.to);
}

/**
 * Whether the admin bypass is active.
 *
 * Juliette sees the whole month by default, because she has to be able to read
 * day 24 to tell me what is wrong with day 24. `?asbuyer=1` turns the bypass
 * off and sticks, so she can walk the product the way a buyer meets it without
 * owning a second account. `?asbuyer=0` turns it back on.
 */
export function adminBypassActive(email: string | null | undefined, adminEmail: string): boolean {
  if (!email || email.toLowerCase() !== adminEmail) return false;
  return lsGet(ASBUYER_KEY) !== "1";
}
