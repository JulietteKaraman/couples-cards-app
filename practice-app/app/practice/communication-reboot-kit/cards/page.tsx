"use client";

import { useState } from "react";
import Link from "next/link";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { REBOOT_KIT_CARDS } from "@/lib/content/communication-reboot-kit";

const DECK_TYPE = "communication-reboot-kit";

// Spec R11 renders as a real card, one prompt at a time, matching the
// ACTUAL printed card design. Rebuilt 12 Aug 2026 against a precise crop
// of a single real card (pulled fresh from the source PDF, not memory)
// after Juliette said the first pass was "NOT at all what my cards look
// like": taller card, a double-nested gold chevron (not a single thin
// line), REBOOT visually bigger than the other two band words, and far
// more generous, asymmetric whitespace, prompt sits upper-middle, the
// site name sits close to the bottom ornament, not grouped together.
function GoldChevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 110"
      className={`h-14 w-32 ${flip ? "rotate-180" : ""}`}
      fill="none"
      stroke="#a88538"
      strokeWidth={1.75}
    >
      <polyline points="15,8 100,95 185,8" />
      <polyline points="72,50 100,95 128,50" />
    </svg>
  );
}

function Card({ text, index, total }: { text: string; index: number; total: number }) {
  return (
    <div className="flex aspect-[2/3] w-full max-w-xs flex-col overflow-hidden rounded-lg border border-[#a88538]/25 bg-white text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex w-full flex-col items-center pt-6">
        <GoldChevron />
      </div>
      <div className="w-full bg-ffy-black px-4 py-4">
        <p className="font-display text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-ffy-gold-pale">
          Communication
        </p>
        <p className="font-display text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-ffy-gold-pale">
          &amp; Intimacy
        </p>
        <p className="mt-1 font-display text-xl font-bold uppercase tracking-[0.15em] text-ffy-gold-pale">
          Reboot
        </p>
      </div>

      <div className="flex flex-1 flex-col px-7">
        <p className="mt-10 font-display text-lg font-semibold uppercase leading-snug text-ffy-black sm:text-xl">
          {text}
        </p>
        <div className="flex-1" />
        <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-ffy-black/50">feelfullyyou.com</p>
      </div>

      <div className="flex w-full flex-col items-center gap-1 pb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ffy-black/40">
          {index + 1} of {total}
        </p>
        <GoldChevron flip />
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
