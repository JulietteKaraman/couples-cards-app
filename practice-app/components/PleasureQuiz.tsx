"use client";

// The way into the Touch Map (v5, 29 Oct 2026): HER OWN live Touch Reset quiz
// mechanic, the one that already works, not a new one. Six photo touches she
// chose, each felt on a dial (ick, nothing, nice, mmm, goosebumps, toes curl),
// then her four "Quick, don't think" scenes (knot, hairdresser, dance, closet).
// Source: feelfullyyou-site/touch-languages-quiz.html PICS + WIRE (v4 live).
// Scoring is hers too: the four scenes decide, the warmest dial breaks a tie,
// two Shapeshifter answers = Shapeshifter. Benchmarked against the Libido
// Fairy (Hannah) Turn-On Type quiz: concrete scenes beat abstract questions.
// Everything stays on this phone.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, LANG_STYLE, type LanguageId } from "@/lib/content/touch-map";
import { SlimPlayer } from "@/components/SlimPlayer";

// SOUND, 30 Oct 2026, Juliette: "the quiz in the Touch Map doesn't make any sound".
// Same as her website quiz: a soft hum while you turn the dial (it rises as it
// warms), a bell at "toes curl", her voice on the first screen, and a Sound
// on/off switch. Web Audio only, nothing to download.
let AC: AudioContext | null = null;
function ac(): AudioContext | null {
  try {
    if (!AC) AC = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
  } catch { return null; }
  return AC;
}
function bell(fs: number[], vol = 0.09) {
  const a = ac(); if (!a) return;
  const t = a.currentTime;
  fs.forEach((f, k) => {
    const o = a.createOscillator(), G = a.createGain();
    o.type = "sine"; o.frequency.value = f;
    G.gain.setValueAtTime(0.0001, t + k * 0.08);
    G.gain.exponentialRampToValueAtTime(vol, t + k * 0.08 + 0.02);
    G.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.08 + 1.2);
    o.connect(G); G.connect(a.destination); o.start(t + k * 0.08); o.stop(t + k * 0.08 + 1.3);
  });
}

export type Scores = Record<LanguageId, number>;
export function rankLanguages(s: Scores): LanguageId[] {
  return (LANGUAGES.map((l) => l.id) as LanguageId[]).sort((a, b) => s[b] - s[a]);
}

