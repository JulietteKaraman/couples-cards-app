"use client";

// Couples Touch Map (spec v2: APP builds/specs/couples-touch-map.md, agreed 9 Nov 2026).
// Two people, one phone. Each touch date one receives and one gives, in the receiver's
// Pleasure Language, place by place from her recordings. Starts at 3 minutes and grows.
// Map answers stay on this phone. Only finished touch dates are recorded to the account.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PleasureQuiz, QUIZ_CSS, type Scores } from "@/components/PleasureQuiz";
import { SlimPlayer, savedSpeed, saveSpeed } from "@/components/SlimPlayer";
import { OneTouchCardFace } from "@/components/OneTouch";
import { BodyMap, todayStr, type MapEntry } from "@/components/TouchMap";
import { ANSWERS, AREAS, LANGUAGES, LANG_STYLE, type Answer, type LanguageId } from "@/lib/content/touch-map";
import { buildPlaceDate, minutesFor, MINUTES, type Block, type DatePlan, type PlayStep, type Step } from "@/lib/couples-touch/engine";
import { useAuth } from "@/components/providers/AuthProvider";
import { markComplete } from "@/lib/entitlements/progress";
import { audioFor, DYAD_SECONDS, FRAME, HAVE, JOINS, PALMS, playlistFor, INTEGRATION_PROMPT, NOS, WARM_UP_PROMPT } from "@/lib/couples-touch/frame";
import poolData from "@/lib/couples-touch/pool.json";

const POOL = poolData as unknown as Block[];
const KEY = "ffy.couples-touch-map.v2"; // never the live Touch Map's keys
type Person = { name: string; scores?: Scores; entries: MapEntry[]; body: "female" | "male"; dates: number; lastPlaces: string[]; usedTools: string[]; usedMenu: string[] };
type Saved = { people: Person[]; receiver?: number; lastReceiver?: number; no: string[]; have: string[]; minutes?: number; tryLang?: string | null; welcomed?: boolean; setupSeen?: boolean };
type Stage = "doors" | "welcome" | "names" | "quiz0" | "quiz1" | "who" | "nos" | "handover" | "length" | "have" | "callback" | "stuck" | "setup" | "giver" | "receiver" | "open" | "touchbase" | "dyad1" | "stoplight" | "touch" | "question" | "dyad2" | "ground" | "map" | "end";
const person = (name = ""): Person => ({ name, entries: [], body: "female", dates: 0, lastPlaces: [], usedTools: [], usedMenu: [] });
const EMPTY: Saved = { people: [person(), person()], no: [], have: [] };
const TRY = [
  { label: "Mostly Sensual, a little Kinky", mix: { energetic: 0, sensual: 70, kinky: 30, sexual: 0, shapeshifter: 0 } },
  { label: "Mostly Energetic, some Sensual", mix: { energetic: 60, sensual: 40, kinky: 0, sexual: 0, shapeshifter: 0 } },
  { label: "Mostly Kinky, a little Sexual", mix: { energetic: 9, sensual: 5, kinky: 75, sexual: 11, shapeshifter: 0 } },
];

function useSaved(): [Saved, (s: Saved) => void] {
  const [s, setS] = useState<Saved>(EMPTY);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v) setS({ ...EMPTY, ...v }); } catch {} }, []);
  return [s, (n) => { setS(n); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} }];
}

let bellCtx: AudioContext | null = null;
function unlockBell() {
  try {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    bellCtx = bellCtx ?? new C();
    void bellCtx.resume();
  } catch {}
}
function bell() {
  try {
    const a = bellCtx;
    if (!a) return;
    void a.resume();
    [528, 792].forEach((f) => {
      const o = a.createOscillator(), g = a.createGain();
      o.frequency.value = f; g.gain.setValueAtTime(0.1, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 2.4);
      o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 2.4);
    });
  } catch {}
}

const Gold = "#DDC98E";
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const primary = "inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 text-[16px] font-medium text-[#070707]";
const quiet = "inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#DDC98E]/50 px-5 text-[15px] text-[#f1ece2]";

