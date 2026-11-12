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
  AUDIO, COPY, DOOR_URL, EYES_SECONDS, HOW_ALONE, JOURNAL, JOURNAL_SCREENS, LETTER, PARTS, PHOTOS, PROMPTS, SENSES,
  TB_AUDIO_LABEL, TB_DAYS, TB_HEAD, TB_LINE, TB_STEPS, TB_WHY, TB_WITH_ME,
} from "@/lib/content/let-her-land";

// ---- Everything on the phone, under one family of keys -----------------------------------
const K = {
  resume: "ffy.lhl.resume.v1",
  prog: "ffy.lhl.prog.v1",
  journal: "ffy.lhl.journal.v1",
  r2: "ffy.lhl.r2.v1",
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
const SCREENS = [JOURNAL_SCREENS.length + 1, 4, 3, 4]; // + Her letter

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
function journalText(journal: Record<string, string>, r2: R2) {
  const out: string[] = [];
  JOURNAL.forEach((l, i) => {
    if (l.k !== "q") return;
    const a = (journal[`q${i}`] ?? "").trim();
    if (i === 3) {
      const cs = complaintsOf(journal, r2);
      if (cs.length) out.push(`${l.t}\n${cs.map((c, n) => `${n + 1}. ${c.t}`).join("\n")}`);
    } else if (i === 4) {
      const ds = complaintsOf(journal, r2).filter((c) => c.d.trim());
      const parts = [...ds.map((c) => `${c.t}\n${c.d.trim()}`), ...(a ? [a] : [])];
      if (parts.length) out.push(`${l.t}\n${parts.join("\n\n")}`);
    } else if (i === 19) {
      const s = sensesOf(r2);
      const parts = [...s.map((v, n) => (v.trim() ? `${SENSES[n]}: ${v.trim()}` : "")).filter(Boolean), ...(!r2.s && a ? [a] : [])];
      if (parts.length) out.push(`${l.t}\n${parts.join("\n")}`);
    } else if (THREE.includes(`q${i}`)) {
      const v = threeOf(`q${i}`, journal, r2);
      const tk = ticksOf(`q${i}`, r2);
      const items = v.map((t, n) => (t.trim() ? `${n + 1}. ${t.trim()}${tk[n] ? " ✓" : ""}` : "")).filter(Boolean);
      if (items.length) out.push(`${l.t}\n${items.join("\n")}`);
    } else if (a) out.push(`${l.t}\n${a}`);
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

function KeepCopy({ text, extra }: { text: string; extra?: React.ReactNode }) {
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
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={run} className="lhl-press inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E]/60 px-6 text-[15px] text-[#DDC98E]">{COPY.keepCopy}</button>
        {extra}
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-[#a79f90]">{COPY.newPhone}</p>
      {msg && <p role="status" className="mt-2 text-[14px] text-[#EEDE80]" data-testid="copy-msg">{msg}</p>}
      {show && <textarea readOnly value={text} rows={8} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-3 text-[14px] text-[#f1ece2]" data-testid="copy-text" />}
    </div>
  );
}

// ---- The box she writes in: saves as she types (R5, R8) ---------------------------------------
function Box({ id, value, onChange, rows = 6, placeholder }: { id: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div className="mt-4">
      <textarea id={id} rows={rows} value={value} placeholder={placeholder ?? COPY.writePlaceholder} aria-label="Your answer" onChange={(e) => onChange(e.target.value)}
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

// ---- Round 2: what she writes beyond a single box ---------------------------------------------------
// Lists, desires, senses and the 3-boxes are kept under their own key (ffy.lhl.r2.v1). The old
// journal keys (q3, q19, q21, q22, q24) are never wiped: if the new key has nothing yet, the
// old text is read and split into the new shape, and every edit writes the old key as well.
type Cmp = { id: string; t: string; d: string };
type R2 = { c?: Cmp[]; s?: string[]; t?: Record<string, string[]>; k?: Record<string, boolean[]> };
const THREE = ["q21", "q22", "q24"];
const uid = () => Math.random().toString(36).slice(2, 9);
const lines = (s: string) => (s ?? "").split(/\r?\n/).map((x) => x.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim()).filter(Boolean);

function complaintsOf(journal: Record<string, string>, r2: R2): Cmp[] {
  if (r2.c) return r2.c;
  return lines(journal.q3 ?? "").map((t, i) => ({ id: `m${i}`, t, d: "" }));
}
function threeOf(key: string, journal: Record<string, string>, r2: R2): string[] {
  const got = r2.t?.[key];
  if (got) return [got[0] ?? "", got[1] ?? "", got[2] ?? ""];
  const raw = (journal[key] ?? "").trim();
  if (!raw) return ["", "", ""];
  const ls = lines(raw);
  if (ls.length >= 3) return [ls[0], ls[1], ls.slice(2).join("\n")];
  if (ls.length === 2) return [ls[0], ls[1], ""];
  return [raw, "", ""];
}
const sensesOf = (r2: R2): string[] => SENSES.map((_, i) => r2.s?.[i] ?? "");
const ticksOf = (key: string, r2: R2): boolean[] => [0, 1, 2].map((i) => !!r2.k?.[key]?.[i]);

type LRow = { label: string; text?: string; items?: { t: string; done: boolean }[] };
type LGroup = { group: string; rows: LRow[] };
function letterOf(journal: Record<string, string>, r2: R2): LGroup[] {
  const out: LGroup[] = [];
  LETTER.forEach((g) => {
    const rows: LRow[] = [];
    g.rows.forEach(({ q, label }) => {
      if (q === 19) {
        const s = sensesOf(r2);
        s.forEach((v, i) => { if (v.trim()) rows.push({ label: SENSES[i], text: v.trim() }); });
        const old = (journal.q19 ?? "").trim();
        if (old && !s.some((v) => v.trim())) rows.push({ label: "Her senses", text: old });
      } else if (THREE.includes(`q${q}`)) {
        const k = `q${q}`;
        const v = threeOf(k, journal, r2);
        const tk = ticksOf(k, r2);
        const items = v.map((t, i) => ({ t: t.trim(), done: tk[i] })).filter((x) => x.t);
        if (items.length) rows.push({ label, items });
      } else {
        const a = (journal[`q${q}`] ?? "").trim();
        if (a) rows.push({ label, text: a });
      }
    });
    if (rows.length) out.push({ group: g.group, rows });
  });
  return out;
}
function letterText(journal: Record<string, string>, r2: R2) {
  const gs = letterOf(journal, r2);
  if (!gs.length) return "";
  const body = gs.map((g) => `${g.group.toUpperCase()}\n\n` + g.rows.map((r) => `${r.label}\n` + (r.items ? r.items.map((x, i) => `${i + 1}. ${x.t}${x.done ? " ✓" : ""}`).join("\n") : r.text)).join("\n\n")).join("\n\n");
  return `${COPY.letterTitle}\n${COPY.title}\n\n${body}`;
}

function Tick({ on }: { on: boolean }) {
  return <span key={on ? "on" : "off"} className={on ? "lhl-pop inline-block" : "inline-block"} aria-hidden="true">{on ? "✓" : ""}</span>;
}

/** R17. The complaints question collects a list: one line at a time, each its own row, removable. */
function ComplaintList({ items, onChange }: { items: Cmp[]; onChange: (n: Cmp[]) => void }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const add = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...items, { id: uid(), t, d: "" }]);
    setText("");
    ref.current?.focus();
  };
  return (
    <div className="mt-4" data-testid="complaints">
      {items.length > 0 && (
        <ul className="mb-3 grid gap-2" data-testid="complaint-rows">
          {items.map((c, i) => (
            <li key={c.id} data-testid="complaint-row" className="lhl-rowin flex items-center gap-3 rounded-2xl border border-[#DDC98E]/35 bg-[rgba(13,53,53,0.35)] py-2 pl-4 pr-2">
              <span className="font-display text-[15px] text-[#DDC98E]">{i + 1}</span>
              <span className="min-w-0 flex-1 break-words text-[16px] leading-snug text-[#f1ece2]">{c.t}</span>
              <button type="button" aria-label={COPY.complaintRemove} onClick={() => onChange(items.filter((x) => x.id !== c.id))} className="lhl-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] text-[#a79f90]">×</button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <input ref={ref} data-testid="complaint-input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          enterKeyHint="done" placeholder={COPY.complaintPlaceholder} aria-label={COPY.complaintPlaceholder}
          className="min-h-[52px] min-w-0 flex-1 rounded-full border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] px-5 text-[16px] text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
        <button type="button" data-testid="complaint-add" onClick={add} className="lhl-press inline-flex min-h-[52px] shrink-0 items-center rounded-full bg-[#DDC98E] px-6 font-display text-[16px] font-medium text-[#070707]">{COPY.complaintAdd}</button>
      </div>
    </div>
  );
}

/** R17. Each complaint is a card: tap to turn it over and write its desire on the back. */
function DesireCard({ c, i, onDesire }: { c: Cmp; i: number; onDesire: (v: string) => void }) {
  const [back, setBack] = useState(false);
  const [flip, setFlip] = useState(false);
  const turn = () => {
    setFlip(true);
    setTimeout(() => setBack((b) => !b), 210);
    setTimeout(() => setFlip(false), 460);
  };
  useEffect(() => {
    if (back) document.getElementById(`lhl-desire-${c.id}`)?.focus({ preventScroll: true });
  }, [back, c.id]);
  const has = c.d.trim().length > 0;
  return (
    <div className={`lhl-turn lhl-dcard ${flip ? "flip2" : ""}`} data-testid={`desire-card-${i}`} data-side={back ? "back" : "front"}>
      {!back ? (
        <div role="button" tabIndex={0} aria-label={`${c.t}. ${COPY.turnHint}`} onClick={turn} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); turn(); } }}
          className="lhl-dface flex min-h-[132px] flex-col justify-between rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.45)] p-5 text-left">
          <p className="font-display text-[22px] font-light leading-snug text-[#f1ece2]">{c.t}</p>
          <p className="mt-3 flex items-center justify-between text-[13px] text-[#a79f90]"><span>{COPY.turnHint}</span>{has && <span className="flex items-center gap-1.5 text-[#DDC98E]"><Tick on /> {COPY.desireWritten}</span>}</p>
        </div>
      ) : (
        <div className="lhl-dface rounded-3xl border-[1.5px] border-[#DDC98E] bg-[linear-gradient(160deg,rgba(13,53,53,0.85),rgba(7,7,7,0.9))] p-5 shadow-[0_0_34px_-14px_rgba(221,201,142,0.7)]">
          <p className="text-[13px] leading-snug text-[#a79f90] line-through decoration-[#a79f90]/50">{c.t}</p>
          <textarea id={`lhl-desire-${c.id}`} data-testid={`desire-box-${i}`} rows={3} value={c.d} placeholder={COPY.desirePlaceholder} aria-label={`${COPY.desirePlaceholder} ${c.t}`} onChange={(e) => onDesire(e.target.value)}
            className="resize-none mt-3 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(7,7,7,0.35)] p-3 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
          <button type="button" data-testid={`desire-back-${i}`} onClick={turn} className="lhl-press mt-3 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">{COPY.turnBack}</button>
        </div>
      )}
    </div>
  );
}

/** R18. "Close your eyes": two minutes, soft chime, can be skipped, never blocks Next. */
function EyesTimer() {
  const [st, setSt] = useState<"idle" | "run" | "done">("idle");
  const [left, setLeft] = useState(EYES_SECONDS);
  const endAt = useRef(0);
  const actx = useRef<AudioContext | null>(null);
  const chime = () => {
    const ctx = actx.current;
    if (!ctx) return;
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    ([[196, 1, 5], [392, 0.45, 4], [588, 0.2, 3]] as [number, number, number][]).forEach(([f, v, d]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + d + 0.1);
    });
  };
  useEffect(() => {
    if (st !== "run") return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(r);
      if (r === 0) { clearInterval(id); chime(); try { navigator.vibrate?.([150, 80, 150]); } catch {} setSt("done"); }
    }, 250);
    return () => clearInterval(id);
  }, [st]);
  useEffect(() => () => { try { actx.current?.close(); } catch {} }, []);
  const start = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      actx.current = actx.current ?? new AC();
      void actx.current.resume();
    } catch { /* silent is fine */ }
    endAt.current = Date.now() + EYES_SECONDS * 1000;
    setLeft(EYES_SECONDS);
    setSt("run");
  };
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const ring = 2 * Math.PI * 54;
  return (
    <div className="my-6 rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] px-5 py-5 text-center" data-testid="eyes">
      {st === "idle" && (
        <button type="button" data-testid="eyes-start" onClick={start} className="lhl-pick lhl-press">{COPY.eyesStart}<small>{COPY.eyesSub}</small></button>
      )}
      {st === "run" && (
        <div data-testid="eyes-run" className="lhl-rowin">
          <div className="relative mx-auto h-[140px] w-[140px]">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(221,201,142,.18)" strokeWidth="5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#DDC98E" strokeWidth="5" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - left / EYES_SECONDS)} style={{ transition: "stroke-dashoffset .3s linear" }} /></svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-[32px] font-light" data-testid="eyes-time">{mm}</span>
          </div>
          <p className="mt-3 text-[15px] text-[#cfc8bb]">{COPY.eyesRunning}</p>
          <button type="button" data-testid="eyes-skip" onClick={() => setSt("done")} className="lhl-press mt-2 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">{COPY.eyesSkip}</button>
        </div>
      )}
      {st === "done" && (
        <div data-testid="eyes-done" className="lhl-rowin">
          <span className="lhl-tickbig lhl-pop" aria-hidden="true">✓</span>
          <p className="mt-2 font-display text-[22px] font-light">{COPY.eyesOpen}</p>
          <button type="button" onClick={() => setSt("idle")} className="lhl-press mt-1 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">{COPY.eyesStart}</button>
        </div>
      )}
    </div>
  );
}

/** R19. Her senses question as she wrote it, then six tap-through prompts, one box each. */
function Senses({ vals, onChange, legacy, onLegacy }: { vals: string[]; onChange: (i: number, v: string) => void; legacy: string; onLegacy: (v: string) => void }) {
  const [open, setOpen] = useState(0);
  const go = (i: number) => {
    setOpen(i);
    setTimeout(() => document.getElementById(`lhl-sense-${i}`)?.focus({ preventScroll: true }), 260);
  };
  return (
    <div className="mt-4 grid gap-2.5" data-testid="senses">
      {SENSES.map((label, i) => {
        const on = open === i;
        const filled = vals[i].trim().length > 0;
        return (
          <div key={label} data-testid={`sense-row-${i}`} data-open={on ? "1" : "0"} className={`rounded-2xl border transition-colors ${on ? "border-[#DDC98E] bg-[rgba(13,53,53,0.5)]" : "border-[#DDC98E]/35 bg-[rgba(13,53,53,0.28)]"}`}>
            <button type="button" aria-expanded={on} data-testid={`sense-head-${i}`} onClick={() => (on ? setOpen(-1) : go(i))} className="lhl-press flex min-h-[56px] w-full items-center gap-3 px-4 text-left">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[14px] ${filled ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/50 text-[#DDC98E]"}`}>{filled ? <Tick on /> : i + 1}</span>
              <span className="font-display text-[20px] font-light">{label}</span>
            </button>
            <div className={`lhl-collapse ${on ? "open" : ""}`}>
              <div className="min-h-0 overflow-hidden">
                <div className="px-4 pb-4">
                  <textarea id={`lhl-sense-${i}`} data-testid={`sense-${i}`} rows={3} value={vals[i]} placeholder={COPY.writePlaceholder} aria-label={label} tabIndex={on ? 0 : -1} onChange={(e) => onChange(i, e.target.value)}
                    className="resize-none w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(7,7,7,0.35)] p-3 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
                  {i < SENSES.length - 1 && <button type="button" tabIndex={on ? 0 : -1} data-testid={`sense-next-${i}`} onClick={() => go(i + 1)} className="lhl-press mt-2 inline-flex min-h-[44px] items-center rounded-full border border-[#DDC98E]/60 px-5 text-[14px] text-[#DDC98E]">{COPY.sensesNext}</button>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {legacy.trim() && (
        <div className="mt-2" data-testid="senses-before">
          <p className="text-[13px] text-[#a79f90]">{COPY.sensesBefore}</p>
          <textarea rows={3} value={legacy} aria-label={COPY.sensesBefore} onChange={(e) => onLegacy(e.target.value)} className="mt-1.5 w-full rounded-2xl border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.28)] p-3 text-[16px] leading-relaxed text-[#f1ece2] outline-none focus:border-[#DDC98E]" />
        </div>
      )}
    </div>
  );
}

/** R20. Three numbered boxes, each with a tick she sets when it is done. */
function ThreeBoxes({ k, vals, ticks, onText, onTick }: { k: string; vals: string[]; ticks: boolean[]; onText: (i: number, v: string) => void; onTick: (i: number) => void }) {
  return (
    <div className="mt-4 grid gap-3" data-testid={`three-${k}`}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors ${ticks[i] ? "border-[#DDC98E] bg-[rgba(221,201,142,0.08)]" : "border-[#DDC98E]/35 bg-[rgba(13,53,53,0.28)]"}`}>
          <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDC98E]/60 font-display text-[16px] text-[#DDC98E]">{i + 1}</span>
          <textarea data-testid={`three-${k}-${i}`} rows={2} value={vals[i]} placeholder={COPY.writePlaceholder} aria-label={`${i + 1}`} onChange={(e) => onText(i, e.target.value)}
            className="resize-none min-w-0 flex-1 rounded-xl border border-transparent bg-transparent p-2 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]/50" />
          <button type="button" data-testid={`tick-${k}-${i}`} aria-pressed={ticks[i]} aria-label={COPY.tickDone} onClick={() => onTick(i)}
            className={`lhl-press mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[18px] ${ticks[i] ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/50 text-transparent"}`}><Tick on={ticks[i]} /></button>
        </div>
      ))}
    </div>
  );
}

/** R21. Her letter: everything she wrote about her future self, as one designed card. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const out: string[] = [];
  text.split(/\r?\n/).forEach((para) => {
    if (!para.trim()) { out.push(""); return; }
    let cur = "";
    para.split(/\s+/).forEach((w) => {
      const tryLine = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(tryLine).width > maxW && cur) { out.push(cur); cur = w; } else cur = tryLine;
    });
    if (cur) out.push(cur);
  });
  return out;
}
async function letterImage(groups: LGroup[], family: string): Promise<Blob | null> {
  try { await document.fonts?.ready; } catch {}
  const W = 1080, P = 88, MW = W - P * 2;
  const meas = document.createElement("canvas").getContext("2d");
  if (!meas) return null;
  type Cmd = { y: number; t: string; f: string; c: string; sp?: number };
  const cmds: Cmd[] = [];
  let y = P + 20;
  const add = (t: string, f: string, c: string, lh: number, sp?: number) => {
    meas.font = f;
    wrapText(meas, t, MW).forEach((ln) => { y += lh; cmds.push({ y, t: ln, f, c, sp }); });
  };
  add(COPY.title.toUpperCase(), `500 24px ${family}`, "#DDC98E", 30, 6);
  add(COPY.letterTitle, `300 72px ${family}`, "#f1ece2", 84);
  y += 24;
  groups.forEach((g) => {
    y += 36;
    add(g.group.toUpperCase(), `500 24px ${family}`, "#DDC98E", 30, 5);
    g.rows.forEach((r) => {
      y += 22;
      add(r.label, `500 26px ${family}`, "#a79f90", 34);
      if (r.items) r.items.forEach((x, i) => add(`${i + 1}. ${x.t}${x.done ? "  ✓" : ""}`, `400 34px ${family}`, "#f1ece2", 46));
      else add(r.text ?? "", `400 34px ${family}`, "#f1ece2", 46);
    });
  });
  const H = Math.min(y + P + 20, 9000);
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d3535"); bg.addColorStop(1, "#070707");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(221,201,142,.7)"; ctx.lineWidth = 3; ctx.strokeRect(36, 36, W - 72, H - 72);
  cmds.forEach((c) => {
    ctx.font = c.f; ctx.fillStyle = c.c;
    if (c.sp) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${c.sp}px`; else (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
    ctx.fillText(c.t, P, c.y);
  });
  return new Promise((res) => cv.toBlob((b) => res(b), "image/png"));
}

function SaveImage({ groups }: { groups: LGroup[] }) {
  const [msg, setMsg] = useState("");
  const run = async () => {
    setMsg("");
    const fam = (document.querySelector("[data-letter-title]") ? getComputedStyle(document.querySelector("[data-letter-title]") as Element).fontFamily : "serif") || "serif";
    const blob = await letterImage(groups, fam).catch(() => null);
    if (!blob) { setMsg(COPY.imageFail); return; }
    const file = new File([blob], "her-letter.png", { type: "image/png" });
    try {
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }) && typeof navigator.share === "function") {
        await navigator.share({ files: [file], title: COPY.shareTitle });
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "her-letter.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setMsg(COPY.imageSaved);
    } catch { setMsg(COPY.imageFail); }
  };
  return (
    <>
      <button type="button" data-testid="save-image" onClick={run} className="lhl-press inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707]">{COPY.saveImage}</button>
      {msg && <p role="status" data-testid="image-msg" className="mt-2 w-full text-[14px] text-[#EEDE80]">{msg}</p>}
    </>
  );
}

function Letter({ journal, r2 }: { journal: Record<string, string>; r2: R2 }) {
  const groups = letterOf(journal, r2);
  return (
    <>
      <div className="rounded-[28px] border-[1.5px] border-[rgba(221,201,142,0.7)] bg-[linear-gradient(160deg,rgba(13,53,53,0.9),rgba(7,7,7,0.95))] px-5 py-7 shadow-[0_0_50px_-20px_rgba(221,201,142,0.7)]" data-testid="letter">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{COPY.title}</p>
        <h2 data-letter-title="1" className="!mb-2 !mt-1">{COPY.letterTitle}</h2>
        <p className="mb-2 text-[15px] text-[#a79f90]">{COPY.letterLine}</p>
        {groups.length === 0 && <p className="mt-4 text-[16px] text-[#cfc8bb]" data-testid="letter-empty">{COPY.letterEmpty}</p>}
        {groups.map((g) => (
          <div key={g.group} className="mt-7">
            <p className="border-b border-[#DDC98E]/30 pb-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{g.group}</p>
            {g.rows.map((r) => (
              <div key={r.label} className="mt-4">
                <p className="text-[13px] text-[#a79f90]">{r.label}</p>
                {r.items ? (
                  <ol className="mt-1 grid gap-1.5">
                    {r.items.map((x, i) => (
                      <li key={i} data-letter="1" className="flex gap-2.5 text-[17px] leading-snug text-[#f1ece2]"><span className="font-display text-[#DDC98E]">{i + 1}</span><span className="whitespace-pre-wrap">{x.t}</span>{x.done && <span className="text-[#DDC98E]">✓</span>}</li>
                    ))}
                  </ol>
                ) : (
                  <p data-letter="1" className="mt-1 whitespace-pre-wrap text-[17px] leading-relaxed text-[#f1ece2]">{r.text}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <KeepCopy text={letterText(journal, r2)} extra={groups.length ? <SaveImage groups={groups} /> : null} />
    </>
  );
}

// ---- Part 1: Meet her ------------------------------------------------------------------------
type Act = {
  setComplaints: (c: Cmp[]) => void;
  setDesire: (id: string, v: string) => void;
  setSense: (i: number, v: string) => void;
  setLegacy: (v: string) => void;
  setThree: (k: string, i: number, v: string) => void;
  tick: (k: string, i: number) => void;
};

function Part1({ idx, journal, setAnswer, r2, act }: { idx: number; journal: Record<string, string>; setAnswer: (k: string, v: string) => void; r2: R2; act: Act }) {
  if (idx >= JOURNAL_SCREENS.length) {
    return (
      <section data-testid="p1-letter">
        <p className="kicker">Part 1 · {PARTS[0].name}</p>
        <Letter journal={journal} r2={r2} />
      </section>
    );
  }
  const lines = JOURNAL_SCREENS[idx];
  const last = idx === JOURNAL_SCREENS.length - 1;
  const complaints = complaintsOf(journal, r2);
  return (
    <section data-testid={`p1-${idx}`}>
      {idx === 0 && <Photo src={PHOTOS.meetHer.src} alt={PHOTOS.meetHer.alt} pos={PHOTOS.meetHer.pos} ratio={PHOTOS.meetHer.ratio} />}
      <p className="kicker">Part 1 · {PARTS[0].name}</p>
      <div className="mt-3">
        {lines.map((li) => {
          const L = JOURNAL[li];
          if (L.k === "q") {
            const key = `q${li}`;
            let control: React.ReactNode;
            if (li === 3) control = <ComplaintList items={complaints} onChange={act.setComplaints} />;
            else if (li === 4) control = null; // the cards and the extra box come after the tip, below
            else if (li === 19) control = <Senses vals={sensesOf(r2)} onChange={act.setSense} legacy={r2.s ? "" : journal.q19 ?? ""} onLegacy={act.setLegacy} />;
            else if (THREE.includes(key)) control = <ThreeBoxes k={key} vals={threeOf(key, journal, r2)} ticks={ticksOf(key, r2)} onText={(i, v) => act.setThree(key, i, v)} onTick={(i) => act.tick(key, i)} />;
            else control = <Box id={`lhl-q${li}`} value={journal[key] ?? ""} onChange={(v) => setAnswer(key, v)} />;
            return (
              <div key={li} className="lhl-block">
                <p data-journal="1" className="lhl-q">{L.t}</p>
                {control}
              </div>
            );
          }
          if (L.k === "tip") {
            return (
              <div key={li}>
                <p data-journal="1" className="lhl-tip"><span>TIP:</span> {L.t.slice(5)}</p>
                <div className="grid gap-3" data-testid="desire-cards">
                  {complaints.length === 0 && <p className="text-[15px] leading-relaxed text-[#a79f90]" data-testid="desires-empty">{COPY.desiresEmpty}</p>}
                  {complaints.map((c, i) => <DesireCard key={c.id} c={c} i={i} onDesire={(v) => act.setDesire(c.id, v)} />)}
                </div>
                <Box id="lhl-q4" value={journal.q4 ?? ""} onChange={(v) => setAnswer("q4", v)} rows={4} placeholder={COPY.desireExtra} />
              </div>
            );
          }
          return (
            <div key={li}>
              <p data-journal="1" className={idx === 0 && li === 0 ? "lhl-lead" : "lhl-p"}>{L.t}</p>
              {li === 6 && <EyesTimer />}
            </div>
          );
        })}
      </div>
      {last && <KeepCopy text={journalText(journal, r2)} />}
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
  // R15: one tap to the name box. Scroll to it and focus it inside the tap so the keyboard comes up.
  const begin = () => {
    const el = document.querySelector<HTMLInputElement>('input[name="firstName"]');
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  };
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
        <button type="button" data-testid="begin" onClick={begin} className="lhl-press lhl-begin mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#DDC98E] font-display text-[18px] font-medium text-[#070707]">{COPY.begin}<span aria-hidden="true">↓</span></button>
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

      {!resume && (
        <button type="button" data-testid="start" onClick={() => open(1, 0)} className="lhl-press lhl-begin mt-6 flex min-h-[64px] w-full items-center justify-between gap-3 rounded-full bg-[#DDC98E] px-6 text-left text-[#070707]">
          <span><span className="block font-display text-[17px] font-medium leading-tight">{COPY.start}</span><span className="block text-[13px] opacity-75">{partLabel(1)}</span></span>
          <span className="text-xl">→</span>
        </button>
      )}
      {resume && (
        <button type="button" data-testid="resume" onClick={() => open(resume.part, resume.i)} className="lhl-press mt-6 flex min-h-[64px] w-full items-center justify-between gap-3 rounded-full bg-[#DDC98E] px-6 text-left text-[#070707]">
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
  const [r2, setR2, loadR2] = useStore<R2>(K.r2, {});
  const [log, setLog, loadLog] = useStore<Entry[]>(K.tb, []);
  const [landed, setLandedS, loadLanded] = useStore<Landed>(K.ground, "");
  const [vis, setVis, loadVis] = useStore<Vis>(K.vis, VIS0);
  const counted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- phone storage is only readable after mount */
    loadResume(); loadProg(); loadJournal(); loadR2(); loadLog(); loadLanded(); loadVis();
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

  // ---- Round 2 answers: written to the new shape AND mirrored to the old journal keys, so nothing is ever wiped (R22)
  const mirror = (k: string, arr: string[]) => setJournal((j) => ({ ...j, [k]: arr.map((x) => x.trim()).filter(Boolean).join("\n") }));
  const act: Act = {
    setComplaints: (c) => {
      setR2((x) => ({ ...x, c }));
      mirror("q3", c.map((y) => y.t));
    },
    setDesire: (id, v) => setR2((x) => ({ ...x, c: complaintsOf(journal, x).map((y) => (y.id === id ? { ...y, d: v } : y)) })),
    setSense: (i, v) => setR2((x) => ({ ...x, s: sensesOf(x).map((y, n) => (n === i ? v : y)) })),
    setLegacy: (v) => setJournal((j) => ({ ...j, q19: v })),
    setThree: (k, i, v) => {
      const next = threeOf(k, journal, r2).map((y, n) => (n === i ? v : y));
      setR2((x) => ({ ...x, t: { ...x.t, [k]: next } }));
      mirror(k, next);
    },
    tick: (k, i) => setR2((x) => ({ ...x, k: { ...x.k, [k]: ticksOf(k, x).map((y, n) => (n === i ? !y : y)) } })),
  };

  const inPart = opened && pos.part > 0;
  const total = inPart ? SCREENS[pos.part - 1] : 0;
  const last = inPart && pos.i === total - 1;
  const nextLabel = !inPart ? "" : last ? COPY.finishPart : pos.part === 1 ? (pos.i === JOURNAL_SCREENS.length - 1 ? COPY.letterNext : "Next →") : `${SCREEN_NAMES[pos.part - 1][pos.i + 1]} →`;
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
                {pos.part === 1 && <Part1 idx={pos.i} journal={journal} r2={r2} act={act} setAnswer={(k, v) => setJournal((j) => ({ ...j, [k]: v }))} />}
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
  .wssr .lhl-press{transition:transform .12s ease,background-color .2s ease,border-color .2s ease}
  .wssr .lhl-press:active{transform:scale(.96)}
  .wssr .lhl-begin{box-shadow:0 0 34px -10px rgba(221,201,142,.7);animation:lhlglow 2.8s ease-in-out infinite}
  @keyframes lhlglow{0%,100%{box-shadow:0 0 22px -12px rgba(221,201,142,.55)}50%{box-shadow:0 0 38px -8px rgba(221,201,142,.85)}}
  .wssr .lhl-pop{animation:lhlpop .42s cubic-bezier(.3,1.7,.5,1) both}
  @keyframes lhlpop{0%{transform:scale(.2);opacity:0}100%{transform:scale(1);opacity:1}}
  .wssr .lhl-tickbig{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:9999px;background:#DDC98E;color:#070707;font-size:22px}
  .wssr .lhl-rowin{animation:lhlrow .35s cubic-bezier(.2,.8,.2,1) both}
  @keyframes lhlrow{0%{transform:translateY(8px) scale(.97);opacity:0}100%{transform:none;opacity:1}}
  .wssr .lhl-turn.lhl-dcard{cursor:default}
  .wssr .lhl-turn.lhl-dcard .lhl-dface[role=button]{cursor:pointer}
  .lhl-turn.flip2{animation:lhlflip2 .46s cubic-bezier(.45,.05,.25,1)}
  @keyframes lhlflip2{0%{transform:rotateY(0) scale(1)}50%{transform:rotateY(90deg) scale(1.03)}100%{transform:rotateY(0) scale(1)}}
  .wssr .lhl-collapse{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s cubic-bezier(.2,.8,.2,1),visibility 0s linear .3s;visibility:hidden}
  .wssr .lhl-collapse.open{grid-template-rows:1fr;visibility:visible;transition-delay:0s}
  @media (prefers-reduced-motion:reduce){.lhl-turn.flip2,.wssr .lhl-begin,.wssr .lhl-pop,.wssr .lhl-rowin{animation:none}.wssr .lhl-collapse{transition:none}}
  .wssr .lhl-fill{transition:width .8s cubic-bezier(.2,.8,.2,1)}
  .wssr details summary{padding:6px 0}
  .wssr details summary small{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#DDC98E;margin-bottom:2px}
`;
