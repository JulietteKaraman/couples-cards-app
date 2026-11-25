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
  SN_DAY_LESSON,
  computeSacredNoDrip,
  snDayOf,
  snMovesClock,
} from "@/lib/content/the-sacred-no-drip";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { SacredNoDay, SnVideo } from "@/components/SacredNo";

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
      <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]"><div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-8"><Link href="/" className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 py-2 text-sm text-[#DDC98E]">← FFY app</Link></div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Not yet</p>
        <h1 className="mt-3 font-display text-3xl font-light text-[#f1ece2]">
          {consecutive >= thisDay - 1 && dueAt
            ? `Day ${thisDay} opens ${whenItOpens(dueAt)}`
            : `Day ${thisDay} opens after day ${thisDay - 1}`}
        </h1>
        <p className="mt-5 text-[#cfc8bb]">
          One day at a time, on purpose. Watch the day&rsquo;s lesson, mark it done, and the next
          one opens tomorrow.
        </p>
        <p className="mt-3 text-[#cfc8bb]">Nothing is lost if you miss a day. It waits for you.</p>
        {lastOpen && (
          <Link
            href={`/practice/the-sacred-no/${lastOpen.slug}`}
            className="mt-8 inline-block rounded-full bg-[#DDC98E] px-6 py-3 font-display text-sm font-medium text-[#070707] transition hover:opacity-90"
          >
            Go to {lastOpen.title}
          </Link>
        )}
        <p className="mt-6">
          <Link href="/practice/the-sacred-no" className="text-sm text-[#DDC98E] underline">
            See all seven days
          </Link>
        </p>
      </div></main>
    );
  }

  // 20 Nov 2026: each lesson is three steps, like One Touch (components/SacredNo.tsx).
  const firstP = entry.body.find((x) => x.kind === "p") as { text: string } | undefined;
  const video = entry.body.find((x) => x.kind === "driveVideo") as { url: string; label: string } | undefined;
  const videoId = video?.url.match(/\/d\/([^/]+)\//)?.[1] ?? "";
  const lessonDay = Object.entries(SN_DAY_LESSON).find(([, v]) => v === entry.slug)?.[0];

  if (lessonDay) {
    const d = Number(lessonDay);
    const nextLesson = entries.find((x) => x.slug === SN_DAY_LESSON[d + 1]);
    const prevLesson = entries.find((x) => x.slug === SN_DAY_LESSON[d - 1]);
    const rest = entry.body.filter((x) => x !== firstP && x.kind !== "driveVideo");
    return (
      <SacredNoDay
        slug={entry.slug}
        day={d}
        title={entry.title.replace(/^\d+\s/, "")}
        line={firstP?.text ?? ""}
        videoId={videoId}
        extra={rest.length ? <Blocks blocks={rest} dark /> : undefined}
        nextTitle={nextLesson ? nextLesson.title.replace(/^\d+\s/, "") : undefined}
        alreadyDone={completed}
        prevHref={prevLesson ? `/practice/the-sacred-no/${prevLesson.slug}` : undefined}
        nextHref={nextLesson && (isAdmin || snDayOf(nextLesson.slug) <= unlockedThrough) ? `/practice/the-sacred-no/${nextLesson.slug}` : undefined}
        onDone={handleMarkComplete}
      />
    );
  }

  // Welcome and the bonus meditation: one dark page, the video, and a gold button.
  const isWelcome = entry.slug === "welcome";
  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <div className="mx-auto max-w-xl px-5 pb-20 pt-5">
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← FFY app</Link>
          <Link href="/practice/the-sacred-no" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← The Sacred No</Link>
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">{isWelcome ? "Before you begin" : "Bonus · any time"}</p>
        <h1 className="mt-2 font-display text-[32px] font-light leading-tight">{isWelcome ? "Welcome to The Sacred No" : entry.title}</h1>
        {entry.body.filter((x) => x.kind === "p").map((x, i) => (
          <p key={i} className={`mt-4 text-[16px] leading-relaxed ${i === 0 && isWelcome ? "font-display text-[22px] font-light text-[#F6EFE0]" : "text-[#F6EFE0]/75"}`}>{(x as { text: string }).text}</p>
        ))}
        {videoId && <div className="mt-6"><SnVideo id={videoId} label={entry.title} /></div>}
        {isWelcome ? (
          <Link href={`/practice/the-sacred-no/${SN_DAY_LESSON[1]}`} onClick={() => { if (!completed) void handleMarkComplete(); }}
            className="mt-8 block w-full rounded-full bg-[#DDC98E] py-3.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-[#070707]">Begin day 1</Link>
        ) : (
          <Link href="/practice/the-sacred-no" className="mt-8 block w-full rounded-full border border-[#DDC98E] py-3 text-center text-xs uppercase tracking-[0.22em] text-[#DDC98E]">Back to The Sacred No</Link>
        )}
      </div>
    </main>
  );
}