function Title({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  return (
    <>
      {kicker && <p className="mt-7 text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">{kicker}</p>}
      <h1 className="mt-2 font-display text-[32px] font-light leading-tight">{children}</h1>
    </>
  );
}

// Her voice when it exists, a marked box until it does (spec R11).
function Frame({ id }: { id: string }) {
  const f = FRAME[id];
  if (!f) return null;
  if (f.src) return <div className="mt-5"><SlimPlayer src={f.src} label={f.label} big /></div>;
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[#DDC98E]/60 bg-[rgba(221,201,142,0.07)] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Your voice goes here</p>
      <p className="mt-1 text-[15px] text-[#e9e3d6]">{f.label}</p>
    </div>
  );
}

function Doors({ open }: { open: boolean }) {
  return (
    <div className="relative mt-5 h-[52vh] max-h-[460px] overflow-hidden rounded-[28px] border border-[#DDC98E]/30 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(221,201,142,0.75),rgba(13,53,53,0.9))]">
      {(["left", "right"] as const).map((side) => (
        <div key={side} className="absolute inset-y-0 w-1/2 transition-transform duration-[2600ms] ease-in-out"
          style={{ [side]: 0, transform: open ? `translateX(${side === "left" ? "-100%" : "100%"})` : "none" }}>
          <Image src={`/touch-map/couples/beg-door-${side}.jpg`} alt="" fill priority sizes="50vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function Picks({ items, on, toggle }: { items: { id: string; label: string }[]; on: string[]; toggle: (id: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((x) => {
        const sel = on.includes(x.id);
        return (
          <button key={x.id} type="button" aria-pressed={sel} onClick={() => toggle(x.id)}
            className={`min-h-[46px] rounded-full border px-4 text-[15px] ${sel ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`}>
            {x.label}
          </button>
        );
      })}
    </div>
  );
}

function ChooseLanguage({ onPick }: { onPick: (s: Scores) => void }) {
  return (
    <div className="mt-5 space-y-2">
      {LANGUAGES.map((l) => (
        <button key={l.id} type="button" className={quiet + " w-full !justify-start"} onClick={() => onPick(Object.fromEntries(LANGUAGES.map((x) => [x.id, x.id === l.id ? 100 : 0])) as Scores)}>
          {l.label} · <span className="ml-1 text-[#a79f90]">{l.line}</span>
        </button>
      ))}
    </div>
  );
}

function Quiz({ who, onDone }: { who: string; onDone: (s: Scores) => void }) {
  const [choose, setChoose] = useState(false);
  return (
    <>
      <Title kicker={who}>{choose ? "Choose your language" : "Your quiz"}</Title>
      {choose ? <ChooseLanguage onPick={onDone} /> : (
        <div className="mt-4"><PleasureQuiz doneLabel="Carry on" onDone={(_, s) => onDone(s)} onChooseMyself={() => setChoose(true)} /></div>
      )}
    </>
  );
}

function DyadTimer({ prompt }: { prompt: string }) {
  const [left, setLeft] = useState(DYAD_SECONDS);
  const [running, setRunning] = useState(false);
  const [swaps, setSwaps] = useState(0);
  useEffect(() => {
    if (!running) return;
    const endsAt = Date.now() + left * 1000;
    const tick = () => {
      const l = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) { setRunning(false); bell(); }
    };
    const t = setInterval(tick, 500);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", tick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  return (
    <div>
      <OneTouchCardFace prompt={prompt} />
      <p className="text-center font-display text-[46px] font-light tabular-nums">{mmss(left)}</p>
      <div className="mt-4 flex gap-2">
        {left > 0 && <button type="button" className={primary} onClick={() => { unlockBell(); setRunning((r) => !r); }}>{running ? "Pause" : left === DYAD_SECONDS ? "Start the timer" : "Carry on"}</button>}
        {running && <button type="button" className={quiet + " w-full"} onClick={() => setSwaps((n) => n + 1)}>Thank you, swap</button>}
      </div>
      {swaps > 0 && <p className="mt-2 text-center text-[13px] text-[#a79f90]">{swaps % 2 ? "Second speaker" : "First speaker"}</p>}
      {left === 0 && <p className="mt-3 text-center text-[15px] text-[#DDC98E]">Time.</p>}
    </div>
  );
}

// One guided run across many recordings (spec R9, R10).
function TouchPlayer({ touchDate, onDone }: { touchDate: { steps: Step[] }; onDone: (played: PlayStep[]) => void }) {
  const [skip, setSkip] = useState<string[]>([]);
  const steps = useMemo(() => {
    const kept = touchDate.steps.filter((s) => s.kind === "line" || !s.contains.some((c) => skip.includes(c)));
    // "Not today" can orphan a palm or a moving-on line: a palm follows a touch, a moving-on line sits between touches.
    return kept.filter((s, k) => {
      if (s.kind !== "line" || s.line === "ask") return true;
      const prev = kept[k - 1];
      if (prev?.kind !== "play") return false;
      return s.line === "palm" || kept.slice(k + 1).some((n) => n.kind === "play");
    });
  }, [touchDate, skip]);
  const [i, setI] = useState(0);
  const [span, setSpan] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [words, setWords] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  const want = useRef(false);
  const pendingAt = useRef<number | null>(null);
  const step: Step | undefined = steps[i];
  // Once she has recorded a moving-on or palm line it plays in the same run, so the giver's hands stay on their partner.
  const lineSrc = useMemo(() => {
    if (step?.kind !== "line" || step.line === "ask") return null;
    const set = step.line === "join" ? JOINS : step.line === "palm" ? PALMS : null;
    if (!set) return FRAME[step.line]?.src ?? null;
    const n = steps.slice(0, i).filter((x) => x.kind === "line" && x.line === step.line).length; // take turns
    return set[n % set.length];
  }, [step, steps, i]);
  const total = useMemo(() => steps.reduce((n, s) => n + (s.kind === "play" ? s.seconds : 0), 0), [steps]);
  const done = useMemo(() => steps.slice(0, i).reduce((n, s) => n + (s.kind === "play" ? s.seconds : 0), 0), [steps, i]);

  // The map only offers places they actually heard, so tapping past a part doesn't count it.
  const heard = useRef(new Set<PlayStep>());
  const finish = () => onDone(steps.filter((s): s is PlayStep => s.kind === "play" && heard.current.has(s)));
  const go = (n: number) => { setSpan(0); if (n >= steps.length) { ref.current?.pause(); finish(); } else setI(Math.max(0, n)); };
  // Called inside a tap: keeps iPhone Safari willing to play, silently, until the right place is loaded.
  const unlock = () => { const a = ref.current; if (!a) return; want.current = true; if (a.getAttribute("src")) { a.muted = true; a.play().catch(() => {}); } };

  // Load the right place in the right recording whenever the step or span changes.
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (!step || (step.kind !== "play" && !lineSrc)) { a.pause(); return; }
    const src = step.kind === "play" ? audioFor(step.slug) : (lineSrc as string);
    pendingAt.current = step.kind === "play" ? step.spans[span]?.[0] ?? step.start : 0;
    if (a.getAttribute("src") !== src) { a.pause(); a.setAttribute("src", src); a.load(); }
    else seek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, span]);
  const seek = () => {
    const a = ref.current;
    if (!a || pendingAt.current === null) return;
    a.currentTime = pendingAt.current;
    pendingAt.current = null;
    a.defaultPlaybackRate = rate; // iPhone resets the speed when a new recording loads
    a.playbackRate = rate;
    a.muted = false;
    if (want.current) a.play().catch(() => { want.current = false; setPlaying(false); });
  };
  useEffect(() => { setRate(savedSpeed()); }, []);
  useEffect(() => { const a = ref.current; if (a) { a.defaultPlaybackRate = rate; a.playbackRate = rate; } saveSpeed(rate); }, [rate]);
  // "Not today" can remove everything that was left.
  useEffect(() => {
    if (i >= steps.length) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, steps.length]);

  // Stops exactly at the end of what should play. timeupdate alone is far too coarse: the next
  // sentence, often a cut line, starts straight after the end of the span.
  const onTime = () => {
    const a = ref.current;
    if (!a || !step || step.kind !== "play" || pendingAt.current !== null || a.paused) return;
    const s = step.spans[span];
    if (!a.muted && s && a.currentTime >= s[0] + 5) heard.current.add(step);
    if (s && a.currentTime >= s[1] - 0.04 * rate) {
      if (!a.muted && span + 1 >= step.spans.length) heard.current.add(step);
      a.muted = true;
      if (span + 1 < step.spans.length) setSpan(span + 1);
      else go(i + 1);
    }
  };
  const latest = useRef(onTime);
  latest.current = onTime;
  useEffect(() => {
    const t = setInterval(() => latest.current(), 30);
    return () => clearInterval(t);
  }, []);
  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) { want.current = true; setPlaying(true); a.play().catch(() => { want.current = false; setPlaying(false); }); }
    else { want.current = false; setPlaying(false); a.pause(); }
  };

  if (!step) return null;
  return (
    <div className="mt-5">
      <div className="h-[3px] overflow-hidden rounded-full bg-[#DDC98E]/20"><div className="h-full bg-[#DDC98E]" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
      <p className="mt-2 text-[12px] text-[#8f877a]">Part {i + 1} of {steps.length}</p>

      {step.kind === "line" && !lineSrc ? (
        <div>
          {step.line === "ask"
            ? (step.asks ?? []).map((a) => <Frame key={a} id={`ask_${a}`} />)
            : <Frame id={step.line} />}
          {step.line === "ask" ? (
            <div className="mt-5 flex gap-2">
              <button type="button" className={primary} onClick={() => { const asks = step.asks ?? []; setSkip((x) => x.filter((c) => !asks.includes(c))); unlock(); go(i + 1); }}>Yes, carry on</button>
              <button type="button" className={quiet + " w-full"} onClick={() => { setSkip((x) => [...x, ...(step.asks ?? [])]); unlock(); setSpan(0); setI(i + 1); }}>Not today</button>
            </div>
          ) : (
            <button type="button" className={primary + " mt-5"} onClick={() => { unlock(); go(i + 1); }}>Carry on</button>
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDC98E] text-[28px] text-[#070707] shadow-[0_0_44px_-6px_rgba(221,201,142,0.8)]">
            {playing ? "❚❚" : "▶"}
          </button>
          <div className="mt-5 flex gap-2" role="group" aria-label="Speed">
            {[1, 1.25, 1.5].map((r) => (
              <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)}
                className={`min-h-[40px] rounded-full border px-4 text-[14px] ${rate === r ? "border-[#DDC98E] text-[#DDC98E]" : "border-white/20 text-[#a79f90]"}`}>{r}x</button>
            ))}
          </div>
          <button type="button" className="mt-4 min-h-[40px] text-[14px] text-[#DDC98E] underline underline-offset-4" onClick={() => setWords((w) => !w)}>
            {words ? "Hide the words" : "Show the words"}
          </button>
          {words && <p className="mt-3 text-[16px] leading-relaxed text-[#e9e3d6]">{step.kind === "play" ? step.text : FRAME[(step as { line: string }).line]?.label}</p>}
        </div>
      )}

      <div className="mt-7 flex justify-between">
        <button type="button" className={quiet} onClick={() => { if (want.current) unlock(); go(i - 1); }} disabled={i === 0} style={{ opacity: i === 0 ? 0.4 : 1 }}>← Part</button>
        <button type="button" className={quiet} onClick={() => { if (want.current) unlock(); go(i + 1); }}>{i + 1 >= steps.length ? "Finish" : "Part →"}</button>
      </div>
      <audio ref={ref} preload="auto" onLoadedMetadata={seek} onTimeUpdate={onTime} onEnded={() => go(i + 1)} onPlay={() => { const a = ref.current; if (a && a.playbackRate !== rate) a.playbackRate = rate; setPlaying(true); }} onPause={() => setPlaying(false)} />
    </div>
  );
}

