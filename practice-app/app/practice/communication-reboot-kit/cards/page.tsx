"use client";

import { useState } from "react";
import Link from "next/link";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { REBOOT_KIT_CARDS } from "@/lib/content/communication-reboot-kit";

const DECK_TYPE = "communication-reboot-kit";

// Spec R11 renders as a real card, one prompt at a time, matching the
// ACTUAL printed/Canva card design pulled from the real source PDF (11 Aug
// 2026, "Communication & Intimacy Reboot Kit (2).pdf" pages 5-13, checked
// image by image): white card, a thin gold triangle outline top and
// bottom, a black band with "COMMUNICATION / & INTIMACY / REBOOT" in gold
// serif caps, then the prompt in plain black type, feelfullyyou.com under
// the band. Juliette, 11 Aug 2026: "even the free guides are more
// beautiful than this" — the flat promptGroup dump was the first problem;
// this component's own black-on-gold styling (inverted from the real
// white card) was a second one, caught only by checking the real pages.
function GoldTriangle({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={`h-6 w-16 ${flip ? "rotate-180" : ""}`}
      fill="none"
      stroke="#a88538"
      strokeWidth={1.5}
    >
      <polyline points="0,0 50,38 100,0" />
    </svg>
  );
}

function Card({ text, index, total }: { text: string; index: number; total: number }) {
  return (
    <div className="flex aspect-[3/4] w-full max-w-xs flex-col items-center overflow-hidden rounded-2xl border border-[#a88538]/30 bg-white text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex w-full flex-col items-center pt-5">
        <GoldTriangle />
      </div>
      <div className="mt-3 w-full bg-ffy-black px-4 py-3">
        <p className="font-display text-sm font-semibold uppercase leading-tight tracking-[0.1em] text-ffy-gold-pale">
          Communication
          <br />
          &amp; Intimacy
          <br />
          Reboot
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
        <p className="font-display text-base font-semibold uppercase leading-snug text-ffy-black sm:text-lg">
          {text}
        </p>
        <p className="text-[11px] uppercase tracking-[0.15em] text-ffy-black/50">feelfullyyou.com</p>
      </div>
      <div className="flex w-full flex-col items-center gap-2 pb-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ffy-black/40">
          {index + 1} of {total}
        </p>
        <GoldTriangle flip />
      </div>
    </div>
  );
}

export default function CardsPage() {
  return (
    <CollectionGate collectionSlug={DECK_TYPE}>
      <CardsPageContent />
    </CollectionGate>
  );
}

function CardsPageContent() {
  const [index, setIndex] = useState(0);
  const total = REBOOT_KIT_CARDS.length;

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }
  function next() {
    setIndex((i) => (i + 1) % total);
  }
  function shuffle() {
    setIndex(Math.floor(Math.random() * total));
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-ffy-cream px-6 py-10">
      <div className="w-full max-w-xs">
        <Link
          href="/practice/communication-reboot-kit/communication-and-intimacy-cards"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← Back
        </Link>
      </div>

      <div className="mt-8 flex w-full flex-1 flex-col items-center justify-center">
        <Card text={REBOOT_KIT_CARDS[index]} index={index} total={total} />

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous card"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep transition hover:bg-ffy-gold-deep/10"
          >
            ←
          </button>
          <button
            type="button"
            onClick={shuffle}
            className="rounded-full bg-ffy-teal px-6 py-3 font-display text-sm font-medium text-ffy-cream transition hover:bg-ffy-black"
          >
            Draw a card
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next card"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep transition hover:bg-ffy-gold-deep/10"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}
