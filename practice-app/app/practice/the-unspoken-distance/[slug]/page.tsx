"use client";

import Link from "next/link";
import { TellMe } from "@/components/TellMe";
import Image from "next/image";
import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { theUnspokenDistance, UD_CHAPTERS } from "@/lib/content/the-unspoken-distance";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs, markComplete } from "@/lib/entitlements/progress";
import { localDone, addLocalDone } from "../progressLocal";

export default function TheUnspokenDistanceEntry() {
  return (
    <CollectionGate collectionSlug={theUnspokenDistance.slug}>
      <TheUnspokenDistanceEntryContent />
    </CollectionGate>
  );
}

function TheUnspokenDistanceEntryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [glow, setGlow] = useState(false);
  const dark = theUnspokenDistance.theme === "dark";

  const entries = theUnspokenDistance.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  useEffect(() => {
    if (!entry) return;
    setCompleted(localDone().includes(entry.slug));
    if (!user) return;
    getCompletedSlugs(user.id, "unspoken-distance").then((slugs) => {
      if (slugs.includes(entry.slug)) setCompleted(true);
    });
  }, [user, entry]);

  if (!entry) notFound();

  // "I did it" on every part (27 Oct): saves on the phone and to the
  // account, glows gold, then moves him on to the next part.
  async function handleMarkComplete() {
    if (!entry) return;
    const was = completed;
    addLocalDone(entry.slug);
    setCompleted(true);
    setGlow(true);
    if (user) {
      try { await markComplete(user.id, "unspoken-distance", entry.slug); } catch {}
    }
    if (!was && next) setTimeout(() => router.push(`/practice/the-unspoken-distance/${next.slug}`), 900);
  }

  const prev = entries[index - 1];
  const next = entries[index + 1];

  const isLast = index === entries.length - 1;
  const doLabel = entry.kind === "ritual" ? "I did it" : isLast ? "Finished" : "Got it";
  const markCompleteBlock = (
    <div className="mt-12 border-t border-ffy-gold/20 pt-7 text-center">
      <button
        onClick={handleMarkComplete}
        className={`min-h-[48px] rounded-full border border-[#DDC98E] px-7 py-3 font-display text-[17px] font-medium transition ${
          completed ? "bg-[#DDC98E] text-[#1a1814]" : "text-[#DDC98E]"
        } ${glow ? "animate-[ffyglow_.9s_ease-out_2]" : ""}`}
      >
        {completed ? "Done ✓" : `${doLabel} ✓`}
      </button>
      <style>{`@keyframes ffyglow{0%{box-shadow:0 0 0 0 rgba(221,201,142,.7)}100%{box-shadow:0 0 0 22px rgba(221,201,142,0)}}`}</style>
      {isLast && <TellMe line="I just finished The Unspoken Distance. What came up for me: " />}
    </div>
  );

  const navRow = (
    <div
      className={`mx-auto mt-12 flex max-w-2xl items-center justify-between border-t px-6 py-6 text-sm ${
        dark ? "border-ffy-gold/20" : "border-ffy-border"
      }`}
    >
      {prev ? (
        <Link
          href={`/practice/the-unspoken-distance/${prev.slug}`}
          className={dark ? "text-ffy-gold-pale hover:underline" : "text-ffy-gold-deep hover:underline"}
        >
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/practice/the-unspoken-distance/${next.slug}`}
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
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${dark ? "border-ffy-gold-pale/40 text-ffy-gold-pale hover:bg-white/5" : "border-ffy-gold-deep/40 text-ffy-gold-deep hover:bg-ffy-gold-deep/5"}`}
          >
            ← Your library
          </Link>
          <Link href="/practice/the-unspoken-distance" className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${dark ? "border-ffy-gold-pale/40 text-ffy-gold-pale hover:bg-white/5" : "border-ffy-gold-deep/40 text-ffy-gold-deep hover:bg-ffy-gold-deep/5"}`}>
            ← The Unspoken Distance
          </Link>
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#a79f90]">{(() => { const c = UD_CHAPTERS.find((c) => c.slugs.includes(entry.slug)); return c ? `Part ${c.n} · ${c.title}` : `Part ${index + 1} of ${entries.length}`; })()}</p>
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

        {entry.readMore ? (
          <>
            <Blocks blocks={entry.body.slice(0, entry.readMore[0])} dark={dark} />
            <ReadMore>
              <Blocks blocks={entry.body.slice(entry.readMore[0], entry.readMore[1])} dark={dark} />
            </ReadMore>
            <Blocks blocks={entry.body.slice(entry.readMore[1])} dark={dark} />
          </>
        ) : (
          <Blocks blocks={entry.body} dark={dark} />
        )}
        {markCompleteBlock}
      </div>

      {navRow}
    </main>
  );
}

// "Read more" (27 Oct 2026, Juliette: regroup with Read more). The longer
// explanation sits behind one tap; the practice and the "You become" line
// always show.
function ReadMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      {open ? (
        children
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#DDC98E]/60 px-5 text-[15px] text-[#DDC98E]"
        >
          Read more ↓
        </button>
      )}
    </div>
  );
}
