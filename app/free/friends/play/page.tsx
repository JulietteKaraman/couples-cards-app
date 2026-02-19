"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTasterCards } from "@/data/taster-cards";

export default function FriendsTasterPlayPage() {
  const router = useRouter();
  const cards = getTasterCards("friends");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const currentCard = cards[currentCardIndex];
  const isLastCard = currentCardIndex === cards.length - 1;

  function drawCard() {
    if (isLastCard && showCard) {
      // Go to upgrade page after last card
      router.push("/free/friends/upgrade");
      return;
    }

    setFlipped(false);
    setShowCard(true);
    setTimeout(() => setFlipped(true), 140);
  }

  function nextCard() {
    if (isLastCard) {
      router.push("/free/friends/upgrade");
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
      // Small delay to allow the card index to update before flipping
      setTimeout(() => setFlipped(true), 100);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/free" 
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back
          </Link>
          <div className="text-center">
            <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
              Friends Taster
            </span>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60">Card {currentCardIndex + 1} of {cards.length}</span>
            <span className="text-xs text-white/40">Taster Pack</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card Display */}
        {showCard ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-6">
            <Image
              src={currentCard.templateImage}
              alt="Card template"
              width={1200}
              height={1600}
              className={`w-full h-auto transition-transform duration-500 ${
                flipped ? "scale-100" : "scale-[1.01]"
              }`}
              priority
            />

            {/* Prompt overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-10">
              <div
                className={`text-center transition-opacity duration-500 ${
                  flipped ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="space-y-3">
                  {currentCard.lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={`text-black tracking-wide ${
                        line.bold ? "font-semibold" : "font-normal"
                      }`}
                      style={{
                        fontSize: 18,
                        lineHeight: 1.35,
                      }}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center mb-6">
            <p className="text-white/60 mb-4">Ready to draw your first card?</p>
            <p className="text-white/40 text-sm">Click the button below to begin</p>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          {!showCard ? (
            <button
              onClick={drawCard}
              className="w-full rounded-xl bg-white text-black py-4 font-medium text-lg"
            >
              Draw Card
            </button>
          ) : (
            <>
              <button
                onClick={nextCard}
                className="w-full rounded-xl bg-white text-black py-4 font-medium text-lg"
              >
                {isLastCard ? "Finish Taster" : "Next Card"}
              </button>
              
              <Link
                href="/free/friends/upgrade"
                className="block w-full text-center rounded-xl border border-white/20 text-white py-3 font-medium"
              >
                Unlock Full Deck Now
              </Link>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            {showCard ? "Take your time with this prompt" : "5 cards to explore"}
          </p>
        </div>
      </div>
    </main>
  );
}