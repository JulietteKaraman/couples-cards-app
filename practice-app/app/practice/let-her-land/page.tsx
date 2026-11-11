"use client";

// LET HER LAND. specs/let-her-land.md (3 Nov 2026). Juliette's free offering in the Already Her
// Bundle. Dark look of the funnel bites (BiteKit), modelled on The Full Stop. A first name and
// email first (FreeEmailGate), then a hub of four parts. Everything she writes and every tick
// stays on her phone; only anonymous counts leave it. Her words live in
// lib/content/let-her-land.ts, never retyped here.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BITE_CSS, HomePrompt, MuteNote, Photo, StepBar, Voice, read, write } from "@/components/BiteKit";
import { FreeEmailGate } from "@/components/FreeEmailGate";
import PracticeTimer from "@/components/PracticeTimer";
import { count } from "@/lib/count";
import { rememberBite } from "@/lib/bites-on-phone";
import { nextDayStart, TWELVE_H, whenItOpens } from "@/lib/content/31-touch-points-drip";
import {
  AUDIO, COPY, DOOR_URL, HOW_ALONE, JOURNAL, JOURNAL_SCREENS, PARTS, PHOTOS, PROMPTS,
  TB_AUDIO_LABEL, TB_DAYS, TB_HEAD, TB_LINE, TB_STEPS, TB_WHY, TB_WITH_ME,
} from "@/lib/content/let-her-land";

// ---- Everything on the phone, under one family of keys -----------------------------------
const K = {
  resume: "ffy.lhl.resume.v1",
  prog: "ffy.lhl.prog.v1",
  journal: "ffy.lhl.journal.v1",
  tb: "ffy.lhl.tb.v1",
  ground: "ffy.lhl.ground.v1",
  vis: "ffy.lhl.vis.v1",
};
const CONTACT_KEY = "ffy.freebie.contact.v1";

type Pos = { part: number; i: number };
type Prog = { r: number[]; d: boolean[] }; // furthest screen reached, and finished, per part
type Entry = { d: string; slot: "am" | "pm"; b: number; a: number };
type Vis = { a: Record<string, string>; d: Record<string, number> }; // answers, and when each day was marked done
type Landed = "" | "yes" | "maybe" | "no";

const PROG0: Prog = { r: [0, 0, 0, 0], d: [false, false, false, false] };
const VIS0: Vis = { a: {}, d: {} };
const SCREENS = [JOURNAL_SCREENS.length, 4, 3, 4];

const SCREEN_NAMES: string[][] = [
  [],
  ["Touch Base", "The practice", "Do it now", "Your first 7 days"],
  [COPY.p3TouchHead, COPY.p3ListenHead, "How did it land?"],
  [COPY.p4ListenHead, COPY.p4HowNav, COPY.p4TodayHead, COPY.p4LookHead],
];

// ---- tiny helpers ---------------------------------------------------------------------------
const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayIndex = (start: string, d: string) => Math.round((new Date(d + "T12:00").getTime() - new Date(start + "T12:00").getTime()) / 86400000);

function useStore<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const ref = useRef<T>(init);
  const load = useCallback(() => {
    const x = read<T>(key, init);
    ref.current = x;
    setV(x);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((n: T | ((p: T) => T)) => {
    const nv = typeof n === "function" ? (n as (p: T) => T)(ref.current) : n;
    ref.current = nv;
    setV(nv);
    write(key, nv);
  }, [key]);
  return [v, set, load] as const;
}

function Slot({ src, label, id }: { src: string; label: string; id?: string }) {
  // Empty path = no player at all. A file that isn't there (a 404) is hidden too (E5, R9).
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (!src) return;
    let live = true;
    fetch(src, { method: "HEAD" })
      .then((r) => { if (live && !r.ok) setMissing(true); })
      .catch(() => {});
    return () => { live = false; };
  }, [src]);
  if (!src || missing) return null;
  return <Voice id={id} src={src} label={label} />;
}

// ---- Keep a copy (R12, E6) -------------------------------------------------------------------
function journalText(journal: Record<string, string>) {
  const out: string[] = [];
  JOURNAL.forEach((l, i) => {
    const a = (journal[`q${i}`] ?? "").trim();
    if (l.k === "q" && a) out.push(`${l.t}\n${a}`);
  });
  return out.length ? `${COPY.title}. Part 1, ${PARTS[0].name}\n\n${out.join("\n\n")}` : "";
}
function visText(vis: Vis) {
  const out: string[] = [];
  PROMPTS.forEach((p) => {
    const a = (vis.a[p.day] ?? "").trim();
    if (a) out.push(`Day ${p.day}. ${p.lines.map((x) => x.text).join(" ")}\n${a}`);
  });
  return out.length ? `${COPY.title}. Part 4, ${PARTS[3].name}\n\n${out.join("\n\n")}` : "";
}