const Q = "/touch-map/quiz/";
const PICS: { img: string; pos?: string; line: [string, string]; pl: LanguageId }[] = [
  { img: "touch-lace-closet-bw.jpg", line: ["Black lace,", "against your skin."], pl: "sexual" },
  { img: "touch-scarf-silk-2.jpg", line: ["Silk,", "sliding slowly across you."], pl: "sensual" },
  { img: "touch-singing-bowl.jpg", line: ["A singing bowl,", "humming over you."], pl: "energetic" },
  { img: "touch-rope-feet.jpg", line: ["Rope,", "wound slowly round your ankles."], pl: "kinky" },
  { img: "touch-alex-behind.jpg", pos: "48% center", line: ["A kiss on your neck,", "from behind."], pl: "sexual" },
  { img: "touch-hand-heart.jpg", line: ["A hand, resting", "on your heart."], pl: "energetic" },
];
const WIRE: { k: string; q: [string, string]; img: string; a: [string, LanguageId][] }[] = [
  { k: "Quick, don't think", q: ["Someone finds the knot", "in your shoulder. You..."], img: "touch-grey-chest.jpg", a: [
    ["melt with a long, slow moan. Take your time.", "sensual"],
    ["groan, and want their hands lower. Now.", "sexual"],
    ["feel it through your whole body before they even press", "energetic"],
    ["want them to press harder, and tell you to stay still", "kinky"],
    ["want all of it. Soft, then deep, then something new.", "shapeshifter"]] },
  { k: "Quick, don't think", q: ["The hairdresser tips your head", "back into the sink."], img: "touch-neck-back.jpg", a: [
    ["I melt into the warm water, the scent, their fingers", "sensual"],
    ["my mind goes straight to bed", "sexual"],
    ["I feel the charge before their hands even land", "energetic"],
    ["I want them to take a fistful and pull, a little", "kinky"],
    ["I want it different every time. Gentle, firm, surprise me.", "shapeshifter"]] },
  { k: "Quick, don't think", q: ["You're dancing. A firm hand on your lower back", "leads you. Your body..."], img: "touch-hand-back.jpg", a: [
    ["loves handing over control", "kinky"],
    ["melts, and savours every slow step", "sensual"],
    ["feels the charge between you before you even move", "energetic"],
    ["wants to skip the dance and go home", "sexual"],
    ["wants to lead one song and follow the next", "shapeshifter"]] },
  { k: "Be honest", q: ["Your partner's closet.", "You're half hoping to find..."], img: "touch-lace-closet-bw.jpg", a: [
    ["rope, a blindfold, something to obey", "kinky"],
    ["candles, oils, feathers, silk", "sensual"],
    ["lingerie, and a toy for two", "sexual"],
    ["singing bowls, and space", "energetic"],
    ["all of it. A different thing every night.", "shapeshifter"]] },
];
// Her running order: three touches, two scenes, three touches, two scenes.
// Same order as her live website quiz (29 Oct): the mirror comes straight after the six touches.
const STEPS: ({ t: "pic"; i: number } | { t: "tap"; i: number } | { t: "mirror" })[] = [
  { t: "pic", i: 0 }, { t: "pic", i: 1 }, { t: "pic", i: 2 }, { t: "tap", i: 0 }, { t: "tap", i: 1 },
  { t: "pic", i: 3 }, { t: "pic", i: 4 }, { t: "pic", i: 5 }, { t: "mirror" }, { t: "tap", i: 2 }, { t: "tap", i: 3 },
];
const NUM = ["None", "One", "Two", "Three", "Four", "Five", "Six"];
// Her mirror, word for word from the website quiz: what her body just told her.
function mirrorLines(vals: (number | null)[]): [string, string, string] {
  let n = 0, low = 0, high = 0, curl = 0;
  vals.forEach((x) => { if (x == null || x < 0) return; n++; if (x < 2 / 6) low++; if (x >= 0.5) high++; if (x >= 5 / 6) curl++; });
  const curlLine = curl ? `${NUM[curl]} made your toes curl.` : "Not one made your toes curl.";
  if (low >= Math.ceil(n / 2)) return [`${NUM[n]} touches.`, `${NUM[low]} barely reached you.`, `${curlLine} This is what your body has been living with.`];
  if (high >= n - 1) return [`${NUM[n]} touches.`, `${NUM[high]} reached you.`, "Imagine touch landing like that every single day."];
  return [`${NUM[n]} touches.`, `${NUM[high]} reached you. ${NUM[n - high]} didn\u2019t.`, `${curlLine} Your body knows what it\u2019s missing.`];
}
const WORDS = ["ick", "nothing", "nice", "mmm", "goosebumps", "toes curl"];
const GOLD = "#DDC98E";

function score(vals: (number | null)[], taps: (LanguageId | null)[]) {
  const s: Scores = { energetic: 0, sensual: 0, sexual: 0, kinky: 0, shapeshifter: 0 };
  taps.forEach((l) => { if (l) s[l] += 1; });
  // her rule: the warmest touch breaks a tie (half a point)
  let best = -1;
  let bk = null as LanguageId | null;
  vals.forEach((v, k) => { if (v != null && v > best) { best = v; bk = PICS[k].pl; } });
  // the dial also feeds the mix a little, so the bar reflects what she felt
  const mix: Scores = { ...s };
  vals.forEach((v, k) => { if (v != null) mix[PICS[k].pl] += v * 0.5; });
  let top: LanguageId;
  if (s.shapeshifter >= 2) top = "shapeshifter";
  else {
    const tie = { ...s, shapeshifter: -1 } as Scores;
    if (bk) tie[bk] += 0.5;
    top = rankLanguages(tie)[0];
    if ((["sensual", "sexual", "kinky", "energetic"] as LanguageId[]).every((k) => s[k] <= 1) && s.shapeshifter === 1) top = "shapeshifter";
  }
  return { top, mix };
}

