// THE DRIP for One Touch, 27 Oct 2026. Same rule as The Sacred No and
// 31 Touch Points, built on the same helpers so they never behave
// differently: the next day opens at whichever is LATER, twelve hours after
// the last day was marked done, or the start of the next calendar day.
// Welcome opens with Day 1 and never moves the clock.

import { lsGet, nextDayStart, TWELVE_H } from "./31-touch-points-drip";

export const OT_ADV_KEY = "ffy.onetouch.lastadvance";

export const OT_DAY_OF: Record<string, number> = {
  welcome: 1,
  "your-own-touch": 1,
  "moving-the-energy": 2,
  "saying-yes-when-your-body-said-no": 3,
  "what-youve-never-dared-ask-for": 4,
  "a-time-you-felt-free": 5,
  "layering-the-touch": 6,
  "the-body-youve-been-at-war-with": 7,
};

export const OT_DAY_LESSON: Record<number, string> = {
  1: "your-own-touch",
  2: "moving-the-energy",
  3: "saying-yes-when-your-body-said-no",
  4: "what-youve-never-dared-ask-for",
  5: "a-time-you-felt-free",
  6: "layering-the-touch",
  7: "the-body-youve-been-at-war-with",
};

export function otDayOf(slug: string): number {
  return OT_DAY_OF[slug] ?? 1;
}

export function otMovesClock(slug: string): boolean {
  return Object.values(OT_DAY_LESSON).includes(slug);
}

export function computeOneTouchDrip(args: { doneSlugs: string[]; lastDone: number | null; now: number }) {
  const { doneSlugs, lastDone, now } = args;
  let consecutive = 0;
  while (consecutive < 7 && doneSlugs.includes(OT_DAY_LESSON[consecutive + 1])) consecutive += 1;
  const localAdv = parseInt(lsGet(OT_ADV_KEY) ?? "0", 10) || 0;
  const lastAdv = Math.max(lastDone ?? 0, localAdv);
  const dueAt = lastAdv ? Math.max(lastAdv + TWELVE_H, nextDayStart(lastAdv)) : 0;
  const clockPassed = !lastAdv || now >= dueAt;
  const unlockedThrough = Math.min(7, consecutive === 0 ? 1 : clockPassed ? consecutive + 1 : consecutive);
  return { consecutive, unlockedThrough, dueAt: clockPassed ? 0 : dueAt };
}