function KeepCopy({ text }: { text: string }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const run = async () => {
    const body = text || `${COPY.title}\n\n(Nothing written yet.)`;
    setMsg("");
    setShow(false);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: COPY.shareTitle, text: body });
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return; // she closed the sheet
    }
    try {
      await navigator.clipboard.writeText(body);
      setMsg(COPY.copied);
      return;
    } catch {
      /* both blocked: show the text to select */
    }
    setMsg(COPY.selectIt);
    setShow(true);
  };
  return (
    <div className="mt-8 rounded-2xl border border-[#DDC98E]/30 p-4" data-testid="keep-copy">
      <button type="button" onClick={run} className="inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E]/60 px-6 text-[15px] text-[#DDC98E]">{COPY.keepCopy}</button>
      <p className="mt-3 text-[14px] leading-relaxed text-[#a79f90]">{COPY.newPhone}</p>
      {msg && <p role="status" className="mt-2 text-[14px] text-[#EEDE80]" data-testid="copy-msg">{msg}</p>}
      {show && <textarea readOnly value={text} rows={8} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-3 text-[14px] text-[#f1ece2]" data-testid="copy-text" />}
    </div>
  );
}

// ---- The box she writes in: saves as she types (R5, R8) ---------------------------------------
function Box({ id, value, onChange, rows = 6 }: { id: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="mt-4">
      <textarea id={id} rows={rows} value={value} placeholder={COPY.writePlaceholder} aria-label="Your answer" onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
      <p className="mt-1.5 text-[12px] text-[#8f877a]">{value ? COPY.savedLine : ""}&nbsp;</p>
    </div>
  );
}

// ---- The one door: The Sacred No, at the end of the journal and on the hub ------------------------
function SacredNoDoor({ line, testid }: { line: string; testid: string }) {
  return (
      <a href={DOOR_URL} data-testid={testid} onClick={() => count("lhl_sacred_click")} className="mt-10 block overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.45)] shadow-[0_0_40px_-18px_rgba(221,201,142,0.6)]">
        <span className="relative block w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          <Image src={PHOTOS.door.src} alt={PHOTOS.door.alt} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" style={{ objectPosition: PHOTOS.door.pos }} />
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(13,53,53,0.95)] to-transparent" />
        </span>
        <span className="block px-5 pb-6 pt-1">
          <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{COPY.doorKicker}</span>
          <span className="mt-1 block font-display text-[28px] font-light leading-tight">{COPY.doorTitle}</span>
          <span className="mt-2 block text-[16px] text-[#cfc8bb]">{line}</span>
          <span className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">{COPY.doorButton}</span>
        </span>
      </a>
  );
}

// ---- Part 4 card: her printed Visibility Challenge card, words laid on its white area ---------------
function PromptCard({ p }: { p: (typeof PROMPTS)[number] }) {
  return (
    <div className="lhl-vcard" style={{ aspectRatio: `${PHOTOS.card.w} / ${PHOTOS.card.h}` }}>
      <Image src={PHOTOS.card.src} alt="" fill unoptimized sizes="300px" className="object-fill" />
      <div className="lhl-vcard-text">
        {p.lines.map((l, i) => (
          <p key={i} data-prompt={p.day} className={l.bold ? "b" : "n"}>{l.text}</p>
        ))}
      </div>
    </div>
  );
}

// ---- Today's card: opens on the black side, turns over on a tap, then her solo sitting -------------
// Same as the Communication & Intimacy cards app (card-engine/app): her printed card back, "Tap the
// card to turn it over", then "On your own", five minutes, with her two recorded voice notes.
const SOLO_VOICE = { start: "/let-her-land/voice/6-solo-start.m4a", bell: "/let-her-land/voice/7-solo-bell.m4a" };
const SOLO_SECONDS = 5 * 60;
let soloAudio: HTMLAudioElement | null = null;
function playSolo(src: string) {
  try { soloAudio?.pause(); soloAudio = new Audio(src); soloAudio.play().catch(() => {}); } catch {}
}

function TodayCard({ p }: { p: (typeof PROMPTS)[number] }) {
  const key = `ffy.lhl.turned.v1.${p.day}`;
  const [turned, setTurned] = useState(false);
  const [flip, setFlip] = useState(false);
  useEffect(() => { try { setTurned(localStorage.getItem(key) === "1"); } catch {} }, [key]);
  const turn = () => {
    if (turned) return;
    setFlip(true);
    setTimeout(() => { setTurned(true); try { localStorage.setItem(key, "1"); } catch {} }, 380);
    setTimeout(() => setFlip(false), 820);
  };
  return (
    <div className="mt-4 mb-5">
      <div className={`mx-auto max-w-[300px] lhl-turn ${flip ? "flip" : ""}`} role="button" tabIndex={0} aria-label="Turn the card over"
        data-testid="card-turn" onClick={turn} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") turn(); }}>
        {turned ? <PromptCard p={p} /> : (
          <div className="lhl-vcard lhl-back" style={{ aspectRatio: `${PHOTOS.card.w} / ${PHOTOS.card.h}` }} data-testid="card-back">
            <Image src="/let-her-land/card-back.jpg" alt="The back of the card" fill unoptimized sizes="300px" className="object-cover" />
            <span className="lhl-back-day">Day {p.day}</span>
          </div>
        )}
      </div>
      {!turned ? <p className="mt-3 text-center text-[13px] text-[#a79f90]">Tap the card to turn it over</p> : <SoloSitting day={p.day} />}
    </div>
  );
}

