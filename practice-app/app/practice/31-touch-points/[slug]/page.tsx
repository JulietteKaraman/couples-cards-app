"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { thirtyOneTouchPoints } from "@/lib/content/31-touch-points";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { getCompletedWithTimes, markComplete } from "@/lib/entitlements/progress";
import {
  ADV_KEY,
  adminBypassActive,
  computeDrip,
  dayOf,
  lsSet,
  whenItOpens,
} from "@/lib/content/31-touch-points-drip";

export default function TouchPointEntry() {
  return (
    <CollectionGate collectionSlug={thirtyOneTouchPoints.slug}>
      <TouchPointEntryContent />
    </CollectionGate>
  );
}

// The drip rule and its helpers moved into lib/content/31-touch-points-drip.ts
// on 30 Sep 2026, when the Month screen was built. Two copies of a rule this
// fiddly would have drifted apart within a week.

function TouchPointEntryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Re-check the clock every minute so a day that comes due while the page is
  // open unlocks itself, rather than needing a refresh nobody thinks to do.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const entries = thirtyOneTouchPoints.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  useEffect(() => {
    if (!user || !entry) return;
    getCompletedWithTimes(user.id, "31-touch-points").then((rows) => {
      const slugs = rows.map((r) => r.slug);
      setDoneSlugs(slugs);
      setCompleted(slugs.includes(entry.slug));
      // Only DAY completions move the clock. Reading an essay does not.
      const times = rows.filter((r) => dayOf(r.slug) > 0 && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user, entry]);

  if (!entry) notFound();

  // The five opening reads tick themselves off when opened (24 Oct 2026), so
  // the month screen can show which ones have been read. They never move the
  // day clock (only day completions do).
  useEffect(() => {
    if (!user || !entry || dayOf(entry.slug) > 0 || doneSlugs === null) return;
    if (doneSlugs.includes(entry.slug)) return;
    markComplete(user.id, "31-touch-points", entry.slug).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, entry, doneSlugs === null]);

  async function handleMarkComplete() {
    if (!user || !entry) return;
    await markComplete(user.id, "31-touch-points", entry.slug);
    setCompleted(true);
    setDoneSlugs((prev) => (prev && prev.includes(entry.slug) ? prev : [...(prev ?? []), entry.slug]));
    // Marking done starts the clock on tomorrow. It does not open it.
    if (dayOf(entry.slug) > 0) {
      lsSet(ADV_KEY, String(Date.now()));
      setNow(Date.now());
    }
  }

  // ONE DAY AT A TIME. Juliette, 30 Sep: "we had decided that it would only
  // open day by day". `unlockMode: "sequential"` on the collection is only a
  // string and nothing in the app ever read it, so every day was reachable
  // by prev/next or by typing the URL. This is the real gate.
  //
  // The three essays are always open, and so is day 1. Day N opens once day
  // N-1 has been marked done. That matches what she says in The Container
  // recording: "if you skip a day, it doesn't matter, it will be there for
  // you the next time you come back to the app."
  const done = doneSlugs ?? [];

  const { consecutive, unlockedThrough, dueAt } = computeDrip({
    entries,
    doneSlugs: done,
    lastDone,
    now,
  });
  const thisDay = dayOf(entry.slug);
  // doneSlugs === null means progress has not loaded yet: never flash a lock.
  // Juliette sees the whole month. She has to be able to read day 24 to tell
  // me what is wrong with day 24, and buying her own product to review it is
  // absurd. Same single address /admin already gates on. The Month screen's
  // "Show me what a buyer sees" link turns that bypass off when she wants to
  // walk the product the way a buyer meets it.
  const isAdmin = adminBypassActive(user?.email, ADMIN_EMAIL);
  const locked = !isAdmin && doneSlugs !== null && thisDay > unlockedThrough;
  const lastOpen = entries.find((x) => dayOf(x.slug) === unlockedThrough);

  const prev = entries[index - 1];
  const nextRaw = entries[index + 1];
  const next = !isAdmin && nextRaw && dayOf(nextRaw.slug) > unlockedThrough ? undefined : nextRaw;

  const dark = "min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]";
  const pill = "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E] transition hover:border-[#DDC98E]";

  // Never flash a day's content before we know whether it is open yet.
  if (!isAdmin && doneSlugs === null && thisDay > 1) {
    return <main className={dark} aria-busy="true" />;
  }

  if (locked) {
    return (
      <main className={`${dark} flex items-center`}>
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Not yet</p>
          <h1 className="mt-3 font-display text-3xl font-light leading-snug">
            {consecutive >= thisDay - 1 && dueAt
              ? `${entry.title} opens ${whenItOpens(dueAt)}`
              : `${entry.title} opens after day ${thisDay - 1}`}
          </h1>
          <p className="mt-5 text-[rgba(254,252,250,0.78)]">
            One day at a time, on purpose. A month you can finish teaches your body far more than a
            month you read in one sitting.
          </p>
          <p className="mt-3 text-[rgba(254,252,250,0.78)]">Nothing is lost if you miss a day. It waits for you.</p>
          {lastOpen && (
            <Link
              href={`/practice/31-touch-points/${lastOpen.slug}`}
              className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707]"
            >
              Go to {lastOpen.title}
            </Link>
          )}
          <p className="mt-6">
            <Link href="/practice/31-touch-points" className="text-sm text-[#DDC98E] underline underline-offset-4">
              See the whole month
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const isDay = thisDay > 0;
  const finishedMonth = isDay && thisDay === 31 && completed;

  // ONE LAYOUT FOR EVERY DAY (24 Oct 2026): photo on top, then the words, then
  // the day's actions. The old split layout and the separate "closing" layout
  // are gone, so Day 31 behaves like every other day.
  return (
    <main className={dark}>
      <div className="mx-auto max-w-2xl px-5 pb-16 pt-6">
        <Link href="/practice/31-touch-points" className={pill}>
          ← The month
        </Link>

        {/* The whole photo, never cropped (24 Oct 2026: heads were being cut
            off, Alex's included). It keeps its own shape on every screen. */}
        {entry.image && (
          <div className="relative mt-5 flex justify-center">
            <div className="relative inline-block">
              <Image
                src={entry.image}
                alt={entry.imageAlt ?? ""}
                width={1200}
                height={1500}
                priority
                sizes="(min-width: 768px) 672px, 100vw"
                className="block h-auto max-h-[78vh] w-auto max-w-full rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]"
              />
              {isDay && (
                <span className="absolute bottom-4 left-5 font-display text-5xl font-light leading-none text-[#DDC98E] [text-shadow:0_2px_18px_rgba(0,0,0,0.75)]">
                  {thisDay}
                </span>
              )}
            </div>
          </div>
        )}

        {entry.eyebrow && (
          <p className="mt-7 text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">{entry.eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-light leading-tight sm:text-4xl">{entry.title}</h1>

        <Blocks blocks={entry.body} dark />

        {isDay && (
          <div className="mt-10">
            {completed ? (
              <div className="ffy-done rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
                <span className="block font-display text-5xl font-light leading-none text-[#DDC98E]">
                  {finishedMonth ? "31 of 31" : `Day ${thisDay}`}
                </span>
                <p className="mt-3 text-[15px] text-ffy-cream">
                  {finishedMonth
                    ? "All thirty one done. Every one of them is yours to go back to, and you can swap who leads."
                    : "Done. See you tomorrow."}
                </p>
                {finishedMonth && (
                  <Link
                    href="/practice/31-touch-points/your-next-yes"
                    className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707] transition hover:bg-[#EEDE80]"
                  >
                    Your next yes →
                  </Link>
                )}
                <div>
                  <Link
                  href="/practice/31-touch-points"
                  className="mt-5 inline-flex min-h-[44px] items-center text-sm text-[#DDC98E] underline underline-offset-4"
                >
                  Back to the month
                </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] transition hover:bg-[#EEDE80] sm:w-auto"
              >
                Mark day {thisDay} done
              </button>
            )}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[rgba(221,201,142,0.2)] pt-5 text-sm">
          {prev ? (
            <Link href={`/practice/31-touch-points/${prev.slug}`} className="min-h-[44px] py-3 text-[#DDC98E]">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/practice/31-touch-points/${next.slug}`} className="min-h-[44px] py-3 text-right text-[#DDC98E]">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
      <style>{`
        @keyframes ffyDone { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
        .ffy-done { animation: ffyDone .6s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .ffy-done { animation: none; } }
      `}</style>
    </main>
  );
}
