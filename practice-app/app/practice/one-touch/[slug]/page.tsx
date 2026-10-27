"use client";

// One Touch, 27 Oct 2026: a day as three steps (Arrive, Practice, Your card),
// plus the Welcome, the deck and Your week. See components/OneTouch.tsx.

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { oneTouch, oneTouchPrompts } from "@/lib/content/one-touch";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedWithTimes, markComplete } from "@/lib/entitlements/progress";
import { lsSet, whenItOpens, adminBypassActive } from "@/lib/content/31-touch-points-drip";
import { OT_ADV_KEY, OT_DAY_LESSON, computeOneTouchDrip, otDayOf, otMovesClock } from "@/lib/content/one-touch-drip";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { OneTouchDay, OneTouchDeck, OT_DAY_CARD } from "@/components/OneTouch";

export default function OneTouchEntry() {
  return (
    <CollectionGate collectionSlug={oneTouch.slug}>
      <OneTouchEntryContent />
    </CollectionGate>
  );
}

const shell = "min-h-screen bg-[#070707] text-[#F6EFE0]";

function OneTouchEntryContent() {
  const slug = useParams().slug as string;
  const { user } = useAuth();
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!user) return;
    getCompletedWithTimes(user.id, "one-touch").then((rows) => {
      setDoneSlugs(rows.map((r) => r.slug));
      const times = rows.filter((r) => otMovesClock(r.slug) && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user]);

  async function done(s: string) {
    if (!user) return;
    await markComplete(user.id, "one-touch", s);
    setDoneSlugs((p) => (p && p.includes(s) ? p : [...(p ?? []), s]));
    if (otMovesClock(s)) { lsSet(OT_ADV_KEY, String(Date.now())); setNow(Date.now()); }
  }

  const back = (
    <Link href="/practice/one-touch" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← One Touch</Link>
  );

  // Your cards, any time
  if (slug === "the-one-touch-cards") {
    return (
      <main className={shell}><div className="mx-auto max-w-xl px-5 pb-20 pt-5">{back}
        <h1 className="mt-6 font-display text-[32px] font-light">Your One Touch cards</h1>
        <OneTouchDeck prompts={oneTouchPrompts} />
      </div></main>
    );
  }

  const welcome = oneTouch.entries.find((e) => e.slug === "welcome");
  if (slug === "welcome" && welcome) {
    const paras = welcome.body.filter((b) => b.kind === "p").map((b) => (b as { text: string }).text);
    const vid = (welcome.body.find((b) => b.kind === "video") as { vimeoId: string } | undefined)?.vimeoId;
    return (
      <main className={shell}><div className="mx-auto max-w-xl px-5 pb-20 pt-5">{back}
        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Before you begin</p>
        <h1 className="mt-2 font-display text-[32px] font-light leading-tight">Welcome to One Touch</h1>
        {vid && (
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-black" style={{ paddingTop: "56.25%" }}>
            <iframe src={`https://player.vimeo.com/video/${vid}?badge=0&autopause=0&title=0&byline=0&portrait=0`} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Welcome" />
          </div>
        )}
        <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#F6EFE0]/80">{paras.map((p, i) => <p key={i}>{p}</p>)}</div>
        <Link href={`/practice/one-touch/${OT_DAY_LESSON[1]}`} onClick={() => done("welcome")}
          className="mt-8 block w-full rounded-full bg-[#DDC98E] py-3.5 text-center text-xs font-medium uppercase tracking-[0.22em] text-[#070707]">I&rsquo;m ready, start Day 1</Link>
      </div></main>
    );
  }

  // Your week (after day 7)
  if (slug === "your-week") {
    const days = Object.entries(OT_DAY_LESSON).map(([d, s]) => {
      const g = (k: string) => { try { return JSON.parse(localStorage.getItem("ffy.ot." + k) || "null"); } catch { return null; } };
      return { d, title: oneTouch.entries.find((e) => e.slug === s)?.title, before: g(`check-${s}-before`), after: g(`check-${s}-after`), answer: g(`answer-${s}`) };
    });
    return (
      <main className={shell}><div className="mx-auto max-w-xl px-5 pb-20 pt-5">{back}
        <h1 className="mt-6 font-display text-[32px] font-light">Your week</h1>
        <div className="mt-6 space-y-3">{days.map((x) => (
          <div key={x.d} className="rounded-2xl border border-[#DDC98E]/15 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#DDC98E]">Day {x.d} · {x.title}</p>
            {x.before !== null && x.after !== null && <p className="mt-1 text-sm text-[#F6EFE0]/60">Came in at {x.before}, left at {x.after}</p>}
            {x.answer && <p className="mt-2 font-display text-[17px] font-light italic">{x.answer}</p>}
          </div>))}
        </div>
      </div></main>
    );
  }

  const entry = oneTouch.entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const { consecutive, unlockedThrough, dueAt } = computeOneTouchDrip({ doneSlugs: doneSlugs ?? [], lastDone, now });
  const day = otDayOf(slug);
  const isAdmin = adminBypassActive(user?.email, ADMIN_EMAIL);
  // 27 Oct, Juliette: "make sure they stay locked". Days 2-7 show nothing until
  // her progress has loaded, so a locked day never flashes open first.
  if (!isAdmin && user && doneSlugs === null && day > 1) {
    return <main className={`${shell} flex items-center justify-center`}><p className="text-sm text-[#F6EFE0]/40">One moment…</p></main>;
  }
  const locked = !isAdmin && doneSlugs !== null && day > unlockedThrough;

  if (locked) {
    return (
      <main className={`${shell} flex items-center`}><div className="mx-auto max-w-md px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Not yet</p>
        <h1 className="mt-3 font-display text-3xl font-light">
          {consecutive >= day - 1 && dueAt ? `Day ${day} opens ${whenItOpens(dueAt)}` : `Day ${day} opens after day ${day - 1}`}
        </h1>
        <p className="mt-4 text-[#F6EFE0]/60">One day at a time, on purpose. Nothing is lost if you miss a day. It waits for you.</p>
        <div className="mt-8">{back}</div>
      </div></main>
    );
  }

  const vid = (entry.body.find((b) => b.kind === "video") as { vimeoId: string } | undefined)?.vimeoId ?? "";
  const bonusBlock = entry.body.find((b) => b.kind === "driveVideo") as { url: string; label: string } | undefined;
  const nextSlug = OT_DAY_LESSON[day + 1];
  const nextTitle = nextSlug ? oneTouch.entries.find((e) => e.slug === nextSlug)?.title : undefined;

  return (
    <OneTouchDay
      slug={slug}
      day={day}
      title={entry.title}
      videoId={vid}
      transcript={(entry as { transcript?: string }).transcript}
      card={OT_DAY_CARD[slug] ?? null}
      bonus={bonusBlock ? { url: bonusBlock.url, label: bonusBlock.label.replace(/^Bonus: /, "") } : null}
      prompts={oneTouchPrompts}
      nextTitle={nextTitle}
      alreadyDone={!!doneSlugs?.includes(slug)}
      onDone={() => done(slug)}
    />
  );
}
