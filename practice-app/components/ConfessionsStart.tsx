"use client";

// 24 Nov 2026 (Juliette): the first time someone opens Scrumptious Confessions. Same look as her website quiz
// (feelfullyyou-site/scrumptious-confessions-start.html: photo behind every question, cream opening card, gold
// italics, a thin progress line), streamlined around "What do you need today?". Her welcome first, three taps about
// them, the way in they need, their time, then their way in explained (Touch Base with her voice), their week and
// programmes. Answers stay on the phone. Her words: the taps and "where your Touch went" come from the website quiz;
// new 24 Nov: "Sore hips, knees, a body that aches" (Penelope), "My erections aren't what they were".

import { useEffect, useRef, useState } from "react";
import { MEMBERSHIP_UNLOCKS } from "@/lib/entitlements/config";

export const WELCOME_AUDIO = "/scrumptious-confessions/audio/welcome-9d55969d.m4a";
export const START_KEY = "ffy.sc.start.v1";
const P = "/confessions-start";

export type Need = "safe" | "pleasure" | "understand" | "closer" | "listen" | "ask";
export type StartAnswers = { who: string; state: string; body: string; need: Need | ""; time: string; date: string };
export type StartGo = { tab: "today" | "stories" | "card" | "library" | "yours"; fold?: "touchbase"; door?: "touchmap" | "meditations" | "smut" | "answers"; topic?: string };

const WHO = [["woman", "Me, a woman"], ["man", "Me, a man"], ["both", "The two of us"]];
const STATES = [
  ["braced", "Almost nothing is arriving"],
  ["fade", "It arrives, and then I go somewhere else"],
  ["reaching", "I feel it, and I can’t ask for what I want"],
  ["melted", "All of it reaches me. I want more"],
];
const BODY = [["meno", "Menopause, or perimenopause"], ["baby", "After having a baby"], ["aches", "Sore hips, knees, a body that aches"], ["mlow", "Just not so turned on anymore"], ["none", "Nothing like that"]];
// 24 Nov 2026 (Juliette): more for men: "not in a relationship, I want to please her, some things like that".
const BODY_MAN = [
  ["please", "I want to learn how to please her"],
  ["single", "I’m not in a relationship right now"],
  ["erect", "My erections aren’t what they were"],
  ["sooner", "I finish sooner than I’d like"],
  ["older", "Getting older, my hormones, my health, or medication"],
  ["stress", "Stress, or exhaustion"],
  ["aches", "Sore hips, knees, a body that aches"],
  ["mlow", "Just not so turned on anymore"],
  ["meno", "She’s in menopause, or perimenopause"],
  ["baby", "We’ve had a baby"],
  ["none", "Nothing like that"],
];
// 24 Nov 2026 (Juliette): couples using one membership together get their own list.
const BODY_COUPLE = [
  ["meno", "One of us is in menopause, or perimenopause"],
  ["baby", "We’ve had a baby"],
  ["erect", "Erections aren’t what they were"],
  ["aches", "Sore hips, knees, bodies that ache"],
  ["stress", "Stress, or exhaustion"],
  ["mlow", "We’re just not so turned on anymore"],
  ["none", "Nothing like that"],
];
const NEEDS = [
  ["safe", "Something for when I’m anxious, or tense"],
  ["pleasure", "To find my way back into pleasure"],
  ["understand", "To understand what’s happening to me"],
  ["closer", "To feel closer to my partner"],
  ["listen", "Something to listen to, and let go"],
  ["ask", "To ask you something I’ve never asked anyone"],
];
const TIME = [["5", "Five minutes"], ["20", "About twenty minutes"], ["evening", "An evening now and then"]];

const MADE: Record<string, { lines: string[]; close: string }> = {
  braced: { lines: ["Almost nothing is getting through.", "Not the Touch, not the wanting.", "Your body took up a position a long time ago and never put it down."], close: "Positions don’t respond to being told to relax." },
  fade: { lines: ["It starts. Your body picks it up.", "Then somewhere in the middle you’re gone.", "You come back at the end and realise you missed most of it."], close: "You already want it. Staying is the part nobody built." },
  reaching: { lines: ["You know when something isn’t quite right.", "You know it while it’s happening.", "By the time you’ve worked out how to say it, the moment has gone."], close: "You’re the one closing the gap. Every time." },
  melted: { lines: ["A look across the kitchen.", "Your own hand on your own arm.", "Most of what passes other people by reaches you."], close: "Nothing here to repair. The question at your end is range." },
};

