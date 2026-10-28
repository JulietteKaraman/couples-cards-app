"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FEELS } from "@/components/Interactive";
import { count } from "@/lib/count";
import VoicePlayer from "@/components/VoicePlayer";
import { Blocks } from "@/components/Blocks";
import type { ContentBlock } from "@/lib/content/blocks";

// THE TASTE (28 Oct 2026). A free, open page: no sign-in. One practice that
// is NOT one of the 31 days, in Juliette's voice, laid out exactly like a day
// in the app so people feel what the month is like before they pay.
// Juliette: "make them have an experience of what it's like in the app, so
// that some of the bits are written... what did you feel, they can write it in".
// Her recording: Drive "Tp taster fruit.m4a" (28 Oct), transcribed in Descript.
// The written parts deepen the recording, they never repeat it word for word.

const BUY = "https://buy.stripe.com/7sYeVceOvgtydq5av30co2o";

const before: ContentBlock[] = [
  {
    kind: "tapCheck",
    key: "taste-fruit-ready",
    label: "Before you press play",
    items: [
      "One strawberry, raspberry or grape. Soft and juicy, nothing crunchy.",
      "You've decided who gives and who receives.",
      "Phone volume up, somewhere you won't be interrupted for three minutes.",
    ],
    done: "Ready. Press play.",
  },
];

const after: ContentBlock[] = [
  {
    kind: "pickOne",
    key: "taste-fruit-role",
    label: "Which were you today?",
    items: ["I gave", "I received"],
    chosenLabel: "Next time, swap.",
  },
  {
    kind: "why",
    lines: [
      { text: "Why only one way", emphasis: "bold" },
      { text: "When you both give at the same time, nobody gets to receive. Most couples do exactly that, every day, without noticing." },
      { text: "One of you leads. One of you lets it happen. It sounds simple, and for a lot of people it's the first time in years." },
    ],
  },
  {
    kind: "notice",
    lines: [
      { text: "There's no right reaction.", emphasis: "bold" },
      { text: "A laugh. A blush. A \"not my thing\". Each one tells you something about what lights you up, and what doesn't." },
    ],
  },
];

