"use client";

// The Sacred No, 20 Nov 2026 (Juliette: "make it more interactive, like One Touch and
// all the other apps", and "the little tile looks different"). Same seven lessons and the
// same one-day-at-a-time rule; the screens now work like One Touch:
//   Today screen: the library tile's photo, seven circles, a Today card, two tabs
//   (Seven days · Your nos).
//   A day: 1 Arrive (how present is your body) · 2 Watch (her lesson) · 3 Your answer
//   (one question from that lesson) · then "I did it", a chime, came in / leaving at.
// Answers stay on her phone (localStorage), like One Touch and Let Her Land.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { localVideoPoster, localVideoSrc } from "@/lib/content/local-audio";
import { HOW_ALONE } from "@/lib/content/let-her-land";
import { nextSpeed, readSpeed, saveSpeedFor } from "@/lib/voice-speed";
import PracticeTimer from "@/components/PracticeTimer";

const LS = "ffy.sn.";
function lsGet<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(LS + k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function lsPut(k: string, v: unknown) {
  try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {}
}
function useLS<T>(k: string, d: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(d);
  useEffect(() => { setV(lsGet(k, d)); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  return [v, (nv: T) => { setV(nv); lsPut(k, nv); }];
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

/** One question per day, taken from that lesson's own description. Needs Juliette's approval. */
export const SN_DAY_QUESTION: Record<number, string> = {
  1: "Tell me where you first learned that a no turns into a yes if someone pushes long enough.",
  2: "Tell me what your body's real yes felt like today. Then tell me what your real no felt like.",
  3: "Tell me about a time you said yes when your body was already saying no.",
  4: "Tell me what your body wants right now, after two minutes with your own hands.",
  5: "Tell me who you say yes to when you mean no.",
  6: "Tell me which standard you keep when no one is watching. Then tell me which one you're raising.",
  7: "Tell me what has already started to shift this week.",
};

/** Her card, the way all her Communication & Intimacy cards look (20 Nov 2026: "it's always the cards").
 *  Black back with The Sacred No and the gold V's; tap to turn over to the white face with the question. */
export function SacredNoCard({ prompt }: { prompt: string }) {
  const [turned, setTurned] = useState(false);
  const m = prompt.match(/^(.+?[.?])\s+(.+)$/);
  const lines = m ? [{ t: m[1], b: true }, { t: m[2], b: false }] : [{ t: prompt, b: true }];
  return (
    <div className="my-6 flex flex-col items-center">
      <button type="button" onClick={() => setTurned((v) => !v)} aria-label={turned ? "Turn the card back" : "Turn the card over"}
        className="relative w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_70px_-10px_rgba(221,201,142,.25)] transition-transform duration-500"
        style={{ containerType: "inline-size" }} data-testid="sn-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={turned ? "/sacred-no/cards/template.png" : "/sacred-no/cards/cover.png"} alt={turned ? prompt : "The Sacred No card"} className="block h-auto w-full" />
        {turned && (
          <span className="absolute inset-0 flex items-center justify-center" style={{ paddingLeft: "10cqw", paddingRight: "10cqw", paddingTop: "8cqw" }}>
            <span className="space-y-3 text-center">
              {lines.map((l, i) => (
                <span key={i} className={`block tracking-wide text-black ${l.b ? "font-semibold" : "font-normal"}`} style={{ fontSize: "4.6cqw", lineHeight: 1.35 }}>{l.t}</span>
              ))}
            </span>
          </span>
        )}
      </button>
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]/80">{turned ? "Tap to turn back" : "Tap to turn over"}</p>
    </div>
  );
}

type Entry = { slug: string; title: string; eyebrow?: string };
const clean = (t: string) => t.replace(/^\d+\s/, "");

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

function TodayCard({ eyebrow, title, line, href, cta }: { eyebrow: string; title: string; line: string; href: string; cta: string }) {
  return (
    <Link href={href} data-testid="sn-today" className="mt-6 block rounded-3xl border border-[#DDC98E]/35 bg-gradient-to-br from-[#1b1710] to-[#0d0d0d] p-6 shadow-[0_30px_70px_-35px_rgba(221,201,142,.45)] transition hover:border-[#DDC98E]/70">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{title}</h2>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-[#F6EFE0]/60">{line}</span>
        <span className="shrink-0 rounded-full bg-[#DDC98E] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#070707]">{cta}</span>
      </div>
    </Link>
  );
}

function BodyCheck({ value, onChange, label }: { value: number | null; onChange: (v: number) => void; label: string }) {
  return (
    <div className="mt-6">
      <p className="text-center font-display text-lg font-light">{label}</p>
      <div className="mt-4 grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={`aspect-square rounded-full border text-sm transition ${value === n ? "scale-110 border-[#EEDE80] bg-[#EEDE80] text-[#070707]" : value !== null && n < value ? "border-[#DDC98E]/60 bg-[#DDC98E]/25 text-[#F6EFE0]" : "border-[#DDC98E]/30 text-[#F6EFE0]/70"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#F6EFE0]/40"><span>Not here</span><span>Fully here</span></div>
    </div>
  );
}


/** Her voice up to 1.5x, the same remembered speed as every story and teaching (lib/voice-speed). */
function useVoiceRate(src: string): [number, () => void] {
  const [rate, setRate] = useState(1);
  useEffect(() => {
    setRate(readSpeed(src)); // eslint-disable-line react-hooks/set-state-in-effect
    const on = () => setRate(readSpeed(src));
    window.addEventListener("ffy-voice-rate", on);
    return () => window.removeEventListener("ffy-voice-rate", on);
  }, [src]);
  return [rate, () => { const v = nextSpeed(src, rate); setRate(v); saveSpeedFor(src, v); }];
}
function SpeedChip({ rate, onTap }: { rate: number; onTap: () => void }) {
  return (
    <button type="button" onClick={onTap} aria-label={`Speed ${rate}x. Tap to change`} className="min-h-[36px] min-w-[60px] rounded-full border border-[#DDC98E]/50 px-3 text-[13px] text-[#DDC98E]">
      {rate}×
    </button>
  );
}

export function SnVideo({ id, label }: { id: string; label: string }) {
  const src = localVideoSrc(id);
  const ref = useRef<HTMLVideoElement | null>(null);
  const [rate, cycle] = useVoiceRate(src);
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate]);
  return (
    <div className="flex flex-col items-center gap-3">
      <video ref={ref} src={src} poster={localVideoPoster(id)} controls playsInline preload="metadata" controlsList="nodownload"
        onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate; }} onPlay={(e) => { e.currentTarget.playbackRate = rate; }}
        className="block h-auto max-h-[72vh] w-auto max-w-full rounded-2xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-black shadow-[0_0_50px_-20px_rgba(221,201,142,0.55)]">
        {label}
      </video>
      <SpeedChip rate={rate} onTap={cycle} />
    </div>
  );
}

function icsFor(title: string, url: string) {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(d.getTime() + 15 * 60000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Feel Fully You//The Sacred No//EN", "BEGIN:VEVENT",
    `UID:sacredno-${d.getTime()}@feelfullyyou.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(d)}`, `DTEND:${f(end)}`,
    `SUMMARY:The Sacred No: ${title}`, `DESCRIPTION:Your next lesson. ${url}`, `URL:${url}`,
    "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", "DESCRIPTION:The Sacred No", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sacred-no-tomorrow.ics"; a.click();
}


/** "On your own", five minutes: the same sitting as Let Her Land Part 4 (her voice to start, her bell at
 *  the end, Next answer, the count), plus her written "how to work with it alone". 20 Nov 2026. */
const soloAudio: HTMLAudioElement | null = null;


/** Her photo you tap to hear "On your own: how to use your card" (same voice note as One Touch and Confessions). */
const OWN_VOICE = "/one-touch/voice/on-your-own.m4a";
function OwnVoice() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const [rate, cycle] = useVoiceRate(OWN_VOICE);
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate]);
  return (
    <div className="flex items-center gap-4" data-testid="sn-own-voice">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <button type="button" aria-label={playing ? "Pause" : "On your own: how to use your card"} onClick={() => { const a = ref.current; if (!a) return; if (a.paused) { soloAudio?.pause(); a.playbackRate = rate; a.play().catch(() => {}); } else a.pause(); }} className="relative h-[72px] w-[72px] rounded-full">
          <Image src="/how-to-feel-like-a-woman/juliette.jpg" alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover" />
          <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="16.5" fill="none" stroke="rgba(221,201,142,0.35)" strokeWidth="2" />
            <circle cx="18" cy="18" r="16.5" fill="none" stroke="#DDC98E" strokeWidth="2" strokeDasharray={`${p * 1.037} 200`} />
          </svg>
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#DDC98E] text-[11px] text-[#070707] shadow">{playing ? "❚❚" : "▶"}</span>
          <audio ref={ref} src={OWN_VOICE} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setP(0); }}
            onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate; }}
            onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setP((a.currentTime / a.duration) * 100); }} />
        </button>
        <SpeedChip rate={rate} onTap={cycle} />
      </div>
      <div className="text-left">
        <p className="font-display text-[24px] font-light leading-tight">Listen to me here</p>
        <p className="mt-1 text-[14px] text-[#cfc8bb]">Five minutes, just you and the card.</p>
        <p className="mt-1 text-[12px] text-[#a79f90]">Tap my photo to hear how.</p>
      </div>
    </div>
  );
}

