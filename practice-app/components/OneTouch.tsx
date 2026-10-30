"use client";

// One Touch, rebuilt as a seven-day ritual (27 Oct 2026). Juliette: "It needs
// to be much more professional ... a much nicer experience" and built on
// Abigail Peugh's method: small rewards exactly where people stop. Three spots:
// nothing pulls them back after day 1 or 2 (Today screen, I did it, tomorrow
// teaser, calendar reminder), the transcript wall (Watch / Read switch), the
// cards living somewhere else (Your cards, all 23, with How to use).
// One Touch is for women AND men: everything here says "you".

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- small helpers ---------- */
const LS = "ffy.ot.";
function lsGet<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(LS + k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function lsSet(k: string, v: unknown) {
  try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {}
}
function useLS<T>(k: string, d: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(d);
  useEffect(() => { setV(lsGet(k, d)); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  return [v, (nv: T) => { setV(nv); lsSet(k, nv); }];
}
function chime(notes = [523, 659, 784, 1047]) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const a = new AC(); const t = a.currentTime;
    notes.forEach((f, k) => {
      const o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = f;
      const s = t + k * 0.1; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.09, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 1.1); o.connect(g); g.connect(a.destination); o.start(s); o.stop(s + 1.2);
    });
  } catch {}
}

/* ---------- the day's card and how to use it ---------- */
// Card text from the One Touch deck (couples-cards-app/data/decks/one-touch.ts).
export const OT_DAY_CARD: Record<string, string | null> = {
  // 27 Oct: Days 1 and 2 now match the card she READS in each video (the old members page had them swapped).
  "your-own-touch": "Tell me what you have not voiced yet still influences the way you receive touch. What do you need in order to feel safe and secure to receive touch now?",
  "moving-the-energy": "Tell me what surprises you about your own touch. What have you been told about touching your own skin?",
  "saying-yes-when-your-body-said-no": "Tell me when you've said yes although your body said no. How does it feel to voice that now?",
  "what-youve-never-dared-ask-for": "Tell me one thing you've never dared ask for, because you were afraid of the answer.",
  "a-time-you-felt-free": "Tell me about a time you felt free to express yourself.",
  "layering-the-touch": null, // Day 6 never had its own card: draw one from the deck
  "the-body-youve-been-at-war-with": "Tell me one way you judge yourself or your body.",
};

// Juliette 27 Oct: "Solo, then with someone". Alone = drafted for her to edit,
// With someone = her Dyad, word for word from the cards app How To Use card.
export const HOW_TO = {
  alone: [
    "Set a timer for 5 minutes. One card.",
    "Answer it on paper or out loud.",
    "Breathe, read the card again, answer again. Keep going until the timer.",
  ],
  together: [
    "Set a timer for 15 minutes. Choose one prompt. Stay with it.",
    "A asks. B takes in the prompt and gives one clear communication.",
    "A listens to understand and only responds with: “Thank you.” “Clarify that.” “Summarise that.”",
    "Once you reach “thank you”, switch. Same prompt. Back and forth.",
    "No fixing. No defending. No interrupting. No debating.",
  ],
};

/* Her own voice from the cards app (card-engine/app/voice): welcome.m4a = the Dyad
   with someone, 6-solo-start.m4a = on your own. Same recordings, so it matches the app. */
function VoiceNote({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  return (
    <div className="mx-auto mt-4 max-w-sm">
      <button type="button" onClick={() => { const a = ref.current; if (!a) return; if (a.paused) { a.play(); } else { a.pause(); } }}
        className="flex w-full items-center gap-3 rounded-full border border-[#DDC98E]/40 bg-[#DDC98E]/[0.06] py-2 pl-2 pr-5 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDC98E] text-[#070707]">{playing ? "❚❚" : "▶"}</span>
        <span className="flex-1">
          <span className="block text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Hear Juliette</span>
          <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-[#DDC98E]/20"><span className="block h-full bg-[#DDC98E]" style={{ width: `${p}%` }} /></span>
        </span>
      </button>
      <audio ref={ref} src={src} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setP(0); }}
        onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setP((a.currentTime / a.duration) * 100); }} />
    </div>
  );
}

