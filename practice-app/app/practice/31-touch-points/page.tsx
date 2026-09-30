"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { thirtyOneTouchPoints } from "@/lib/content/31-touch-points";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { getCompletedWithTimes } from "@/lib/entitlements/progress";
import {
  ASBUYER_KEY,
  WEEKS,
  adminBypassActive,
  computeDrip,
  dayOf,
  lsGet,
  lsRemove,
  lsSet,
  whenItOpens,
} from "@/lib/content/31-touch-points-drip";

// THE MONTH SCREEN.
//
// Built 30 Sep 2026. Juliette: "at the moment it shows all days, I thought
// that would lock like on the cards app and maybe show the days?" Then, once
// the lock was explained: "Build the month screen. I think that would be
// great."
//
// Two things were true at once. The lock WAS already real for a buyer, and she
// could not see it because her own address skips the gate so she can read day
// 24 without buying her own product. What genuinely did not exist was any way
// to SEE the month: this page used to redirect straight into day 1 and you
// moved with prev/next arrows, so nobody could feel the shape of it or watch
// it open. This screen is that. (It replaces the 27 Aug "dont need to index
// page" note, which was about 10 Touch Rituals, a single continuous guide.)
//
// Locked titles are shown on purpose. "Taking For Your Pleasure" and "Don't
// Use Your Hands" sitting greyed out four days ahead is the tease, and it is
// the reason to come back tomorrow. Only the content is withheld.
export default function ThirtyOneTouchPointsMonth() {
  return (
    <CollectionGate collectionSlug={thirtyOneTouchPoints.slug}>
      <Suspense fallback={<main className="min-h-screen bg-ffy-cream" />}>
        <MonthContent />
      </Suspense>
    </CollectionGate>
  );
}

/** "Day 7. Your Second Date" becomes "Your Second Date" */
const stripDay = (title: string) => title.replace(/^Day\s+\d+\.\s*/, "");

