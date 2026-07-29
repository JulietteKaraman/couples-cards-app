"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDeck, DeckType, isValidDeck, isSequentialDeck, REPAIR_KIT_PHASES } from "@/data/decks";

type Phase = { key: string; name: string; description: string; dayRange: string; end: number };

function phasesForDeck(deckType: string): Phase[] {
  if (deckType === "repair-kit") return REPAIR_KIT_PHASES as Phase[];
  return [];
}

function JourneyContent() {
  const params = useParams();
  const router = useRouter();
  const { user, loading, purchasedDecks } = useAuth();

  const deckType = params.deck as string;
  const valid = isValidDeck(deckType) && isSequentialDeck(deckType);
  const deck = valid ? getDeck(deckType as DeckType) : null;

  const cards = useMemo(
    () => (deck ? [...deck.cards].sort((a, b) => a.id - b.id) : []),
    [deck]
  );
  const N = cards.length;
  const phases = phasesForDeck(deckType);
  const STORAGE_KEY = user?.id ? `${deckType}_journey_${user.id}` : `${deckType}_journey`;

  const [progress, setProgress] = useState<number | null>(null); // cards completed (frontier)
  const [showOpened, setShowOpened] = useState(false);

  // Load saved progress once we know the user/storage key
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const v = raw ? parseInt(raw, 10) : 0;
    setProgress(isNaN(v) ? 0 : Math.max(0, Math.min(N, v)));
  }, [STORAGE_KEY, N]);

  // Gate: must own this deck
  useEffect(() => {
    if (loading) return;
    if (!valid) {
      router.replace("/app");
      return;
    }
    if (!purchasedDecks.includes(deckType)) {
      router.replace(`/app/${deckType}/unlock`);
    }
  }, [loading, valid, purchasedDecks, deckType, router]);

  function save(v: number) {
    setProgress(v);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, String(v));
  }

  function phaseFor(cardIndex: number): Phase | null {
    const cardNo = cardIndex + 1;
    for (const p of phases) if (cardNo <= p.end) return p;
    return phases.length ? phases[phases.length - 1] : null;
  }

  if (!deck || progress === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Loading…</p>
      </main>
    );
  }

  const done = progress >= N;
  const idx = Math.min(progress, N - 1);
  const current = cards[idx];
  const phase = phaseFor(idx);
  const template = deck.sections[current.section as keyof typeof deck.sections]?.templateImg;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8 space-y-5">
        <button
          onClick={() => router.push("/app")}
          className="text-sm text-white/70 hover:text-white"
        >
          ← Back to decks
        </button>

        <div>
          <h1 className="text-xl font-semibold">{deck.name}</h1>
          <p className="text-xs text-white/50 mt-1">Worked one card at a time, in order.</p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-yellow-200/70 transition-all duration-500"
              style={{ width: `${Math.round((progress / N) * 100)}%` }}
            />
          </div>
        </div>

        {done ? (
          <div className="rounded-2xl border border-white/10 p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">You've moved through all {N}.</h2>
            <p className="text-white/70">
              Whatever came up, it came up because it was ready to. Come back to any card whenever you need it.
            </p>
            <button
              onClick={() => setShowOpened(true)}
              className="w-full rounded-xl border border-white/20 text-white py-3 font-medium hover:bg-white/5"
            >
              Revisit the cards
            </button>
            <button
              onClick={() => save(0)}
              className="w-full rounded-xl bg-white/10 text-white/70 py-2 text-sm hover:bg-white/15"
            >
              Start again from card 1
            </button>
          </div>
        ) : (
          <>
            {/* Module / phase */}
            {phase && (
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-200/70">
                  {phase.dayRange} · {phase.name}
                </p>
                <p className="text-sm text-white/60">{phase.description}</p>
                <p className="text-xs text-white/40 pt-1">Card {idx + 1} of {N}</p>
              </div>
            )}

            {/* Card */}
            {template && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={template}
                  alt="Card"
                  width={1200}
                  height={1600}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center px-10">
                  <div className="text-center space-y-3">
                    {current.lines.map((line, i) => (
                      <p
                        key={i}
                        className={`text-black tracking-wide ${line.bold ? "font-semibold" : "font-normal"}`}
                        style={{ fontSize: 18, lineHeight: 1.35 }}
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                save(progress + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full rounded-xl bg-white text-black py-3 font-medium"
            >
              {idx + 1 === N ? "Finish the journey →" : "I've worked this card, next →"}
            </button>

            {progress > 0 && (
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowOpened((s) => !s)}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {showOpened ? "Hide" : `${progress} card${progress > 1 ? "s" : ""} opened so far`}
                </button>
                {showOpened && (
                  <ol className="mt-3 space-y-2 list-decimal list-inside">
                    {cards.slice(0, progress).map((c) => (
                      <li key={c.id} className="text-sm text-white/60 leading-relaxed">
                        {c.lines.map((l) => l.text).join(" ")}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function JourneyPage() {
  return (
    <ProtectedRoute>
      <JourneyContent />
    </ProtectedRoute>
  );
}
