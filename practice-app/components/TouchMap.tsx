"use client";

// The Touch Map, version 1 pieces (spec: APP builds/specs/touch-map.md).
// Her map is the most private thing she buys, so everything here lives on
// this phone only (spec R0e). Nothing about her body is sent anywhere.

import { useEffect, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import {
  AREAS, ANSWERS, TOUCHES, WHAT_HAPPENED, WH_AUDIO, NEXT_LINE, SCRIPTS, recipeLine,
  PLACES, STEERS, LANDED, steerRecipeLine, TM_AUDIO,
  type Answer, type View, type Place,
} from "@/lib/content/touch-map";

export const GOLD = "#DDC98E";

// ---------- storage (this phone only) ----------
export type MapEntry = {
  area: string;
  date: string; // YYYY-MM-DD
  preferred?: "A" | "B";
  answer?: Answer;
  partial?: boolean; // E2: left mid-area
  step?: "A" | "B" | "choose" | "answer" | "first" | "steer" | "second";
  // THE STEER (29 Oct)
  place?: string;
  steers?: string[];
  landed?: string;
};
export type MapState = {
  introSeen?: boolean;
  wristDone?: boolean;
  wristRating?: number;
  body?: "female" | "male";
  entries: MapEntry[];
  touches: Record<string, number>; // date -> touches done that day (max 2)
};

export const todayStr = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};
const empty = (): MapState => ({ entries: [], touches: {} });

