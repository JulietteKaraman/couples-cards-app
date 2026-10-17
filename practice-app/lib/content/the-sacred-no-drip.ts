// THE DRIP for The Sacred No, 17 Oct 2026.
//
// Juliette, the day it launched: lessons should "only open day by day when
// they have done them, like the 31 Touch Points". Same rule as 31 Touch
// Points, and the same helpers, so the two products never behave differently:
// the next day opens at whichever is LATER, twelve hours after the last day
// was marked done, or the start of the next calendar day.
//
// Her split: Day 1 is Welcome plus lesson 1, days 2 to 7 are one lesson each,
// and the Bonus meditation opens with day 7. A day counts as done when its
// LESSON is marked done. Welcome and the bonus never move the clock.

import type { PracticeEntry } from "./ten-touch-rituals";
import { lsGet, nextDayStart, TWELVE_H } from "./31-touch-points-drip";

export const SN_ADV_KEY = "ffy.sacredno.lastadvance";

/** Which day each entry belongs to. */
export const SN_DAY_OF: Record<string, number> = {
  welcome: 1,
  "why-is-no-so-difficult": 1,
  "body-as-a-compass": 2,
  "rrrr-process": 3,
  "touch-base": 4,
  "standards-with-others": 5,
  "standards-with-self": 6,
  "the-last-day": 7,
  "bonus-meditation": 7,
};

/** The lesson that has to be marked done to finish each day. */
export const SN_DAY_LESSON: Record<number, string> = {
  1: "why-is-no-so-difficult",
  2: "body-as-a-compass",
  3: "rrrr-process",
  4: "touch-base",
  5: "standards-with-others",
  6: "standards-with-self",
  7: "the-last-day",
};

export function snDayOf(slug: string): number {
  return SN_DAY_OF[slug] ?? 1;
}

/** True if marking this entry done should start the clock on the next day. */
export function snMovesClock(slug: string): boolean {
  return Object.values(SN_DAY_LESSON).includes(slug);
}

export type SnDripState = {
  /** Days finished back to back from day 1. */
  consecutive: number;
  /** The highest day currently open. */
  unlockedThrough: number;
  /** When the next day comes due, or 0 if nothing is waiting on the clock. */
  dueAt: number;
};

export function computeSacredNoDrip(args: {
  doneSlugs: string[];
  /** Newest LESSON completion timestamp from the database, or null. */
  lastDone: number | null;
  now: number;
}): SnDripState {
  const { doneSlugs, lastDone, now } = args;
  let consecutive = 0;
  while (consecutive < 7 && doneSlugs.includes(SN_DAY_LESSON[consecutive + 1])) consecutive += 1;

  // Database time is the authority (same on every device); localStorage only
  // covers the moments before the new row has been read back.
  const localAdv = parseInt(lsGet(SN_ADV_KEY) ?? "0", 10) || 0;
  const lastAdv = Math.max(lastDone ?? 0, localAdv);
  const dueAt = lastAdv ? Math.max(lastAdv + TWELVE_H, nextDayStart(lastAdv)) : 0;
  const clockPassed = !lastAdv || now >= dueAt;
  const unlockedThrough = Math.min(
    7,
    consecutive === 0 ? 1 : clockPassed ? consecutive + 1 : consecutive
  );
  return { consecutive, unlockedThrough, dueAt: clockPassed ? 0 : dueAt };
}

/** The entries, in order, that are not open yet. */
export function snLockedSlugs(entries: PracticeEntry[], unlockedThrough: number): string[] {
  return entries.filter((e) => snDayOf(e.slug) > unlockedThrough).map((e) => e.slug);
}
