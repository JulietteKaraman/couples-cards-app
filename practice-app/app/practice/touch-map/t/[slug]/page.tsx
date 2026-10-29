"use client";

// One touch from Juliette's Touch Menu (v2, 29 Oct 2026). Her note: "too many
// things and prompts at once for one touch... like always you start with
// touch base - there is no touch base anywhere". So one simple flow:
//   1. Touch Base first (her 5 min guided recording), ticked off once a day
//   2. The touch itself, in her voice
//   3. One question after: how did it land? (Yes / Maybe / No, once)
// Her written steps are still here for anyone who can't listen, but one step
// per screen, one thing to notice, no buttons on every step. Phone only.

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { count } from "@/lib/count";
import { FullStop, todayStr } from "@/components/TouchMap";
import { useMenuState, languageOf } from "@/components/TouchMenu";
import { MENU } from "@/lib/content/touch-menu";
import { ANSWERS, LANG_STYLE, TM_SLUG, type Answer, type LanguageId } from "@/lib/content/touch-map";

const BASE_AUDIO = "/touch-base/touch-base-guided.m4a";
const BASE_KEY = "ffy.touchmap.base.v1";

export default function MenuTouchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <CollectionGate collectionSlug={TM_SLUG}>
      <TouchDetail slug={slug} />
    </CollectionGate>
  );
}

function SlimPlayer({ src, label, big }: { src: string; label: string; big?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label={playing ? "Pause" : label}
        onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }}
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#DDC98E] text-[#070707] shadow-[0_0_30px_-6px_rgba(221,201,142,0.8)] ${big ? "h-16 w-16 text-[18px]" : "h-12 w-12"}`}>
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="flex-1">
        <p className={big ? "text-[17px]" : "text-[15px]"}>{label}</p>
        <div onClick={(e) => { const a = ref.current; if (!a || !dur) return; const r = e.currentTarget.getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur; }}
          className="mt-2 h-[3px] cursor-pointer overflow-hidden rounded-full bg-[#DDC98E]/20">
          <div className="h-full bg-[#DDC98E]" style={{ width: dur ? `${(cur / dur) * 100}%` : "0%" }} />
        </div>
        <p className="mt-1.5 text-[12px] text-[#8f877a]">{playing || cur ? `${fmt(cur)} · ${fmt(Math.max(0, dur - cur))} left` : "In Juliette’s voice"}</p>
      </div>
      <audio ref={ref} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />
    </div>
  );
}