/* 21 Nov 2026 (Juliette, the card-writing standard, memory feedback_card_writing_pattern_21nov2026.md): her photo
   "Listen to me here" with speed, her five-minute timer with the gong (PracticeTimer, same as the cards app, Confessions
   and Let Her Land), answers one at a time with room for 15 to 20, kept on this phone (one answer per line under the
   same key as before, so older single answers still show), and the day is marked done only once the five minutes ring. */
const splitAnswers = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);
function SnSitting({ day, value, setValue, onDone }: { day: number; value: string; setValue: (v: string) => void; onDone: () => void }) {
  const [timeUp, setTimeUp] = useState(false);
  const [draft, setDraft] = useState("");
  const [breath, setBreath] = useState("");
  const answers = splitAnswers(value);
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setValue([...answers, t].join("\n"));
    setDraft("");
    setBreath("Take a breath. Read the card again, and give the next one.");
    setTimeout(() => setBreath(""), 4000);
  };
  const remove = (i: number) => setValue(answers.filter((_, k) => k !== i).join("\n"));
  return (
    <div className="mt-2" data-testid="sn-own">
      <div className="rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
        <OwnVoice />
        <div className="mt-4"><PracticeTimer minutes={[5]} dark solo label="Your five minutes" onDone={() => setTimeUp(true)} /></div>
        <details className="mt-4 rounded-2xl border border-[#DDC98E]/15 px-4 py-3">
          <summary className="cursor-pointer text-center text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">How to work with it alone</summary>
          <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-[#cfc8bb]">
            {HOW_ALONE.map((l) => <p key={l}>{l}</p>)}
          </div>
        </details>
      </div>
      <p className="mt-6 font-display text-[20px] font-light">Answer {answers.length + 1}</p>
      <p className="text-[13px] text-[#8f877a]">Write one, add it, then the next. Fifteen or twenty things often come up.</p>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Write one answer here." aria-label={`Answer ${answers.length + 1}`}
        className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
      <p className="min-h-[22px] text-center text-[14px] text-[#EEDE80]" aria-live="polite">{breath}</p>
      <button type="button" data-testid="sn-add" disabled={!draft.trim()} onClick={add} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[16px] text-[#DDC98E] disabled:opacity-40">Add it, and write the next one</button>
      {answers.length > 0 && (
        <ol className="mt-4 grid gap-2" data-testid="sn-answer-list">
          {answers.map((t, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border border-[#DDC98E]/20 bg-[rgba(13,53,53,0.3)] px-4 py-2.5 text-[15px] text-[#f1ece2]">
              <span className="font-display text-[#DDC98E]">{i + 1}</span><span className="flex-1">{t}</span>
              <button type="button" aria-label={`Remove answer ${i + 1}`} onClick={() => remove(i)} className="text-[#8f877a]">×</button>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-[13px] text-[#8f877a]">Saved on this phone. Only you see these.</p>
      {timeUp ? (
        <div className="mt-6 text-center" data-testid="sn-end">
          <p className="font-display text-[28px] font-light">Pause.</p>
          <p className="mt-1 text-[15px] text-[#cfc8bb]">Notice how your body feels. Often there&rsquo;s a little more breath, more space, more aliveness.</p>
          {answers.length > 0 && <p className="mt-3"><b className="font-display text-[34px] font-light text-[#DDC98E]">{answers.length}</b><span className="ml-2 text-[14px] text-[#a79f90]">answers on one card</span></p>}
          <button type="button" data-testid="sn-did-it" disabled={answers.length === 0 && !draft.trim()} onClick={() => { add(); onDone(); }}
            className="mt-4 w-full rounded-full bg-[#EEDE80] py-4 text-sm font-medium uppercase tracking-[0.22em] text-[#070707] shadow-[0_0_40px_-6px_rgba(238,222,128,.7)] disabled:opacity-30 disabled:shadow-none">I did it · Day {day}</button>
        </div>
      ) : (
        <p className="mt-5 text-center text-[13px] text-[#8f877a]">When the five minutes ring, you can mark the day done.</p>
      )}
    </div>
  );
}

/* ================= TODAY SCREEN ================= */
export function SacredNoToday(props: {
  entries: Entry[]; doneSlugs: string[] | null; dayOf: (s: string) => number; dayLesson: Record<number, string>;
  unlockedThrough: number; dueAt: number; whenItOpens: (t: number) => string; heroImage: string; thumbOf: (s: string) => string | null;
  isAdmin: boolean;
}) {
  const { entries, doneSlugs, dayOf, dayLesson, unlockedThrough, dueAt, whenItOpens, heroImage, thumbOf, isAdmin } = props;
  const [tab, setTab] = useState<"days" | "nos">("days");
  const done = doneSlugs ? Object.values(dayLesson).filter((s) => doneSlugs.includes(s)).length : 0;
  const welcomed = !!doneSlugs?.includes("welcome");
  const allDone = done >= 7;
  const todayDay = Math.min(7, done + 1);
  const today = entries.find((e) => e.slug === dayLesson[todayDay]);
  const waiting = !allDone && !isAdmin && todayDay > unlockedThrough;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    const a: Record<number, string> = {};
    for (let d = 1; d <= 7; d++) { const v = lsGet<string>(`answer-${dayLesson[d]}`, ""); if (v.trim()) a[d] = v; }
    setAnswers(a); // eslint-disable-line react-hooks/set-state-in-effect
  }, [tab, dayLesson]);

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0] md:pt-6">
      {/* 20 Nov: on a computer the full-width photo showed only the hat, so the photo keeps to the page column. */}
      <section className="relative mx-auto h-[54vh] max-h-[640px] max-w-xl overflow-hidden md:rounded-3xl md:border md:border-[#DDC98E]/30">
        <Image src={heroImage} alt="" fill priority sizes="(max-width: 640px) 100vw, 576px" className="object-cover object-[50%_18%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/40 via-[#070707]/10 to-[#070707]" />
        <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col justify-between px-5 pb-6 pt-5">
          <Link href="/" className="self-start rounded-full border border-[#DDC98E]/40 bg-[#070707]/50 px-4 py-1.5 text-xs text-[#DDC98E] backdrop-blur">← Your library</Link>
          <div>
            <p className="font-display text-[34px] font-light leading-none">The Sacred No</p>
            <div className="mt-3 flex items-center justify-between">
              <Circles done={done} today={todayDay} />
              <span className="text-xs tracking-[0.2em] text-[#F6EFE0]/60">{allDone ? "7 of 7" : `Day ${todayDay} of 7`}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-5 pb-16">
        {!welcomed ? (
          <TodayCard eyebrow="Before you begin" title="Welcome to The Sacred No" line="Start here. A minute from me." href="/practice/the-sacred-no/welcome" cta="Begin" />
        ) : allDone ? (
          <TodayCard eyebrow="You did all seven" title="You know your no now" line="Your bonus meditation is waiting." href="/practice/the-sacred-no/bonus-meditation" cta="Open" />
        ) : waiting ? (
          <div className="mt-6 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-6" data-testid="sn-today">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
            <h2 className="mt-2 font-display text-2xl font-light leading-snug">{today ? clean(today.title) : ""}</h2>
            <p className="mt-2 text-sm text-[#F6EFE0]/60">Opens {dueAt ? whenItOpens(dueAt) : "tomorrow"}. Today is done. Let it land.</p>
          </div>
        ) : today ? (
          <TodayCard eyebrow={`Today · Day ${todayDay}`} title={clean(today.title)} line="About 15 minutes. Three small steps." href={`/practice/the-sacred-no/${today.slug}`} cta="Begin" />
        ) : null}

        <div className="mt-8 flex gap-2">
          {(["days", "nos"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`flex-1 rounded-full border py-2.5 text-xs uppercase tracking-[0.2em] transition ${tab === t ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/30 text-[#DDC98E]"}`}>
              {t === "days" ? "Seven days" : "Your nos"}
            </button>
          ))}
        </div>

        {tab === "days" ? (
          <div className="mt-5 space-y-2.5">
            {entries.map((e) => {
              const d = e.slug === "welcome" ? 0 : dayOf(e.slug);
              const bonus = e.slug === "bonus-meditation";
              const isDone = !!doneSlugs?.includes(e.slug);
              const open = isAdmin || e.slug === "welcome" || d <= unlockedThrough;
              const thumb = thumbOf(e.slug);
              const inner = (
                <div className={`flex items-center gap-4 rounded-2xl border px-3 py-3 ${open ? "border-[#DDC98E]/20 bg-white/[0.03]" : "border-white/5 opacity-45"}`}>
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#0d3535]">
                    {thumb && <Image src={thumb} alt="" fill sizes="56px" className={`object-cover ${open ? "" : "grayscale"}`} />}
                    <span className={`absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border font-display text-[11px] ${isDone ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/60 bg-[#070707]/70 text-[#DDC98E]"}`}>
                      {isDone ? "✓" : d === 0 ? "★" : bonus ? "+" : d}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-[#DDC98E]/80">{d === 0 ? "Welcome" : bonus ? "Bonus" : `Day ${d}`}</span>
                    <span className="block font-display text-[17px] font-light leading-snug">{clean(e.title)}</span>
                  </span>
                  {!open && <span className="text-xs text-[#F6EFE0]/40">Locked</span>}
                </div>
              );
              return open ? <Link key={e.slug} href={`/practice/the-sacred-no/${e.slug}`}>{inner}</Link> : <div key={e.slug}>{inner}</div>;
            })}
          </div>
        ) : (
          <div className="mt-5" data-testid="sn-nos">
            <p className="text-center text-sm text-[#F6EFE0]/60">Everything you wrote this week, in one place. Only you see this.</p>
            {Object.keys(answers).length === 0 ? (
              <p className="mt-6 rounded-2xl border border-[#DDC98E]/15 p-5 text-center text-sm text-[#F6EFE0]/50">Nothing here yet. Each day you answer shows up here.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {Object.entries(answers).map(([d, a]) => (
                  <div key={d} className="rounded-2xl border border-[#DDC98E]/20 bg-white/[0.03] p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#DDC98E]">Day {d}</p>
                    <p className="mt-1 text-sm text-[#F6EFE0]/60">{SN_DAY_QUESTION[Number(d)]}</p>
                    <ol className="mt-3 grid gap-1">{splitAnswers(a).map((t, i) => <li key={i} className="font-display text-[17px] font-light italic"><span className="mr-2 not-italic text-[#DDC98E]">{i + 1}</span>{t}</li>)}</ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* ================= A DAY: three steps ================= */
export function SacredNoDay(props: {
  slug: string; day: number; title: string; line: string; videoId: string; extra?: React.ReactNode;
  nextTitle?: string; alreadyDone: boolean; prevHref?: string; nextHref?: string; onDone: () => Promise<void> | void;
}) {
  const { slug, day, title, line, videoId, extra, nextTitle, alreadyDone, onDone, prevHref, nextHref } = props;
  const [step, setStep] = useState(0); // 0 arrive · 1 watch · 2 answer · 3 done
  const [before, setBefore] = useLS<number | null>(`check-${slug}-before`, null);
  const [after, setAfter] = useLS<number | null>(`check-${slug}-after`, null);
  const [answer, setAnswer] = useLS<string>(`answer-${slug}`, "");
  const top = useRef<HTMLDivElement>(null);
  const go = (s: number) => { setStep(s); top.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (alreadyDone) setStep(3); }, [alreadyDone]); // eslint-disable-line react-hooks/set-state-in-effect
  const steps = ["Arrive", "Watch", "Your answer"];

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <div ref={top} className="mx-auto max-w-xl px-5 pb-20 pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← Your library</Link>
            <Link href="/practice/the-sacred-no" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← The Sacred No</Link>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Day {day} of 7</span>
        </div>
        <h1 className="mt-6 font-display text-[32px] font-light leading-tight">{title}</h1>

        {step < 3 && (
          <div className="mt-5 flex gap-2">
            {steps.map((s, i) => (
              <button key={s} type="button" onClick={() => i <= step && go(i)} className="flex-1 text-left">
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
            <button type="button" disabled={before === null} onClick={() => go(1)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707] disabled:opacity-30">Next</button>
          </section>
        )}

        {step === 1 && (
          <section className="mt-8">
            <p className="mb-5 text-[15px] leading-relaxed text-[#F6EFE0]/75">{line}</p>
            <SnVideo id={videoId} label={title} />
            {extra}
            <button type="button" onClick={() => go(2)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707]">I&rsquo;ve watched it</button>
          </section>
        )}

        {step === 2 && (
          <section className="mt-8">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Today&rsquo;s card</p>
            <SacredNoCard prompt={SN_DAY_QUESTION[day]} />
            <SnSitting day={day} value={answer} setValue={setAnswer} onDone={async () => { await onDone(); chime(); go(3); }} />
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 text-center" data-testid="sn-done">
            <div className="sn-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#EEDE80] text-3xl text-[#EEDE80] shadow-[0_0_60px_rgba(238,222,128,.55)]">✓</div>
            <h2 className="mt-5 font-display text-3xl font-light">Day {day}, done.</h2>
            {after === null ? (
              <BodyCheck value={after} onChange={setAfter} label="And now? How present is your body?" />
            ) : (
              <p className="mt-5 font-display text-xl font-light text-[#DDC98E]">
                {before !== null ? <>You came in at {before}.<br />You&rsquo;re leaving at {after}.</> : <>You&rsquo;re leaving at {after}.</>}
              </p>
            )}
            {answer.trim() && (
              <div className="mt-6 rounded-2xl border border-[#DDC98E]/15 bg-white/[0.02] p-4 text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#DDC98E]">You wrote</p>
                <ol className="mt-2 grid gap-1">{splitAnswers(answer).map((t, i) => <li key={i} className="font-display text-[16px] font-light italic"><span className="mr-2 not-italic text-[#DDC98E]">{i + 1}</span>{t}</li>)}</ol>
              </div>
            )}
            {extra && day === 7 ? <div className="mt-6 text-left">{extra}</div> : null}
            {nextTitle ? (
              <div className="mt-8 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
                <p className="mt-2 font-display text-xl font-light">{nextTitle}</p>
                <button type="button" onClick={() => icsFor(nextTitle, "https://app.feelfullyyou.com/practice/the-sacred-no")} className="mt-4 rounded-full border border-[#DDC98E] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#DDC98E]">Remind me tomorrow</button>
              </div>
            ) : null}
            <button type="button" onClick={() => go(0)} className="mt-6 block w-full rounded-full border border-[#DDC98E] py-3 text-xs uppercase tracking-[0.22em] text-[#DDC98E]">Do it again</button>
            <Link href="/practice/the-sacred-no" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-[#F6EFE0]/50 underline">Back to The Sacred No</Link>
          </section>
        )}

        {(prevHref || nextHref) && (
          <div className="mt-10 flex items-center justify-between border-t border-[#DDC98E]/15 pt-5 text-sm">
            {prevHref ? <Link href={prevHref} className="min-h-[44px] py-3 text-[#DDC98E]">← Day {day - 1}</Link> : <span />}
            {nextHref ? <Link href={nextHref} className="min-h-[44px] py-3 text-[#DDC98E]">Day {day + 1} →</Link> : <span />}
          </div>
        )}
      </div>
      <style>{`.sn-pop{animation:snpop .7s cubic-bezier(.2,.8,.2,1) both}@keyframes snpop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}`}</style>
    </main>
  );
}