export function useMapState(key: string) {
  const [state, setState] = useState<MapState | null>(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      setState(v && Array.isArray(v.entries) ? { ...empty(), ...v } : empty());
    } catch { setState(empty()); }
  }, [key]);
  const save = (next: MapState) => {
    setState(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [state, save] as const;
}

// Latest finished entry per area (redos keep the old ones, E9).
export function latestByArea(entries: MapEntry[]): Record<string, MapEntry> {
  const out: Record<string, MapEntry> = {};
  for (const e of entries) if (!e.partial && e.answer) out[e.area] = e;
  return out;
}

// ---------- the body map ----------
type Shape = { kind: "rect"; x: number; y: number; w: number; h: number; r?: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { kind: "poly"; pts: string };

// Coordinates on her own drawings (777 x 1100). Mirror for the right side.
const m = (pts: [number, number][]) => pts.map(([x, y]) => `${480 - x},${y}`).join(" ");
const p = (pts: [number, number][]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
const L_OUTER: [number, number][] = [[112, 250], [132, 250], [118, 450], [84, 572], [70, 568], [96, 450]];
const L_INNER: [number, number][] = [[132, 250], [158, 262], [148, 450], [122, 575], [86, 572], [118, 450]];
const L_FORE: [number, number][] = [[98, 405], [142, 412], [118, 565], [66, 560]];
const L_THIGH: [number, number][] = [[148, 515], [236, 575], [228, 830], [160, 830]];
const L_BTHIGH: [number, number][] = [[140, 548], [236, 548], [230, 800], [155, 800]];
const L_CALF: [number, number][] = [[152, 800], [232, 800], [222, 1060], [168, 1060]];

const SHAPES: Record<string, Shape[]> = {
  "face-scalp": [{ kind: "ellipse", cx: 240, cy: 122, rx: 40, ry: 64 }],
  "throat-neck": [{ kind: "rect", x: 214, y: 186, w: 52, h: 48, r: 12 }],
  "collarbone-shoulders": [{ kind: "rect", x: 128, y: 224, w: 226, h: 40, r: 18 }],
  "chest-heart": [{ kind: "rect", x: 160, y: 266, w: 170, h: 104, r: 30 }],
  "belly-ribs": [{ kind: "rect", x: 166, y: 372, w: 156, h: 126, r: 26 }],
  "hips-lower-belly": [{ kind: "poly", pts: p([[150, 500], [330, 500], [318, 535], [244, 578], [236, 578], [160, 535]]) }],
  "outer-arms": [{ kind: "poly", pts: p(L_OUTER) }, { kind: "poly", pts: m(L_OUTER) }],
  "inner-arms": [{ kind: "poly", pts: p(L_INNER) }, { kind: "poly", pts: m(L_INNER) }],
  "hands-wrists": [{ kind: "ellipse", cx: 74, cy: 618, rx: 34, ry: 56 }, { kind: "ellipse", cx: 412, cy: 618, rx: 34, ry: 56 }],
  thighs: [{ kind: "poly", pts: p(L_THIGH) }, { kind: "poly", pts: m(L_THIGH) }],
  "back-of-head": [{ kind: "ellipse", cx: 240, cy: 102, rx: 42, ry: 66 }],
  nape: [{ kind: "rect", x: 214, y: 158, w: 52, h: 40, r: 12 }],
  "shoulders-traps": [{ kind: "rect", x: 128, y: 196, w: 226, h: 40, r: 18 }],
  "shoulder-blades": [{ kind: "rect", x: 146, y: 238, w: 190, h: 96, r: 30 }],
  "spine-mid-back": [{ kind: "rect", x: 166, y: 336, w: 150, h: 64, r: 20 }],
  "lower-back-sacrum": [{ kind: "rect", x: 162, y: 402, w: 158, h: 52, r: 20 }],
  "backs-of-arms": [{ kind: "poly", pts: p([[104, 222], [152, 222], [142, 405], [98, 400]]) }, { kind: "poly", pts: m([[104, 222], [152, 222], [142, 405], [98, 400]]) }],
  "elbows-forearms": [{ kind: "poly", pts: p(L_FORE) }, { kind: "poly", pts: m(L_FORE) }],
  "backs-of-thighs": [{ kind: "poly", pts: p(L_BTHIGH) }, { kind: "poly", pts: m(L_BTHIGH) }],
  "calves-soles": [{ kind: "poly", pts: p(L_CALF) }, { kind: "poly", pts: m(L_CALF) }],
};

const colourOf = (a?: Answer) => ANSWERS.find((x) => x.id === a)?.color;

function Figure({ view, body, filled, active }: {
  view: View; body: "female" | "male"; filled: Record<string, MapEntry>; active?: string;
}) {
  const img = view === "back" ? "/touch-map/touch-map-unisex-back.png" : body === "male" ? "/touch-map/touch-map-male-front.png" : "/touch-map/touch-map-female-front.png";
  const areas = AREAS.filter((a) => a.view === view);
  return (
    <figure className="relative">
      <svg viewBox="20 30 460 1050" className="block h-auto w-full" role="img" aria-label={`Your map, ${view}`}>
        <g className="tm-lines">
          <image href={img} x="0" y="0" width="777" height="1100" />
          {/* hide the drawing's own FRONT / BACK label, we caption it ourselves */}
          <rect x="340" y="40" width="200" height="90" fill="#fff" />
        </g>
        {areas.map((a) => {
          const c = colourOf(filled[a.id]?.answer);
          const strong = filled[a.id]?.answer === "yes";
          const isActive = active === a.id;
          return (SHAPES[a.id] || []).map((s, i) => {
            const k = `${a.id}-${i}`;
            const common = {
              fill: c ?? (isActive ? GOLD : "transparent"),
              fillOpacity: c ? 0.62 : isActive ? 0.28 : 0,
              stroke: isActive ? GOLD : "none",
              strokeWidth: isActive ? 4 : 0,
              className: strong ? "tm-glow" : undefined,
            };
            if (s.kind === "rect") return <rect key={k} {...common} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r ?? 0} />;
            if (s.kind === "ellipse") return <ellipse key={k} {...common} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />;
            return <polygon key={k} {...common} points={s.pts} />;
          });
        })}
      </svg>
      <figcaption className="mt-1 text-center text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">{view}</figcaption>
    </figure>
  );
}

export function BodyMap({ entries, body = "female", active }: { entries: MapEntry[]; body?: "female" | "male"; active?: string }) {
  const filled = latestByArea(entries);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#DDC98E]/30 bg-[#0b0b0a] p-3">
        <Figure view="front" body={body} filled={filled} active={active} />
        <Figure view="back" body={body} filled={filled} active={active} />
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-[13px] text-[#cfc8bb]">
        {ANSWERS.map((a) => (
          <span key={a.id} className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: a.color }} />{a.label}</span>
        ))}
      </div>
      <style>{`
        .tm-lines { filter: invert(0.9) sepia(0.25); }
        @keyframes tmGlow { 0%,100% { opacity: .62 } 50% { opacity: .85 } }
        .tm-glow { animation: tmGlow 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tm-glow { animation: none; } }
      `}</style>
    </div>
  );
}

