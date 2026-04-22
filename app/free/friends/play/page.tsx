"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTasterCards } from "@/data/taster-cards";

const instructions = [
  "/cards/instructions/instructions1.svg",
  "/cards/instructions/instructions2.svg",
];

export default function FriendsTasterPlayPage() {
  const router = useRouter();
  const cards = getTasterCards("friends");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentCard = cards[currentCardIndex];
  const isLastCard = currentCardIndex === cards.length - 1;
  const isLastInstruction = currentInstruction === instructions.length - 1;

  function nextInstruction() {
    if (isLastInstruction) {
      setShowInstructions(false);
    } else {
      setCurrentInstruction(currentInstruction + 1);
    }
  }

  function prevInstruction() {
    if (currentInstruction > 0) {
      setCurrentInstruction(currentInstruction - 1);
    }
  }

  function skipInstructions() {
    setShowInstructions(false);
  }

  function drawCard() {
    if (isLastCard && showCard) {
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
      setTimeout(() => setFlipped(true), 100);
    }
  }

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
          {/* Skip button */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={skipInstructions}
              className="text-sm text-white/50 hover:text-white"
            >
              Skip
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {instructions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentInstruction ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Instructions content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 w-full">
              <img
                src={instructions[currentInstruction]}
                alt={`Instructions ${currentInstruction + 1}`}
                className="w-full h-auto"
              />
            </div>

            <h2 className="text-2xl font-semibold text-center mb-3">
              Friends & Family Edition Taster
            </h2>
            <p className="text-white/70 text-center">
              Experience 5 cards from the deck for free
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 space-y-3">
            {currentInstruction > 0 && (
              <button
                onClick={prevInstruction}
                className="w-full rounded-xl border border-white/20 text-white py-3 font-medium"
              >
                Back
              </button>
            )}
            <button
              onClick={nextInstruction}
              className="w-full rounded-xl bg-white text-black py-3 font-medium"
            >
              {isLastInstruction ? "Start Taster" : "Next"}
            </button>
          </div>
        </div>
      </main>
    );
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
