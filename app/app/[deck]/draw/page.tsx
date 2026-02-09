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
  
  // Validate deck type
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

  const [selected, setSelected] = useState<string[]>(allKeys);
  const [current, setCurrent] = useState<{ id: number; section: string; lines: { text: string; bold?: boolean }[] } | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Check access for this specific deck
  const hasDeckAccess = purchasedDecks.includes(deckType) || hasAccess;

  useEffect(() => {
    if (!loading && !hasDeckAccess) {
      router.push(`/app/${deckType}/unlock`);
    }
  }, [hasDeckAccess, loading, router, deckType]);

  // Restore selected sections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setSelected(parsed);
      } catch {}
    }
  }, [STORAGE_KEY]);

  // Persist selected sections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected, STORAGE_KEY]);

  const pool = useMemo(() => {
    const set = new Set(selected);
    return deck.cards.filter((c) => set.has(c.section));
  }, [selected, deck.cards]);

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

  const template = current ? deck.sections[current.section as keyof typeof deck.sections].templateImg : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Back button and Deck Title */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push("/app")}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back to decks
          </button>
          <h1 className="text-lg font-semibold">{deck.name}</h1>
        </div>

        {/* FILTER HEADER */}
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

        {/* SECTION COVER GRID */}
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

        {/* DRAW BUTTON */}
        <button
          onClick={draw}
          disabled={!pool.length}
          className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
        >
          Draw a Card
        </button>

        {/* CARD DISPLAY */}
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

            {/* Prompt overlay */}
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

            {/* FOOTER CONTROLS */}
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