"use client";

// THE TOUCH MAP TASTE, v3 (30 Oct 2026). Juliette: the old taste was "way too
// long and boring for people that are kinky or sexual or shapeshifter, because
// we want a little bit of all of it". Now: her neck-kiss reel, then five
// flavours, one tap each. Each is her own ~90-second solo wrist recording
// (recorded 30 Oct). One question, then the door. Leave them hungry.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { count } from "@/lib/count";
import { PlaceClip } from "@/components/TouchMap";
import { SlimPlayer } from "@/components/SlimPlayer";
import { LANGUAGES, LANG_STYLE, STEERS_BY_LANGUAGE, ANSWERS, TM_AUDIO, TM_BUY_URL, TASTER_CLIP, type LanguageId, type Answer } from "@/lib/content/touch-map";

const KEY = "ffy.touchmap.taste.v3";
const AUDIO: Record<LanguageId, string> = {
  energetic: TM_AUDIO.taster ?? "/touch-map/audio/taster.m4a",
  sensual: "/touch-map/audio/taste/sensual.m4a",
  sexual: "/touch-map/audio/taste/sexual.m4a",
  kinky: "/touch-map/audio/taste/kinky.m4a",
  shapeshifter: "/touch-map/audio/taste/shapeshifter.m4a",
};
type Saved = Partial<Record<LanguageId, Answer>>;

export default function TasteTouchMap() {
  const [tried, setTried] = useState<Saved>({});
  const [pick, setPick] = useState<LanguageId | null>(null);
  const [said, setSaid] = useState<string[]>([]);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const playerTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setTried(JSON.parse(localStorage.getItem(KEY) || "{}") || {}); } catch {}
    count("tm_taster_open", 0);
  }, []);

  const choose = (l: LanguageId) => {
    setPick(l); setSaid([]); setAnswer(null);
    count("tm_taster_flavour", 0, l);
    setTimeout(() => playerTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  const land = (a: Answer) => {
    if (!pick) return;
    setAnswer(a);
    const next = { ...tried, [pick]: a };
    setTried(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    count("tm_taster_done", 0, `${pick}:${a}`);
  };

  const lang = pick ? LANGUAGES.find((l) => l.id === pick)! : null;
  const st = pick ? LANG_STYLE[pick] : null;

  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <a href="/" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E] transition hover:border-[#DDC98E]">
          ← Your library
        </a>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">The Touch Map · a taste</p>

        <PlaceClip src={TASTER_CLIP} label="The neck-kiss reel" poster="/touch-map/taster-neck-kiss-poster.jpg" />

        <h1 className="mt-7 font-display text-3xl font-light leading-tight sm:text-4xl">Which one calls to you?</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-[#cfc8bb]">Five flavours of touch. Pick one, put your phone down, and let me take you through it on your own wrist. About a minute and a half.</p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {LANGUAGES.map((l) => {
            const s = LANG_STYLE[l.id];
            const done = tried[l.id];
            const on = pick === l.id;
            return (
              <button key={l.id} type="button" onClick={() => choose(l.id)}
                className={`relative h-36 overflow-hidden rounded-2xl border-[1.5px] text-left transition active:scale-[0.98] ${on ? "border-[#EEDE80]" : "border-[#DDC98E]/35"} ${l.id === "shapeshifter" ? "col-span-2 sm:col-span-1" : ""}`}>
                <Image src={s.img} alt="" fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover" style={{ objectPosition: s.pos }} />
                <span className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="flex items-center gap-1.5 font-display text-[19px] leading-tight">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{l.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-[#cfc8bb]">{l.line}</span>
                </span>
                {done && <span className="absolute right-2 top-2 rounded-full bg-[#070707]/70 px-2 py-0.5 text-[11px] text-[#DDC98E]">✓ tried</span>}
              </button>
            );
          })}
        </div>

        {pick && lang && st && (
          <section ref={playerTop} className="mt-8 scroll-mt-4 rounded-[28px] border-2 p-5" style={{ borderColor: st.color, background: `${st.color}14` }}>
            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: st.color }}>{lang.label} · on your own wrist</p>
            <div className="mt-4"><SlimPlayer src={AUDIO[pick]} label="Do it with me" big /></div>

            <p className="mt-6 text-[14px] text-[#a79f90]">Say it out loud. Tap the words you used.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set([...STEERS_BY_LANGUAGE[pick].slice(0, STEERS_BY_LANGUAGE[pick].length - 9), "Slower", "Firmer", "Stay there", "More"])].map((w) => (
                <button key={w} type="button" onClick={() => setSaid((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))}
                  className={`min-h-[44px] rounded-full border px-4 text-[15px] ${said.includes(w) ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/30 text-[#f1ece2]/85"}`}>{w}</button>
              ))}
            </div>

            {!answer ? (
              <div className="mt-7 text-center">
                <h2 className="font-display text-[26px] font-light">Did it land?</h2>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {ANSWERS.map((a) => (
                    <button key={a.id} type="button" onClick={() => land(a.id)}
                      className="flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] text-[15px] active:scale-[0.97]"
                      style={{ borderColor: a.color, background: `${a.color}22` }}>
                      <span className="h-3.5 w-3.5 rounded-full" style={{ background: a.color }} />{a.short}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="tm-done mt-7 text-center">
                <p className="font-display text-[22px] font-light leading-snug">
                  {answer === "yes" ? "That one's yours. Notice that." : answer === "maybe" ? "A maybe is information too." : "A no tells us just as much as a yes."}
                </p>
                <p className="mt-2 text-[15px] text-[#cfc8bb]">That was one flavour, on one wrist.</p>
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button type="button" onClick={() => { setAnswer(null); setSaid([]); playerTop.current?.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex min-h-[48px] items-center rounded-full border-[1.5px] border-[#DDC98E] px-6 text-[15px] text-[#DDC98E]">Do it again</button>
                  <button type="button" onClick={() => { setPick(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Try another flavour</button>
                </div>
              </div>
            )}
          </section>
        )}

        <div className="mt-12 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Your Touch Map</p>
          <h2 className="mt-2 font-display text-[28px] font-light leading-tight">Every part of you. Every flavour.</h2>
          <p className="mt-4 text-[15px] text-[#cfc8bb]">My voice in your ear, place by place. My whole Touch Menu in your Pleasure Language. Your map and your own recipe. Yours to keep.</p>
          <a href={TM_BUY_URL} onClick={() => count("tm_taster_buy_click", 0)}
            className="mt-6 inline-flex min-h-[52px] items-center rounded-full bg-[#DDC98E] px-7 text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80]">
            Get your Touch Map · £197
          </a>
          <p className="mt-3 text-[13px] text-[#8f877a]">Day one opens the minute you join.</p>
        </div>
      </div>
      <style>{`
        @keyframes tmDone { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
        .tm-done { animation: tmDone .6s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .tm-done { animation: none; } }
      `}</style>
    </main>
  );
}