// Each way in, in her words (approved 24 Nov 2026).
const WAYS: Record<Need, { k: string; title: string; paras: string[]; why?: { title: string; paras: string[] }; audio?: [string, string][]; cta: string; go: StartGo }> = {
  safe: {
    k: "Your way in", title: "Touch Base®, your anchor",
    paras: ["Thumb to forefinger. Feel the ridges of your skin, slower than you think slow is.", "Say to yourself: I am safe right now. There is no lion or tiger in the room. Nobody here is going to hurt me.", "Two minutes, morning and evening."],
    why: { title: "Why every day, for at least 30 days?", paras: ["Each time you do it, you teach your nervous system what safe feels like. Your attention on your fingers, the Touch you receive from yourself, the words you say: together they quiet the part of you that is always on watch.", "After 30 days it becomes as easy as tapping your fingers. In a stressful moment you tap, and your body remembers what it’s like to be safe."] },
    audio: [[`${P}/tb-anchor.m4a`, "Hear me: the anchor"], [`${P}/tb-why.m4a`, "Hear me: why 30 days"]],
    cta: "Start Touch Base", go: { tab: "today", fold: "touchbase" },
  },
  pleasure: {
    k: "Your way in", title: "The Touch Map, your way back into pleasure",
    paras: ["Self-touch, one place at a time. This month, your wrist.", "My voice in your ear, two touches, and you notice what lands and what doesn’t.", "Slowly, your body starts telling you what it likes. A new place opens every month, and your map colours itself in."],
    cta: "Open The Touch Map", go: { tab: "library", door: "touchmap" },
  },
  understand: {
    k: "Your way in", title: "This week’s confession",
    paras: ["Every Monday, a confession in my voice. What people bring me, what I’ve learned, the things I don’t say on Instagram.", "Listen first. The next day, a card opens for you to write what came up.", "Headphones on, somewhere private."],
    cta: "Listen to this week’s confession", go: { tab: "stories" },
  },
  closer: {
    k: "Your way in", title: "Your cards, and the Holiday Survival Kit",
    paras: ["Every Tuesday and Saturday, a new card opens in Confessions. Turn it over, hear my voice, then take five minutes to write. Do it on your own, or together, with fifteen minutes for the two of you.", "On top of that, the Holiday Survival Kit is yours to keep: a deck of cards for the season, for the drive there, the table, and who isn’t here this year. It opens in the cards app."],
    cta: "Open this week’s card", go: { tab: "card" },
  },
  ask: {
    k: "Your way in", title: "Ask me anything",
    paras: ["The thing you’ve never said out loud. Send it to me in the Questions tab.", "It’s anonymous. I never know who asked.", "Each Thursday, I answer that week’s questions, in my voice. The library already holds the questions I’ve answered, for women and for men."],
    cta: "Ask me a question", go: { tab: "yours" },
  },
  listen: {
    k: "Your way in", title: "Something to listen to",
    paras: ["My meditations, a new one every Friday. Lie down, headphones on, and let me take you somewhere quieter.", "Or Smut Stories: stories in my voice for late at night, or whenever takes your fancy."],
    cta: "Open my meditations", go: { tab: "library", door: "meditations" },
  },
};