// 27 Oct, Juliette: "they will be mostly doing this solo". On your own is THE how-to;
// with someone is a quiet extra underneath, closed until she opens it.
export function HowTo({ compact = false }: { compact?: boolean }) {
  const [together, setTogether] = useState(false);
  const steps = (list: string[]) => (
    <ol className="mx-auto mt-4 max-w-sm space-y-2.5 text-left">
      {list.map((l, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[#EDE6D6]/85">
          <span className="mt-0.5 font-display text-[#DDC98E]">{i + 1}</span><span>{l}</span>
        </li>
      ))}
    </ol>
  );
  return (
    <div className={compact ? "" : "mt-6"}>
      <VoiceNote src="/one-touch/voice/on-your-own.m4a" />
      {steps(HOW_TO.alone)}
      <div className="mx-auto mt-6 max-w-sm border-t border-[#DDC98E]/15 pt-4">
        <button type="button" onClick={() => setTogether(!together)} className="text-xs uppercase tracking-[0.2em] text-[#DDC98E]/80">
          {together ? "Close" : "Doing it with someone? +"}
        </button>
        {together && (<><VoiceNote src="/one-touch/voice/with-someone.m4a" />{steps(HOW_TO.together)}</>)}
      </div>
    </div>
  );
}

/* ---------- the seven circles ---------- */
function Circles({ done, today }: { done: number; today: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => (
        <span key={d} aria-label={`Day ${d}`}
          className={`relative h-3.5 w-3.5 rounded-full border ${d <= done ? "border-[#DDC98E] bg-[#DDC98E] shadow-[0_0_12px_rgba(221,201,142,.6)]" : d === today ? "border-[#DDC98E]" : "border-[#DDC98E]/25"}`}>
          {d === today && d > done && <span className="absolute inset-[3px] rounded-full bg-[#DDC98E]/70" />}
        </span>
      ))}
    </div>
  );
}

