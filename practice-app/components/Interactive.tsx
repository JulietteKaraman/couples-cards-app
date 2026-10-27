"use client";

// Interactive blocks for the guides (27 Oct 2026), after Juliette asked for
// the app to be "really interactive and just fun" like the buyer-page hubs.
// Every word shown comes from the guide itself: these only change HOW it is
// met (flip, tick, copy, choose, write), never what it says. Everything a
// reader taps or writes saves on this phone.

import { useEffect, useState } from "react";

const GOLD = "#DDC98E";

function useSaved<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ffy.i." + key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
  }, [key]);
  const save = (nv: T) => {
    setV(nv);
    try { localStorage.setItem("ffy.i." + key, JSON.stringify(nv)); } catch {}
  };
  return [v, save];
}

const Glow = () => (
  <style>{`@keyframes ffyglow{0%{box-shadow:0 0 0 0 rgba(221,201,142,.7)}100%{box-shadow:0 0 0 18px rgba(221,201,142,0)}}.ffy-glow{animation:ffyglow .9s ease-out 1}`}</style>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>{children}</p>
);

/* Tap to turn a card over; optionally mark the ones that land. */
export function FlipCards({ k, prompt, markLabel, summaryLabel, cards }: {
  k: string; prompt?: string; markLabel?: string; summaryLabel?: string;
  cards: { front: string; back: string; sub?: string; subLabel?: string }[];
}) {
  const [open, setOpen] = useState<number[]>([]);
  const [marked, setMarked] = useSaved<number[]>(k, []);
  const [pulse, setPulse] = useState(-1);
  return (
    <div className="my-8">
      <Glow />
      {prompt && <Label>{prompt}</Label>}
      <div className="grid gap-3">
        {cards.map((c, i) => {
          const isOpen = open.includes(i);
          const isMarked = marked.includes(i);
          return (
            <div key={i} className={`overflow-hidden rounded-[18px] border transition ${isMarked ? "border-[#DDC98E]" : "border-[#DDC98E]/25"} ${isOpen ? "bg-[#0D3535]/55" : "bg-white/[0.04]"}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? open.filter((x) => x !== i) : [...open, i])}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-display text-[19px] leading-snug text-[#f1ece2]">{c.front}</span>
                <span className="shrink-0 text-xs uppercase tracking-[0.14em]" style={{ color: GOLD }}>{isOpen ? "Close" : "Turn over"}</span>
              </button>
              {isOpen && (
                <div className="border-t border-[#DDC98E]/20 px-5 pb-5 pt-4">
                  <p className="font-display text-[18px] italic leading-snug" style={{ color: GOLD }}>{c.back}</p>
                  {c.sub && (
                    <p className="mt-3 text-[15px] text-[#a79f90]">
                      {c.subLabel && <span className="mr-1.5 text-[11px] uppercase tracking-[0.14em] text-[#a79f90]/80">{c.subLabel}</span>}
                      {c.sub}
                    </p>
                  )}
                  {markLabel && (
                    <button
                      type="button"
                      onClick={() => { setMarked(isMarked ? marked.filter((x) => x !== i) : [...marked, i]); setPulse(i); }}
                      className={`mt-4 rounded-full border px-4 py-2 text-sm font-medium ${isMarked ? "border-[#DDC98E] bg-[#DDC98E] text-[#1a1814]" : "border-[#DDC98E] text-[#DDC98E]"} ${pulse === i ? "ffy-glow" : ""}`}
                    >
                      {isMarked ? `✓ ${markLabel}` : markLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {markLabel && marked.length > 0 && (summaryLabel ? (
        <div className="mt-4 rounded-[16px] border border-[#DDC98E] bg-[#0D3535]/40 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>{summaryLabel}</p>
          {marked.map((m) => cards[m] && <p key={m} className="mt-1.5 font-display text-[20px] italic text-[#f1ece2]">{cards[m].front}</p>)}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#a79f90]">{marked.length} marked. They stay marked on this phone.</p>
      ))}
    </div>
  );
}

/* A checklist that remembers. */
export function TapCheck({ k, label, items, done }: { k: string; label: string; items: string[]; done?: string }) {
  const [on, setOn] = useSaved<number[]>(k, []);
  const [pulse, setPulse] = useState(-1);
  const all = items.length > 0 && items.every((_, i) => on.includes(i));
  return (
    <div className="my-8">
      <Glow />
      <Label>{label}</Label>
      <div className="grid gap-2.5">
        {items.map((t, i) => {
          const isOn = on.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setOn(isOn ? on.filter((x) => x !== i) : [...on, i]); setPulse(i); }}
              className={`flex w-full items-start gap-3.5 rounded-[14px] border bg-white/[0.04] p-3.5 text-left text-[16px] leading-relaxed ${isOn ? "border-[#DDC98E]/70" : "border-[#DDC98E]/25"}`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-[1.5px] border-[#DDC98E] text-sm ${isOn ? "bg-[#DDC98E] text-[#1a1814]" : ""} ${pulse === i && isOn ? "ffy-glow" : ""}`}>{isOn ? "✓" : ""}</span>
              <span className={isOn ? "text-[#f1ece2]/70" : "text-[#f1ece2]"}>{t}</span>
            </button>
          );
        })}
      </div>
      {done && all && <p className="mt-4 font-display text-[21px]" style={{ color: GOLD }}>{done}</p>}
    </div>
  );
}

