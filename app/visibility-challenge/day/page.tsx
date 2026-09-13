"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  VISIBILITY_TEMPLATE_IMG,
  VISIBILITY_CHALLENGE_LENGTH,
  getVisibilityPrompt,
} from "@/data/decks/visibility-challenge";

function computeDay(startedAt: string): number {
  const started = new Date(startedAt).getTime();
  const now = Date.now();
  const hoursElapsed = Math.max(0, (now - started) / (1000 * 60 * 60));
  const day = Math.floor(hoursElapsed / 24) + 1;
  return Math.min(day, VISIBILITY_CHALLENGE_LENGTH);
}

export default function VisibilityChallengeDayPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(1);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const startedAt = localStorage.getItem("visibility_challenge_started_at");
    if (!startedAt) {
      router.push("/visibility-challenge");
      return;
    }
    setDay(computeDay(startedAt));
    setReady(true);
    const t = setTimeout(() => setFlipped(true), 150);
    return () => clearTimeout(t);
  }, [router]);

  if (!ready) return null;

  const prompt = getVisibilityPrompt(day);
  const isComplete = day >= VISIBILITY_CHALLENGE_LENGTH;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/visibility-challenge" className="text-sm text-white/70 hover:text-white">
            ← Back
          </Link>
          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
            Day {day} of {VISIBILITY_CHALLENGE_LENGTH}
          </span>
          <div className="w-12" />
        </div>

        <div className="mb-6">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(day / VISIBILITY_CHALLENGE_LENGTH) * 100}%` }}
            />
          </div>
        </div>

        {prompt && (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-6">
            <Image
              src={VISIBILITY_TEMPLATE_IMG}
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
                  {prompt.lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={`text-black tracking-wide ${
                        line.bold ? "font-semibold" : "font-normal"
                      }`}
                      style={{ fontSize: 18, lineHeight: 1.35 }}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          {isComplete ? (
            <>
              <p className="text-white/70 mb-4">
                That's all 21 days. What has shifted for you?
              </p>
              <p className="text-xs text-white/40">
                Come back to this page any time, this last prompt stays here for you.
              </p>
            </>
          ) : (
            <p className="text-xs text-white/40">
              Today's question. Tomorrow's unlocks in 24 hours, come back for it then.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