// ---------- her voice, or the words if there's no sound (E4, E8) ----------
export function Voice({ src, label, script }: { src: string | null; label: string; script?: string[] }) {
  const [open, setOpen] = useState(false);
  // No recording yet: show her words straight away, never a placeholder.
  if (!src) {
    return script && script.length > 0 ? (
      <div className="mt-4 space-y-2 rounded-2xl bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2]">
        {script.map((l, i) => <p key={i}>{l}</p>)}
      </div>
    ) : null;
  }
  return (
    <div className="mt-4">
      <VoicePlayer src={src} label={label} dark />
      {script && script.length > 0 && (
        <div className="mt-2">
          <button type="button" onClick={() => setOpen(!open)} className="min-h-[44px] text-[14px] text-[#DDC98E] underline underline-offset-4">
            {open ? "Hide the words" : "Can't use sound? Read it"}
          </button>
          {open && (
            <div className="mt-2 space-y-2 rounded-2xl bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2]">
              {script.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- one touch, with "What happened?" (R9) ----------
export function TouchStep({ which, areaLabel, onDone }: { which: "A" | "B"; areaLabel: string; onDone: () => void }) {
  const t = TOUCHES[which];
  const [picked, setPicked] = useState<string | null>(null);
  const wh = WHAT_HAPPENED.find((w) => w.id === picked);
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 bg-[rgba(13,53,53,0.35)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{t.name} · {t.language} · {areaLabel}</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{t.title}</h2>
      {"needs" in t && <p className="mt-1 text-[14px] text-[#a79f90]">You&rsquo;ll need: {t.needs.toLowerCase()}.</p>}
      <Voice src={null} label={`${t.name}, about 45 seconds`} script={[...t.lines]} />

      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">What happened?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {WHAT_HAPPENED.map((w) => (
          <button key={w.id} type="button" onClick={() => setPicked(w.id)}
            className={`min-h-[44px] rounded-full border px-4 text-[14px] ${picked === w.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`}>
            {w.label}
          </button>
        ))}
      </div>
      {wh && (
        <div className="mt-3">
          <Voice src={WH_AUDIO[wh.id]} label={wh.label} />
          <p className="mt-3 text-[15px] text-[#f1ece2]">{NEXT_LINE[wh.next]}</p>
        </div>
      )}
      <button type="button" onClick={onDone}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] sm:w-auto">
        {which === "A" ? "Done, on to Touch B" : "Done"}
      </button>
    </section>
  );
}

// ---------- which one, then yes / maybe / no ----------
export function ChooseAB({ onPick }: { onPick: (w: "A" | "B") => void }) {
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 p-5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Which one did it want more of?</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(["A", "B"] as const).map((w) => (
          <button key={w} type="button" onClick={() => onPick(w)}
            className="min-h-[88px] rounded-2xl border-[1.5px] border-[#DDC98E]/50 bg-[rgba(13,53,53,0.45)] px-3 text-[#f1ece2]">
            <span className="block font-display text-[22px]">{TOUCHES[w].name}</span>
            <span className="block text-[13px] text-[#a79f90]">{TOUCHES[w].title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function YesMaybeNo({ preferred, onAnswer }: { preferred: "A" | "B"; onAnswer: (a: Answer) => void }) {
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 p-5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{TOUCHES[preferred].name}, {TOUCHES[preferred].title.toLowerCase()}. Is it a yes?</p>
      <div className="mt-4 grid gap-2">
        {ANSWERS.map((a) => (
          <button key={a.id} type="button" onClick={() => onAnswer(a.id)}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border-[1.5px] text-[16px] text-[#f1ece2]"
            style={{ borderColor: a.color, background: `${a.color}22` }}>
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: a.color }} />{a.label}
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------- the Full Stop (any NO) ----------
export function FullStop({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#B5443B]/60 bg-[rgba(181,68,59,0.12)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e9b3ad]">The Full Stop</p>
      <Voice src={TM_AUDIO.fullStop} label="The Full Stop" script={SCRIPTS.fullStop} />
      <button type="button" onClick={onContinue}
        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[#DDC98E] px-6 text-[15px] text-[#f1ece2] sm:w-auto">
        Colour it in
      </button>
    </section>
  );
}

// ---------- her Touch Recipe (R11) ----------
export function Recipe({ entries }: { entries: MapEntry[] }) {
  const latest = latestByArea(entries);
  const byPlace: Record<string, MapEntry> = {};
  for (const e of entries) if (!e.partial && e.answer && e.place) byPlace[e.place] = e;
  const steerLines = PLACES.filter((p) => byPlace[p.id]).map((p) => {
    const e = byPlace[p.id];
    return { id: p.id, text: steerRecipeLine(p.label.replace(/^Your /, "").replace(/^./, (c) => c.toUpperCase()), e.steers ?? [], e.answer!), color: colourOf(e.answer)!, date: e.date };
  });
  const areaLines = AREAS.filter((a) => latest[a.id] && !latest[a.id].place).map((a) => {
    const e = latest[a.id];
    return { id: a.id, text: recipeLine(a.label, e.preferred ?? "A", e.answer!), color: colourOf(e.answer)!, date: e.date };
  });
  const lines = [...steerLines, ...areaLines];

  const saveImage = () => {
    const W = 1080, pad = 70, lh = 46;
    const c = document.createElement("canvas");
    c.width = W; c.height = Math.max(700, 260 + lines.length * lh * 2.2);
    const g = c.getContext("2d"); if (!g) return;
    g.fillStyle = "#070707"; g.fillRect(0, 0, W, c.height);
    g.fillStyle = GOLD; g.font = "500 30px Poppins, sans-serif"; g.fillText("MY TOUCH RECIPE", pad, 110);
    g.font = "300 26px Inter, sans-serif"; g.fillStyle = "#a79f90"; g.fillText("The Touch Map · Juliette Karaman", pad, 155);
    let y = 240;
    g.font = "400 30px Inter, sans-serif";
    for (const l of lines) {
      g.fillStyle = l.color; g.beginPath(); g.arc(pad + 10, y - 10, 10, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#f1ece2";
      const words = l.text.split(" "); let line = "";
      for (const w of words) {
        if (g.measureText(line + w).width > W - pad * 2 - 40) { g.fillText(line, pad + 36, y); y += lh; line = ""; }
        line += w + " ";
      }
      g.fillText(line, pad + 36, y); y += lh * 1.4;
    }
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png"); a.download = "my-touch-recipe.png"; a.click();
  };

  return (
    <section id="tm-recipe" className="rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.55)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">My Touch Recipe</p>
      {lines.length === 0 ? (
        <p className="mt-3 text-[15px] text-[#a79f90]">Your first area adds the first line.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-3 text-[16px] leading-snug text-[#f1ece2]">
              <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: l.color }} />
              <span>{l.text} <span className="text-[12px] text-[#8f877a]">{l.date ? new Date(l.date + "T12:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}</span></span>
            </li>
          ))}
        </ul>
      )}
      {lines.length > 0 && (
        <div className="tm-noprint mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={saveImage} className="min-h-[44px] rounded-full border border-[#DDC98E] px-5 text-[14px] text-[#f1ece2]">Save as image</button>
          <button type="button" onClick={() => window.print()} className="min-h-[44px] rounded-full border border-[#DDC98E] px-5 text-[14px] text-[#f1ece2]">Save as PDF</button>
        </div>
      )}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #tm-recipe, #tm-recipe * { visibility: visible; }
          #tm-recipe { position: absolute; inset: 0; background: #fff !important; border: none; }
          #tm-recipe li, #tm-recipe p { color: #070707 !important; }
          .tm-noprint { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ---------- THE STEER (29 Oct) ----------
export function PlaceClip({ src, label, poster }: { src: string | null; label: string; poster?: string }) {
  if (!src) return null; // never show an empty video box to a buyer
  return (
    <video src={src} poster={poster} controls playsInline preload="metadata" aria-label={label}
      className="mt-5 block h-auto w-full rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-black" />
  );
}

export function FirstTouch({ place, onDone }: { place: Place; onDone: () => void }) {
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 bg-[rgba(13,53,53,0.35)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Touch 1 · as it comes</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{place.label}</h2>
      <Voice src={place.audio} label="Touch 1" script={place.touch} />
      <button type="button" onClick={onDone}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] sm:w-auto">
        Done, now steer it
      </button>
    </section>
  );
}

export function SteerTouch({ place, onDone }: { place: Place; onDone: (steers: string[]) => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 bg-[rgba(13,53,53,0.35)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Touch 2 · the steer</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{place.label}, steered</h2>
      <Voice src={TM_AUDIO.steerIntro} label="The steer, about 45 seconds" script={SCRIPTS.steerIntro} />
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Tap the words you used</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {STEERS.map((s) => (
          <button key={s} type="button" onClick={() => toggle(s)}
            className={`min-h-[44px] rounded-full border px-4 text-[15px] ${picked.includes(s) ? "border-[#DDC98E] bg-[rgba(221,201,142,0.2)] text-[#f1ece2]" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`}>
            {s}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onDone(picked)}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] sm:w-auto">
        It landed
      </button>
    </section>
  );
}

export function Frisson({ onAnswer }: { onAnswer: (a: Answer, landed: string) => void }) {
  const [landed, setLanded] = useState<string>("");
  return (
    <section className="mt-6 rounded-3xl border-[1.5px] border-[#DDC98E]/45 p-5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">How did it land?</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {LANDED.map((l) => (
          <button key={l.id} type="button" onClick={() => setLanded(l.id)}
            className={`min-h-[44px] rounded-full border px-4 text-[15px] ${landed === l.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.2)] text-[#f1ece2]" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`}>
            {l.label}
          </button>
        ))}
      </div>
      <h3 className="mt-6 font-display text-[24px] font-light">Did that add a little frisson?</h3>
      <div className="mt-4 grid gap-2">
        {ANSWERS.map((a) => (
          <button key={a.id} type="button" onClick={() => onAnswer(a.id, landed)}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border-[1.5px] text-[16px] text-[#f1ece2]"
            style={{ borderColor: a.color, background: `${a.color}22` }}>
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: a.color }} />{a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