/* Lines with a copy button each. */
export function CopyLines({ label, lines }: { label: string; lines: string[] }) {
  const [copied, setCopied] = useState(-1);
  return (
    <div className="my-8">
      <Label>{label}</Label>
      <div className="grid gap-2.5">
        {lines.map((t, i) => (
          <div key={i} className="rounded-[14px] border border-[#DDC98E]/25 bg-white/[0.04] p-4">
            <p className="font-display text-[18px] italic leading-snug text-[#f1ece2]">{t}</p>
            <button
              type="button"
              onClick={() => { try { navigator.clipboard.writeText(t.replace(/^[“"]|[”"]$/g, "")); } catch {} setCopied(i); setTimeout(() => setCopied(-1), 1600); }}
              className="mt-3 rounded-full border border-[#DDC98E] px-4 py-1.5 text-sm font-medium text-[#DDC98E]"
            >
              {copied === i ? "Copied ✓" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Pick what happened, see what to do. */
export function Choice({ k, label, options }: { k: string; label: string; options: { label: string; lines: string[] }[] }) {
  const [pick, setPick] = useSaved<number>(k, -1);
  return (
    <div className="my-8">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPick(i)}
            className={`min-w-[140px] flex-1 rounded-[16px] border px-4 py-4 font-display text-[17px] ${pick === i ? "border-[#DDC98E] text-[#DDC98E] shadow-[0_0_0_1px_#DDC98E]" : "border-[#DDC98E]/25 bg-white/[0.04] text-[#f1ece2]"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {pick >= 0 && options[pick] && (
        <div className="mt-4 rounded-[16px] border-l-2 border-[#DDC98E] bg-[#0D3535]/40 py-3 pl-4 pr-3">
          {options[pick].lines.map((t, i) => (
            <p key={i} className="my-1.5 text-[17px] leading-relaxed text-[#f1ece2]">{t}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* Tap one to choose it. */
export function PickOne({ k, label, items, chosenLabel }: { k: string; label: string; items: string[]; chosenLabel: string }) {
  const [pick, setPick] = useSaved<number>(k, -1);
  return (
    <div className="my-8">
      <Label>{label}</Label>
      <div className="grid gap-2.5">
        {items.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPick(pick === i ? -1 : i)}
            className={`rounded-[14px] border p-4 text-left font-display text-[18px] leading-snug ${pick === i ? "border-[#DDC98E] bg-[#0D3535]/55 text-[#DDC98E]" : "border-[#DDC98E]/25 bg-white/[0.04] text-[#f1ece2]"}`}
          >
            {pick === i && <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em]">{chosenLabel}</span>}
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Write something down; it stays on this phone with the date. */
export function Journal({ k, label, placeholder }: { k: string; label: string; placeholder?: string }) {
  const [list, setList] = useSaved<{ t: string; d: string }[]>(k, []);
  const [txt, setTxt] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <div className="my-8">
      <Glow />
      <Label>{label}</Label>
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-y rounded-[14px] border border-[#DDC98E]/25 bg-[#1a1814] p-4 font-display text-[18px] italic text-[#f1ece2] placeholder:text-[#a79f90]/70"
      />
      <button
        type="button"
        onClick={() => {
          const t = txt.trim(); if (!t) return;
          setList([...list, { t, d: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }) }]);
          setTxt(""); setSaved(true); setTimeout(() => setSaved(false), 1500);
        }}
        className={`mt-2.5 rounded-full border border-[#DDC98E] px-5 py-2.5 text-sm font-medium text-[#DDC98E] ${saved ? "ffy-glow" : ""}`}
      >
        {saved ? "Saved ✓" : "Save it"}
      </button>
      {list.length > 0 && (
        <div className="mt-4 grid gap-2">
          {[...list].reverse().map((e, i) => (
            <div key={i} className="border-l-2 border-[#DDC98E] py-1.5 pl-3.5 font-display text-[17px] italic text-[#f1ece2]">
              {e.t}
              <span className="mt-0.5 block font-sans text-xs not-italic text-[#a79f90]">{e.d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* A one-at-a-time sorting game: which pile does this line belong in? */
export function SortGame({ label, a, b, items, end }: {
  label: string; a: { label: string; line: string }; b: { label: string; line: string };
  items: { text: string; side: "a" | "b" }[]; end?: string;
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<"a" | "b" | null>(null);
  const [score, setScore] = useState(0);
  const finished = i >= items.length;
  const it = items[Math.min(i, items.length - 1)];
  return (
    <div className="my-8 rounded-[22px] border border-[#DDC98E]/40 bg-gradient-to-b from-[#0D3535]/55 to-[#211e19] p-5">
      <Glow />
      <Label>{label}</Label>
      {!finished ? (
        <>
          <p className="text-xs uppercase tracking-[0.16em] text-[#a79f90]">{i + 1} of {items.length}</p>
          <p className="mt-3 min-h-[64px] font-display text-[23px] italic leading-snug text-[#f1ece2]">{it.text}</p>
          {!pick ? (
            <div className="mt-4 flex gap-2.5">
              {(["a", "b"] as const).map((s) => (
                <button key={s} type="button"
                  onClick={() => { setPick(s); if (s === it.side) setScore(score + 1); }}
                  className="flex-1 rounded-full border border-[#DDC98E] px-4 py-3.5 font-display text-[17px] font-medium text-[#DDC98E]">
                  {s === "a" ? a.label : b.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <p className={`font-display text-[19px] ${pick === it.side ? "text-[#DDC98E]" : "text-[#f1ece2]"}`}>
                {pick === it.side ? `Yes. ${it.side === "a" ? a.label : b.label}.` : `This one is ${(it.side === "a" ? a.label : b.label).toLowerCase()}.`}
              </p>
              <p className="mt-2 text-[16px] leading-relaxed text-[#a79f90]">{it.side === "a" ? a.line : b.line}</p>
              <button type="button" onClick={() => { setPick(null); setI(i + 1); }}
                className="mt-4 rounded-full bg-[#DDC98E] px-6 py-3 font-display text-[16px] font-medium text-[#1a1814]">
                {i + 1 < items.length ? "Next →" : "See how you did →"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="font-display text-[34px] text-[#DDC98E] ffy-glow inline-block rounded-full px-4">{score} of {items.length}</p>
          {end && <p className="mt-3 font-display text-[20px] text-[#f1ece2]">{end}</p>}
          <button type="button" onClick={() => { setI(0); setScore(0); setPick(null); }}
            className="mt-4 rounded-full border border-[#DDC98E] px-5 py-2.5 text-sm font-medium text-[#DDC98E]">Play again</button>
        </div>
      )}
    </div>
  );
}

/* One text box that keeps what he typed on this phone. */
export function Draft({ k, label, placeholder }: { k: string; label: string; placeholder?: string }) {
  const [v, setV] = useSaved<string>(k, "");
  return (
    <div className="my-8">
      <Label>{label}</Label>
      <textarea value={v} onChange={(e) => setV(e.target.value)} rows={3} placeholder={placeholder}
        className="w-full resize-y rounded-[14px] border border-[#DDC98E]/25 bg-[#1a1814] p-4 font-display text-[18px] italic text-[#f1ece2] placeholder:text-[#a79f90]/70" />
    </div>
  );
}

/* A photo card pointing to the next step. */
export function NextCard({ image, title, line, href, cta }: { image: string; title: string; line: string; href: string; cta: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="my-8 block overflow-hidden rounded-[22px] border border-[#DDC98E] bg-[#211e19]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
      <span className="block p-5">
        <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your next step</span>
        <span className="mt-1.5 block font-display text-[26px] leading-tight text-[#f1ece2]">{title}</span>
        <span className="mt-2 block text-[16px] text-[#a79f90]">{line}</span>
        <span className="mt-4 inline-block rounded-full bg-[#DDC98E] px-6 py-3 font-display text-[16px] font-medium text-[#1a1814]">{cta}</span>
      </span>
    </a>
  );
}

/* ---- 31 Touch Points: "How did it feel?" (27 Oct) ---- */
export const FEELS = [
  { id: "laughed", label: "We laughed", color: "#EEDE80" },
  { id: "close", label: "Closer", color: "#C29A4E" },
  { id: "awkward", label: "Awkward", color: "#F1ECE2" },
  { id: "flat", label: "Nothing much", color: "#6b6559" },
] as const;
const FEEL_KEY = "ffy.31tp.feel.v1";
export function readFeels(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(FEEL_KEY) || "{}") || {}; } catch { return {}; }
}
export function FeelTracker({ day }: { day: number }) {
  const [v, setV] = useState<string>("");
  useEffect(() => { setV(readFeels()[String(day)] || ""); }, [day]);
  const choose = (id: string) => {
    const all = readFeels(); all[String(day)] = id;
    try { localStorage.setItem(FEEL_KEY, JSON.stringify(all)); } catch {}
    setV(id);
  };
  return (
    <div className="mt-6">
      <Glow />
      <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>How did it feel?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {FEELS.map((f) => (
          <button key={f.id} type="button" onClick={() => choose(f.id)}
            className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-2 py-3 text-[14px] ${v === f.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2] ffy-glow" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`}>
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: f.color }} />{f.label}
          </button>
        ))}
      </div>
      {v && <p className="mt-3 text-sm text-[#a79f90]">Saved. It colours Day {day} on your month.</p>}
    </div>
  );
}
export function MonthFeelings({ doneDays }: { doneDays: number[] }) {
  const [feels, setFeels] = useState<Record<string, string>>({});
  useEffect(() => { setFeels(readFeels()); }, []);
  const col = (d: number) => FEELS.find((f) => f.id === feels[String(d)])?.color;
  const any = Object.keys(feels).length > 0;
  return (
    <div className="mt-6 rounded-2xl border border-[rgba(221,201,142,0.25)] bg-[rgba(13,53,53,0.35)] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Your month so far</p>
      <div className="mt-3 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const c = col(d); const done = doneDays.includes(d);
          return <span key={d} title={`Day ${d}`} className="aspect-square rounded-full border"
            style={{ background: c ?? (done ? "rgba(221,201,142,0.35)" : "transparent"), borderColor: c ?? "rgba(221,201,142,0.3)" }} />;
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => <span key={f.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />{f.label}</span>)}
      </div>
      {!any && <p className="mt-2 text-xs text-[rgba(254,252,250,0.55)]">After each day, tap how it felt and your month fills with colour.</p>}
    </div>
  );
}

/* ---- Weekly date: pick one, then put it in the calendar (27 Oct) ---- */
export function DatePick({ k, label, options }: { k: string; label: string; options: { title: string; text: string }[] }) {
  const [pick, setPick] = useSaved<number>(k, -1);
  const [when, setWhen] = useSaved<string>(k + ".when", "");
  const ics = () => {
    if (pick < 0 || !when) return;
    const o = options[pick]; const start = new Date(when);
    const end = new Date(start.getTime() + 90 * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Feel Fully You//31 Touch Points//EN", "BEGIN:VEVENT",
      `UID:31tp-${k}-${start.getTime()}@feelfullyyou.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:Our date: ${o.title.replace(/[,;]/g, "")}`, `DESCRIPTION:${o.text.replace(/[,;\n]/g, " ")}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a"); a.href = url; a.download = "our-date.ics"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  return (
    <div className="my-8 rounded-[22px] border border-[#DDC98E] bg-gradient-to-b from-[#0D3535]/60 to-[#211e19] p-5">
      <Label>{label}</Label>
      <div className="grid gap-2.5">
        {options.map((o, i) => (
          <button key={i} type="button" onClick={() => setPick(i)}
            className={`rounded-[16px] border p-4 text-left ${pick === i ? "border-[#DDC98E] bg-[rgba(221,201,142,0.12)]" : "border-[#DDC98E]/25 bg-white/[0.03]"}`}>
            {pick === i && <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#DDC98E]">Our date</span>}
            <span className="block font-display text-[19px] text-[#f1ece2]">{o.title}</span>
            <span className="mt-1 block text-[15px] leading-relaxed text-[#a79f90]">{o.text}</span>
          </button>
        ))}
      </div>
      {pick >= 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#DDC98E]">Put it in the diary</p>
          <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-[#DDC98E]/30 bg-[#1a1814] p-3 text-[#f1ece2] [color-scheme:dark]" />
          <button type="button" onClick={ics} disabled={!when}
            className="mt-3 w-full rounded-full bg-[#DDC98E] px-5 py-3.5 font-display text-[16px] font-medium text-[#1a1814] disabled:opacity-40">
            Add to my calendar
          </button>
        </div>
      )}
    </div>
  );
}

/* ---- Between Touches translation cards (27 Oct). Rebuilt from HER Google
   Doc "Between Touches": her own column names on every layer (He Says / She
   Hears / What She Does; What She Says / What She Really Means; She Says /
   What She Feels / He Hears / Try Instead). Each card its own colour, each
   layer pops in its own colour. HER PALETTE ONLY. */
type TCard = { label: string; says: string; layers: { label: string; text: string }[] };
const TC_FRONTS = [
  { bg: "#F6EFE0", fg: "#1a1814", chip: "#0D3535" },
  { bg: "#D8DFE1", fg: "#1a1814", chip: "#0D3535" }, // her site's soft blue (27 Oct: "use the light blue, much more on brand")
  { bg: "#0D3535", fg: "#F6EFE0", chip: "#EEDE80" },
  { bg: "#C29A4E", fg: "#1a1814", chip: "#F6EFE0" },
  { bg: "#DDC98E", fg: "#1a1814", chip: "#0D3535" },
];
const TC_LAYERS = [
  { bg: "#0D3535", fg: "#F6EFE0", label: "#EEDE80" },
  { bg: "#EEDE80", fg: "#1a1814", label: "#0D3535" },
  { bg: "#F6EFE0", fg: "#0D3535", label: "#C29A4E" },
  { bg: "#D8DFE1", fg: "#0D3535", label: "#0D3535" },
];
// A layer never opens in its card's colour, or the one above it (27 Oct:
// "green opening on green needs to be changed").
function tcLayerColours(frontBg: string, n: number) {
  const out: (typeof TC_LAYERS)[number][] = [];
  let prev = frontBg;
  let j = 0;
  for (let k = 0; k < n; k++) {
    let tries = 0;
    while ((TC_LAYERS[j % TC_LAYERS.length].bg === prev || TC_LAYERS[j % TC_LAYERS.length].bg === frontBg) && tries < 8) { j++; tries++; }
    out.push(TC_LAYERS[j % TC_LAYERS.length]);
    prev = TC_LAYERS[j % TC_LAYERS.length].bg;
    j++;
  }
  return out;
}
export function TranslateCards({ prompt, cards }: { prompt?: string; cards: TCard[] }) {
  const [step, setStep] = useState<Record<number, number>>({});
  return (
    <div className="my-7">
      <style>{`@keyframes tcIn{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:none}}@keyframes tcPop{0%{transform:scale(1)}40%{transform:scale(1.04)}100%{transform:scale(1)}}`}</style>
      {prompt && <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: GOLD }}>{prompt}</p>}
      <div className="grid gap-4">
        {cards.map((c, i) => {
          const s = step[i] ?? 0;
          const done = s >= c.layers.length;
          const f = TC_FRONTS[i % TC_FRONTS.length];
          return (
            <div key={i} className="overflow-hidden rounded-[22px] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)]">
              <button
                type="button"
                onClick={() => setStep({ ...step, [i]: done ? 0 : s + 1 })}
                className="block w-full p-5 text-left"
                style={{ background: f.bg, color: f.fg, animation: s ? "tcPop .35s ease" : undefined }}
              >
                <span className="inline-block rounded-full px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ background: f.chip, color: f.bg }}>{c.label}</span>
                <span className="mt-3 block font-display text-[23px] leading-snug">&ldquo;{c.says}&rdquo;</span>
                <span className="mt-3 block text-[13px] font-medium opacity-70">{done ? "Tap to fold it back ↺" : `Tap: ${c.layers[s].label} →`}</span>
              </button>
              {c.layers.slice(0, s).map((L, k) => {
                const C = tcLayerColours(f.bg, c.layers.length)[k];
                return (
                  <div key={k} className="px-5 py-4" style={{ background: C.bg, color: C.fg, animation: "tcIn .4s ease" }}>
                    <span className="block text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.label }}>{L.label}</span>
                    <span className={`mt-1 block leading-snug ${/actually means|^she hears$/i.test(L.label) ? "font-display text-[20px]" : "text-[17px]"}`}>{L.text}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- The real card, drawn like the cards app (27 Oct, Juliette: "It
   should show that card in the card app... the black-and-white card").
   Copied from card-engine/app/index.html: white card 1226x1758, black band,
   gold chevrons, Jost uppercase prompt, FEELFULLYYOU.COM. */
export function PromptCard({ deck, prompt }: { deck: string; prompt: string }) {
  return (
    <div className="my-7 flex justify-center">
      <div
        className="relative w-full max-w-[300px] overflow-hidden bg-white text-black shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_0_1px_rgba(221,201,142,.12),0_0_70px_-10px_rgba(221,201,142,.22)]"
        style={{ aspectRatio: "1226 / 1758", containerType: "inline-size", fontFamily: '"Jost","Futura","Century Gothic","Avenir Next",sans-serif' }}
      >
        <svg viewBox="0 0 120 106" aria-hidden="true" className="absolute left-1/2 top-0 h-auto -translate-x-1/2" style={{ width: "31cqw" }}>
          <defs><linearGradient id="pcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8c6a2b" /><stop offset=".5" stopColor="#d9c389" /><stop offset="1" stopColor="#8c6a2b" /></linearGradient></defs>
          <polyline points="0,0 60,104 120,0" fill="none" stroke="url(#pcg)" strokeWidth="2.4" />
          <polyline points="40,0 60,34 80,0" fill="none" stroke="url(#pcg)" strokeWidth="1.6" />
        </svg>
        <div className="absolute inset-x-0 flex items-center justify-center bg-black uppercase text-[#a8843f]" style={{ top: "30.6cqw", height: "17.6cqw", fontSize: "6.2cqw" }}>
          {deck}
        </div>
        <div className="absolute flex flex-col items-center" style={{ left: "14cqw", right: "14cqw", top: "58cqw" }}>
          <p className="text-center font-bold uppercase" style={{ letterSpacing: ".14em", lineHeight: 1.35, fontSize: "3.9cqw" }}>{prompt}</p>
        </div>
        <div className="absolute inset-x-0 text-center" style={{ top: "106cqw", fontSize: "3.2cqw", letterSpacing: ".3em" }}>FEELFULLYYOU.COM</div>
        <svg viewBox="0 0 120 106" aria-hidden="true" className="absolute bottom-0 left-1/2 h-auto -translate-x-1/2" style={{ width: "31cqw" }}>
          <polyline points="0,106 60,2 120,106" fill="none" stroke="url(#pcg)" strokeWidth="2.4" />
          <polyline points="40,106 60,72 80,106" fill="none" stroke="url(#pcg)" strokeWidth="1.6" />
        </svg>
      </div>
    </div>
  );
}

/* ---- "I've done this" on a practice box (27 Oct, The Unspoken Distance:
   "this needs to be a good resource for £97"). Saves on the phone. */
export function StepDone({ k }: { k: string }) {
  const [done, setDone] = useSaved<boolean>(k, false);
  return (
    <button
      type="button"
      onClick={() => setDone(!done)}
      className={`mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[15px] font-medium transition ${done ? "border-[#DDC98E] bg-[#DDC98E] text-[#1a1814] shadow-[0_0_24px_-6px_rgba(221,201,142,0.8)]" : "border-[#DDC98E]/60 text-[#DDC98E]"}`}
    >
      {done ? "Done ✓" : "I've done this"}
    </button>
  );
}

/* ---- A whole card deck you can draw from (27 Oct 2026, One Touch:
   "make sure that you have all of them"). One card at a time, no repeats
   until the deck has been through, and the full list underneath. */
export function CardDeck({ deck, prompts }: { deck: string; prompts: string[] }) {
  const [order, setOrder] = useState<number[]>(() => prompts.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const a = prompts.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setOrder(a);
  }, [prompts]);
  const draw = () => setPos((p) => (p + 1) % order.length);
  return (
    <div className="my-6">
      <PromptCard deck={deck} prompt={prompts[order[pos]]} />
      <div className="flex flex-col items-center gap-3">
        <button onClick={draw} className="rounded-full bg-ffy-gold px-6 py-3 font-display text-sm font-medium text-ffy-black transition hover:opacity-90">
          Draw another card
        </button>
        <p className="text-xs uppercase tracking-[0.15em] text-ffy-gold-pale/70">Card {pos + 1} of {order.length}</p>
        <button onClick={() => setShowAll((v) => !v)} className="text-sm text-ffy-gold-pale underline">
          {showAll ? "Hide the list" : `See all ${prompts.length} cards`}
        </button>
      </div>
      {showAll && (
        <ol className="mt-5 space-y-3 text-sm leading-relaxed text-ffy-cream/80">
          {prompts.map((p, i) => (
            <li key={i} className="rounded-xl border border-ffy-gold/15 px-4 py-3">{p}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
