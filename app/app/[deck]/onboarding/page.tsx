"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { isValidDeck, DECKS } from "@/data/decks";

function OnboardingContent() {
  const params = useParams();
  const router = useRouter();
  const deckType = params.deck as string;
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isValidDeck(deckType)) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70">Invalid deck type</p>
          <button 
            onClick={() => router.push("/app")}
            className="mt-4 text-white underline"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const deck = DECKS[deckType];
  const instructions = [
    {
      image: `/cards/${deckType}/instructions/Instructions1.svg`,
      title: "Welcome",
    },
    {
      image: `/cards/${deckType}/instructions/Instructions2.svg`,
      title: "Get Started",
    },
  ];

  const totalSlides = instructions.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push(`/app/${deckType}/draw`);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skip = () => {
    router.push(`/app/${deckType}/draw`);
  };

  const instruction = instructions[currentSlide];
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={skip}
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
                idx === currentSlide ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 w-full">
            <img
              src={instruction.image}
              alt={instruction.title}
              className="w-full h-auto"
            />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-3">
            {deck.name}
          </h2>
          <p className="text-white/70 text-center">
            {deck.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-y-3">
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="w-full rounded-xl border border-white/20 text-white py-3 font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={nextSlide}
            className="w-full rounded-xl bg-white text-black py-3 font-medium"
          >
            {isLastSlide ? "Start Playing" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