function SoloSitting({ day }: { day: number }) {
  const [step, setStep] = useState<"pick" | "prep" | "sit" | "end">("pick");
  const [left, setLeft] = useState(SOLO_SECONDS);
  const [answers, setAnswers] = useState(0);
  const [breath, setBreath] = useState("");
  const endAt = useRef(0);
  useEffect(() => {
    if (step !== "sit") return;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(r);
      if (r === 0) { clearInterval(t); setStep("end"); setTimeout(() => playSolo(SOLO_VOICE.bell), 1500); }
    }, 250);
    return () => clearInterval(t);
  }, [step]);
  useEffect(() => () => { try { soloAudio?.pause(); } catch {} }, []);
  const start = () => { endAt.current = Date.now() + SOLO_SECONDS * 1000; setLeft(SOLO_SECONDS); setAnswers(0); setStep("sit"); playSolo(SOLO_VOICE.start); };
  const mm = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const ring = 2 * Math.PI * 54;
  if (step === "pick") return (
    <button type="button" data-testid="solo-pick" onClick={() => setStep("prep")} className="lhl-pick mt-5">
      On your own<small>5 minutes, out loud or on paper</small>
    </button>
  );
  if (step === "prep") return (
    <div className="mt-5 text-center" data-testid="solo-prep">
      <p className="lhl-soloi">Write one answer, or speak it out loud. Just one.</p>
      <p className="mt-2 text-[16px] text-[#cfc8bb]">Then take a breath, read the question again, and give the next one.</p>
      <button type="button" data-testid="solo-start" onClick={start} className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">Start</button>
    </div>
  );
  if (step === "sit") return (
    <div className="mt-5 text-center" data-testid="solo-sit">
      <div className="relative mx-auto h-[150px] w-[150px]">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(221,201,142,.18)" strokeWidth="5" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#DDC98E" strokeWidth="5" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - left / SOLO_SECONDS)} /></svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-[30px] font-light" data-testid="solo-time">{mm}</span>
      </div>
      <p className="lhl-soloi mt-4">Write one answer, or speak it out loud. Just one.</p>
      <p className="mt-2 min-h-[24px] text-[14px] tracking-[.04em] text-[#EEDE80]" aria-live="polite">{breath}</p>
      <button type="button" data-testid="solo-next" onClick={() => { setAnswers((a) => a + 1); setBreath("Take a breath. Read the question again."); setTimeout(() => setBreath(""), 4000); }}
        className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">Next answer</button>
      <p className="mt-3 text-[14px] text-[#a79f90]">Answers so far: <b className="font-medium text-[#DDC98E]">{answers}</b></p>
    </div>
  );
  return (
    <div className="mt-5 text-center" data-testid="solo-end">
      <p className="font-display text-[30px] font-light">Pause.</p>
      <p className="mt-2 text-[16px] text-[#cfc8bb]">Notice how your body feels. Often there&rsquo;s a little more breath, more space, more aliveness.</p>
      {answers > 0 && <p className="mt-4"><b className="font-display text-[36px] font-light text-[#DDC98E]">{answers}</b><span className="ml-2 text-[14px] text-[#a79f90]">answers on one prompt</span></p>}
      <p className="mt-3 text-[15px] text-[#cfc8bb]">That&rsquo;s what staying with one prompt does. The first answers are the surface.</p>
    </div>
  );
}

// ---- Part 1: Meet her ------------------------------------------------------------------------
function Part1({ idx, journal, setAnswer }: { idx: number; journal: Record<string, string>; setAnswer: (k: string, v: string) => void }) {
  const lines = JOURNAL_SCREENS[idx];
  const last = idx === JOURNAL_SCREENS.length - 1;
  return (
    <section data-testid={`p1-${idx}`}>
      {idx === 0 && <Photo src={PHOTOS.meetHer.src} alt={PHOTOS.meetHer.alt} pos={PHOTOS.meetHer.pos} ratio={PHOTOS.meetHer.ratio} />}
      <p className="kicker">Part 1 · {PARTS[0].name}</p>
      <div className="mt-3">
        {lines.map((li) => {
          const L = JOURNAL[li];
          if (L.k === "q") {
            return (
              <div key={li} className="lhl-block">
                <p data-journal="1" className="lhl-q">{L.t}</p>
                <Box id={`lhl-q${li}`} value={journal[`q${li}`] ?? ""} onChange={(v) => setAnswer(`q${li}`, v)} />
              </div>
            );
          }
          if (L.k === "tip") {
            return (
              <p key={li} data-journal="1" className="lhl-tip"><span>TIP:</span> {L.t.slice(5)}</p>
            );
          }
          return <p key={li} data-journal="1" className={idx === 0 && li === 0 ? "lhl-lead" : "lhl-p"}>{L.t}</p>;
        })}
      </div>
      {last && <KeepCopy text={journalText(journal)} />}
      {last && <SacredNoDoor line={COPY.doorAfterJournal} testid="door-journal" />}
    </section>
  );
}

// ---- Part 2: Anchor her ----------------------------------------------------------------------
const MOODS = [
  { min: 8, label: "Glowing", color: "#EEDE80" },
  { min: 5, label: "Warm", color: "#C29A4E" },
  { min: 1, label: "Settling", color: "#2c7a72" },
];
const MILESTONES = [7];

function Rate({ label, value, onPick }: { label: string; value: number | null; onPick: (n: number) => void }) {
  return (
    <div>
      <p className="font-display text-[19px]">{label}</p>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onPick(n)} aria-pressed={value === n}
            className={`h-12 rounded-full border font-display text-[18px] ${value === n ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/35 text-[#f1ece2]/85"}`}>{n}</button>
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
    const e: Entry = { d: localDay(), slot: new Date().getHours() < 14 ? "am" : "pm", b: before, a: after };
    onSave(e);
    setSaved(e);
  };
  return (
    <div className="rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] px-5 py-6" data-testid="tryit">
      {saved ? (
        <div className="text-center" data-testid="tryit-saved">
          <p className="font-display text-[24px] font-light">{saved.slot === "am" ? "Morning" : "Evening"} done ✓</p>
          <p className="mt-4 flex items-center justify-center gap-4 font-display text-[44px] font-light text-[#DDC98E]">
            <span>{saved.b}</span><span className="text-2xl text-[#a79f90]">→</span><span>{saved.a}</span>
          </p>
          <p className="mt-1 text-[14px] text-[#a79f90]">Before, then after. It&rsquo;s on your week.</p>
          <button type="button" onClick={() => { setSaved(null); setBefore(null); setAfter(null); }} className="mt-4 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Do another one</button>
        </div>
      ) : (
        <div className="grid gap-7">
          <Rate label="1. Before you begin, how do you feel?" value={before} onPick={setBefore} />
          <div className={before === null ? "pointer-events-none opacity-40" : ""}>
            <p className="mb-3 flex items-center gap-3 font-display text-[19px]">
              <Image src={PHOTOS.emblem.src} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
              2. Thumb to forefinger. Slowly, like honey.
            </p>
            <PracticeTimer minutes={[2]} label="Your two minutes" dark solo />
          </div>
          <div className={before === null ? "pointer-events-none opacity-40" : ""}>
            <Rate label="3. Now, how do you feel?" value={after} onPick={setAfter} />
          </div>
          <button type="button" onClick={finish} disabled={before === null || after === null}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] disabled:opacity-40">I did it ✓</button>
        </div>
      )}
    </div>
  );
}