// The example day's own "how did it feel" and "I did it", the same look as
// the 31 real days, kept on this phone only (not the buyer's month).
const DONE_KEY = "ffy.31tp.taste.done.v1";
const FEEL_KEY = "ffy.31tp.taste.feel.v1";
const GIVER_KEY = "ffy.31tp.taste.giver.v1";
const RECEIVER_KEY = "ffy.31tp.taste.receiver.v1";
// Two voices, two colours: giver in her gold, receiver in her soft blue #D8DFE1.
const NOTES = [
  { key: GIVER_KEY, who: "Giver", color: "#DDC98E", placeholder: "Leading felt..." },
  { key: RECEIVER_KEY, who: "Receiver", color: "#D8DFE1", placeholder: "Being told what to do felt..." },
] as const;
const lsGet = (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

export default function TasteThirtyOneTouchPoints() {
  const [done, setDone] = useState(false);
  const [feel, setFeel] = useState("");
  const [giverNote, setGiverNote] = useState("");
  const [receiverNote, setReceiverNote] = useState("");
  useEffect(() => { setDone(lsGet(DONE_KEY) === "1"); setFeel(lsGet(FEEL_KEY)); count("taster_open", 0); setGiverNote(lsGet(GIVER_KEY)); setReceiverNote(lsGet(RECEIVER_KEY)); }, []);
  const markDone = () => { lsSet(DONE_KEY, "1"); setDone(true); count("taster_done", 0); };
  const chooseFeel = (id: string) => { lsSet(FEEL_KEY, id); setFeel(id); count("taster_feel", 0, id); };
  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <p className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">
          31 Touch Points · a taste
        </p>

        <div className="relative mt-5 flex justify-center">
          <Image
            src="/31-touch-points/itv-raspberry-feed.jpg"
            alt="Juliette feeding Ferne McCann a raspberry on ITV"
            width={1000}
            height={644}
            priority
            sizes="(min-width: 768px) 672px, 100vw"
            className="block h-auto max-h-[70vh] w-auto max-w-full rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]"
          />
        </div>

        <p className="mt-7 text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Your example day · free · about three minutes · for two</p>
        <h1 className="mt-2 font-display text-3xl font-light leading-tight sm:text-4xl">The Fruit</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#cfc8bb]">
          One of you leads. One of you receives. I&rsquo;ll talk you both through it.
        </p>

        <Blocks blocks={before} dark />

        <div className="mt-8">
          <VoicePlayer src="/31-touch-points/audio/taster-fruit.m4a" label="Listen: 3 minutes" dark />
        </div>

        <Blocks blocks={after} dark />

        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">What did you feel? A line each.</p>
        <div className="mt-3 space-y-3">
          {NOTES.map((n) => {
            const val = n.key === GIVER_KEY ? giverNote : receiverNote;
            const set = n.key === GIVER_KEY ? setGiverNote : setReceiverNote;
            return (
              <label key={n.key} className="block rounded-2xl border-[1.5px] p-4" style={{ borderColor: n.color, background: `${n.color}12` }}>
                <span className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em]" style={{ color: n.color }}>
                  <span className="h-3 w-3 rounded-full" style={{ background: n.color }} />{n.who}
                </span>
                <textarea
                  value={val}
                  onChange={(e) => { set(e.target.value); lsSet(n.key, e.target.value); }}
                  placeholder={n.placeholder}
                  rows={3}
                  className="mt-2 w-full resize-none bg-transparent text-[16px] leading-relaxed text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:outline-none"
                />
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-[13px] text-[#8f877a]">Saved as you type, on this phone only. What you write stays on your phone. Not even I see it.</p>

        <div className="mt-10 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">How did it feel?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {FEELS.map((f) => (
              <button key={f.id} type="button" onClick={() => chooseFeel(f.id)}
                className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-2 py-3 text-[14px] ${feel === f.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`}>
                <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: f.color }} />{f.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">Your month, one dot a day</p>
          <div className="mt-2 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
            {Array.from({ length: 31 }, (_, i) => {
              const c = i === 0 ? FEELS.find((f) => f.id === feel)?.color : undefined;
              return (
                <span key={i} className="aspect-square rounded-full border border-[#DDC98E]/30"
                  style={c ? { background: c, borderColor: c } : undefined} />
              );
            })}
          </div>
          <p className="mt-3 text-sm text-[#a79f90]">
            {feel ? "That's your first dot. Every day you do colours the next one." : "Pick one, and watch your first dot colour in."}
          </p>
        </div>

        <div className="mt-8">
          {done ? (
            <div className="ffy-done rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
              <span className="block font-display text-4xl font-light leading-none text-[#DDC98E]">Done</span>
              <p className="mt-3 text-[15px] text-ffy-cream">That&rsquo;s what every day in the app feels like.</p>
            </div>
          ) : (
            <button
              onClick={markDone}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] transition hover:bg-[#EEDE80] sm:w-auto"
            >
              I did it ✓
            </button>
          )}
        </div>

        <div className="mt-12 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">That was one</p>
          <h2 className="mt-2 font-display text-[28px] font-light leading-tight">31 more, all different, waiting in this app.</h2>
          <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-[15px] text-[#cfc8bb]">
            <li>🔒 The Kitchen Spin</li>
            <li>🔒 The Neck Kiss</li>
            <li>🔒 Telly Hands</li>
            <li>🔒 Greedy Hands</li>
            <li className="text-[#8f877a]">…and 27 more</li>
          </ul>
          <p className="mt-5 text-[15px] text-[#cfc8bb]">One a day, my voice in your ear, a few minutes each.</p>
          <a
            href={BUY}
            onClick={() => count("taster_buy_click", 0)}
            className="mt-6 inline-flex min-h-[52px] items-center rounded-full bg-[#DDC98E] px-7 text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80]"
          >
            Get all 31 · £27
          </a>
          <p className="mt-3 text-[13px] text-[#8f877a]">Day one opens the minute you join.</p>
        </div>
      </div>
      <style>{`
        @keyframes ffyDone { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
        .ffy-done { animation: ffyDone .6s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .ffy-done { animation: none; } }
      `}</style>
    </main>
  );
}
