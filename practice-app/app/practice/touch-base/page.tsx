"use client";

// Touch Base® Anchor. Free, no login, one page (27 Oct 2026 rebuild in the
// dark hub style of When She Goes Quiet and the buyer pages).
//
// Every word of the practice, the "why it works" and the closing line is
// Juliette's, unchanged. What is new is the doing: her 5 minute guided
// recording, the 1 to 10 rating she already asks for (before, two minute
// timer, after), and a 31 day morning/evening tracker, because her own copy
// says "Thirty-one days, it becomes automatic". Saved on this phone only.
//
// Photos: press shoot portraits used on no other page (27 Oct).

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import PracticeTimer from "@/components/PracticeTimer";
import { TellMe } from "@/components/TellMe";

const GOLD = "#DDC98E";
const LOG_KEY = "ffy.touchbase.log.v1";

type Entry = { d: string; slot: "am" | "pm"; b: number; a: number };

const today = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};
const readLog = (): Entry[] => {
  try { const v = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
};
const dayIndex = (start: string, d: string) =>
  Math.round((new Date(d + "T12:00").getTime() - new Date(start + "T12:00").getTime()) / 86400000);

const STEPS: [string, string][] = [
  ["Press thumb to forefinger:", "begin with this simple, grounding gesture."],
  ["Move slowly, like honey:", "feel every ridge of your skin. Slower than you think slow is. Then slower still."],
  ["Notice and release:", "notice where you want to speed up, notice the thoughts that rise, and let them pass."],
  ["Remind yourself:", "there is no tiger in the room. I am safe."],
  ["Two minutes, twice a day:", "morning and evening. Before you begin, rate how you feel one to ten. After two minutes, rate again."],
];

export default function TouchBasePage() {
  const [log, setLog] = useState<Entry[]>([]);
  useEffect(() => setLog(readLog()), []);

  const save = (e: Entry) => {
    const next = [...log, e];
    setLog(next);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <main className="min-h-screen bg-[#1a1814] text-[#f1ece2]">
      <div className="relative h-[58vh] min-h-[380px] w-full overflow-hidden">
        <Image src="/touch-base/hero.jpg" alt="Juliette Karaman, eyes closed" fill priority sizes="100vw" className="object-cover object-[50%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1814]/50 via-transparent to-[#1a1814]" />
        <div className="absolute left-0 top-0 p-4">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[#DDC98E]/40 bg-black/20 px-4 py-2 text-sm font-medium text-[#DDC98E] backdrop-blur-sm">
            ← Your library
          </Link>
        </div>
      </div>

      <div className="relative mx-auto -mt-28 max-w-xl px-6 pb-16">
        {/* The gold Touch Base emblem, so they recognise it (27 Oct, Juliette) */}
        <Image src="/touch-base/emblem.png" alt="The Touch Base emblem: thumb pressed to forefinger" width={96} height={96} className="mb-5 h-24 w-24 rounded-full shadow-[0_0_40px_-6px_rgba(221,201,142,0.7)]" />
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">Free practice</p>
        <h1 className="mt-3 font-display text-[42px] font-light leading-[1.05]">Touch Base®, the Anchor</h1>
        <p className="mt-4 text-lg text-[#a79f90]">A tiny gesture. A massive shift. Two minutes, no equipment.</p>

        <a href="#try" className="mt-8 inline-flex items-center rounded-full bg-[#DDC98E] px-7 py-4 font-display text-lg font-medium text-[#1a1814]">
          Do it now →
        </a>

        <div className="mt-6 flex items-center gap-3.5">
          <Image src="/touch-base/me.jpg" alt="Juliette" width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover shadow-[0_0_24px_-6px_rgba(221,201,142,0.6)]" />
          <div>
            <p className="font-display text-lg">Do it with me</p>
            <p className="text-sm text-[#a79f90]">Press play, close your eyes, follow my voice.</p>
          </div>
        </div>
        <div className="mt-4">
          <VoicePlayer src="/touch-base/touch-base-guided.m4a" label="Touch Base, guided by me · 5 min" dark />
        </div>

        <Section eyebrow="Watch">
          <div className="overflow-hidden rounded-2xl bg-black" style={{ position: "relative", paddingBottom: "56.25%" }}>
            <iframe
              src="https://player.vimeo.com/video/1223329859?speed=1&title=0&byline=0&portrait=0&dnt=1"
              title="Touch Base®, the video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-[#f1ece2]/90">
            This is the tool Juliette teaches every single client. It&rsquo;s discreet enough that no one around you will
            notice, but your body will.
          </p>
        </Section>

        <Section eyebrow="The Practice">
          <div className="grid gap-3">
            {STEPS.map(([h, t], i) => (
              <div key={h} className="flex gap-3.5 rounded-[18px] border border-[#DDC98E]/20 bg-[#211e19] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDC98E]/60 font-display text-[#DDC98E]">{i + 1}</span>
                <p className="leading-relaxed"><span className="font-display font-medium text-[#DDC98E]">{h}</span> {t}</p>
              </div>
            ))}
          </div>
        </Section>

        <div id="try" className="scroll-mt-6">
          <TryIt onSave={save} />
        </div>

        {/* No paid door on this free page (27 Oct, Juliette): it ends on Tell me. */}
        <Month log={log} />

        {/* Why it works, 27 Oct: her ask, "this needs to pop", each line on its own */}
        <div className="mt-10 rounded-[22px] bg-gradient-to-b from-[#0D3535] to-[#0D3535]/60 px-5 py-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>Why it works</p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#f1ece2]/70">
            Paired with slowness, breath and attention, this gesture downregulates the stress response.
          </p>
          <p className="mt-5 font-display text-[27px] font-light leading-[1.2] text-[#EEDE80]">
            You are gently teaching your system to associate this moment with safety.
          </p>
          <div className="mt-7 grid gap-3">
            {[
              ["31", "Thirty-one days,", "it becomes automatic."],
              ["90", "Ninety days,", "it is muscle memory, you will reach for it instinctively."],
            ].map(([num, lead, rest]) => (
              <div key={num} className="flex items-center gap-4 rounded-[18px] border border-[#DDC98E]/40 bg-[#1a1814]/40 px-4 py-4">
                <span className="w-[64px] shrink-0 text-center font-display text-[44px] font-light leading-none text-[#DDC98E]">{num}</span>
                <p className="leading-snug">
                  <span className="block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">{lead}</span>
                  <span className="mt-1 block font-display text-[19px] text-[#f1ece2]">{rest}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center font-display text-[24px] font-light leading-snug">
          The body follows the focus. Give it something worth finding.
        </p>

        <TellMe line="I just did Touch Base. What came up for me: " />
      </div>
    </main>
  );
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>{eyebrow}</p>
      {children}
    </section>
  );
}

function Rate({ label, value, onPick }: { label: string; value: number | null; onPick: (n: number) => void }) {
  return (
    <div>
      <p className="font-display text-lg">{label}</p>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className={`h-11 rounded-full border font-display text-[17px] ${value === n ? "border-[#DDC98E] bg-[#DDC98E] text-[#1a1814]" : "border-[#DDC98E]/30 text-[#f1ece2]/85"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function TryIt({ onSave }: { onSave: (e: Entry) => void }) {
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);
  const [saved, setSaved] = useState<Entry | null>(null);

  const finish = () => {
    if (before === null || after === null) return;
    const e: Entry = { d: today(), slot: new Date().getHours() < 14 ? "am" : "pm", b: before, a: after };
    onSave(e);
    setSaved(e);
  };

  return (
    <section className="mt-12 rounded-[22px] border border-[#DDC98E] bg-gradient-to-b from-[#0D3535]/60 to-[#211e19] px-5 py-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>Do it now</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">Two minutes. Right where you are.</h2>

      {saved ? (
        <div className="mt-6 text-center">
          <p className="font-display text-[22px]">{saved.slot === "am" ? "Morning" : "Evening"} done ✓</p>
          <p className="mt-4 flex items-center justify-center gap-4 font-display text-[40px] font-light text-[#DDC98E]">
            <span>{saved.b}</span><span className="text-2xl text-[#a79f90]">→</span><span>{saved.a}</span>
          </p>
          <p className="mt-1 text-sm text-[#a79f90]">Before, then after. It&rsquo;s on your month below.</p>
          <button type="button" onClick={() => { setSaved(null); setBefore(null); setAfter(null); }} className="mt-5 text-sm text-[#DDC98E] underline underline-offset-4">
            Do another one
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-7">
          <Rate label="1. Before you begin, how do you feel?" value={before} onPick={setBefore} />
          <div className={before === null ? "pointer-events-none opacity-40" : ""}>
            <p className="mb-3 flex items-center gap-3 font-display text-lg">
              <Image src="/touch-base/emblem.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
              2. Thumb to forefinger. Slowly, like honey.
            </p>
            <PracticeTimer minutes={[2]} label="Your two minutes" dark solo />
          </div>
          <div className={before === null ? "pointer-events-none opacity-40" : ""}>
            <Rate label="3. Now, how do you feel?" value={after} onPick={setAfter} />
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={before === null || after === null}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#1a1814] disabled:opacity-40"
          >
            I did it ✓
          </button>
        </div>
      )}
    </section>
  );
}

function Month({ log }: { log: Entry[] }) {
  if (!log.length) {
    return (
      <section className="mt-10 rounded-[22px] border border-[#DDC98E]/20 bg-[#211e19] px-5 py-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>Your first 7 days</p>
        <p className="mt-2 text-[#a79f90]">Your first one starts your week. Morning and evening each get a dot.</p>
      </section>
    );
  }
  const start = log.map((e) => e.d).sort()[0];
  const n = Math.min(DAYS, dayIndex(start, today()) + 1);
  const get = (i: number, slot: "am" | "pm") =>
    [...log].reverse().find((e) => dayIndex(start, e.d) === i && e.slot === slot);
  return (
    <section className="mt-10 rounded-[22px] bg-[#F6EFE0] px-4 py-5 text-[#1a1814] shadow-[0_0_40px_-12px_rgba(238,222,128,0.5)]">
      <div className="flex items-baseline justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0D3535]">Your first 7 days</p>
        <p className="text-sm text-[#6b6559]">Day {n} of {DAYS} · <b className="text-[#0D3535]">{log.length} done</b></p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {Array.from({ length: DAYS }, (_, i) => {
          const am = get(i, "am");
          const pm = get(i, "pm");
          const star = MILESTONES.includes(i + 1);
          const reached = star && n >= i + 1 && (am || pm);
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 rounded-xl py-1.5 ${am || pm ? "bg-white" : "bg-white/45"} ${i === n - 1 ? "ring-2 ring-[#0D3535]" : ""}`}
            >
              <span className={`text-[11px] font-medium ${reached ? "text-[#b8902f]" : "text-[#6b6559]"}`}>
                {star ? (reached ? "★" : "☆") : i + 1}
              </span>
              <span className="flex gap-1">
                <Dot e={am} />
                <Dot e={pm} />
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-[13px] text-[#4a443b]">
        {MOODS.map((m) => (
          <span key={m.label} className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full ring-1 ring-[#C29A4E]/60" style={{ background: m.color }} />
            {m.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">Left dot morning, right dot evening</span>
        <span className="inline-flex items-center gap-1.5">★ your first week</span>
      </div>
    </section>
  );
}

// How they felt AFTER the two minutes picks the colour (27 Oct, Juliette:
// "a bit more fun and playful, maybe different colour dots").
const MOODS = [
  { min: 8, label: "Glowing", color: "#EEDE80" },
  { min: 5, label: "Warm", color: "#C29A4E" },
  { min: 1, label: "Settling", color: "#0D3535" },
];
const MILESTONES = [7];
// A taster, not the whole month (27 Oct, Juliette: "31 days is way too
// fucking much... This is just a freebie").
const DAYS = 7;

function Dot({ e }: { e?: Entry }) {
  if (!e) return <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-dashed border-[#c9bfa9]" />;
  const m = MOODS.find((x) => e.a >= x.min) ?? MOODS[2];
  return <span className="h-3.5 w-3.5 rounded-full ring-1 ring-[#C29A4E]/60" style={{ background: m.color }} title={`${e.b} → ${e.a}`} />;
}