// Her set-up videos, checked 9 Nov 2026 (no names, no Beginning). Partner video ends before
// "how to get her to feel safe". Toolkit is whole: her tying and tape lines stay (Juliette: great for Kinky).
const SETUP_READY = true;
const SETUP_VIDEOS = [
  { src: "/touch-map/couples/setup/room.mp4", title: "Setting up the room" },
  { src: "/touch-map/couples/setup/room-2.mp4", title: "Setting up the room, part 2" },
  { src: "/touch-map/couples/setup/toolkit.mp4", title: "Your Pleasure Toolkit" },
];
function Playlist({ scores, name }: { scores?: Scores; name: string }) {
  const p = playlistFor(scores as unknown as Record<string, number> | undefined);
  if (!p) return null;
  return (
    <div className="mt-6 rounded-2xl border border-[#DDC98E]/40 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">{name}&apos;s playlist · {p.label}</p>
      <p className="mt-1 text-[15px] text-[#d8d1c3]">Put it on before you start. It sets the tone.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.spotify && <a href={p.spotify} target="_blank" rel="noopener noreferrer" className={quiet}>Open in Spotify</a>}
        {p.tidal && <a href={p.tidal} target="_blank" rel="noopener noreferrer" className={quiet}>Open in Tidal</a>}
      </div>
    </div>
  );
}

