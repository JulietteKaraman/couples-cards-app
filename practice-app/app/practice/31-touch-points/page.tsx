"use client";

import Link from "next/link";
import Image from "next/image";
import VoicePlayer from "@/components/VoicePlayer";

// Juliette's welcome to the month. Drop the file into
// public/31-touch-points/audio/ and put its name here. It shows only before
// Day 1 is done. Empty = nothing shows.
const WELCOME_31TP = "welcome.m4a";
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
      <Suspense fallback={<main className="min-h-screen bg-[#070707]" />}>
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
  const nextUp = days.find((e) => dayOf(e.slug) === consecutive + 1);
  const [lockNote, setLockNote] = useState<string | null>(null);

  const finished = doneSlugs !== null && doneCount >= days.length;
  const today = current && !waiting ? current : null;

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_50%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-16 pt-6">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E] transition hover:border-[#DDC98E]"
        >
          ← Your library
        </Link>

        <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">The month</p>
        <h1 className="mt-1 font-display text-4xl font-light">31 Touch Points</h1>

        {/* Progress */}
        <div className="mt-6 flex items-end gap-3">
          <span className="font-display text-5xl font-light leading-none text-[#DDC98E]">{doneSlugs === null ? "·" : doneCount}</span>
          <span className="pb-1 text-[rgba(254,252,250,0.78)]">of 31 done</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]">
          <div className="h-full rounded-full bg-[#DDC98E] transition-all duration-700" style={{ width: `${(doneCount / 31) * 100}%` }} />
        </div>

        {/* TODAY */}
        {doneSlugs !== null && (
          <div className="mt-8 overflow-hidden rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] shadow-[0_0_70px_-24px_rgba(221,201,142,0.4)]">
            {finished ? (
              <div className="p-6 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">You finished the month</p>
                <p className="mt-3 text-[15px] leading-relaxed">
                  All thirty one done. Every one of them is yours to go back to, and you can swap who leads.
                </p>
              </div>
            ) : today ? (
              <Link href={`/practice/31-touch-points/${today.slug}`} className="group block">
                {today.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={today.image} alt={today.imageAlt ?? ""} fill sizes="672px" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,53,53,0.95)] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Today · Day {unlockedThrough}</p>
                  <h2 className="mt-1 font-display text-2xl font-light">{stripDay(today.title)}</h2>
                  <span className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707] transition group-hover:bg-[#EEDE80]">
                    {doneCount === 0 ? "Start day 1" : `Open day ${unlockedThrough}`}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Today&rsquo;s is done</p>
                <h2 className="mt-1 font-display text-2xl font-light">
                  {nextUp ? `Day ${dayOf(nextUp.slug)} opens ${whenItOpens(dueAt)}.` : "The next one opens soon."}
                </h2>
                <p className="mt-2 text-sm text-[rgba(254,252,250,0.78)]">Nothing is lost if you miss a day. It waits for you.</p>
              </div>
            )}
          </div>
        )}

        {WELCOME_31TP && doneSlugs !== null && doneCount === 0 && (
          <div className="mt-6">
            <VoicePlayer src={`/31-touch-points/audio/${WELCOME_31TP}`} label="Welcome to the month" dark />
          </div>
        )}

        {/* Admin banner. A buyer never sees this. */}
        {user?.email?.toLowerCase() === ADMIN_EMAIL && (
          <div className="mt-6 rounded-2xl border border-[rgba(221,201,142,0.35)] px-4 py-3 text-sm text-[rgba(254,252,250,0.78)]">
            {asBuyer ? (
              <>
                You are seeing this the way a buyer sees it, so the lock is on.{" "}
                <Link href="?asbuyer=0" className="text-[#DDC98E] underline">Give me the whole month back</Link>
              </>
            ) : (
              <>
                You are the admin, so every day is open to you.{" "}
                <Link href="?asbuyer=1" className="text-[#DDC98E] underline">Show me what a buyer sees</Link>
              </>
            )}
          </div>
        )}

        {/* THE FIVE OPENING READS */}
        <h2 className="mt-12 font-display text-xl font-light">Start here</h2>
        <p className="mt-1 text-sm text-[rgba(254,252,250,0.78)]">Five short reads before day one.</p>
        <ul className="mt-4 grid gap-2">
          {essays.map((e) => {
            const read = done.includes(e.slug);
            return (
              <li key={e.slug}>
                <Link
                  href={`/practice/31-touch-points/${e.slug}`}
                  className="flex min-h-[52px] items-center gap-3 rounded-2xl border-[1.5px] border-[rgba(221,201,142,0.4)] bg-[rgba(13,53,53,0.35)] px-4 py-3 transition hover:border-[#DDC98E]"
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${read ? "bg-[#DDC98E] text-[#070707]" : "border border-[rgba(221,201,142,0.5)] text-[#DDC98E]"}`}>
                    {read ? "✓" : "·"}
                  </span>
                  <span>{e.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* THE THIRTY ONE DAYS, by week */}
        {WEEKS.map((w) => (
          <section key={w.name} className="mt-12">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-light">{w.name}</h2>
              <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-[#DDC98E]">Days {w.from} to {w.to}</span>
            </div>
            <p className="mt-1 text-sm text-[rgba(254,252,250,0.78)]">{w.line}</p>

            <ul className="mt-4 grid gap-2">
              {days
                .filter((e) => dayOf(e.slug) >= w.from && dayOf(e.slug) <= w.to)
                .map((e) => {
                  const n = dayOf(e.slug);
                  const isDone = done.includes(e.slug);
                  const locked = !isAdmin && doneSlugs !== null && n > unlockedThrough;
                  const isNext = !isDone && n === unlockedThrough;
                  const isNextUp = locked && n === consecutive + 1;
                  const cls = `flex min-h-[52px] w-full items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3 text-left transition ${
                    isNext
                      ? "border-[#DDC98E] bg-[rgba(13,53,53,0.6)]"
                      : locked
                        ? "border-[rgba(221,201,142,0.15)] bg-transparent"
                        : "border-[rgba(221,201,142,0.4)] bg-[rgba(13,53,53,0.35)] hover:border-[#DDC98E]"
                  }`;
                  const inner = (
                    <>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs ${
                          isDone
                            ? "bg-[#DDC98E] text-[#070707]"
                            : isNext
                              ? "bg-[#DDC98E] text-[#070707] shadow-[0_0_14px_rgba(221,201,142,0.6)]"
                              : locked
                                ? "border border-[rgba(221,201,142,0.2)] text-[rgba(254,252,250,0.35)]"
                                : "border border-[rgba(221,201,142,0.5)] text-[#DDC98E]"
                        }`}
                      >
                        {isDone ? "✓" : n}
                      </span>
                      <span className={`flex-1 ${locked ? "text-[rgba(254,252,250,0.4)]" : ""}`}>{stripDay(e.title)}</span>
                      {isNext && <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-[#DDC98E]">Open</span>}
                      {isNextUp && dueAt > 0 && (
                        <span className="shrink-0 text-xs text-[rgba(254,252,250,0.5)]">{whenItOpens(dueAt)}</span>
                      )}
                      {locked && !isNextUp && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[rgba(221,201,142,0.45)]" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                      )}
                    </>
                  );
                  return (
                    <li key={e.slug}>
                      {locked ? (
                        <button type="button" className={cls} onClick={() => setLockNote(e.slug === lockNote ? null : e.slug)}>
                          {inner}
                        </button>
                      ) : (
                        <Link href={`/practice/31-touch-points/${e.slug}`} className={cls}>{inner}</Link>
                      )}
                      {lockNote === e.slug && (
                        <p className="px-4 pt-2 text-sm text-[#DDC98E]">
                          {isNextUp && dueAt > 0 ? `This one opens ${whenItOpens(dueAt)}.` : `This one opens after Day ${n - 1}.`}
                        </p>
                      )}
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        <p className="mt-12 border-t border-[rgba(221,201,142,0.2)] pt-6 text-sm text-[rgba(254,252,250,0.78)]">
          Nothing is lost if you miss a day. It waits for you, exactly where you left it.
        </p>
      </div>
    </main>
  );
}