/* ================= TODAY ================= */
type Entry = { slug: string; title: string; eyebrow?: string };
export function OneTouchToday(props: {
  entries: Entry[]; doneSlugs: string[] | null; dayOf: (s: string) => number; dayLesson: Record<number, string>;
  unlockedThrough: number; dueAt: number; whenItOpens: (t: number) => string; heroImage: string; prompts: string[];
}) {
  const { entries, doneSlugs, dayOf, dayLesson, unlockedThrough, dueAt, whenItOpens, heroImage, prompts } = props;
  const [tab, setTab] = useState<"days" | "cards">("days");
  const done = doneSlugs ? Object.values(dayLesson).filter((s) => doneSlugs.includes(s)).length : 0;
  const welcomed = !!doneSlugs?.includes("welcome");
  const allDone = done >= 7;
  const todayDay = Math.min(7, done + 1);
  const todaySlug = dayLesson[todayDay];
  const today = entries.find((e) => e.slug === todaySlug);
  const waiting = !allDone && todayDay > unlockedThrough;

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <section className="relative h-[34vh] overflow-hidden">
        <Image src={heroImage} alt="" fill priority className="object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/40 via-[#070707]/20 to-[#070707]" />
        <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col justify-between px-5 pb-6 pt-5">
          <Link href="/" className="self-start rounded-full border border-[#DDC98E]/40 bg-[#070707]/50 px-4 py-1.5 text-xs text-[#DDC98E] backdrop-blur">← Your library</Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#DDC98E]">One Touch</p>
            <div className="mt-3 flex items-center justify-between">
              <Circles done={done} today={todayDay} />
              <span className="text-xs tracking-[0.2em] text-[#F6EFE0]/60">{allDone ? "7 of 7" : `Day ${todayDay} of 7`}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-5 pb-16">
        {/* TODAY card */}
        {!welcomed ? (
          <TodayCard eyebrow="Before you begin" title="Welcome to One Touch" line="Start here." href="/practice/one-touch/welcome" cta="Begin" />
        ) : allDone ? (
          <TodayCard eyebrow="You did all seven" title="Your week" line="Every answer, every check-in, in one place." href="/practice/one-touch/your-week" cta="Open" />
        ) : waiting ? (
          <div className="mt-6 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
            <h2 className="mt-2 font-display text-2xl font-light leading-snug">{today?.title}</h2>
            <p className="mt-2 text-sm text-[#F6EFE0]/60">Opens {dueAt ? whenItOpens(dueAt) : "tomorrow"}. Today is done. Let it land.</p>
          </div>
        ) : today ? (
          <TodayCard eyebrow={`Today · Day ${todayDay}`} title={today.title} line="About 15 minutes. Three small steps." href={`/practice/one-touch/${today.slug}`} cta="Begin" />
        ) : null}

        {/* tabs */}
        <div className="mt-8 flex gap-2">
          {(["days", "cards"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-full border py-2.5 text-xs uppercase tracking-[0.2em] transition ${tab === t ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/30 text-[#DDC98E]"}`}>
              {t === "days" ? "Seven days" : "Your cards"}
            </button>
          ))}
        </div>

        {tab === "days" ? (
          <div className="mt-5 space-y-2.5">
            {entries.filter((e) => e.slug === "welcome" || Object.values(dayLesson).includes(e.slug)).map((e) => {
              const d = e.slug === "welcome" ? 0 : dayOf(e.slug);
              const isDone = !!doneSlugs?.includes(e.slug);
              const open = e.slug === "welcome" || d <= unlockedThrough;
              const inner = (
                <div className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${open ? "border-[#DDC98E]/20 bg-white/[0.03]" : "border-white/5 opacity-45"}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm ${isDone ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#DDC98E]"}`}>
                    {isDone ? "✓" : d === 0 ? "★" : d}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-[#DDC98E]/80">{d === 0 ? "Welcome" : `Day ${d}`}</span>
                    <span className="block font-display text-[17px] font-light leading-snug">{e.title}</span>
                  </span>
                  {!open && <span className="text-xs text-[#F6EFE0]/40">Locked</span>}
                </div>
              );
              return open ? <Link key={e.slug} href={`/practice/one-touch/${e.slug}`}>{inner}</Link> : <div key={e.slug}>{inner}</div>;
            })}
          </div>
        ) : (
          <OneTouchDeck prompts={prompts} />
        )}
      </div>
    </main>
  );
}

function TodayCard({ eyebrow, title, line, href, cta }: { eyebrow: string; title: string; line: string; href: string; cta: string }) {
  return (
    <Link href={href} className="mt-6 block rounded-3xl border border-[#DDC98E]/35 bg-gradient-to-br from-[#1b1710] to-[#0d0d0d] p-6 shadow-[0_30px_70px_-35px_rgba(221,201,142,.45)] transition hover:border-[#DDC98E]/70">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{title}</h2>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-[#F6EFE0]/60">{line}</span>
        <span className="rounded-full bg-[#DDC98E] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#070707]">{cta}</span>
      </div>
    </Link>
  );
}

/* ================= THE REAL CARD (27 Oct: "looks NOTHING like my normal cards") =================
   Her printed One Touch template, words laid on exactly as the cards app does:
   first sentence bold, the follow-up question normal, centred, black. */
export function OneTouchCardFace({ prompt }: { prompt: string }) {
  const m = prompt.match(/^(.+?[.?])\s+(.+)$/);
  const lines = m ? [{ t: m[1], b: true }, { t: m[2], b: false }] : [{ t: prompt, b: false }];
  return (
    <div className="my-7 flex justify-center">
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_70px_-10px_rgba(221,201,142,.22)]" style={{ containerType: "inline-size" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/one-touch/cards/template.png" alt="" className="block h-auto w-full" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingLeft: "10cqw", paddingRight: "10cqw" }}>
          <div className="space-y-3 text-center">
            {lines.map((l, i) => (
              <p key={i} className={`tracking-wide text-black ${l.b ? "font-semibold" : "font-normal"}`} style={{ fontSize: "4.4cqw", lineHeight: 1.35 }}>{l.t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= YOUR CARDS ================= */
export function OneTouchDeck({ prompts, startWith }: { prompts: string[]; startWith?: string }) {
  const [seenHowTo, setSeenHowTo] = useLS<boolean>("howto-seen", false);
  const [order, setOrder] = useState<number[]>(() => prompts.map((_, i) => i));
  const [pos, setPos] = useState(-1); // -1 = the cover
  const [flip, setFlip] = useState(false);
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const a = prompts.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    if (startWith) { const k = prompts.indexOf(startWith); if (k >= 0) { a.splice(a.indexOf(k), 1); a.unshift(k); } }
    setOrder(a);
  }, [prompts, startWith]);
  const next = () => { setFlip(true); setTimeout(() => { setPos((p) => (p + 1) % order.length); setFlip(false); }, 180); };

  if (!seenHowTo) {
    return (
      <div className="mt-6 rounded-3xl border border-[#DDC98E]/25 bg-white/[0.03] p-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Before your first card</p>
        <h3 className="mt-2 font-display text-2xl font-light">How to use your cards</h3>
        <p className="mt-2 text-sm text-[#F6EFE0]/60">Just you, five minutes, one card.</p>
        <HowTo compact />
        <button onClick={() => setSeenHowTo(true)} className="mt-6 rounded-full bg-[#DDC98E] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#070707]">Open my cards</button>
      </div>
    );
  }

  return (
    <div className="mt-6"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touchX.current !== null && Math.abs(e.changedTouches[0].clientX - touchX.current) > 40) next(); touchX.current = null; }}>
      <div className={`transition duration-200 ${flip ? "scale-95 opacity-0" : "scale-100 opacity-100"}`} onClick={pos < 0 ? next : undefined}>
        {pos < 0 ? (
          <div className="my-7 flex cursor-pointer flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/one-touch/cards/cover.png" alt="One Touch card deck" className="w-full max-w-[300px] rounded-2xl border border-white/10 shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_70px_-10px_rgba(221,201,142,.25)]" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[#F6EFE0]/50">Tap to draw</p>
          </div>
        ) : (
          <OneTouchCardFace prompt={prompts[order[pos]]} />
        )}
      </div>
      <div className="flex flex-col items-center gap-3">
        <button onClick={next} className="rounded-full bg-[#DDC98E] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#070707]">
          {pos < 0 ? "Draw a card" : "Next card"}
        </button>
        {pos >= 0 && <p className="text-[11px] uppercase tracking-[0.2em] text-[#F6EFE0]/40">{pos + 1} of {order.length} · swipe for the next</p>}
        <details className="mt-2 w-full rounded-2xl border border-[#DDC98E]/15 px-4 py-3 text-center">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.2em] text-[#DDC98E]">How to use your cards</summary>
          <HowTo />
        </details>
      </div>
    </div>
  );
}

/* ================= A DAY: three steps ================= */
function BodyCheck({ value, onChange, label }: { value: number | null; onChange: (v: number) => void; label: string }) {
  return (
    <div className="mt-6">
      <p className="text-center font-display text-lg font-light">{label}</p>
      <div className="mt-4 grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => onChange(n)}
            className={`aspect-square rounded-full border text-sm transition ${value === n ? "scale-110 border-[#EEDE80] bg-[#EEDE80] text-[#070707]" : value !== null && n < value ? "border-[#DDC98E]/60 bg-[#DDC98E]/25 text-[#F6EFE0]" : "border-[#DDC98E]/30 text-[#F6EFE0]/70"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#F6EFE0]/40"><span>Not here</span><span>Fully here</span></div>
    </div>
  );
}

function Video({ id }: { id: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black" style={{ paddingTop: "56.25%" }}>
      <iframe src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&title=0&byline=0&portrait=0`} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Today's practice" />
    </div>
  );
}

function icsFor(title: string, url: string) {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(d.getTime() + 15 * 60000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Feel Fully You//One Touch//EN", "BEGIN:VEVENT",
    `UID:onetouch-${d.getTime()}@feelfullyyou.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(d)}`, `DTEND:${f(end)}`,
    `SUMMARY:One Touch: ${title}`, `DESCRIPTION:Fifteen minutes for you. ${url}`, `URL:${url}`,
    "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", "DESCRIPTION:One Touch", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "one-touch-tomorrow.ics"; a.click();
}

export function OneTouchDay(props: {
  slug: string; day: number; title: string; videoId: string; transcript?: string; card: string | null;
  bonus?: { url: string; label: string } | null; prompts: string[]; nextTitle?: string; alreadyDone: boolean;
  prevHref?: string; nextHref?: string;
  onDone: () => Promise<void> | void;
}) {
  const { slug, day, title, videoId, transcript, card, bonus, prompts, nextTitle, alreadyDone, onDone, prevHref, nextHref } = props;
  const [step, setStep] = useState(0); // 0 arrive · 1 practice · 2 card · 3 done
  const [before, setBefore] = useLS<number | null>(`check-${slug}-before`, null);
  const [after, setAfter] = useLS<number | null>(`check-${slug}-after`, null);
  const [answer, setAnswer] = useLS<string>(`answer-${slug}`, "");
  const [view, setView] = useState<"watch" | "read">("watch");
  const [drawn] = useState(() => { if (card) return card; const used = Object.values(OT_DAY_CARD); const pool = prompts.filter((p) => !used.includes(p)); const from = pool.length ? pool : prompts; return from[Math.floor(Math.random() * from.length)]; });
  const top = useRef<HTMLDivElement>(null);
  const go = (s: number) => { setStep(s); top.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (alreadyDone) setStep(3); }, [alreadyDone]);
  const steps = ["Arrive", "Practice", "Your card"];

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <div ref={top} className="mx-auto max-w-xl px-5 pb-20 pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← Your library</Link>
            <Link href="/practice/one-touch" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← One Touch</Link>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Day {day} of 7</span>
        </div>
        <h1 className="mt-6 font-display text-[32px] font-light leading-tight">{title}</h1>

        {step < 3 && (
          <div className="mt-5 flex gap-2">
            {steps.map((s, i) => (
              <button key={s} onClick={() => i <= step && go(i)} className="flex-1 text-left">
                <span className={`block h-1 rounded-full ${i <= step ? "bg-[#DDC98E]" : "bg-[#DDC98E]/15"}`} />
                <span className={`mt-1.5 block text-[10px] uppercase tracking-[0.2em] ${i === step ? "text-[#DDC98E]" : "text-[#F6EFE0]/35"}`}>{i + 1} · {s}</span>
              </button>
            ))}
          </div>
        )}

        {step === 0 && (
          <section className="mt-8">
            <p className="text-center text-[15px] leading-relaxed text-[#F6EFE0]/75">Take a breath in through your nose, and exhale through your mouth. Notice what&rsquo;s happening in this body of yours.</p>
            <BodyCheck value={before} onChange={setBefore} label="How present is your body right now?" />
            <button disabled={before === null} onClick={() => go(1)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707] disabled:opacity-30">Next</button>
          </section>
        )}

        {step === 1 && (
          <section className="mt-8">
            <div className="mb-4 flex justify-center gap-2">
              {(["watch", "read"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`rounded-full border px-5 py-1.5 text-xs uppercase tracking-[0.2em] ${view === v ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#DDC98E]"}`}>{v === "watch" ? "Watch" : "Read"}</button>
              ))}
            </div>
            {view === "watch" ? <Video id={videoId} /> : (
              <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-[#DDC98E]/15 bg-white/[0.02] p-5 text-[15px] leading-relaxed text-[#F6EFE0]/80 whitespace-pre-line">{transcript}</div>
            )}
            {bonus && (
              <a href={bonus.url} target="_blank" rel="noreferrer" className="mt-4 block rounded-2xl border border-[#DDC98E]/20 px-4 py-3 text-sm text-[#DDC98E]">Bonus · {bonus.label} →</a>
            )}
            <button onClick={() => go(2)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707]">I&rsquo;ve done the practice</button>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">{card ? "Today’s card" : "Draw from your deck today"}</p>
            <OneTouchCardFace prompt={drawn} />
            <details className="rounded-2xl border border-[#DDC98E]/15 px-4 py-3 text-center">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.2em] text-[#DDC98E]">How to use it</summary>
              <HowTo />
            </details>
            <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Your answer · only you see this</p>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Write it here, or say it out loud and write one line."
              className="mt-2 w-full resize-y rounded-2xl border border-[#DDC98E]/25 bg-[#14120e] p-4 font-display text-[17px] font-light italic text-[#F6EFE0] placeholder:text-[#F6EFE0]/30" />
            <p className="mt-4 text-center text-xs text-[#F6EFE0]/50">Done when you&rsquo;ve answered today&rsquo;s card.</p>
            <button disabled={!answer.trim()} onClick={async () => { await onDone(); chime(); go(3); }}
              className="mt-4 w-full rounded-full bg-[#EEDE80] py-4 text-sm font-medium uppercase tracking-[0.22em] text-[#070707] shadow-[0_0_40px_-6px_rgba(238,222,128,.7)] disabled:opacity-30 disabled:shadow-none">I did it</button>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 text-center">
            <div className="ot-shimmer mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#EEDE80] text-3xl text-[#EEDE80] shadow-[0_0_60px_rgba(238,222,128,.55)]">✓</div>
            <h2 className="mt-5 font-display text-3xl font-light">Day {day}, done.</h2>
            {after === null ? (
              <BodyCheck value={after} onChange={setAfter} label="And now? How present is your body?" />
            ) : (
              <p className="mt-5 font-display text-xl font-light text-[#DDC98E]">
                {before !== null ? <>You came in at {before}.<br />You&rsquo;re leaving at {after}.</> : <>You&rsquo;re leaving at {after}.</>}
              </p>
            )}
            {nextTitle ? (
              <div className="mt-8 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
                <p className="mt-2 font-display text-xl font-light">{nextTitle}</p>
                <button onClick={() => icsFor(nextTitle, "https://app.feelfullyyou.com/practice/one-touch")} className="mt-4 rounded-full border border-[#DDC98E] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#DDC98E]">Remind me tomorrow</button>
              </div>
            ) : null}
            <button onClick={() => go(0)} className="mt-6 block w-full rounded-full border border-[#DDC98E] py-3 text-xs uppercase tracking-[0.22em] text-[#DDC98E]">Do it again</button>
            <Link href="/practice/one-touch" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-[#F6EFE0]/50 underline">Back to One Touch</Link>
          </section>
        )}

        {(prevHref || nextHref) && (
          <div className="mt-10 flex items-center justify-between border-t border-[#DDC98E]/15 pt-5 text-sm">
            {prevHref ? <Link href={prevHref} className="min-h-[44px] py-3 text-[#DDC98E]">← Day {day - 1}</Link> : <span />}
            {nextHref ? <Link href={nextHref} className="min-h-[44px] py-3 text-[#DDC98E]">Day {day + 1} →</Link> : <span />}
          </div>
        )}
      </div>
      <style>{`.ot-shimmer{animation:otpop .7s cubic-bezier(.2,.8,.2,1) both}@keyframes otpop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}`}</style>
    </main>
  );
}