function TouchDetail({ slug }: { slug: string }) {
  const t = MENU.find((x) => x.slug === slug);
  const [state, save] = useMenuState();
  const [baseDone, setBaseDone] = useState(false);
  const [reading, setReading] = useState<number | null>(null); // step index when following the words
  const [phase, setPhase] = useState<"touch" | "stop" | "done">("touch");
  const [pending, setPending] = useState<Answer | null>(null);
  const today = todayStr();

  useEffect(() => { try { setBaseDone(localStorage.getItem(BASE_KEY) === today); } catch {} }, [today]);

  if (!t) return <main className="min-h-screen bg-[#070707] p-8 text-[#f1ece2]">This touch isn&rsquo;t on the menu.</main>;
  if (!state) return <main className="min-h-screen bg-[#070707]" aria-busy="true" />;

  const lang = languageOf(t.language);
  const st = LANG_STYLE[t.language as LanguageId];
  const mark = state.marks[t.slug];
  const doneTodayOther = Object.entries(state.marks).some(([s, m]) => m.date === today && s !== t.slug);
  const mode = t.mode === "solo" ? "on your own" : t.mode === "partnered" ? "with a partner" : "solo or together";
  // one thing to notice per step: her first question, never the integration line
  const steps = t.steps.map((s) => ({
    title: s.title.replace(/^Step\s*\d+\s*(\(optional\))?\s*:\s*/i, ""),
    notice: s.questions.find((q) => !/^Integration Prompt/i.test(q)),
  }));
  const takeAway = (t.integration || [...t.steps].reverse().flatMap((s) => s.questions).find((q) => /^Integration Prompt/i.test(q)) || "").replace(/^Integration Prompt:\s*/i, "");

  const tickBase = () => { setBaseDone(true); try { localStorage.setItem(BASE_KEY, today); } catch {} };
  const finish = (a: Answer) => {
    save({ ...state, marks: { ...state.marks, [t.slug]: { date: today, steps: [], steers: [], answer: a } } });
    setPhase("done");
    count("tm_day_done", 0);
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2]">
      {/* Hero */}
      <div className="relative mx-auto max-w-2xl md:mt-6 md:rounded-[28px] md:border md:border-[#DDC98E]/30 h-[52vh] min-h-[340px] overflow-hidden">
        <Image src={st.img} alt="" fill priority sizes="100vw" className="tm-drift object-cover" style={{ objectPosition: st.pos }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-[#070707]/50" />
        <div className="absolute inset-x-0 top-0 mx-auto max-w-2xl px-5 pt-6">
          <Link href="/practice/touch-map" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[#070707]/40 px-4 text-sm text-[#DDC98E] backdrop-blur">← Your Touch Map</Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl px-5 pb-6">
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#DDC98E" }}>{lang?.label} · {mode}{t.minutes ? ` · ${t.minutes} min` : ""}</p>
          <h1 className="mt-1 font-display text-[40px] font-light leading-[1.05]">{t.title}</h1>
          {mark && <p className="mt-2 text-[14px] text-[#cfc8bb]">Last time: <span style={{ color: ANSWERS.find((x) => x.id === mark.answer)?.color }}>{ANSWERS.find((x) => x.id === mark.answer)?.label}</span></p>}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-24">
        {phase === "touch" && (
          <>
            {doneTodayOther && (
              <p className="mt-6 rounded-2xl border border-[#DDC98E]/30 p-4 text-[14px] text-[#cfc8bb]">You&rsquo;ve had a touch today already. Listen as much as you like; one a day is plenty to do.</p>
            )}

            {/* 1. Touch Base */}
            <section className={`mt-6 rounded-[24px] border-[1.5px] p-5 transition ${baseDone ? "border-[#DDC98E]/25 opacity-80" : "border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)]"}`}>
              <div className="flex items-center gap-4">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#DDC98E]/50">
                  <Image src="/touch-base/emblem.png" alt="" fill sizes="56px" className="object-cover" />
                </span>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">First · like always</p>
                  <h2 className="font-display text-[24px] leading-tight">Touch Base</h2>
                </div>
                {baseDone && <span className="text-[13px] text-[#DDC98E]">✓ done today</span>}
              </div>
              {!baseDone && (
                <>
                  <div className="mt-4"><SlimPlayer src={BASE_AUDIO} label="Touch Base, with me · 5 min" /></div>
                  <button type="button" onClick={tickBase} className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-[#DDC98E]/50 px-5 text-[14px] text-[#DDC98E]">I&rsquo;ve done my Touch Base</button>
                </>
              )}
            </section>

            {/* 2. The touch, in her voice */}
            <section className="mt-4 rounded-[24px] border-2 p-5" style={{ borderColor: st.color, background: `linear-gradient(160deg, ${st.color}22, rgba(13,53,53,0.35))` }}>
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#DDC98E" }}>Then · {t.title}</p>
              {t.intro && <p className="mt-2 text-[16px] leading-relaxed text-[#cfc8bb]">{t.intro.split("\n")[0]}</p>}
              <div className="mt-5">
                {t.audio ? <SlimPlayer src={t.audio} label={`Do it with me${t.minutes ? ` · ${t.minutes} min` : ""}`} big /> : <p className="text-[15px] text-[#cfc8bb]">Follow the words below.</p>}
              </div>
              <button type="button" onClick={() => setReading(0)} className="mt-4 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">
                Rather read it? One step at a time
              </button>
            </section>

            {/* 3. One question */}
            {!doneTodayOther && (
              <section className="mt-8 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Afterwards</p>
                <h3 className="mt-1 font-display text-[28px] font-light">How did it land?</h3>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {ANSWERS.map((a) => (
                    <button key={a.id} type="button" onClick={() => (a.id === "no" ? (setPending(a.id), setPhase("stop")) : finish(a.id))}
                      className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] text-[15px] text-[#f1ece2] active:scale-[0.97]"
                      style={{ borderColor: a.color, background: `${a.color}22` }}>
                      <span className="h-3.5 w-3.5 rounded-full" style={{ background: a.color }} />{a.short}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {phase === "stop" && pending && <FullStop onContinue={() => finish(pending)} />}

        {phase === "done" && (
          <div className="tm-reveal mt-8 rounded-[28px] border-2 p-6 text-center" style={{ borderColor: st.color, background: `${st.color}18` }}>
            <span className="block font-display text-4xl font-light leading-none" style={{ color: "#DDC98E" }}>Done</span>
            <p className="mt-3 text-[15px]">It&rsquo;s on your map now. Let it settle.</p>
            {takeAway && <p className="mx-auto mt-5 max-w-sm font-display text-[19px] italic leading-snug text-[#f1ece2]">{takeAway}</p>}
            <Link href="/practice/touch-map" className="mt-6 inline-flex min-h-[52px] items-center rounded-full bg-[#DDC98E] px-7 text-[15px] font-medium text-[#070707]">Back to your Touch Map</Link>
          </div>
        )}
      </div>

      {/* The words, one step per screen */}
      {reading !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#070707]/95 px-5 pb-8 pt-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setReading(null)} className="min-h-[44px] text-[14px] text-[#a79f90]">Close</button>
              <div className="flex flex-1 gap-1.5">
                {steps.map((_, n) => <span key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n <= reading ? st.color : "rgba(255,255,255,0.15)" }} />)}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center" key={reading}>
              <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: "#DDC98E" }}>Step {reading + 1} of {steps.length}</p>
              <h2 className="tm-rise mt-3 font-display text-[32px] font-light leading-[1.15]">{steps[reading].title}</h2>
              {steps[reading].notice && <p className="tm-rise mt-6 text-[19px] italic leading-relaxed text-[#cfc8bb]" style={{ animationDelay: "120ms" }}>{steps[reading].notice}</p>}
            </div>
            <div className="flex gap-3">
              {reading > 0 && <button type="button" onClick={() => setReading(reading - 1)} className="min-h-[56px] flex-1 rounded-full border border-[#DDC98E]/40 text-[#DDC98E]">Back</button>}
              <button type="button" onClick={() => setReading(reading + 1 < steps.length ? reading + 1 : null)}
                className="min-h-[56px] flex-[2] rounded-full font-display text-[16px] font-medium" style={{ background: st.color, color: st.ink }}>
                {reading + 1 < steps.length ? "Next" : "Finished"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes tmRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .tm-rise { animation: tmRise .45s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes tmReveal { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
        .tm-reveal { animation: tmReveal .7s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes tmDrift { from { transform: scale(1.02); } to { transform: scale(1.1); } }
        .tm-drift { animation: tmDrift 14s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .tm-rise, .tm-reveal, .tm-drift { animation: none; } }
      `}</style>
    </main>
  );
}