/** The library door each answer opens (topic ids in the Confessions page). */
export function firstDoor(a: StartAnswers): { title: string; topic: string } {
  if (a.who === "man") {
    if (a.body === "erect" || a.body === "sooner" || a.body === "older") return { title: "His body", topic: "men-body" };
    if (a.body === "single") return { title: "You, too", topic: "men-you" };
    if (a.body === "please") return { title: "Understanding her", topic: "men-her" };
    if (a.body === "meno") return { title: "Menopause and a changing body", topic: "menopause" };
    return { title: "For men", topic: "men-her" };
  }
  if (a.body === "meno") return { title: "Menopause and a changing body", topic: "menopause" };
  if (a.body === "erect") return { title: "His body", topic: "men-body" };
  if (a.body === "aches" || a.body === "baby") return { title: "Touch and the body", topic: "touch" };
  if (a.body === "mlow") return { title: "Desire and pleasure", topic: "desire" };
  return ({ braced: { title: "Feeling nothing", topic: "numb" }, fade: { title: "When your body freezes", topic: "freeze" }, reaching: { title: "Him, her, us", topic: "us" }, melted: { title: "When it's good and you want more", topic: "more" } } as Record<string, { title: string; topic: string }>)[a.state] ?? { title: "Touch and the body", topic: "touch" };
}
/** The library's profile, filled from these answers so nobody is asked twice. */
export function toLibraryWhy(a: StartAnswers): string[] {
  const w = new Set<string>();
  w.add(({ braced: "numb", fade: "freeze", reaching: "us", melted: "more" } as Record<string, string>)[a.state] ?? "desire");
  if (a.who === "man") w.add("approach");
  if (a.body === "meno" || a.body === "aches") w.add("body");
  if (a.body === "erect" || a.body === "sooner" || a.body === "older") w.add("body-m");
  if (a.need === "closer") w.add("us");
  if (a.need === "pleasure" || a.body === "mlow") w.add("desire");
  return Array.from(w);
}

const WEEK = ["A confession in my voice", "A card to turn over and write on", "A poem", "My answers to this week’s questions", "A meditation", "Another card", "Touch Base, and a look back at your week"];
const WD = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_LINE: Record<string, string> = {
  "5": "Five minutes a day: Touch Base every day, and the one small thing that opens that day whenever you can.",
  "20": "About twenty minutes: the one small thing that opens each day. Nothing disappears if you miss one.",
  evening: "An evening now and then: Monday’s confession and your card together, as one evening. The rest waits for you.",
};

// Same photo order as the website quiz.
const PHOTO: Record<number, [string, string, boolean]> = {
  0: [`${P}/touch-bw.jpg`, "center", true],
  1: [`${P}/touch-embrace-bw.jpg`, "center", false],
  2: [`${P}/touch-heart-hands-bw.jpg`, "center", false],
  3: [`${P}/touch-hand-heart.jpg`, "center", false],
  4: [`${P}/touch-alex-behind.jpg`, "48% center", false],
  5: [`${P}/touch-scarf-silk-2.jpg`, "center", false],
  6: [`${P}/touch-grey-chest.jpg`, "center", true],
};

