"use client";

// Ported from the couplecards app's own proven taster play page
// (app/free/couples/play/page.tsx in the repo root) — same draw/flip
// interaction, same 5 cards, same template art. Deliberately NOT behind
// CollectionGate/ProtectedRoute: the source experience is fully public
// (no email, no login) and this keeps that same low-friction feel inside
// the library. "Unlock Full Deck Now" goes straight to the real Cards
// site, no in-app checkout duplicated here.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CARDS_TASTER_CARDS } from "@/lib/content/cards-taster";

// Updated 27 Aug 2026 to the new Dyad-focused 6-card set (Juliette's Canva
// export), matching the root Cards App exactly (app/free/couples/play in
// the repo root) — this page is a manual port of that page and had drifted
// onto the old, retired 2-slide Instructions1/2.svg set until now.
const instructions = [
  "/cards/instructions/why-these-cards-front.png",
  "/cards/instructions/why-these-cards-back.png",
  "/cards/instructions/how-to-use-front.png",
  "/cards/instructions/how-to-use-back.png",
  "/cards/instructions/the-structure-front.png",
  "/cards/instructions/the-structure-back.png",
];

export default function CardsTasterPage() {
  const cards = CARDS_TASTER_CARDS;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [finished, setFinished] = useState(false);

  const currentCard = cards[currentCardIndex];
  const isLastCard = currentCardIndex === cards.length - 1;
  const isLastInstruction = currentInstruction === instructions.length - 1;

  function nextInstruction() {
    if (isLastInstruction) setShowInstructions(false);
    else setCurrentInstruction(currentInstruction + 1);
  }

  function prevInstruction() {
    if (currentInstruction > 0) setCurrentInstruction(currentInstruction - 1);
  }

  function drawCard() {
    if (isLastCard && showCard) {
      setFinished(true);
      return;
    }
    setFlipped(false);
    setShowCard(true);
    setTimeout(() => setFlipped(true), 140);
  }

  function nextCard() {
    if (isLastCard) {
      setFinished(true);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
      setTimeout(() => setFlipped(true), 100);
    }
  }

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
          <div className="mb-4 flex justify-end">
            <button onClick={() => setShowInstructions(false)} className="text-sm text-white/50 hover:text-white">
              Skip
            </button>
          </div>

          <div className="mb-8 flex justify-center gap-2">
            {instructions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-colors ${idx === currentInstruction ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-8 w-full overflow-hidden rounded-2xl border border-white/10">
              <img src={instructions[currentInstruction]} alt={`Instructions ${currentInstruction + 1}`} className="h-auto w-full" />
            </div>
            <h2 className="mb-3 text-center text-2xl font-semibold">Intimacy &amp; Communication Cards, Taster</h2>
            <p className="text-center text-white/70">Five cards from the deck, free.</p>
          </div>

          <div className="mt-8 space-y-3">
            {currentInstruction > 0 && (
              <button onClick={prevInstruction} className="w-full rounded-xl border border-white/20 py-3 font-medium text-white">
                Back
              </button>
            )}
            <button onClick={nextInstruction} className="w-full rounded-xl bg-white py-3 font-medium text-black">
              {isLastInstruction ? "Start Taster" : "Next"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-md px-4 py-10 text-center">
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
            <Image src="/cards/couples/cover.png" alt="Intimacy and Communication Cards" width={1200} height={1600} className="h-auto w-full" priority />
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Enjoyed the taster?</h1>
          <p className="mb-8 text-white/60">There are 145 more cards in the full deck: Love, Desire, Body, Communication, and Repair.</p>
          <div className="space-y-3">
            <a href="https://cards.feelfullyyou.com" className="block w-full rounded-xl bg-white py-4 text-center text-lg font-medium text-black">
              Unlock Full Deck Now
            </a>
            <Link href="/" className="block w-full rounded-xl border border-white/20 py-3 text-center font-medium text-white">
              ← Your library
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10">
            ← Your library
          </Link>
          <span className="rounded bg-white/10 px-2 py-1 text-xs text-white/70">Cards Taster</span>
          <div className="w-20" />
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-white/60">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <span className="text-xs text-white/40">Taster Pack</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-white transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        {showCard ? (
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={currentCard.templateImage}
              alt="Card template"
              width={1200}
              height={1600}
              className={`h-auto w-full transition-transform duration-500 ${flipped ? "scale-100" : "scale-[1.01]"}`}
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center px-10">
              <div className={`text-center transition-opacity duration-500 ${flipped ? "opacity-100" : "opacity-0"}`}>
                <div className="space-y-3">
                  {currentCard.lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={`tracking-wide text-black ${line.bold ? "font-semibold" : "font-normal"}`}
                      style={{ fontSize: 18, lineHeight: 1.35 }}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="mb-4 text-white/60">Ready to draw your first card?</p>
            <p className="text-sm text-white/40">Click the button below to begin</p>
          </div>
        )}

        <div className="space-y-3">
          {!showCard ? (
            <button onClick={drawCard} className="w-full rounded-xl bg-white py-4 text-lg font-medium text-black">
              Draw Card
            </button>
          ) : (
            <>
              <button onClick={nextCard} className="w-full rounded-xl bg-white py-4 text-lg font-medium text-black">
                {isLastCard ? "Finish Taster" : "Next Card"}
              </button>
              <a href="https://cards.feelfullyyou.com" className="block w-full rounded-xl border border-white/20 py-3 text-center font-medium text-white">
                Unlock Full Deck Now
              </a>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">{showCard ? "Take your time with this prompt" : "5 cards to explore"}</p>
        </div>
      </div>
    </main>
  );
}
