"use client";

// The Unspoken Distance as a hub (27 Oct 2026, same build as When She Goes Quiet), matching the buyer-page hubs:
// a real photo of Juliette, a gold progress ring, a photo card for every
// part with a circle that fills when it's done, and "Pick up where you left
// off". Progress comes from the account when signed in, and from this phone
// otherwise, so it never shows less than what he has done.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { theUnspokenDistance, UD_CHAPTERS } from "@/lib/content/the-unspoken-distance";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs } from "@/lib/entitlements/progress";
import { localDone } from "./progressLocal";

export default function TheUnspokenDistanceIndex() {
  return (
    <CollectionGate collectionSlug={theUnspokenDistance.slug}>
      <TheUnspokenDistanceHub />
    </CollectionGate>
  );
}

const RING = 2 * Math.PI * 19;

function TheUnspokenDistanceHub() {
  const { title, subtitle, heroImage, entries } = theUnspokenDistance;
  const { user } = useAuth();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const local = localDone();
    setDone(local);
    if (!user) return;
    getCompletedSlugs(user.id, "unspoken-distance")
      .then((slugs) => setDone(Array.from(new Set([...local, ...slugs]))))
      .catch(() => {});
  }, [user]);

  const total = entries.length;
  const n = entries.filter((e) => done.includes(e.slug)).length;
  const next = entries.find((e) => !done.includes(e.slug));
  const startHref = `/practice/the-unspoken-distance/${(next ?? entries[0]).slug}`;
  const startLabel = n === 0 ? "Begin →" : next ? "Pick up where you left off →" : "Back to the start →";

  return (
    <main className="min-h-screen bg-[#1a1814] text-[#f1ece2]">
      {/* The same cover as the sales page (27 Oct, Juliette: "it should have
          the same in the app"), shown whole so its title is never cut. */}
      <div className="relative w-full bg-black">
        <div className="absolute left-0 top-0 z-10 p-4">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[#DDC98E]/40 bg-black/40 px-4 py-2 text-sm font-medium text-[#DDC98E] backdrop-blur-sm">
            ← Your library
          </Link>
        </div>
        <Image src={heroImage} alt="The Unspoken Distance: a guide for men who love women they can no longer reach" width={1600} height={901} priority sizes="100vw" className="mx-auto block h-auto w-full max-w-3xl pt-14" />
      </div>

      <div className="relative mx-auto mt-6 max-w-xl px-6 pb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">A men&rsquo;s guide</p>
        <h1 className="sr-only">{title}</h1>
        <p className="sr-only">{subtitle}</p>

        <Link href={startHref} className="mt-8 inline-flex items-center rounded-full bg-[#DDC98E] px-7 py-4 font-display text-lg font-medium text-[#1a1814]">
          {startLabel}
        </Link>

        <div className="mt-6 flex items-center gap-3.5">
          <Image src="/unspoken-distance/juliette-karaman-portrait.jpg" alt="Juliette" width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover shadow-[0_0_24px_-6px_rgba(221,201,142,0.6)]" />
          <div>
            <p className="font-display text-lg">From me, for you</p>
            <p className="text-sm text-[#a79f90]">Read in order, or come back to any part.</p>
          </div>
        </div>

        {/* The 15-minute daily sequence the sales page promises (27 Oct). */}
        <Link href="/practice/the-unspoken-distance/the-groundedness-practice" className="mt-5 flex items-center justify-between rounded-[18px] border border-[#DDC98E] bg-[#0D3535]/50 px-5 py-4">
          <span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Every day</span>
            <span className="mt-0.5 block font-display text-[19px]">Your daily 15 minutes, guided by me</span>
          </span>
          <span className="text-[#DDC98E]">&rarr;</span>
        </Link>

        <div className="mt-8 rounded-[22px] border border-[#DDC98E]/20 bg-gradient-to-b from-[#0D3535]/60 to-[#211e19] p-4 pt-5">
          <div className="mb-4 flex items-center gap-4 px-1">
            <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90" aria-hidden="true">
              <circle cx="22" cy="22" r="19" fill="none" strokeWidth="4" stroke="rgba(221,201,142,.18)" />
              <circle cx="22" cy="22" r="19" fill="none" strokeWidth="4" stroke="#DDC98E" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING * (1 - n / total)} style={{ transition: "stroke-dashoffset .6s ease" }} />
            </svg>
            <div>
              <p className="font-display text-[22px]">{n} of {total} done</p>
              <p className="text-[13px] text-[#a79f90]">Your progress saves as you go.</p>
            </div>
          </div>

          <div className="grid gap-7">
            {UD_CHAPTERS.map((ch) => (
              <div key={ch.n}>
                <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Part {ch.n}</p>
                <p className="mt-1 px-1 font-display text-[22px] leading-tight">{ch.title}</p>
                <p className="mt-1 px-1 text-[14px] text-[#a79f90]">{ch.line}</p>
                <div className="mt-3 grid gap-3">
            {entries.filter((e) => ch.slugs.includes(e.slug)).map((e) => {
              const isDone = done.includes(e.slug);
              const isNext = next?.slug === e.slug;
              return (
                <Link
                  key={e.slug}
                  href={`/practice/the-unspoken-distance/${e.slug}`}
                  className={`flex items-center gap-3.5 rounded-[18px] border bg-[#1a1814]/60 p-2.5 ${isNext ? "border-[#DDC98E]" : "border-[#DDC98E]/20"}`}
                >
                  {e.image ? (
                    <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px]">
                      <Image src={e.image} alt="" fill sizes="72px" className={`object-cover ${isDone ? "brightness-75 saturate-50" : ""}`} />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#DDC98E]">
                      {e.eyebrow ?? (e.kind === "ritual" ? "Try this" : e.kind === "closing" ? "To finish" : "Read")}
                    </span>
                    <span className="mt-0.5 block font-display text-[18px] leading-snug">{e.title}</span>
                  </span>
                  <span className={`mr-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs ${isDone ? "border-[#DDC98E] bg-[#DDC98E] text-[#1a1814]" : "border-[#DDC98E]/55"}`}>
                    {isDone ? "✓" : ""}
                  </span>
                </Link>
              );
            })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