/** The website quiz's voice pill: her face, play, length, and speeds (every voice player has speed). */
function VoicePill({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  return (
    <div className="mt-2 inline-flex flex-col items-center gap-2">
      <audio ref={ref} src={src} preload="metadata" onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      <button type="button" onClick={() => { const a = ref.current; if (!a) return; if (a.paused) { document.querySelectorAll("audio").forEach((x) => { if (x !== a) x.pause(); }); a.play(); } else a.pause(); }}
        className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(168,133,56,0.5)] bg-[#f4f1ec] py-[7px] pl-[7px] pr-4 text-[14px] text-[#0D3535]">
        <img src={`${P}/face.jpg`} alt="" className="h-[34px] w-[34px] rounded-full object-cover" />
        <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#DDC98E] text-[10px] text-[#070707]">{playing ? "❚❚" : "▶"}</span>
        <span>{label}</span>
        {dur > 0 && <span className="text-[12px] opacity-70">{fmt(dur)}</span>}
      </button>
      <div className="flex gap-1.5">
        {[1, 1.25, 1.5].map((r) => (
          <button key={r} type="button" onClick={() => setRate(r)} className={`rounded-full border px-2.5 py-[3px] text-[11px] ${rate === r ? "border-[#0D3535] bg-[#0D3535] text-[#fefcfa]" : "border-[rgba(168,133,56,0.4)] text-[#5b4a2e]"}`}>{r}×</button>
        ))}
      </div>
    </div>
  );
}

const card = "mt-[18px] rounded-[22px] bg-[#fefcfa] px-[22px] py-6 text-[#1c1714] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.75)]";
const cardK = "text-[10px] font-semibold uppercase tracking-[0.26em] text-[#7a6236]";
const cardH = "mt-1.5 text-[21px] font-semibold leading-tight text-[#0D3535]";

export function ConfessionsStart({ onDone }: { onDone: (a: StartAnswers, go: StartGo) => void }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<StartAnswers>({ who: "", state: "", body: "", need: "", time: "", date: "" });
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo(0, 0); }, [step]);
  useEffect(() => { Object.values(PHOTO).forEach(([src]) => { const im = new window.Image(); im.src = src; }); }, []);
  // The page behind must not scroll while this is open.
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = o; }; }, []);

  const LAST = 6;
  const photo = PHOTO[Math.min(step, 6)];
  const finish = (go: StartGo) => onDone({ ...a, date: new Date().toISOString() }, go);

  const Q = (n: number, title: React.ReactNode, opts: string[][], key: keyof StartAnswers, sub?: string) => (
    <>
      <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#DDC98E]">{n} of 5</div>
      <h2 className="mt-3 text-[clamp(1.6rem,6.6vw,2.2rem)] font-medium leading-[1.2] text-white [text-shadow:0_2px_18px_rgba(7,7,7,0.55)] [&_em]:italic [&_em]:text-[#DDC98E]">{title}</h2>
      {sub && <p className="mt-3.5 text-[1.02rem] leading-relaxed text-[rgba(246,239,224,0.95)] [text-shadow:0_1px_12px_rgba(7,7,7,0.6)]">{sub}</p>}
      <div className="mt-[26px] flex flex-col gap-2.5" role="radiogroup">
        {opts.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={a[key] === v} onClick={() => setA({ ...a, [key]: v })}
            className={`min-h-[52px] rounded-[30px] border px-[22px] py-3.5 text-center text-[15px] leading-snug backdrop-blur-[4px] transition ${a[key] === v ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[rgba(221,201,142,0.4)] bg-[rgba(7,7,7,0.55)] text-[#F6EFE0]"}`}>{l}</button>
        ))}
      </div>
    </>
  );

  let body: React.ReactNode;
  let foot: { label: string; enabled: boolean; onClick: () => void } | null = null;
  if (step === 0) {
    body = (
      <div className="overflow-hidden rounded-[22px] bg-[#fefcfa] text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <div className="relative h-[230px] bg-cover" style={{ backgroundImage: `url(${P}/cover.jpg)`, backgroundPosition: "50% 72%" }}>
          <div className="absolute inset-x-0 -bottom-0.5 h-7 bg-gradient-to-b from-[rgba(254,252,250,0)] to-[#fefcfa]" />
        </div>
        <div className="px-6 pb-[26px] pt-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a6236]">Scrumptious Confessions · Welcome</div>
          <h1 className="my-2.5 text-[1.9rem] font-semibold leading-[1.1] text-[#0D3535]">Let me show you<br /><em className="text-[#A88538]">your way in.</em></h1>
          <p className="mb-3.5 text-[0.98rem] leading-relaxed text-[#1c1714]">Hear me first. Then a few quick taps, and I&rsquo;ll show you where to start.</p>
          <p className="mx-auto mb-4 max-w-[300px] rounded-2xl border border-[rgba(168,133,56,0.45)] bg-[#f4f1ec] px-4 py-3 text-[0.92rem] leading-snug text-[#0D3535]"><b className="font-semibold">Ask me anything.</b> Anonymously. I answer your questions each Thursday, and the library already holds hundreds I&rsquo;ve answered.</p>
          <VoicePill src={WELCOME_AUDIO} label="Hear me first" />
          <div className="mt-5">
            <button type="button" onClick={() => setStep(1)} className="rounded-full border border-[#0D3535] bg-[#0D3535] px-[34px] py-3.5 text-[12.8px] font-semibold uppercase tracking-[0.24em] text-[#fefcfa]">Begin</button>
          </div>
        </div>
      </div>
    );
  } else if (step === 1) {
    body = Q(1, <>Who&rsquo;s this <em>for?</em></>, WHO, "who");
    foot = { label: "Continue", enabled: !!a.who, onClick: () => setStep(2) };
  } else if (step === 2) {
    body = Q(2, <>Where did <em>the Touch go?</em></>, STATES, "state", "Answer for how it is right now.");
    foot = { label: "Continue", enabled: !!a.state, onClick: () => setStep(3) };
  } else if (step === 3) {
    body = Q(3, a.who === "man" ? <>What&rsquo;s going on <em>for you?</em></> : a.who === "both" ? <>Is anything changing <em>for the two of you?</em></> : <>Is anything changing <em>in your body?</em></>, a.who === "man" ? BODY_MAN : a.who === "both" ? BODY_COUPLE : BODY, "body");
    foot = { label: "Continue", enabled: !!a.body, onClick: () => setStep(4) };
  } else if (step === 4) {
    body = Q(4, <>What do you <em>need today?</em></>, NEEDS, "need", "There are many ways in. Pick the one that feels true right now.");
    foot = { label: "Continue", enabled: !!a.need, onClick: () => setStep(5) };
  } else if (step === 5) {
    body = Q(5, <>How much time <em>do you have?</em></>, TIME, "time", "Most days, just for you.");
    foot = { label: "Show me my way in", enabled: !!a.time, onClick: () => setStep(6) };
  } else {
    const way = WAYS[(a.need || "safe") as Need];
    const made = MADE[a.state] ?? MADE.braced;
    const door = firstDoor(a);
    const todayIdx = (new Date().getDay() + 6) % 7;
    const days = Array.from({ length: 7 }, (_, k) => (todayIdx + k) % 7);
    const later = MEMBERSHIP_UNLOCKS.filter((u) => !u.freeWeek && u.month <= 3);
    body = (
      <>
        <div className={card}>
          <div className={cardK}>{way.k}</div>
          <h3 className={cardH}>{way.title}</h3>
          {way.paras.map((t) => <p key={t} className="mt-3 text-[15px] leading-relaxed">{t}</p>)}
          {way.why && (
            <>
              <h3 className="mt-5 text-[17px] font-semibold leading-tight text-[#0D3535]">{way.why.title}</h3>
              {way.why.paras.map((t) => <p key={t} className="mt-2.5 text-[15px] leading-relaxed">{t}</p>)}
            </>
          )}
          {way.audio && <div className="mt-4 flex flex-col items-center gap-3">{way.audio.map(([s, l]) => <VoicePill key={s} src={s} label={l} />)}</div>}
          <button type="button" onClick={() => finish(way.go)} className="mt-5 w-full rounded-full bg-[#0D3535] py-3.5 text-[15px] font-medium text-[#fefcfa]">{way.cta}</button>
        </div>

        {a.need !== "ask" && (
          <div className={`${card} border-l-4 border-[#A88538]`}>
            <div className={cardK}>Ask me anything</div>
            <h3 className={cardH}>I answer each Thursday</h3>
            <p className="mt-2 text-[15px] leading-relaxed">Whatever you&rsquo;ve never asked anyone, send it to me in the Questions tab. It&rsquo;s anonymous. I never know who asked. Each Thursday, I answer that week&rsquo;s questions in my voice.</p>
            <p className="mt-2 text-[15px] leading-relaxed">You don&rsquo;t have to wait: the library already holds the questions I&rsquo;ve answered, for women and for men.</p>
            <button type="button" onClick={() => finish({ tab: "yours" })} className="mt-4 w-full rounded-full border border-[#0D3535] py-3 text-[15px] font-medium text-[#0D3535]">Ask me a question</button>
            <button type="button" onClick={() => finish({ tab: "library", door: "answers" })} className="mt-2 block w-full py-2 text-center text-[14px] text-[#0D3535] underline underline-offset-4">Read the questions I&rsquo;ve already answered</button>
          </div>
        )}

        <div className={card}>
          <div className={cardK}>Where your Touch went</div>
          <div className="mt-2 space-y-1 text-[19px] font-semibold leading-snug text-[#0D3535]">{made.lines.map((l) => <p key={l}>{l}</p>)}</div>
          <p className="mt-3 text-[15px] italic text-[#A88538]">{made.close}</p>
          <p className="mt-4 text-[14px]">Your door in the library: <button type="button" onClick={() => finish({ tab: "library", topic: door.topic })} className="font-medium text-[#0D3535] underline underline-offset-4">{door.title}</button></p>
        </div>

        <div className={card}>
          <div className={cardK}>Your first week</div>
          <p className="mt-2 text-[14px] leading-relaxed">{TIME_LINE[a.time]}</p>
          <ol className="mt-3 space-y-1.5">
            {days.map((d, k) => (
              <li key={d} className="flex gap-3 text-[14px] leading-snug">
                <span className="w-[84px] shrink-0 font-semibold text-[#A88538]">{k === 0 ? "Today" : WD[d]}</span>
                <span>{WEEK[d]}{a.time === "5" && d !== 6 ? <span className="text-[#7a6236]">, plus Touch Base</span> : null}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${card} border-l-4 border-[#A88538]`}>
          <div className={cardK}>Your programmes</div>
          <h3 className={cardH}>Holiday Survival Kit, open now</h3>
          <p className="mt-1.5 text-[14px] text-[#7a6236]">Yours to keep. Every month you stay, more open for you:</p>
          <ul className="mt-2 space-y-0.5 text-[14px]">{later.map((u) => <li key={u.title}>{u.title}</li>)}</ul>
        </div>
        <p className="mt-5 text-center text-[12px] text-[rgba(246,239,224,0.8)]">Only you see your answers. They stay on your phone.</p>
      </>
    );
    foot = { label: "Start with today", enabled: true, onClick: () => finish({ tab: "today" }) };
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070707] text-[#F6EFE0]" data-testid={step === 6 ? "start-result" : `start-step-${step}`}>
      <div className="absolute inset-[-4%] bg-cover transition-opacity duration-1000 [filter:brightness(.72)_contrast(1.04)_grayscale(.85)]" style={{ backgroundImage: `url(${photo[0]})`, backgroundPosition: photo[1] }} />
      <div className={`pointer-events-none absolute inset-0 ${photo[2] ? "bg-[rgba(7,7,7,0.62)]" : "[background:radial-gradient(120%_60%_at_50%_110%,rgba(7,7,7,.82)_25%,rgba(7,7,7,0)_68%),linear-gradient(180deg,rgba(7,7,7,.55)_0%,rgba(7,7,7,.2)_24%,rgba(7,7,7,.2)_100%)]"}`} />
      <div className="relative mx-auto flex h-full max-w-[480px] flex-col">
        <div className="flex items-center gap-2 px-[22px] pt-[calc(14px+env(safe-area-inset-top,0px))]">
          {step > 0 ? <button type="button" aria-label="Back" onClick={() => setStep(step - 1)} className="-ml-3 grid h-10 w-10 place-items-center text-[#DDC98E]">&larr;</button> : <span className="h-10" />}
          <span className="text-[10.5px] font-medium uppercase tracking-[0.32em] text-[#DDC98E]">Feel Fully You</span>
        </div>
        <div className="flex gap-[5px] px-[22px] pt-2">{Array.from({ length: LAST }, (_, i) => <i key={i} className={`h-px flex-1 transition-colors ${i < step ? "bg-[#DDC98E]" : "bg-[rgba(221,201,142,0.22)]"}`} />)}</div>
        <div ref={scroller} className={`flex-1 overflow-y-auto px-[22px] pt-8 ${foot ? "pb-[150px]" : "pb-10"}`}>{body}</div>
        {foot && (
          <div className="absolute inset-x-0 bottom-0 px-[22px] pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-[30px] [background:linear-gradient(0deg,#070707_62%,rgba(7,7,7,0))]">
            <button type="button" disabled={!foot.enabled} onClick={foot.onClick} className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#DDC98E] text-[16px] font-medium text-[#070707] disabled:opacity-35">{foot.label}</button>
          </div>
        )}
      </div>
    </div>
  );
}