function MonthContent() {
  const { user } = useAuth();
  const search = useSearchParams();
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [asBuyer, setAsBuyer] = useState(false);

  // ?asbuyer=1 sticks, so she can walk the whole product the way a buyer meets
  // it without signing up a second address. ?asbuyer=0 hands the keys back.
  useEffect(() => {
    const q = search.get("asbuyer");
    if (q === "1") lsSet(ASBUYER_KEY, "1");
    if (q === "0") lsRemove(ASBUYER_KEY);
    setAsBuyer(lsGet(ASBUYER_KEY) === "1");
  }, [search]);

  // Re-check the clock every minute so a day that comes due while the page is
  // open unlocks itself, rather than needing a refresh nobody thinks to do.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const entries = thirtyOneTouchPoints.entries;
  const essays = entries.filter((e) => dayOf(e.slug) === 0);
  const days = entries.filter((e) => dayOf(e.slug) > 0);

  useEffect(() => {
    if (!user) return;
    getCompletedWithTimes(user.id, "31-touch-points").then((rows) => {
      setDoneSlugs(rows.map((r) => r.slug));
      const times = rows.filter((r) => dayOf(r.slug) > 0 && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user]);

  const done = doneSlugs ?? [];
  const { consecutive, unlockedThrough, dueAt, clockPassed } = computeDrip({
    entries,
    doneSlugs: done,
    lastDone,
    now,
  });

  const isAdmin = adminBypassActive(user?.email, ADMIN_EMAIL) && !asBuyer;
  const doneCount = days.filter((e) => done.includes(e.slug)).length;
  const current = days.find((e) => dayOf(e.slug) === unlockedThrough);
  const waiting = !clockPassed && consecutive > 0 && dueAt > 0;

  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← Your library
        </Link>

        <p className="mt-7 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">The month</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
          31 Touch Points
        </h1>

        <p className="mt-4 text-ffy-black/70">
          {doneSlugs === null
            ? " "
            : doneCount >= days.length
              ? "All thirty one done. Every one of them is yours to go back to, and you can swap who leads."
              : doneCount === 0
                ? "One a day, in order. Day one is open whenever you are."
                : waiting
                  ? `${doneCount} of 31 done. The next one opens ${whenItOpens(dueAt)}.`
                  : `${doneCount} of 31 done. The next one is open now.`}
        </p>

        {current && doneSlugs !== null && !waiting && (
          <Link
            href={`/practice/31-touch-points/${current.slug}`}
            className="mt-6 inline-block rounded-full bg-ffy-gold px-6 py-3 font-display text-sm font-medium text-white transition hover:opacity-90"
          >
            {doneCount === 0 ? "Start day 1" : `Open day ${unlockedThrough}`}
          </Link>
        )}

        {/* Admin banner. A buyer never sees this. */}
        {user?.email?.toLowerCase() === ADMIN_EMAIL && (
          <div className="mt-8 rounded-lg border border-ffy-gold-deep/30 bg-ffy-gold-deep/5 px-4 py-3 text-sm text-ffy-brown">
            {asBuyer ? (
              <>
                You are seeing this the way a buyer sees it, so the lock is on.{" "}
                <Link href="?asbuyer=0" className="font-medium text-ffy-gold-deep underline">
                  Give me the whole month back
                </Link>
              </>
            ) : (
              <>
                You are the admin, so every day is open to you.{" "}
                <Link href="?asbuyer=1" className="font-medium text-ffy-gold-deep underline">
                  Show me what a buyer sees
                </Link>
              </>
            )}
          </div>
        )}

        {/* THE FIVE OPENING READS. Always open, no clock on them. */}
        <h2 className="mt-12 font-display text-lg font-semibold text-ffy-teal">Start here</h2>
        <p className="mt-1 text-sm text-ffy-brown">
          Five short reads before day one.
        </p>
        <ul className="mt-4 divide-y divide-ffy-border border-y border-ffy-border">
          {essays.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/practice/31-touch-points/${e.slug}`}
                className="flex items-center gap-3 py-3.5 transition hover:bg-ffy-gold-deep/5"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                    done.includes(e.slug)
                      ? "bg-ffy-teal text-ffy-cream"
                      : "border border-ffy-gold-deep/40 text-ffy-gold-deep"
                  }`}
                >
                  {done.includes(e.slug) ? "✓" : "·"}
                </span>
                <span className="text-ffy-black">{e.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* THE THIRTY ONE DAYS, grouped by the weeks the sales page names. */}
        {WEEKS.map((w) => (
          <section key={w.name} className="mt-11">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ffy-teal">{w.name}</h2>
              <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-ffy-gold-deep">
                Days {w.from} to {w.to}
              </span>
            </div>
            <p className="mt-1 text-sm text-ffy-brown">{w.line}</p>

            <ul className="mt-4 divide-y divide-ffy-border border-y border-ffy-border">
              {days
                .filter((e) => dayOf(e.slug) >= w.from && dayOf(e.slug) <= w.to)
                .map((e) => {
                  const n = dayOf(e.slug);
                  const isDone = done.includes(e.slug);
                  // Never flash a lock while progress is still loading.
                  const locked = !isAdmin && doneSlugs !== null && n > unlockedThrough;
                  const isNext = !isDone && n === unlockedThrough;
                  const isNextUp = locked && n === consecutive + 1;

                  const row = (
                    <div
                      className={`flex items-center gap-3 py-3.5 ${
                        locked ? "cursor-default" : "transition hover:bg-ffy-gold-deep/5"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs ${
                          isDone
                            ? "bg-ffy-teal text-ffy-cream"
                            : isNext
                              ? "bg-ffy-gold text-white"
                              : locked
                                ? "border border-ffy-border text-ffy-black/30"
                                : "border border-ffy-gold-deep/40 text-ffy-gold-deep"
                        }`}
                      >
                        {isDone ? "✓" : n}
                      </span>

                      <span
                        className={`flex-1 ${
                          locked
                            ? "text-ffy-black/35"
                            : isNext
                              ? "font-medium text-ffy-black"
                              : "text-ffy-black"
                        }`}
                      >
                        {stripDay(e.title)}
                      </span>

                      {isNext && (
                        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.1em] text-ffy-gold-deep">
                          Open
                        </span>
                      )}
                      {isNextUp && dueAt > 0 && (
                        <span className="shrink-0 text-xs text-ffy-black/40">
                          {whenItOpens(dueAt)}
                        </span>
                      )}
                    </div>
                  );

                  return (
                    <li key={e.slug}>
                      {locked ? row : <Link href={`/practice/31-touch-points/${e.slug}`}>{row}</Link>}
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        <p className="mt-12 border-t border-ffy-border pt-6 text-sm text-ffy-brown">
          Nothing is lost if you miss a day. It waits for you, exactly where you left it.
        </p>
      </div>
    </main>
  );
}
