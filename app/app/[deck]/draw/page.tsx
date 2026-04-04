"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDeck, DeckType, isValidDeck } from "@/data/decks";

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function DrawPageContent() {
  const params = useParams();
  const router = useRouter();
  const { hasAccess, loading, purchasedDecks } = useAuth();
  
  const deckType = params.deck as string;
  
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
  
  const deck = getDeck(deckType as DeckType);
  const allKeys = Object.keys(deck.sections);
  const STORAGE_KEY = `${deckType}_selected_sections_v1`;
  const INSTRUCTIONS_VIEWED_KEY = `${deckType}_instructions_viewed`;

  const [showInstructions, setShowInstructions] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [selected, setSelected] = useState<string[]>(allKeys);
  const [current, setCurrent] = useState<{ id: number; section: string; lines: { text: string; bold?: boolean }[] } | null>(null);
  const [flipped, setFlipped] = useState(false);

  const hasDeckAccess = purchasedDecks.includes(deckType) || hasAccess;
  const instructions = [
    `/cards/${deckType}/instructions/Instructions1.svg`,
    `/cards/${deckType}/instructions/Instructions2.svg`,
  ];
  const isLastInstruction = currentInstruction === instructions.length - 1;

  useEffect(() => {
    if (!loading && !hasDeckAccess) {
      router.push(`/app/${deckType}/unlock`);
    }
  }, [hasDeckAccess, loading, router, deckType]);

  useEffect(() => {
    const viewed = localStorage.getItem(INSTRUCTIONS_VIEWED_KEY);
    if (viewed) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
    }
  }, [INSTRUCTIONS_VIEWED_KEY]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setSelected(parsed);
      } catch {}
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected, STORAGE_KEY]);

  function nextInstruction() {
    if (isLastInstruction) {
      localStorage.setItem(INSTRUCTIONS_VIEWED_KEY, "true");
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

  function viewInstructionsAgain() {
    setCurrentInstruction(0);
    setShowInstructions(true);
  }

  function toggle(k: string) {
    setSelected((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  function selectAll() {
    setSelected(allKeys);
  }

  function clearAll() {
    setSelected([]);
  }

  function draw() {
    if (!pool.length) return;
    setFlipped(false);
    const next = pickRandom(pool);
    setCurrent(next);
    setTimeout(() => setFlipped(true), 140);
  }

  const pool = useMemo(() => {
    const set = new Set(selected);
    return deck.cards.filter((c) => set.has(c.section));
  }, [selected, deck.cards]);

  const template = current ? deck.sections[current.section as keyof typeof deck.sections].templateImg : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    );
  }

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
          <div className="flex justify-end mb-4">
            <button 
              onClick={skipInstructions}
              className="text-sm text-white/50 hover:text-white"
            >
              Skip
            </button>
          </div>

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

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 w-full">
              <img
                src={instructions[currentInstruction]}
                alt={`Instructions ${currentInstruction + 1}`}
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
              {isLastInstruction ? "Start Playing" : "Next"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push("/app")}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back to decks
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{deck.name}</h1>
            <button 
              onClick={viewInstructionsAgain}
              className="text-xs text-white/50 hover:text-white underline"
            >
              Instructions
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Choose sections</h2>
          <div className="flex gap-3 text-xs">
            <button className="underline text-white/70" onClick={selectAll}>
              Select all
            </button>
            <button className="underline text-white/70" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {allKeys.map((k) => {
            const isOn = selected.includes(k);
            const section = deck.sections[k as keyof typeof deck.sections];
            return (
              <button
                key={k}
                onClick={() => toggle(k)}
                className={`rounded-2xl overflow-hidden border transition ${
                  isOn ? "border-yellow-200/40" : "border-white/10"
                }`}
                style={{
                  boxShadow: isOn ? "0 0 0 1px rgba(250, 204, 21, 0.25)" : undefined,
                }}
              >
                <Image
                  src={section.coverImg}
                  alt={section.title}
                  width={800}
                  height={1100}
                  className="w-full h-auto"
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={draw}
          disabled={!pool.length}
          className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
        >
          Draw a Card
        </button>

        {current && template && (
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={template}
              alt="Card template"
              width={1200}
              height={1600}
              className={`w-full h-auto transition-transform duration-500 ${
                flipped ? "scale-100" : "scale-[1.01]"
              }`}
              priority
            />

            <div className="absolute inset-0 flex items-center justify-center px-10">
              <div
                className={`text-center transition-opacity duration-500 ${
                  flipped ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="space-y-3">
                  {current.lines.map((line, idx) => (
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

            <div className="absolute bottom-3 left-0 right-0 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex-1 rounded-xl bg-black/70 text-white py-2 text-sm border border-white/10"
                >
                  Change sections
                </button>
                <button
                  onClick={draw}
                  className="flex-1 rounded-xl bg-black/70 text-white py-2 text-sm border border-white/10"
                >
                  Draw another
                </button>
              </div>
            </div>
          </div>
        )}

        {!current && (
          <p className="text-xs text-white/50">
            Tip: Select one or more sections, then draw.
          </p>
        )}
      </div>
    </main>
  );
}

export default function DrawPage() {
  return (
    <ProtectedRoute>
      <DrawPageContent />
    </ProtectedRoute>
  );
}