export function PleasureQuiz({ onDone, onChooseMyself }: { onDone: (langs: LanguageId[], scores: Scores) => void; onChooseMyself: () => void }) {
  const [i, setI] = useState(-1); // -1 intro, 0..9 steps, 10 reading, 11 result
  const [vals, setVals] = useState<(number | null)[]>(PICS.map(() => null));
  const [taps, setTaps] = useState<(LanguageId | null)[]>(WIRE.map(() => null));
  const [v, setV] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const dialRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);
  const buzzed = useRef(false);
  const total = STEPS.length;
  const [sound, setSound] = useState(true);
  const hum = useRef<{ o: OscillatorNode; g: GainNode } | null>(null);
  const humOn = () => {
    if (!sound || hum.current) return;
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 900; o.type = "sine";
    o.connect(f); f.connect(g); g.connect(a.destination);
    g.gain.value = 0.0001; o.start(); g.gain.exponentialRampToValueAtTime(0.06, a.currentTime + 0.15);
    hum.current = { o, g };
  };
  const humOff = () => {
    const h = hum.current, a = AC; if (!h || !a) return;
    h.g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.4);
    setTimeout(() => { try { h.o.stop(); } catch {} }, 450);
    hum.current = null;
  };
  const humPitch = (x: number) => { if (hum.current && AC) hum.current.o.frequency.setTargetAtTime(110 + x * 220, AC.currentTime, 0.05); };
  useEffect(() => () => humOff(), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (i !== total) return;
    const t = setTimeout(() => setI(total + 1), 1800);
    return () => clearTimeout(t);
  }, [i, total]);

  const go = (n: number) => { setV(-1); setPicked(null); buzzed.current = false; setI(n); };

  // ---------- intro ----------
  if (i === -1) {
    return (
      <section className="mt-6">
        <div className="relative h-[460px] overflow-hidden rounded-[30px]">
          <Image src={Q + "touch-alex-behind.jpg"} alt="" fill priority sizes="(max-width: 768px) 100vw, 672px" className="tm-drift object-cover" style={{ objectPosition: "48% center" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">Your way in · about two minutes</p>
            <h1 className="mt-2 font-display text-[38px] font-light leading-[1.05]">What&rsquo;s your Pleasure Language?</h1>
            <p className="mt-3 text-[16px] text-[#f1ece2]/85">Six touches to feel, four quick questions. Go with your body, not your head.</p>
          </div>
        </div>
        <div className="mt-5"><SlimPlayer src="/touch-map/quiz/hear-from-me-first.m4a" label="Hear from me first · 0:22" /></div>
        <p className="mt-3 text-center text-[13px] text-[#8f877a]">Sound on. The dial hums as you turn it.</p>
        <button type="button" onClick={() => go(0)}
          className="mt-6 inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[17px] font-medium text-[#070707] shadow-[0_0_40px_-8px_rgba(221,201,142,0.85)] active:scale-[0.98]">
          Begin
        </button>
        <button type="button" onClick={onChooseMyself} className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center text-[14px] text-[#a79f90] underline underline-offset-4">
          I already know mine
        </button>
      </section>
    );
  }

  // ---------- reading ----------
  if (i === total) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="flex gap-3">
          {LANGUAGES.map((l, n) => <span key={l.id} className="tm-pulse h-4 w-4 rounded-full" style={{ background: LANG_STYLE[l.id].color, animationDelay: `${n * 0.15}s` }} />)}
        </div>
        <p className="mt-6 font-display text-[24px] font-light">Reading what your body told you&hellip;</p>
      </section>
    );
  }

  // ---------- result ----------
  if (i > total) {
    const { top, mix } = score(vals, taps);
    const sum = Math.max(0.001, Object.values(mix).reduce((a, b) => a + b, 0));
    const ranked = rankLanguages(mix).filter((id) => mix[id] > 0);
    const order = [top, ...ranked.filter((x) => x !== top)];
    const lang = LANGUAGES.find((l) => l.id === top)!;
    const st = LANG_STYLE[top];
    const curls = vals.filter((x) => x != null && x >= 5 / 6).length;
    return (
      <section className="mt-6">
        <div className="tm-reveal relative h-[440px] overflow-hidden rounded-[30px] border-2" style={{ borderColor: st.color, boxShadow: `0 0 60px -12px ${st.color}` }}>
          <Image src={st.img} alt="" fill priority sizes="(max-width: 768px) 100vw, 672px" className="tm-drift object-cover" style={{ objectPosition: st.pos }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "#DDC98E" }}>Your Pleasure Language</p>
            <h1 className="mt-1 font-display text-[52px] font-light leading-none">{lang.label}</h1>
            <p className="mt-2 text-[17px] text-[#f1ece2]/90">{lang.line}</p>
          </div>
        </div>
        <p className="mt-5 text-[15px] text-[#cfc8bb]">{curls ? `${["", "One touch", "Two touches", "Three touches", "Four touches", "Five touches", "Six touches"][curls]} made your toes curl.` : "Nothing made your toes curl yet. That's what this map is for."}</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">Your mix</p>
        <div className="mt-3 flex h-4 overflow-hidden rounded-full">
          {order.map((id) => <span key={id} className="tm-grow h-full" style={{ width: `${(mix[id] / sum) * 100}%`, background: LANG_STYLE[id].color }} />)}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {order.map((id) => (
            <span key={id} className="flex items-center gap-1.5 text-[14px]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_STYLE[id].color }} />
              {LANGUAGES.find((x) => x.id === id)!.label} <span className="text-[#8f877a]">{Math.round((mix[id] / sum) * 100)}%</span>
            </span>
          ))}
        </div>
        <button type="button" onClick={() => onDone(order, mix)}
          className="mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-full px-6 font-display text-[17px] font-medium active:scale-[0.98]"
          style={{ background: st.color, color: st.ink }}>
          Open my Touch Map
        </button>
        <button type="button" onClick={() => { setVals(PICS.map(() => null)); setTaps(WIRE.map(() => null)); go(0); }} className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center text-[14px] text-[#a79f90] underline underline-offset-4">Take it again</button>
      </section>
    );
  }

  const step = STEPS[i];
  const bars = (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Back" onClick={() => go(i - 1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DDC98E]/40 bg-[#070707]/40 text-[#DDC98E] backdrop-blur">←</button>
      <div className="flex flex-1 gap-1.5">
        {STEPS.map((_, n) => <span key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n < i ? GOLD : n === i ? "rgba(221,201,142,0.6)" : "rgba(255,255,255,0.18)" }} />)}
      </div>
      <button type="button" onClick={() => { setSound((s) => !s); humOff(); }} className="shrink-0 rounded-full border border-[#DDC98E]/40 bg-[#070707]/40 px-3 py-2 text-[12px] text-[#DDC98E] backdrop-blur">{sound ? "Sound on" : "Sound off"}</button>
    </div>
  );

  // ---------- the mirror ----------
  if (step.t === "mirror") {
    const [h1, h2, sub] = mirrorLines(vals);
    return (
      <section className="relative -mx-5 -mt-2 min-h-[calc(100vh-90px)] overflow-hidden px-5 pt-3" key={`m${i}`}>
        <div className="absolute inset-0">
          <Image src={Q + "touch-grey-chest.jpg"} alt="" fill priority sizes="100vw" className="object-cover" style={{ filter: "grayscale(.6) brightness(.32)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/30 to-[#070707]" />
        </div>
        <div className="relative">{bars}</div>
        <div className="relative mt-[22vh] text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">What your body just told you</p>
          <h2 className="tm-rise mt-3 font-display text-[34px] font-light leading-tight">{h1}<br /><em className="text-[#DDC98E]">{h2}</em></h2>
          <p className="mx-auto mt-4 max-w-[30ch] text-[16px] leading-relaxed text-[#cfc8bb]">{sub}</p>
          <button type="button" onClick={() => go(i + 1)} className="mt-8 inline-flex min-h-[52px] items-center rounded-full border border-[#DDC98E] px-8 text-[13px] uppercase tracking-[0.25em] text-[#DDC98E]">Keep going</button>
        </div>
      </section>
    );
  }

  // ---------- a photo touch on the dial ----------
  if (step.t === "pic") {
    const P = PICS[step.i];
    const w = v < 0 ? -1 : Math.min(5, Math.floor(v * 6));
    const set = (clientX: number, clientY: number) => {
      const r = dialRef.current!.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + (r.height * 150) / 165;
      let a = Math.atan2(cy - clientY, clientX - cx);
      if (a < 0) a = clientX < cx ? Math.PI : 0;
      const nv = Math.max(0, Math.min(1, 1 - a / Math.PI));
      setV(nv);
      humPitch(nv);
      const nw = Math.min(5, Math.floor(nv * 6));
      if (nw === 5 && !buzzed.current) { buzzed.current = true; try { navigator.vibrate?.([18, 40, 18]); } catch {} if (sound) bell([659, 988, 1319]); }
      if (nw < 5) buzzed.current = false;
    };
    return (
      <section className="relative -mx-5 -mt-2 min-h-[calc(100vh-90px)] overflow-hidden px-5 pt-3" key={`p${i}`}>
        <div className="absolute inset-0">
          <Image src={Q + P.img} alt="" fill priority sizes="100vw" className="object-cover transition-all duration-300"
            style={{ objectPosition: P.pos ?? "center", filter: `grayscale(${0.85 - Math.max(v, 0) * 0.6}) brightness(${0.32 + Math.max(v, 0) * 0.42}) sepia(${Math.max(v, 0) * 0.45})`, transform: `scale(${1.04 + Math.max(v, 0) * 0.06})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/60" />
          <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `radial-gradient(60% 60% at 50% 100%, rgba(221,201,142,${Math.max(v, 0) * 0.45}), transparent)` }} />
        </div>
        <div className="relative">{bars}</div>
        <div className="relative mt-[22vh] text-center">
          <h2 className="tm-rise font-display text-[34px] font-light leading-tight">{P.line[0]}<br /><em className="text-[#DDC98E]">{P.line[1]}</em></h2>
          <p className="mt-2 text-[14px] text-[#cfc8bb]">How does it feel? Drag the dial.</p>
        </div>
        <div className="relative mx-auto mt-6 w-[300px] max-w-full select-none touch-none"
          onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); humOn(); set(e.clientX, e.clientY); }}
          onPointerMove={(e) => { if (dragging.current) set(e.clientX, e.clientY); }}
          onPointerUp={() => { dragging.current = false; humOff(); }} onPointerCancel={() => { dragging.current = false; humOff(); }}>
          <svg ref={dialRef} viewBox="0 0 300 165" className="w-full">
            <path d="M20 150 A130 130 0 0 1 280 150" fill="none" stroke="rgba(221,201,142,0.25)" strokeWidth="14" strokeLinecap="round" />
            <path d="M20 150 A130 130 0 0 1 280 150" fill="none" stroke={GOLD} strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${Math.max(v, 0) * 100} 100`} />
            <g transform={`rotate(${-90 + Math.max(v, 0) * 180} 150 150)`}>
              <line x1="150" y1="150" x2="150" y2="34" stroke="#f1ece2" strokeWidth="3" strokeLinecap="round" />
              <circle cx="150" cy="34" r="11" fill={GOLD} />
            </g>
            <circle cx="150" cy="150" r="7" fill="#f1ece2" />
          </svg>
          <p className={`-mt-2 text-center font-display text-[30px] font-light ${w >= 4 ? "text-[#EEDE80]" : "text-[#f1ece2]"}`}>{w >= 0 ? WORDS[w] : " "}</p>
        </div>
        <div className="relative mt-4 flex justify-center pb-8">
          <button type="button" disabled={v < 0}
            onClick={() => { setVals((p) => { const n = [...p]; n[step.i] = v; return n; }); go(i + 1); }}
            className="inline-flex min-h-[52px] items-center rounded-full bg-[#DDC98E] px-9 font-display text-[16px] font-medium text-[#070707] transition disabled:opacity-0">
            Next
          </button>
        </div>
      </section>
    );
  }

  // ---------- a scene question ----------
  const W = WIRE[step.i];
  return (
    <section className="relative -mx-5 -mt-2 min-h-[calc(100vh-90px)] overflow-hidden px-5 pt-3" key={`t${i}`}>
      <div className="absolute inset-0">
        <Image src={Q + W.img} alt="" fill priority sizes="100vw" className="object-cover" style={{ filter: "grayscale(.6) brightness(.35)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/60 via-[#070707]/40 to-[#070707]" />
      </div>
      <div className="relative">{bars}</div>
      <div className="relative mt-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">{W.k}</p>
        <h2 className="tm-rise mt-2 font-display text-[30px] font-light leading-[1.15]">{W.q[0]}<br /><em className="text-[#DDC98E]">{W.q[1]}</em></h2>
        <div className="mt-7 space-y-2.5 pb-8">
          {W.a.map(([text, l], n) => {
            const st = LANG_STYLE[l];
            const on = picked === n;
            return (
              <button key={n} type="button"
                onClick={() => { if (picked !== null) return; setPicked(n); try { navigator.vibrate?.(8); } catch {} setTaps((p) => { const c = [...p]; c[step.i] = l; return c; }); setTimeout(() => go(i + 1), 450); }}
                className="tm-rise block w-full rounded-2xl border-[1.5px] px-5 py-4 text-left text-[17px] leading-snug backdrop-blur-sm transition-all duration-200 active:scale-[0.98]"
                style={{ animationDelay: `${n * 55}ms`, borderColor: on ? st.color : "rgba(221,201,142,0.3)", background: on ? st.color : "rgba(7,7,7,0.45)", color: on ? st.ink : "#f1ece2" }}>
                {text}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const QUIZ_CSS = `
  @keyframes tmRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  .tm-rise { animation: tmRise .45s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes tmGrow { from { width: 0; } }
  .tm-grow { animation: tmGrow 1s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes tmPulse { 0%,100% { transform: scale(.7); opacity: .5; } 50% { transform: scale(1.25); opacity: 1; } }
  .tm-pulse { animation: tmPulse 1s ease-in-out infinite; }
  @keyframes tmReveal { from { opacity: 0; transform: scale(.94); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
  .tm-reveal { animation: tmReveal .8s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes tmDrift { from { transform: scale(1.02); } to { transform: scale(1.1); } }
  .tm-drift { animation: tmDrift 14s ease-in-out infinite alternate; }
  @media (prefers-reduced-motion: reduce) { .tm-rise, .tm-grow, .tm-pulse, .tm-reveal, .tm-drift { animation: none; } }
`;