function Month({ log }: { log: Entry[] }) {
  if (!log.length) {
    return (
      <div className="rounded-3xl border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.28)] px-5 py-5">
        <p className="kicker">Your first {TB_DAYS} days</p>
        <p className="mt-2 text-[15px] leading-relaxed text-[#a79f90]">Your first one starts your week. Morning and evening each get a dot.</p>
      </div>
    );
  }
  const start = log.map((e) => e.d).sort()[0];
  const n = Math.min(TB_DAYS, dayIndex(start, localDay()) + 1);
  const get = (i: number, slot: "am" | "pm") => [...log].reverse().find((e) => dayIndex(start, e.d) === i && e.slot === slot);
  const Dot = ({ e }: { e?: Entry }) => {
    if (!e) return <span className="h-3 w-3 rounded-full border-[1.5px] border-dashed border-[#DDC98E]/45" />;
    const m = MOODS.find((x) => e.a >= x.min) ?? MOODS[2];
    return <span className="h-3 w-3 rounded-full" style={{ background: m.color, boxShadow: `0 0 8px -1px ${m.color}` }} title={`${e.b} → ${e.a}`} />;
  };
  return (
    <div className="rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] px-4 py-5" data-testid="month">
      <div className="flex items-baseline justify-between px-1">
        <p className="kicker">Your first {TB_DAYS} days</p>
        <p className="text-[14px] text-[#a79f90]">Day {n} of {TB_DAYS} · <b className="font-medium text-[#DDC98E]">{log.length} done</b></p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {Array.from({ length: TB_DAYS }, (_, i) => {
          const am = get(i, "am");
          const pm = get(i, "pm");
          const star = MILESTONES.includes(i + 1);
          const reached = star && n >= i + 1 && (am || pm);
          return (
            <div key={i} data-filled={am || pm ? "1" : "0"} className={`flex flex-col items-center gap-1.5 rounded-xl py-2 ${am || pm ? "bg-[rgba(221,201,142,0.16)]" : "bg-[rgba(221,201,142,0.05)]"} ${i === n - 1 ? "ring-1 ring-[#DDC98E]" : ""}`}>
              <span className={`text-[11px] ${reached ? "text-[#EEDE80]" : "text-[#a79f90]"}`}>{star ? (reached ? "★" : "☆") : i + 1}</span>
              <span className="flex gap-1"><Dot e={am} /><Dot e={pm} /></span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-[12px] text-[#cfc8bb]">
        {MOODS.map((m) => (
          <span key={m.label} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />{m.label}</span>
        ))}
        <span>Left dot morning, right dot evening</span>
        <span>★ your first week</span>
      </div>
    </div>
  );
}

function Part2({ idx, log, saveEntry }: { idx: number; log: Entry[]; saveEntry: (e: Entry) => void }) {
  return (
    <section data-testid={`p2-${idx}`}>
      {idx === 0 && (
        <>
          {/* The Touch Base emblem leads Touch Base (Juliette, 11 Nov 2026) */}
          <div className="mb-7 flex justify-center" data-testid="tb-emblem">
            <Image src={PHOTOS.emblem.src} alt={PHOTOS.emblem.alt} width={180} height={180} className="h-[180px] w-[180px] rounded-full shadow-[0_0_60px_-8px_rgba(221,201,142,0.75)]" />
          </div>
          <p className="kicker">Part 2 · {PARTS[1].name}</p>
          <h2 className="!mb-3">{TB_HEAD}</h2>
          <p className="lhl-lead">{TB_LINE}</p>
          <div className="mt-6 flex items-center gap-3.5">
            <Image src={PHOTOS.me.src} alt={PHOTOS.me.alt} width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover" />
            <div>
              <p className="font-display text-[19px]">{TB_WITH_ME[0]}</p>
              <p className="text-[14px] text-[#a79f90]">{TB_WITH_ME[1]}</p>
            </div>
          </div>
          <MuteNote />
          <Slot src={AUDIO.touchBase} label={TB_AUDIO_LABEL} />
        </>
      )}
      {idx === 1 && (
        <>
          <p className="kicker">Part 2 · {PARTS[1].name}</p>
          <h2>The Practice</h2>
          <div className="grid gap-3">
            {TB_STEPS.map(([h, t], i) => (
              <div key={h} className="flex gap-3.5 rounded-[18px] border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.28)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DDC98E]/70 font-display text-[18px] text-[#DDC98E]">{i + 1}</span>
                <p className="text-[16px] leading-relaxed text-[#cfc8bb]"><span className="font-display font-medium text-[#DDC98E]">{h}</span> {t}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {idx === 2 && (
        <>
          <p className="kicker">Do it now</p>
          <h2>Two minutes. Right where you are.</h2>
          <TryIt onSave={saveEntry} />
        </>
      )}
      {idx === 3 && (
        <>
          <p className="kicker">{TB_WHY.eyebrow}</p>
          <p className="lhl-p">{TB_WHY.small}</p>
          <p className="my-5 font-display text-[27px] font-light leading-[1.2] text-[#EEDE80]">{TB_WHY.big}</p>
          <div className="mb-8 grid gap-3">
            {TB_WHY.marks.map(([num, lead, rest]) => (
              <div key={num} className="flex items-center gap-4 rounded-[18px] border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] px-4 py-4">
                <span className="w-[64px] shrink-0 text-center font-display text-[44px] font-light leading-none text-[#DDC98E]">{num}</span>
                <p className="leading-snug">
                  <span className="block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">{lead}</span>
                  <span className="mt-1 block font-display text-[19px] text-[#f1ece2]">{rest}</span>
                </p>
              </div>
            ))}
          </div>
          <Month log={log} />
          <p className="mt-8 text-center font-display text-[24px] font-light leading-snug">{TB_WHY.close}</p>
        </>
      )}
    </section>
  );
}

// ---- Part 3: the grounding touch ---------------------------------------------------------------
function Part3({ idx, landed, setLanded }: { idx: number; landed: Landed; setLanded: (v: Landed) => void }) {
  return (
    <section data-testid={`p3-${idx}`}>
      {idx === 0 && (
        <>
          <Photo src={PHOTOS.grounding.src} alt={PHOTOS.grounding.alt} pos={PHOTOS.grounding.pos} ratio={PHOTOS.grounding.ratio} />
          <p className="kicker">Part 3 · {PARTS[2].name}</p>
          <h2 className="flex items-center gap-3"><Image src={PHOTOS.emblem.src} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full" />{COPY.p3TouchHead}</h2>
          <div className="grid gap-3">
            {TB_STEPS.slice(0, 3).map(([h, t], i) => (
              <div key={h} className="flex gap-3.5 rounded-[18px] border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.28)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DDC98E]/70 font-display text-[18px] text-[#DDC98E]">{i + 1}</span>
                <p className="text-[16px] leading-relaxed text-[#cfc8bb]"><span className="font-display font-medium text-[#DDC98E]">{h}</span> {t}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {idx === 1 && (
        <>
          <p className="kicker">Part 3 · {PARTS[2].name}</p>
          <h2>{COPY.p3ListenHead}</h2>
          <p className="lhl-lead">{COPY.p3ListenLine}</p>
          <MuteNote />
          <Slot src={AUDIO.grounding} label="The grounding touch, in my voice" />
        </>
      )}
      {idx === 2 && (
        <>
          <p className="kicker">Part 3 · {PARTS[2].name}</p>
          <h2>How did it land?</h2>
          <div className="mt-6 grid grid-cols-3 gap-3" role="group" aria-label="How did it land?">
            {([["yes", "Yes"], ["maybe", "Maybe"], ["no", "No"]] as const).map(([id, label]) => (
              <button key={id} type="button" data-testid={`land-${id}`} aria-pressed={landed === id} onClick={() => setLanded(id)}
                className={`min-h-[84px] rounded-3xl border-[1.5px] font-display text-[22px] font-light transition ${landed === id ? "border-[#EEDE80] bg-[#DDC98E] text-[#070707] shadow-[0_0_30px_-6px_#DDC98E]" : "border-[#DDC98E]/45 bg-[rgba(13,53,53,0.35)] text-[#f1ece2]"}`}>{label}</button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ---- Part 4: Be seen ----------------------------------------------------------------------------
function Part4({ idx, vis, setAnswer, markDone, doneDays, curDay, opensIn }: {
  idx: number; vis: Vis; setAnswer: (day: number, v: string) => void; markDone: (day: number) => void;
  doneDays: number; curDay: number; opensIn: string;
}) {
  const prompt = PROMPTS.find((p) => p.day === curDay);
  const doneList = PROMPTS.filter((p) => p.day <= doneDays);
  const Lines = ({ p }: { p: (typeof PROMPTS)[number] }) => (
    <>
      {p.lines.map((l, i) => (
        <p key={i} data-prompt={p.day} className={l.bold ? "lhl-prompt" : "lhl-prompt2"}>{l.text}</p>
      ))}
    </>
  );
  return (
    <section data-testid={`p4-${idx}`}>
      {idx === 0 && (
        <>
          <Photo src={PHOTOS.beSeen.src} alt={PHOTOS.beSeen.alt} pos={PHOTOS.beSeen.pos} ratio={PHOTOS.beSeen.ratio} />
          <p className="kicker">Part 4 · {PARTS[3].name}</p>
          <h2>{COPY.p4ListenHead}</h2>
          <MuteNote />
          <Slot src={AUDIO.hypnosis} label="The hypnosis" />
        </>
      )}
      {idx === 1 && (
        <>
          <p className="kicker">Part 4 · {PARTS[3].name}</p>
          <h2>{COPY.p4HowHead}</h2>
          <div className="lhl-how" data-testid="how-alone">
            {HOW_ALONE.map((l) => <p key={l} data-how="1">{l}</p>)}
          </div>
          <PracticeTimer minutes={[5]} label="Your five minutes" dark solo />
        </>
      )}
      {idx === 2 && (
        <>
          <p className="kicker">Part 4 · {PARTS[3].name}</p>
          <h2>{COPY.p4TodayHead}</h2>
          {curDay > 0 && prompt ? (
            <div className="rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.45)] p-5 shadow-[0_0_40px_-18px_rgba(221,201,142,0.6)]" data-testid="today">
              <p className="kicker" data-testid="today-day">Day {prompt.day} of {PROMPTS.length}</p>
              <TodayCard key={prompt.day} p={prompt} />
              <Box id="lhl-today" value={vis.a[prompt.day] ?? ""} onChange={(v) => setAnswer(prompt.day, v)} rows={6} />
              <button type="button" data-testid="mark-done" onClick={() => markDone(prompt.day)} className="mt-1 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">{COPY.p4Done}</button>
            </div>
          ) : doneDays >= PROMPTS.length ? (
            <div className="wssr-done rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center" data-testid="all-done">
              <span className="block font-display text-4xl font-light text-[#DDC98E]">✓</span>
              <p className="mt-2 font-display text-[22px] font-light">{COPY.p4AllDone}</p>
            </div>
          ) : (
            <div className="wssr-done rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center" data-testid="waiting">
              <span className="block font-display text-4xl font-light text-[#DDC98E]">✓</span>
              <p className="mt-2 font-display text-[22px] font-light">Day {doneDays} done.</p>
              <p className="mt-1 text-[16px] text-[#cfc8bb]" data-testid="opens">{COPY.p4Next(doneDays + 1, opensIn)}</p>
            </div>
          )}
          <KeepCopy text={visText(vis)} />
        </>
      )}
      {idx === 3 && (
        <>
          <p className="kicker">Part 4 · {PARTS[3].name}</p>
          <h2>{COPY.p4LookHead}</h2>
          {doneList.length === 0 ? (
            <p className="lhl-p quiet" data-testid="look-empty">{COPY.p4LookEmpty}</p>
          ) : (
            <div className="grid gap-3" data-testid="look-back">
              {[...doneList].reverse().map((p) => (
                <details key={p.day} className="!my-0">
                  <summary><span><small className="!mt-0">Day {p.day}</small>{p.lines[0].text}</span><span className="pl">+</span></summary>
                  <div className="dbody">
                    <div className="mb-3"><Lines p={p} /></div>
                    <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-[#f1ece2]" data-testid={`look-${p.day}`}>{vis.a[p.day] ?? ""}</p>
                  </div>
                </details>
              ))}
            </div>
          )}
          <KeepCopy text={visText(vis)} />
        </>
      )}
    </section>
  );
}

// ---- Cover (before the gate): name, one line, the four parts ------------------------------------
function Cover() {
  return (
    <section data-testid="cover">
      <div className="relative mx-auto w-full overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]" style={{ aspectRatio: "4 / 5", maxWidth: 440 }}>
        <Image src={PHOTOS.cover.src} alt={PHOTOS.cover.alt} fill priority sizes="(max-width: 768px) 100vw, 440px" className="object-cover" style={{ objectPosition: PHOTOS.cover.pos }} />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{COPY.coverKicker}</p>
          <h1 className="mt-1.5 font-display text-[44px] font-light leading-[1.04]">{COPY.title}</h1>
        </div>
      </div>
      <div className="mx-auto mt-5" style={{ maxWidth: 440 }}>
        <p className="text-[18px] leading-relaxed text-[#cfc8bb]">{COPY.tagline}</p>
        <ol className="mt-6 grid gap-2" data-testid="cover-parts">
          {PARTS.map((p) => (
            <li key={p.n} className="flex items-center gap-4 rounded-2xl border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.28)] px-4 py-3">
              <span className="font-display text-[26px] font-light leading-none text-[#DDC98E]">{p.n}</span>
              <span className="font-display text-[20px] font-light">{p.name}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[14px] text-[#a79f90]">{COPY.keepLine}</p>
      </div>
    </section>
  );
}

// ---- Hub (after the gate) ------------------------------------------------------------------------
function Ring({ frac, done }: { frac: number; done: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[100px] w-[100px] shrink-0" data-testid="ring" data-frac={frac.toFixed(3)}>
      <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90">
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(221,201,142,0.18)" strokeWidth="6" />
        <circle cx="46" cy="46" r={r} fill="none" stroke="#DDC98E" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)", filter: "drop-shadow(0 0 6px rgba(221,201,142,.7))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display text-[30px] font-light text-[#DDC98E]">{done}</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#a79f90]">{COPY.ringOf}</span>
      </div>
    </div>
  );
}

function Hub({ name, fracs, dones, resume, open, partLabel }: {
  name: string; fracs: number[]; dones: boolean[]; resume: Pos | null; open: (part: number, i: number) => void; partLabel: (n: number) => string;
}) {
  const total = fracs.reduce((a, b) => a + b, 0) / 4;
  const nDone = dones.filter(Boolean).length;
  return (
    <section data-testid="hub">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{COPY.title}</p>
          <h1 className="mt-2 font-display text-[34px] font-light leading-[1.08]" data-testid="hello">{COPY.hello(name)}</h1>
        </div>
        <Ring frac={total} done={nDone} />
      </div>
      <p className="mt-3 text-[16px] leading-relaxed text-[#cfc8bb]">{COPY.tagline}</p>

      {AUDIO.welcome && (
        <div className="mt-6 flex items-center gap-4" data-testid="welcome-slot">
          <Image src={PHOTOS.me.src} alt={PHOTOS.me.alt} width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover" />
          <div className="flex-1"><Slot src={AUDIO.welcome} label={COPY.welcomeLabel} /></div>
        </div>
      )}

      {resume && (
        <button type="button" data-testid="resume" onClick={() => open(resume.part, resume.i)} className="mt-6 flex min-h-[64px] w-full items-center justify-between gap-3 rounded-full bg-[#DDC98E] px-6 text-left text-[#070707]">
          <span><span className="block font-display text-[17px] font-medium leading-tight">{COPY.resume}</span><span className="block text-[13px] opacity-75">{partLabel(resume.part)}</span></span>
          <span className="text-xl">→</span>
        </button>
      )}

      <div className="mt-6 grid gap-3" data-testid="parts">
        {PARTS.map((p, k) => {
          const pct = Math.round(fracs[k] * 100);
          return (
            <button key={p.n} type="button" data-testid={`part-${p.n}`} data-done={dones[k] ? "1" : "0"} data-pct={pct} onClick={() => open(p.n, 0)}
              className="lhl-card relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] p-3 text-left">
              <span aria-hidden="true" className="lhl-fill absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: dones[k] ? "linear-gradient(90deg,rgba(221,201,142,.30),rgba(221,201,142,.20))" : "rgba(221,201,142,.14)" }} />
              <span className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl">
                <Image src={p.photo} alt="" fill sizes="84px" className="object-cover" style={{ objectPosition: p.pos }} />
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Part {p.n}</span>
                <span className="mt-0.5 block font-display text-[22px] font-light leading-tight">{p.name}</span>
                <span className="mt-0.5 block text-[14px] leading-snug text-[#a79f90]">{p.line}</span>
              </span>
              <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[17px] ${dones[k] ? "bg-[#DDC98E] text-[#070707]" : "border border-[#DDC98E]/50 text-[#DDC98E]"}`}>{dones[k] ? "✓" : "→"}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[14px] text-[#a79f90]">{COPY.keepLine}</p>
      <HomePrompt slug="let-her-land" />

      <SacredNoDoor line={COPY.doorLine} testid="door" />
    </section>
  );
}

// ---- The page ----------------------------------------------------------------------------------
export default function LetHerLand() {
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [name, setName] = useState("");
  const [pos, setPos] = useState<Pos>({ part: 0, i: 0 });
  const [now, setNow] = useState(0);
  const [resume, setResume, loadResume] = useStore<Pos | null>(K.resume, null);
  const [prog, setProg, loadProg] = useStore<Prog>(K.prog, PROG0);
  const [journal, setJournal, loadJournal] = useStore<Record<string, string>>(K.journal, {});
  const [log, setLog, loadLog] = useStore<Entry[]>(K.tb, []);
  const [landed, setLandedS, loadLanded] = useStore<Landed>(K.ground, "");
  const [vis, setVis, loadVis] = useStore<Vis>(K.vis, VIS0);
  const counted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- phone storage is only readable after mount */
    loadResume(); loadProg(); loadJournal(); loadLog(); loadLanded(); loadVis();
    setNow(Date.now());
    try {
      localStorage.setItem("ffy.lhl.test", "1");
      localStorage.removeItem("ffy.lhl.test");
    } catch {
      setStorageOk(false);
    }
    try {
      const c = JSON.parse(localStorage.getItem(CONTACT_KEY) || "null");
      if (c && typeof c.firstName === "string") setName(c.firstName);
      if (c && typeof c.email === "string") setOpened(true); // already through the gate on this phone: skip the cover
    } catch {
      /* no contact yet */
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOpen = useCallback(() => {
    setOpened(true);
    try {
      const c = JSON.parse(localStorage.getItem(CONTACT_KEY) || "null");
      if (c && typeof c.firstName === "string") setName(c.firstName);
    } catch {
      /* fine */
    }
    if (!counted.current) {
      counted.current = true;
      count("lhl_open");
      rememberBite({ slug: "let-her-land", title: "Let Her Land", img: PHOTOS.thumb.src });
    }
  }, []);

  // ---- Part 4 clock: the next day opens the next calendar day, never sooner than 12 hours (same rule as the 31 day practice)
  let doneDays = 0;
  while (doneDays < PROMPTS.length && vis.d[String(doneDays + 1)]) doneDays += 1;
  const lastTs = doneDays ? vis.d[String(doneDays)] : 0;
  const dueAt = lastTs ? Math.max(lastTs + TWELVE_H, nextDayStart(lastTs)) : 0;
  const isOpen = !lastTs || now >= dueAt;
  const curDay = doneDays >= PROMPTS.length ? 0 : isOpen ? doneDays + 1 : 0;
  const opensIn = dueAt ? whenItOpens(dueAt) : "";

  const p1Done = prog.d[0];
  const dones = [p1Done, log.length > 0, landed !== "", doneDays >= PROMPTS.length];
  const fracs = [
    p1Done ? 1 : prog.r[0] / SCREENS[0],
    dones[1] ? 1 : prog.r[1] / SCREENS[1],
    dones[2] ? 1 : prog.r[2] / SCREENS[2],
    doneDays / PROMPTS.length,
  ];

  const partLabel = (n: number) => `Part ${n}, ${PARTS[n - 1].name}`;

  const open = (part: number, i: number) => {
    document.querySelectorAll<HTMLAudioElement>(".wssr audio").forEach((a) => a.pause());
    if (part === 0) {
      setPos({ part: 0, i: 0 });
    } else {
      const ix = Math.max(0, Math.min(SCREENS[part - 1] - 1, i));
      setPos({ part, i: ix });
      setResume({ part, i: ix });
      setProg((p) => ({ ...p, r: p.r.map((v, k) => (k === part - 1 ? Math.max(v, ix) : v)) }));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const finishPart = (part: number) => {
    if (part === 1 && !prog.d[0]) {
      setProg((p) => ({ ...p, d: p.d.map((v, k) => (k === 0 ? true : v)) }));
      count("lhl_part_done", 1);
    }
    open(0, 0);
  };

  const setLanded = (v: Landed) => {
    setLandedS(v);
    if (v) count(`lhl_landed_${v}`);
  };
  const saveEntry = (e: Entry) => {
    setLog((l) => [...l, e]);
    count("lhl_tb_done");
  };
  const setVisAnswer = (day: number, v: string) => setVis((x) => ({ ...x, a: { ...x.a, [day]: v } }));
  const markDone = (day: number) => {
    setVis((x) => ({ ...x, d: { ...x.d, [day]: Date.now() } }));
    setNow(Date.now());
    count("lhl_day", day);
  };

  const inPart = opened && pos.part > 0;
  const total = inPart ? SCREENS[pos.part - 1] : 0;
  const last = inPart && pos.i === total - 1;
  const nextLabel = !inPart ? "" : last ? COPY.finishPart : pos.part === 1 ? "Next →" : `${SCREEN_NAMES[pos.part - 1][pos.i + 1]} →`;
  const forward = () => (last ? finishPart(pos.part) : open(pos.part, pos.i + 1));

  return (
    <main className="wssr min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      {/* Stays dark while her phone's saved progress is read, so there is no white flash. */}
      <div className="mx-auto max-w-2xl px-5 pb-36 pt-6" style={{ visibility: ready ? "visible" : "hidden" }}>
        {!storageOk && opened && <p role="status" data-testid="storage-note" className="mb-5 rounded-2xl border border-[#EEDE80]/50 px-4 py-3 text-[14px] leading-relaxed text-[#f1ece2]">{COPY.storageBlocked}</p>}

        {!opened && <Cover />}

        <FreeEmailGate freebie="let-her-land">
          <Opened onOpen={onOpen} />
          {pos.part === 0 ? (
            <Hub name={name} fracs={fracs} dones={dones} resume={resume} open={open} partLabel={partLabel} />
          ) : (
            <div data-testid={`part-view-${pos.part}`}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <button type="button" data-testid="all-parts" onClick={() => open(0, 0)} className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">{COPY.allParts}</button>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8f877a]" data-testid="screen-count">{pos.i + 1} of {total}</span>
              </div>
              <StepBar step={pos.i + 1} total={total} />
              <div key={`${pos.part}-${pos.i}`} className="lhl-screen">
                {pos.part === 1 && <Part1 idx={pos.i} journal={journal} setAnswer={(k, v) => setJournal((j) => ({ ...j, [k]: v }))} />}
                {pos.part === 2 && <Part2 idx={pos.i} log={log} saveEntry={saveEntry} />}
                {pos.part === 3 && <Part3 idx={pos.i} landed={landed} setLanded={setLanded} />}
                {pos.part === 4 && <Part4 idx={pos.i} vis={vis} setAnswer={setVisAnswer} markDone={markDone} doneDays={doneDays} curDay={curDay} opensIn={opensIn} />}
              </div>
            </div>
          )}
        </FreeEmailGate>
      </div>

      {inPart && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDC98E]/20 bg-[#070707]/92 px-4 pt-3 backdrop-blur" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
          <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr] items-center gap-2.5">
            <button type="button" aria-label="Back" data-testid="back" onClick={() => (pos.i > 0 ? open(pos.part, pos.i - 1) : open(0, 0))} className="h-[52px] w-[52px] rounded-full border border-[#DDC98E]/40 text-lg text-[#DDC98E]">←</button>
            <button type="button" data-testid="next" onClick={forward} className="h-[52px] truncate rounded-full bg-[#DDC98E] px-5 font-display text-[16px] font-medium text-[#070707]">{nextLabel}</button>
          </div>
        </nav>
      )}

      <style>{BITE_CSS}</style>
      <style>{LHL_CSS}</style>
    </main>
  );
}

function Opened({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    onOpen();
  }, [onOpen]);
  return null;
}

const LHL_CSS = `
  .wssr .lhl-p{font-size:17px;line-height:1.65;color:#cfc8bb;margin:0 0 16px}
  .wssr .lhl-p.quiet{color:#a79f90}
  .wssr .lhl-lead{font-family:var(--font-display);font-weight:300;font-size:23px;line-height:1.35;color:#f1ece2;margin:0 0 18px}
  .wssr .lhl-tip{margin:18px 0;padding:16px 18px;border-left:2px solid #DDC98E;background:rgba(13,53,53,.45);border-radius:0 16px 16px 0;font-size:16px;line-height:1.55;color:#f1ece2}
  .wssr .lhl-tip span{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#DDC98E;margin-right:4px}
  .wssr .lhl-block{margin:0 0 22px}
  .wssr .lhl-q{font-family:var(--font-display);font-weight:300;font-size:25px;line-height:1.28;color:#f1ece2;margin:6px 0 0}
  .wssr .lhl-prompt{font-family:var(--font-display);font-weight:300;font-size:26px;line-height:1.28;color:#f1ece2;margin:0 0 10px}
  .wssr .lhl-prompt2{font-family:var(--font-display);font-weight:300;font-size:21px;line-height:1.3;color:#EEDE80;margin:0 0 10px}
  .wssr .lhl-how{margin:0 0 24px;padding:20px 18px;border:1px solid rgba(221,201,142,.3);border-radius:24px;background:rgba(13,53,53,.28)}
  .wssr .lhl-how p{font-size:17px;line-height:1.6;color:#cfc8bb;margin:0 0 12px}
  .wssr .lhl-how p:first-child{font-family:var(--font-display);font-weight:300;font-size:22px;line-height:1.3;color:#f1ece2}
  .wssr .lhl-how p:last-child{margin:0;font-family:var(--font-display);font-weight:300;font-size:22px;color:#EEDE80}
  .wssr .lhl-screen{animation:wssrIn .45s cubic-bezier(.2,.8,.2,1) both}
  .wssr .lhl-card{transition:transform .12s ease}
  /* Her journal's round flower photos: always a circle with a soft gold ring, never a square with corners */
  .wssr :is(div,span):has(> img[src*="journal"]:not([src*="cover-painting"])){border-radius:9999px!important;border:2px solid rgba(221,201,142,.55)!important;aspect-ratio:1/1!important}
  .wssr div.mx-auto:has(> img[src*="journal"]:not([src*="cover-painting"])){max-width:230px!important}
  .lhl-turn{perspective:900px;cursor:pointer}
  .lhl-turn.flip{animation:lhlflip .8s cubic-bezier(.45,.05,.25,1)}
  @keyframes lhlflip{0%{transform:rotateY(0) scale(1)}50%{transform:rotateY(90deg) scale(1.04)}100%{transform:rotateY(0) scale(1)}}
  @media (prefers-reduced-motion:reduce){.lhl-turn.flip{animation:none}}
  .lhl-back{background:#000}
  .lhl-back-day{position:absolute;left:18.9%;width:62.1%;top:64.3%;height:12.1%;display:flex;align-items:center;justify-content:center;color:#DDC98E;font-family:var(--font-display);font-weight:400;letter-spacing:.22em;text-transform:uppercase;font-size:max(5cqw,11px)}
  .lhl-soloi{font-family:var(--font-display);font-weight:300;font-size:19px;line-height:1.5;color:#f1ece2}
  .lhl-pick{display:flex;flex-direction:column;align-items:center;width:100%;min-height:64px;justify-content:center;border-radius:9999px;background:#DDC98E;color:#070707;font-family:var(--font-display);font-size:17px;font-weight:500}
  .lhl-pick small{font-size:12px;font-weight:400;opacity:.75;margin-top:2px}
  .lhl-vcard{position:relative;width:100%;container-type:inline-size;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 22px 44px -18px rgba(0,0,0,.85),0 0 0 1px rgba(221,201,142,.25)}
  .lhl-vcard-text{position:absolute;left:9%;right:9%;top:35%;height:37%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#000;font-family:var(--font-display)}
  .lhl-vcard-text p{margin:0;color:#000;line-height:1.32}
  .lhl-vcard-text p.b{font-weight:500;font-size:max(5.6cqw,9px)}
  .lhl-vcard-text p.n{font-weight:400;font-size:max(5cqw,8.5px);margin-top:.7em}
  .wssr .lhl-fill{transition:width .8s cubic-bezier(.2,.8,.2,1)}
  .wssr details summary{padding:6px 0}
  .wssr details summary small{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#DDC98E;margin-bottom:2px}
`;
