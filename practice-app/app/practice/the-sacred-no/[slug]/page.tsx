"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { theSacredNo } from "@/lib/content/the-sacred-no";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedWithTimes, markComplete } from "@/lib/entitlements/progress";
import { lsSet, whenItOpens, adminBypassActive } from "@/lib/content/31-touch-points-drip";
import {
  SN_ADV_KEY,
  computeSacredNoDrip,
  snDayOf,
  snMovesClock,
} from "@/lib/content/the-sacred-no-drip";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

export default function TheSacredNoEntry() {
  return (
    <CollectionGate collectionSlug={theSacredNo.slug}>
      <TheSacredNoEntryContent />
    </CollectionGate>
  );
}

function TheSacredNoEntryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const dark = theSacredNo.theme === "dark";

  const entries = theSacredNo.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  // Re-check every minute so a day that comes due while the page is open
  // unlocks itself.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user || !entry) return;
    getCompletedWithTimes(user.id, "sacred-no").then((rows) => {
      const slugs = rows.map((r) => r.slug);
      setDoneSlugs(slugs);
      setCompleted(slugs.includes(entry.slug));
      // Only LESSON completions move the clock, never Welcome or the bonus.
      const times = rows.filter((r) => snMovesClock(r.slug) && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user, entry]);

  if (!entry) notFound();

  async function handleMarkComplete() {
    if (!user || !entry) return;
    await markComplete(user.id, "sacred-no", entry.slug);
    setCompleted(true);
    setDoneSlugs((p) => (p && p.includes(entry.slug) ? p : [...(p ?? []), entry.slug]));
    // Marking a lesson done starts the clock on tomorrow. It does not open it.
    if (snMovesClock(entry.slug)) {
      lsSet(SN_ADV_KEY, String(Date.now()));
      setNow(Date.now());
    }
  }

  // ONE DAY AT A TIME (Juliette, 17 Oct 2026, same rule as 31 Touch Points).
  const { consecutive, unlockedThrough, dueAt } = computeSacredNoDrip({
    doneSlugs: doneSlugs ?? [],
    lastDone,
    now,
  });
  const thisDay = snDayOf(entry.slug);
  // Juliette sees everything; ?asbuyer=1 shows her the buyer's view.
  const isAdmin = adminBypassActive(user?.email, ADMIN_EMAIL);
  // doneSlugs === null means progress has not loaded yet: never flash a lock.
  const locked = !isAdmin && doneSlugs !== null && thisDay > unlockedThrough;
  const lastOpen = [...entries].reverse().find((x) => snDayOf(x.slug) <= unlockedThrough);

  const prev = entries[index - 1];
  const nextRaw = entries[index + 1];
  const next = !isAdmin && nextRaw && snDayOf(nextRaw.slug) > unlockedThrough ? undefined : nextRaw;

  if (locked) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">Not yet</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ffy-teal">
          {consecutive >= thisDay - 1 && dueAt
            ? `Day ${thisDay} opens ${whenItOpens(dueAt)}`
            : `Day ${thisDay} opens after day ${thisDay - 1}`}
        </h1>
        <p className="mt-5 text-ffy-black/70">
          One day at a time, on purpose. Watch the day&rsquo;s lesson, mark it done, and the next
          one opens tomorrow.
        </p>
        <p className="mt-3 text-ffy-black/70">Nothing is lost if you miss a day. It waits for you.</p>
        {lastOpen && (
          <Link
            href={`/practice/the-sacred-no/${lastOpen.slug}`}
            className="mt-8 inline-block rounded-full bg-ffy-gold px-6 py-3 font-display text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to {lastOpen.title}
          </Link>
        )}
        <p className="mt-6">
          <Link href="/practice/the-sacred-no" className="text-sm text-ffy-gold-deep underline">
            See all seven days
          </Link>
        </p>
      </main>
    );
  }

  const markCompleteBlock =
    entry.kind === "ritual" ? (
      <div className="mt-8">
        {completed ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-ffy-gold px-5 py-2.5 font-display text-sm font-medium text-ffy-black">
            ✓ Marked done
          </p>
        ) : (
          <button
            onClick={handleMarkComplete}
            className={`rounded-full border border-ffy-gold px-5 py-2.5 font-display text-sm font-medium transition hover:bg-ffy-gold hover:text-ffy-black ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
          >
            Mark this one done
          </button>
        )}
      </div>
    ) : null;

  const navRow = (
    <div
      className={`mx-auto mt-12 flex max-w-2xl items-center justify-between border-t px-6 py-6 text-sm ${
        dark ? "border-ffy-gold/20" : "border-ffy-border"
      }`}
    >
      {prev ? (
        <Link
          href={`/practice/the-sacred-no/${prev.slug}`}
          className={dark ? "text-ffy-gold-pale hover:underline" : "text-ffy-gold-deep hover:underline"}
        >
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/practice/the-sacred-no/${next.slug}`}
          className={dark ? "text-ffy-gold-pale hover:underline" : "text-ffy-gold-deep hover:underline"}
        >
          {next.title} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );

  // Editorial layout, matching the deck's own presentation: a full-width
  // photo at the top, then one flowing column of content below — not a
  // 50/50 split screen. Same shape for every entry kind (the "closing"
  // entries don't need a separate treatment here, they read the same way).
  return (
    <main className={dark ? "min-h-screen bg-ffy-black" : "min-h-screen bg-ffy-cream"}>
      {entry.image && (
        <div
          className={`relative h-[42vh] w-full overflow-hidden sm:h-[56vh] ${
            entry.imageFocus === "top" ? (dark ? "bg-ffy-black" : "bg-ffy-cream") : ""
          }`}
        >
          <Image
            src={entry.image}
            alt={entry.imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={entry.imageFocus === "top" ? "object-contain" : "object-cover"}
          />
          {dark && entry.imageFocus !== "top" && (
            <div className="absolute inset-0 bg-gradient-to-t from-ffy-black via-ffy-black/10 to-transparent" />
          )}
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 pb-14 pt-10">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${dark ? "border-ffy-gold-pale/40 text-ffy-gold-pale hover:bg-white/5" : "border-ffy-gold-deep/40 text-ffy-gold-deep hover:bg-ffy-gold-deep/5"}`}
        >
          ← Your library
        </Link>

        {entry.eyebrow && (
          <p className={`mt-6 text-xs uppercase tracking-[0.15em] ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
            {entry.eyebrow}
          </p>
        )}
        <h1
          className={`mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl ${
            dark ? "text-ffy-cream" : "text-ffy-teal"
          }`}
        >
          {entry.title}
        </h1>

        <Blocks blocks={entry.body} dark={dark} />
        {markCompleteBlock}
      </div>

      {navRow}
    </main>
  );
}