function SetupVideos({ collapsed = false }: { lang?: string; collapsed?: boolean }) {
  if (!SETUP_READY) return null;
  const body = (
    <div className="mt-4 space-y-5">
      {SETUP_VIDEOS.map((v) => (
        <div key={v.src}>
          <p className="text-[15px] text-[#e9e3d6]">{v.title}</p>
          <video src={v.src} controls playsInline preload="metadata" className="mt-2 w-full rounded-2xl bg-black" />
        </div>
      ))}
      <Frame id="space" />
    </div>
  );
  if (!collapsed) return body;
  return (
    <details className="mt-5 rounded-2xl border border-[#DDC98E]/30 p-4">
      <summary className="cursor-pointer text-[15px] text-[#DDC98E]">Watch the set-up videos again</summary>
      {body}
    </details>
  );
}

export function CouplesTouchMap() {
  const { user } = useAuth();
  const [saved, save] = useSaved();
  const [stage, setStage] = useState<Stage>("doors");
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [played, setPlayed] = useState<PlayStep[]>([]);
  const [rated, setRated] = useState<Record<string, Answer>>({});
  const [open, setOpen] = useState(false);
  const r = saved.receiver ?? 0;
  const rec = saved.people[r] ?? person();
  const giv = saved.people[1 - r] ?? person();
  const [startDone, setStartDone] = useState<number | null>(null); // fixed for the whole touch date
  const done = startDone ?? rec.dates; // touch dates this receiver had finished when today began
  const short = done < 3; // her ladder: the first three are short, no Dyads, hands only
  const both = saved.people.every((p) => p.name && p.scores);

  const route = useMemo<Stage[]>(() => {
    const pre: Stage[] = ["doors", ...(saved.welcomed ? [] : ["welcome" as Stage]), ...(both ? [] : ["names", "quiz0", "quiz1"] as Stage[]), "who", "nos", "handover", "length", ...(short ? [] : ["have" as Stage])];
    const after: Stage[] = short
      ? [...(SETUP_READY && done === 0 && !saved.setupSeen ? ["setup" as Stage] : []), "callback", "touchbase", "stoplight", "touch", "question", "map", "end"]
      : ["giver", "callback", "receiver", "open", "touchbase", "dyad1", "stoplight", "touch", "dyad2", "ground", "map", "end"];
    return [...pre, ...after];
  }, [saved.welcomed, saved.setupSeen, both, short, done]);
  const go = (s: Stage) => { setStage(s); try { window.scrollTo(0, 0); } catch {} };
  const idx = route.indexOf(stage);
  const next = () => go(route[Math.min(route.length - 1, idx + 1)]);
  const back = () => { let n = idx - 1; while (n > 0 && route[n] === "open") n--; go(route[Math.max(0, n)]); };
  const setPerson = (i: number, patch: Partial<Person>) => save({ ...saved, people: saved.people.map((p, k) => (k === i ? { ...p, ...patch } : p)) });
  const toggle = (k: "no" | "have") => (id: string) => save({ ...saved, [k]: saved[k].includes(id) ? saved[k].filter((x) => x !== id) : [...saved[k], id] });

  useEffect(() => {
    if (stage !== "open") { setOpen(false); return; }
    const t = setTimeout(() => setOpen(true), 400);
    const n = setTimeout(() => setStage("touchbase"), 3400);
    return () => { clearTimeout(t); clearTimeout(n); };
  }, [stage]);

  const allowed = minutesFor(done);
  const minutes = allowed.includes(saved.minutes ?? 0) ? (saved.minutes as number) : allowed[allowed.length - 1] === 15 ? 3 : allowed[0];
  const makePlan = () => {
    if (!rec.scores) return;
    const p = buildPlaceDate(rec.scores, POOL, {
      minutes, datesDone: done, lastPlaces: rec.lastPlaces, usedTools: rec.usedTools, usedMenu: rec.usedMenu,
      no: saved.no, have: short ? [] : saved.have, giver: giv.scores ?? null, tryLang: short ? null : saved.tryLang ?? null,
    });
    setPlayed([]); setRated({}); setStartDone(rec.dates);
    if ("stuck" in p) { setPlan(null); go("stuck"); return; }
    setPlan(p);
    next();
  };
  const finishTouch = (p: PlayStep[]) => {
    setPlayed(p);
    if (plan) {
      const tools = plan.steps.filter((s): s is PlayStep => s.kind === "play" && s.slug.startsWith("tool-")).map((s) => s.slug);
      save({ ...saved, lastReceiver: r, setupSeen: true, people: saved.people.map((x, k) => (k === r ? {
        ...x, dates: x.dates + 1, lastPlaces: plan.places, usedTools: [...x.usedTools, ...tools].slice(-6), usedMenu: [...x.usedMenu, ...plan.used].slice(-40),
      } : x)) });
      // Recorded privately for a possible guarantee: that a touch date was finished, never what was felt.
      if (user?.id) void markComplete(user.id, "couples-touch-map", `p${r + 1}-date${done + 1}-${minutes}m-${new Date().toISOString().slice(0, 10)}`);
    }
    next();
  };

  const top = useMemo(() => {
    const s = rec.scores;
    if (!s) return "sensual" as LanguageId;
    return (Object.entries(s).sort((a, b) => b[1] - a[1])[0][0]) as LanguageId;
  }, [rec.scores]);
  const needs = useMemo(() => {
    const ids = new Set(plan ? plan.steps.flatMap((s) => (s.kind === "play" ? s.needs : [])) : []);
    return HAVE.filter((h) => ids.has(h.id));
  }, [plan]);
  const places = useMemo(() => [...new Set(played.flatMap((p) => p.areas))].map((id) => AREAS.find((a) => a.id === id)).filter(Boolean) as typeof AREAS, [played]);
  const nameOf = (i: number) => saved.people[i]?.name || (i === 0 ? "First" : "Second");
  const suggest = saved.lastReceiver === undefined ? null : 1 - saved.lastReceiver;
  const btn = (label: string, onClick = next) => <button type="button" className={primary + " mt-7"} onClick={onClick}>{label}</button>;
  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-xl px-5 pb-24 pt-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Your library</Link>
          {idx > 0 && stage !== "open" && <button type="button" onClick={back} className="min-h-[44px] px-2 text-sm text-[#a79f90]">Back</button>}
        </div>

        {stage === "doors" && (
          <>
            <Doors open={false} />
            <Title kicker="The Touch Map">Just you, or the two of you?</Title>
            <p className="mt-3 text-[17px] leading-relaxed text-[#d8d1c3]">Pick a morning, a lunchtime or a mid-afternoon, when you&apos;re both resourced.</p>
            <Frame id="when" />
            <Link href="/practice/touch-map" className={quiet + " mt-7 w-full"}>Just me</Link>
            <button type="button" className={primary + " mt-3"} onClick={next}>The two of us</button>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 rounded-2xl border border-dashed border-[#DDC98E]/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Preview only: skip the quizzes</p>
                {TRY.map((t) => (
                  <button key={t.label} type="button" className={quiet + " mt-2 w-full"} onClick={() => { save({ ...EMPTY, welcomed: true, people: [{ ...person("Sam"), scores: t.mix as unknown as Scores }, { ...person("Alex"), scores: t.mix as unknown as Scores }] }); go("who"); }}>{t.label}</button>
                ))}
              </div>
            )}
          </>
        )}

        {stage === "welcome" && (
          <>
            <Title kicker="Before you start">One small touch date at a time</Title>
            <Frame id="why" />
            <Frame id="bike" />
            {btn("Carry on", () => { save({ ...saved, welcomed: true }); go(both ? "who" : "names"); })}
          </>
        )}

        {stage === "names" && (
          <>
            <Title kicker="The two of you">Your first names</Title>
            {[0, 1].map((i) => (
              <input key={i} value={saved.people[i]?.name ?? ""} onChange={(e) => setPerson(i, { name: e.target.value.slice(0, 30) })}
                placeholder={i === 0 ? "First name" : "Their first name"} aria-label={i === 0 ? "First name" : "Their first name"}
                className="mt-4 block min-h-[54px] w-full rounded-2xl border border-[#DDC98E]/40 bg-transparent px-4 text-[17px] text-[#f1ece2] placeholder:text-[#8f877a]" />
            ))}
            <p className="mt-3 text-[14px] text-[#a79f90]">Each of you takes the quiz once, and you&apos;ll both get your own map.</p>
            {saved.people.every((p) => p.name.trim()) && btn("Carry on")}
          </>
        )}
        {stage === "quiz0" && <Quiz key="q0" who={nameOf(0)} onDone={(s) => { setPerson(0, { scores: s }); next(); }} />}
        {stage === "quiz1" && <Quiz key="q1" who={nameOf(1)} onDone={(s) => { setPerson(1, { scores: s }); next(); }} />}

        {stage === "who" && (
          <>
            <Title kicker="Today">Who receives today?</Title>
            {suggest !== null && <p className="mt-3 text-[16px] text-[#d8d1c3]">Last time {nameOf(1 - suggest)} received. Is it {nameOf(suggest)}&apos;s turn?</p>}
            <div className="mt-5 space-y-3">
              {[0, 1].map((i) => (
                <button key={i} type="button" className={(suggest === i || (suggest === null && i === 0) ? primary : quiet + " w-full")}
                  onClick={() => { setStartDone(null); setPlan(null); save({ ...saved, receiver: i }); next(); }}>
                  {nameOf(i)} receives
                </button>
              ))}
            </div>
            <p className="mt-3 text-[14px] text-[#a79f90]">The other one gives, in the receiver&apos;s Pleasure Language.</p>
            <button type="button" className="mt-8 min-h-[44px] text-[14px] text-[#a79f90] underline underline-offset-4"
              onClick={() => { save({ ...saved, people: saved.people.map((p) => ({ ...p, scores: undefined })) }); go("names"); }}>Take the quizzes again</button>
          </>
        )}

        {stage === "length" && (
          <>
            <Title kicker={`${giv.name} leads today`}>How long today?</Title>
            <p className="mt-3 text-[16px] text-[#d8d1c3]">{short ? `Touch date ${done + 1}. It starts small and grows, so it lands.` : "Choose what feels right today."}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {MINUTES.map((m) => {
                const can = allowed.includes(m);
                return (
                  <button key={m} type="button" disabled={!can} aria-pressed={minutes === m} onClick={() => save({ ...saved, minutes: m })}
                    className={`min-h-[54px] rounded-2xl border text-[16px] ${minutes === m ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : can ? "border-[#DDC98E]/40" : "border-white/10 text-[#6f6a60]"}`}>
                    {m} min{!can && <span className="block text-[11px]">locked</span>}
                  </button>
                );
              })}
            </div>
            {short && <p className="mt-3 text-[13px] text-[#a79f90]">Up to 15 minutes opens after 3 touch dates.</p>}
            {!short && rec.scores && (
              <>
                <h2 className="mt-9 font-display text-[22px] font-light">Try a little of another language today?</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGES.filter((l) => l.id !== top).map((l) => {
                    const sel = saved.tryLang === l.id;
                    return (
                      <button key={l.id} type="button" aria-pressed={sel} onClick={() => save({ ...saved, tryLang: sel ? null : l.id })}
                        className={`min-h-[46px] rounded-full border px-4 text-[15px] ${sel ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40"}`}>{l.label}</button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[13px] text-[#a79f90]">Just a taste, the gentle part only.</p>
              </>
            )}
            {short ? <button type="button" className={primary + " mt-7"} onClick={makePlan}>That&apos;s today</button> : btn("Carry on")}
          </>
        )}

        {stage === "nos" && (
          <>
            <Title kicker={`${rec.name} receives`}>Anything that&apos;s a no today?</Title>
            <Picks items={NOS} on={saved.no} toggle={toggle("no")} />
            <p className="mt-4 text-[14px] text-[#a79f90]">Only you choose these, {rec.name}.</p>
            {btn("Carry on")}
          </>
        )}

        {stage === "handover" && (
          <>
            <Title kicker={`${rec.name}`}>Hand the phone to {giv.name}.</Title>
            <p className="mt-3 text-[17px] leading-relaxed text-[#d8d1c3]">Then leave the room. What comes next is only for {giv.name}. Your only job now is to receive, and to notice what that brings up.</p>
            <Frame id="leave" />
            {btn(`I'm ${giv.name}, I have the phone`)}
          </>
        )}

        {stage === "have" && (
          <>
            <Title kicker={`${giv.name} leads today`}>What do you have to hand?</Title>
            <Picks items={HAVE} on={saved.have} toggle={toggle("have")} />
            <button type="button" className={primary + " mt-8"} onClick={makePlan}>That&apos;s today</button>
          </>
        )}

        {stage === "callback" && (
          <>
            <Title kicker={`${giv.name} leads today`}>Go and get {rec.name}.</Title>
            <p className="mt-3 text-[17px] text-[#d8d1c3]">When you&apos;re both here, carry on.</p>
            {short && done > 0 && <Playlist scores={rec.scores} name={rec.name} />}
            {btn("We're both here")}
          </>
        )}

        {stage === "stuck" && (
          <>
            <Title kicker="Not yet">There aren&apos;t enough touches for these choices.</Title>
            <p className="mt-3 text-[17px] text-[#d8d1c3]">Choose a different length, or different things to hand.</p>
            {btn("Back to the choices", () => go("length"))}
          </>
        )}

        {stage === "setup" && (
          <>
            <Title kicker={`${giv.name} leads today`}>Set this up for {rec.name}.</Title>
            <p className="mt-3 text-[16px] text-[#d8d1c3]">Only one of you leads, and today it&apos;s you. The one who gives sets up.</p>
            <SetupVideos lang={LANGUAGES.find((l) => l.id === top)?.label ?? ""} />
            <Playlist scores={rec.scores} name={rec.name} />
            {btn("We're ready")}
          </>
        )}

        {stage === "giver" && plan && (
          <>
            <div className="relative mt-5 h-64 overflow-hidden rounded-[28px] border-2" style={{ borderColor: LANG_STYLE[top].color }}>
              <Image src={LANG_STYLE[top].img} alt="" fill priority sizes="600px" className="object-cover" style={{ objectPosition: LANG_STYLE[top].pos }} />
            </div>
            <Title kicker={`${giv.name} gives`}>Set this up for {rec.name}.</Title>
            <Frame id="giver" />
            <Playlist scores={rec.scores} name={rec.name} />
            <SetupVideos collapsed lang={LANGUAGES.find((l) => l.id === top)?.label ?? ""} />
            {needs.length > 0 && (
              <>
                <h2 className="mt-7 font-display text-[22px] font-light">Have ready</h2>
                <ul className="mt-2 list-disc pl-5 text-[16px] text-[#d8d1c3]">{needs.map((n) => <li key={n.id}>{n.label}</li>)}</ul>
              </>
            )}
            {btn("It's ready")}
          </>
        )}
        {stage === "receiver" && (<><Title kicker={`${rec.name} receives`}>You just arrive.</Title><Frame id="receiver" />{btn("Open the doors")}</>)}
        {stage === "open" && <Doors open={open} />}
        {stage === "touchbase" && (
          <>
            <Title kicker="Both of you">Touch Base</Title>
            <div className="mt-6"><SlimPlayer src="/touch-base/touch-base-guided.m4a" label="Touch Base" big /></div>
            {btn("Next")}
          </>
        )}
        {stage === "dyad1" && (<><Title kicker="Warm-up Dyad">Five minutes</Title><Frame id="dyadIn" /><DyadTimer key="d1" prompt={WARM_UP_PROMPT} />{btn("Next")}</>)}
        {stage === "stoplight" && (
          <>
            <Title kicker="Before the touch">Your stoplight</Title>
            <Frame id="stoplight" />
            <div className="mt-6 flex justify-center gap-5" aria-hidden>
              {["#3E9B5F", "#D9952B", "#B5443B"].map((c) => <span key={c} className="h-14 w-14 rounded-full" style={{ background: c, boxShadow: `0 0 30px -4px ${c}` }} />)}
            </div>
            {btn("We're ready")}
          </>
        )}
        {stage === "touch" && plan && (
          <>
            <Title kicker={`${giv.name} gives · ${minutes} minutes`}>{rec.name}&apos;s touch</Title>
            <TouchPlayer key={plan.used.join()} touchDate={plan} onDone={finishTouch} />
          </>
        )}
        {stage === "question" && (
          <>
            <Title kicker="Both of you">One question</Title>
            <div className="mt-5"><OneTouchCardFace prompt="Tell me one thing that landed." /></div>
            {btn("Colour the map")}
          </>
        )}
        {stage === "dyad2" && (<><Title kicker="Integration Dyad">Five minutes</Title><Frame id="closing" /><DyadTimer key="d2" prompt={INTEGRATION_PROMPT} />{btn("Next")}</>)}
        {stage === "ground" && (<><Title kicker="Both of you">Grounding</Title><Frame id="grounding" />{btn("Colour the map")}</>)}

        {stage === "map" && (
          <>
            <Title kicker={rec.name}>Your map</Title>
            {places.length === 0 && <p className="mt-3 text-[16px] text-[#d8d1c3]">{played.length ? "This touch didn't name a place, so there's nothing to colour today." : "No touch played today, so there's nothing to colour."}</p>}
            <div className="mt-4 space-y-4">
              {places.map((a) => (
                <div key={a.id}>
                  <p className="text-[16px]">{a.label}</p>
                  <div className="mt-2 flex gap-2">
                    {ANSWERS.map((ans) => (
                      <button key={ans.id} type="button" aria-pressed={rated[a.id] === ans.id} className="min-h-[44px] flex-1 rounded-full border text-[15px]"
                        style={{ borderColor: ans.color, background: rated[a.id] === ans.id ? ans.color : "transparent" }}
                        onClick={() => {
                          setRated({ ...rated, [a.id]: ans.id });
                          setPerson(r, { entries: [...rec.entries.filter((e) => !(e.area === a.id && e.date === todayStr())), { area: a.id, date: todayStr(), answer: ans.id }] });
                        }}>{ans.short}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              {(["female", "male"] as const).map((b) => (
                <button key={b} type="button" aria-pressed={rec.body === b} onClick={() => setPerson(r, { body: b })}
                  className={`min-h-[40px] rounded-full border px-4 text-[14px] capitalize ${rec.body === b ? "border-[#DDC98E] text-[#DDC98E]" : "border-white/20 text-[#a79f90]"}`}>{b}</button>
              ))}
            </div>
            <div className="mt-3"><BodyMap entries={rec.entries} body={rec.body} /></div>
            {btn("Done")}
          </>
        )}
        {stage === "end" && (
          <>
            <Doors open={false} />
            <Title kicker={`Touch date ${done + 1}`}>The doors close again.</Title>
            <p className="mt-3 text-[17px] text-[#d8d1c3]">Next time, other places{done + 1 === 3 ? ", and up to 15 minutes" : ""}. Maybe it&apos;s {giv.name}&apos;s turn to receive.</p>
            {btn("Do it again", () => { setStartDone(null); setPlan(null); go("who"); })}
          </>
        )}
        {process.env.NODE_ENV === "development" && <p className="mt-16 text-center text-[11px]" aria-hidden style={{ color: Gold, opacity: 0.45 }}>Preview on your computer. Nothing here is live.</p>}
      </div>
      <style>{QUIZ_CSS}</style>
    </main>
  );
}
