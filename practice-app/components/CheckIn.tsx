"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 24 Nov 2026 (Juliette, from Viv's test): "a gentle 'Where are you at? How much time do you have?'"
// and "consent around time". Asked the first time this phone opens the app, kept on the phone only,
// and one tap asks again. It suggests ONE thing that fits, from what is already free (or theirs).
//
// Her welcome (video with captions) goes above the questions. Drop the file in public/app/ and put
// its name here. Empty = nothing shows, never a placeholder.
const WELCOME_VIDEO = "";
const WELCOME_CAPTIONS = ""; // a .vtt file in public/app/, optional

const KEY = "ffy.checkin.v1";

const FEELS = [
  { id: "frazzled", label: "Frazzled. I need to come down" },
  { id: "far", label: "A bit far from my body" },
  { id: "missing", label: "Missing touch, missing us" },
  { id: "curious", label: "Curious. Just looking around" },
] as const;
const TIMES = [
  { id: "5", label: "Five minutes" },
  { id: "20", label: "About twenty minutes" },
  { id: "evening", label: "An evening to myself" },
] as const;

type Feel = (typeof FEELS)[number]["id"];
type Time = (typeof TIMES)[number]["id"];
type Answer = { feel: Feel; time: Time };

type Suggestion = { title: string; line: string; where: string; href: string; external?: boolean };

function suggest(a: Answer, member: boolean): Suggestion {
  if (a.time === "5" || a.feel === "frazzled") {
    return {
      title: "Touch Base®, the Anchor",
      line: "Thumb to forefinger. Feel the ridges. \u201cI am safe right now.\u201d Hold it for two minutes.",
      where: "2 minutes · anywhere, nobody will notice",
      href: "/practice/touch-base",
    };
  }
  if (a.time === "evening" && member) {
    return {
      title: "This week's confession",
      line: "My voice, then your card, then a few minutes to write.",
      where: "Headphones · somewhere you won't be disturbed",
      href: "/practice/scrumptious-confessions",
    };
  }
  if (a.feel === "curious") {
    return {
      title: "Where did the touch go?",
      line: "Sixteen quick taps. Your body answers.",
      where: "2 minutes · free quiz",
      href: "https://feelfullyyou.com/touch-reset-quiz",
      external: true,
    };
  }
  if (a.feel === "missing" && a.time === "20") {
    return {
      title: "Between Touches",
      line: "A guide to decoding unspoken needs, in life and in love.",
      where: "Free · somewhere quiet",
      href: "/practice/between-touches",
    };
  }
  if (a.time === "evening") {
    return {
      title: "The Scrumptiousness Journal, with its meditation",
      line: "Write first, then let me take you into the meditation.",
      where: "About 35 minutes · headphones · somewhere you won't be disturbed",
      href: "/practice/scrumptiousness-journal",
    };
  }
  return {
    title: "The Scrumptiousness Journal",
    line: "One prompt, written slowly. What you write stays on your phone.",
    where: "10 to 15 minutes · somewhere quiet",
    href: "/practice/scrumptiousness-journal",
  };
}

const pill = (on: boolean) =>
  `min-h-[48px] rounded-full border px-4 text-left text-[15px] transition ${on ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-ffy-cream hover:border-[#DDC98E]"}`;

export function CheckIn({ member }: { member: boolean }) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [ready, setReady] = useState(false);
  const [feel, setFeel] = useState<Feel | null>(null);
  const [time, setTime] = useState<Time | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setAnswer(JSON.parse(v));
    } catch { /* fine */ }
    setReady(true);
  }, []);

  if (!ready) return null;

  const save = (a: Answer) => {
    setAnswer(a);
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* fine */ }
  };

  if (answer) {
    const s = suggest(answer, member);
    const inner = (
      <>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">For right now</p>
        <h2 className="font-display mt-2 text-2xl font-light text-ffy-cream">{s.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[rgba(254,252,250,0.82)]">{s.line}</p>
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[#DDC98E]">{s.where}</p>
        <span className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707]">Open it</span>
      </>
    );
    const cls = "ffy-rise block rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 sm:p-8";
    return (
      <div className="mt-4">
        {s.external ? (
          <a href={s.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
        ) : (
          <Link href={s.href} className={cls}>{inner}</Link>
        )}
        <button type="button" onClick={() => { setAnswer(null); setFeel(null); setTime(null); }}
          className="mt-3 min-h-[40px] text-[13px] text-[rgba(254,252,250,0.6)] underline underline-offset-4">
          Somewhere else today? Ask me again
        </button>
      </div>
    );
  }

  return (
    <section className="ffy-rise mt-4 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-6 sm:p-8" data-testid="check-in">
      {WELCOME_VIDEO && (
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">A welcome from me</p>
          <video controls playsInline preload="metadata" className="mt-3 w-full rounded-2xl" src={`/app/${WELCOME_VIDEO}`}>
            {WELCOME_CAPTIONS && <track kind="captions" src={`/app/${WELCOME_CAPTIONS}`} srcLang="en" label="English" default />}
          </video>
        </div>
      )}
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Before you start</p>
      <h2 className="font-display mt-2 text-2xl font-light text-ffy-cream">Where are you at today?</h2>
      <div className="mt-4 flex flex-col gap-2">
        {FEELS.map((f) => (
          <button key={f.id} type="button" aria-pressed={feel === f.id} onClick={() => setFeel(f.id)} className={pill(feel === f.id)}>{f.label}</button>
        ))}
      </div>
      <h2 className="font-display mt-7 text-2xl font-light text-ffy-cream">How much time do you have?</h2>
      <div className="mt-4 flex flex-col gap-2">
        {TIMES.map((t) => (
          <button key={t.id} type="button" aria-pressed={time === t.id} onClick={() => setTime(t.id)} className={pill(time === t.id)}>{t.label}</button>
        ))}
      </div>
      <button type="button" disabled={!feel || !time} onClick={() => feel && time && save({ feel, time })}
        className="mt-6 min-h-[48px] w-full rounded-full bg-[#DDC98E] text-[16px] font-medium text-[#070707] disabled:opacity-40">
        Show me one thing
      </button>
      <p className="mt-3 text-center text-[12px] text-[rgba(254,252,250,0.55)]">Only you see this. It stays on your phone.</p>
    </section>
  );
}
