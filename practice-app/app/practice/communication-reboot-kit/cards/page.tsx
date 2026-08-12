"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { REBOOT_KIT_CARDS, RebootCard } from "@/lib/content/communication-reboot-kit";

const DECK_TYPE = "communication-reboot-kit";

// Rebuilt 12 Aug 2026 to use the SAME real-template + text-overlay pattern
// as the actual cards app (app/app/[deck]/draw/page.tsx): a real image
// (card-template.png, cropped straight from Juliette's own card 1, prompt
// area painted blank) as the card face, with the live prompt text
// absolutely positioned on top — not a from-scratch CSS/SVG recreation.
// Juliette, 12 Aug 2026: "these are NOT like my cards!!! Use the same code
// from the actual cards app and integrate them." Font sized down and
// bold restricted to two-line cards' first line only, per her direct
// correction: "ONLY the cards that have 2 questions are in bold."
function Card({ card, index, total }: { card: RebootCard; index: number; total: number }) {
  const isSplit = typeof card !== "string";
  return (
    <>
      <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-[#a88538]/25 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
        <Image
          src="/reboot-kit/card-template.png"
          alt="Communication & Intimacy Reboot card"
          width={939}
          height={1331}
          priority
          className="h-auto w-full"
        />
        <div className="absolute inset-x-0 flex flex-col items-center gap-4 px-9" style={{ top: "38%", height: "40%" }}>
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
            {isSplit ? (
              <>
                <p className="text-center font-display text-[0.95rem] font-semibold uppercase leading-snug text-ffy-black sm:text-base">
                  {card.main}
                </p>
                <p className="text-center font-display text-[0.95rem] font-normal uppercase leading-snug text-ffy-black sm:text-base">
                  {card.secondary}
                </p>
              </>
            ) : (
              <p className="text-center font-display text-[0.95rem] font-normal uppercase leading-snug text-ffy-black sm:text-base">
                {card}
              </p>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-ffy-black/45">feelfullyyou.com</p>
        </div>
      </div>
      {/* The real card has no counter printed on it — this is an app-only
          navigation aid, so it lives below the card, not squeezed into
          the tight real gap above the bottom chevron where it used to
          overlap. */}
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ffy-black/40">
        {index + 1} of {total}
      </p>
    </>
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
        <Card card={REBOOT_KIT_CARDS[index]} index={index} total={total} />

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
