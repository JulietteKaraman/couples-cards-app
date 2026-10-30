"use client";

// The steer week (v2, 29 Oct 2026), in the look Juliette approved on the touch
// page ("energetic non touch is beautiful"): photo, Touch Base first, her
// voice, one question at the end. The steer week adds the one thing it exists
// for: do it again, and steer it out loud. One place a day, her order.
// Map and recipe on this phone only.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { count } from "@/lib/count";
import { SlimPlayer } from "@/components/SlimPlayer";
import { BodyMap, FullStop, Recipe, useMapState, todayStr, type MapState } from "@/components/TouchMap";
import { PLACES, ANSWERS, STEERS, TM_AUDIO, TM_APPLY_URL, TM_SLUG, type Answer, type Place } from "@/lib/content/touch-map";

const KEY = "ffy.touchmap.v2";
const BASE_KEY = "ffy.touchmap.base.v1"; // shared with every touch: Touch Base once a day
const BASE_AUDIO = "/touch-base/touch-base-guided.m4a";
const Q = "/touch-map/quiz/";
// one photo per place (her own quiz photos)
const PHOTO: Record<string, { img: string; pos?: string }> = {
  "wrist": { img: Q + "touch-scarf-silk-2.jpg" },
  "inner-elbow": { img: Q + "touch-singing-bowl.jpg" },
  "elbow-armpit": { img: Q + "touch-hand-back.jpg" },
  "heart": { img: Q + "touch-hand-heart.jpg" },
  "collarbone": { img: Q + "touch-lace-closet-bw.jpg" },
  "back-of-neck": { img: Q + "touch-alex-behind.jpg", pos: "48% center" },
};

export default function SteerWeek() {
  return (
    <CollectionGate collectionSlug={TM_SLUG}>
      <Content />
    </CollectionGate>
  );
}

function Hero({ place, eyebrow, title }: { place?: Place; eyebrow: string; title: string }) {
  const ph = PHOTO[place?.id ?? "heart"];
  return (
    <div className="relative mx-auto max-w-2xl md:mt-6 md:rounded-[28px] md:border md:border-[#DDC98E]/30 h-[46vh] min-h-[320px] overflow-hidden">
      <Image src={ph.img} alt="" fill priority sizes="100vw" className="tm-drift object-cover" style={{ objectPosition: ph.pos ?? "center", filter: "grayscale(.35)" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-[#070707]/50" />
      <div className="absolute inset-x-0 top-0 mx-auto flex max-w-2xl flex-wrap gap-2 px-5 pt-6">
        <Link href="/" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[#070707]/40 px-4 text-sm text-[#DDC98E] backdrop-blur">← Your library</Link>
        <Link href="/practice/touch-map" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[#070707]/40 px-4 text-sm text-[#DDC98E] backdrop-blur">← Your Touch Map</Link>
      </div>
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl px-5 pb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[40px] font-light leading-[1.05]">{title}</h1>
      </div>
    </div>
  );
}

function Content() {
  const [state, save] = useMapState(KEY);
  const [baseDone, setBaseDone] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const [steers, setSteers] = useState<string[]>([]);
  const [stopFor, setStopFor] = useState<Answer | null>(null);
  const [justDone, setJustDone] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const today = todayStr();
  useEffect(() => { try { setBaseDone(localStorage.getItem(BASE_KEY) === today); } catch {} }, [today]);

  if (!state) return <main className="min-h-screen bg-[#070707]" aria-busy="true" />;

  const update = (fn: (s: MapState) => MapState) => save(fn(structuredClone(state)));
  const finished = state.entries.filter((e) => !e.partial && e.answer && e.place);
  const doneToday = finished.some((e) => e.date === today);
  const nextInOrder = PLACES.find((p) => !finished.some((e) => e.place === p.id));
  const place = PLACES.find((p) => p.id === (pick ?? nextInOrder?.id));
  const dayNo = place ? PLACES.indexOf(place) + 1 : PLACES.length;

  const tickBase = () => { setBaseDone(true); try { localStorage.setItem(BASE_KEY, today); } catch {} };
  const finish = (answer: Answer) => {
    if (!place) return;
    update((s) => {
      s.entries.push({ area: place.area, place: place.id, date: today, steers, answer });
      s.touches[today] = 2;
      return s;
    });
    setStopFor(null); setJustDone(true); setSteers([]); setPick(null);
    count("tm_day_done", Math.min(new Set(finished.map((e) => e.date)).size + 1, 31));
  };

  const map = (
    <div className="mx-auto max-w-2xl px-5">
      <div className="mt-14 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your map</p>
        <div className="flex gap-1 text-[13px]">
          {(["female", "male"] as const).map((b) => (
            <button key={b} type="button" onClick={() => update((s) => ({ ...s, body: b }))}
              className={`min-h-[44px] rounded-full px-3 ${(state.body ?? "female") === b ? "bg-[rgba(221,201,142,0.2)] text-[#f1ece2]" : "text-[#a79f90]"}`}>{b}</button>
          ))}
        </div>
      </div>
      <div className="mt-3"><BodyMap entries={state.entries} body={state.body ?? "female"} active={doneToday ? undefined : place?.area} /></div>
      <p className="mt-2 text-center text-[13px] text-[#8f877a]">Kept on this phone only. Not even I see it.</p>
      <div className="mt-8"><Recipe entries={state.entries} /></div>
      {finished.length > 0 && (
        <p className="mt-12 text-center text-[15px] text-[#a79f90]">Want me there with you? <a href={TM_APPLY_URL} className="inline-flex min-h-[44px] items-center text-[#DDC98E] underline underline-offset-4">Talk to me about 1:1</a></p>
      )}
    </div>
  );

  let body: React.ReactNode;

  if (!state.introSeen) {
    body = (
      <>
        <Hero eyebrow="Before you begin · the steer" title="Touch it. Then steer it." />
        <div className="mx-auto max-w-2xl px-5">
          <p className="mt-6 text-[17px] leading-relaxed text-[#cfc8bb]">One place a day, six days. Touch it as it comes, then do it again and steer it, out loud, until it lands.</p>
          <div className="mt-6 space-y-6">
            <SlimPlayer src={TM_AUDIO.welcome!} label="Welcome · about a minute" />
            <SlimPlayer src={TM_AUDIO.capacity!} label="Why only two touches a day · about a minute" />
          </div>
          <button type="button" onClick={() => update((s) => ({ ...s, introSeen: true }))}
            className="mt-8 inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[16px] font-medium text-[#070707]">
            Let&rsquo;s begin
          </button>
        </div>
      </>
    );
  } else if (stopFor) {
    body = (<><Hero place={place} eyebrow={`Day ${dayNo}`} title={place?.label ?? ""} /><div className="mx-auto max-w-2xl px-5"><FullStop onContinue={() => finish(stopFor)} /></div></>);
  } else if (doneToday && !pick) {
    const last = [...finished].reverse()[0];
    const lastPlace = PLACES.find((p) => p.id === last?.place);
    body = (
      <>
        <Hero place={lastPlace} eyebrow="That's today" title={lastPlace?.label ?? "That's today"} />
        <div className="mx-auto max-w-2xl px-5 text-center">
          {justDone && (
            <div className="tm-reveal mt-8 rounded-[28px] border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.5)] p-6">
              <span className="block font-display text-4xl font-light leading-none text-[#DDC98E]">Done</span>
              <p className="mt-3 text-[15px]">Something just coloured in on your map.</p>
            </div>
          )}
          <div className="mx-auto mt-8 max-w-md text-left"><SlimPlayer src={TM_AUDIO.thatsToday!} label="That's today · 30 seconds" /></div>
          <p className="mt-6 text-[15px] text-[#a79f90]">{nextInOrder ? "Your next place opens tomorrow." : "You've learned the steer. Every touch on your menu is yours now."}</p>
          {lastPlace && (
            <button type="button" onClick={() => setPick(lastPlace.id)}
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] px-6 text-[15px] text-[#DDC98E]">
              Do it again
            </button>
          )}
          {finished.length > 1 && (
            <div className="mx-auto mt-8 max-w-md text-left">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Go back to an earlier place</p>
              <div className="mt-3 grid gap-2">
                {PLACES.filter((p) => finished.some((x) => x.place === p.id) && p.id !== lastPlace?.id).map((p) => (
                  <button key={p.id} type="button" onClick={() => setPick(p.id)}
                    className="flex min-h-[52px] items-center rounded-2xl border border-[#DDC98E]/30 px-4 text-left text-[16px]">{p.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else if (place) {
    body = (
      <>
        <Hero place={place} eyebrow={pick ? "Your pick · the steer" : `Day ${dayNo} of ${PLACES.length} · the steer`} title={place.label} />
        <div className="mx-auto max-w-2xl px-5">
          {/* 1. Touch Base */}
          <section className={`mt-6 rounded-[24px] border-[1.5px] p-5 ${baseDone ? "border-[#DDC98E]/25 opacity-80" : "border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)]"}`}>
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

          {/* 2. Touch 1, as it comes */}
          <section className="mt-4 rounded-[24px] border-2 border-[#DDC98E]/70 bg-[linear-gradient(160deg,rgba(221,201,142,0.12),rgba(13,53,53,0.35))] p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Then · touch it as it comes</p>
            {place.audio && <div className="mt-4"><SlimPlayer src={place.audio} label="Do it with me" big /></div>}
            <button type="button" onClick={() => setReading(0)} className="mt-4 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Rather read it? One step at a time</button>
          </section>

          {/* 3. Touch 2, steered */}
          <section className="mt-4 rounded-[24px] border-[1.5px] border-[#DDC98E]/45 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Now · do it again, and steer it</p>
            <div className="mt-4"><SlimPlayer src={TM_AUDIO.steerIntro!} label="The steer · 45 seconds" /></div>
            <p className="mt-5 text-[14px] text-[#a79f90]">Say it out loud. Tap the words you used.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STEERS.map((w) => (
                <button key={w} type="button" onClick={() => setSteers((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]))}
                  className={`min-h-[44px] rounded-full border px-4 text-[15px] ${steers.includes(w) ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/30 text-[#f1ece2]/85"}`}>{w}</button>
              ))}
            </div>
          </section>

          {/* 4. One question */}
          <section className="mt-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">Afterwards</p>
            <h3 className="mt-1 font-display text-[28px] font-light">How did it land?</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {ANSWERS.map((a) => (
                <button key={a.id} type="button" onClick={() => (a.id === "no" ? setStopFor(a.id) : finish(a.id))}
                  className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] text-[15px] text-[#f1ece2] active:scale-[0.97]"
                  style={{ borderColor: a.color, background: `${a.color}22` }}>
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: a.color }} />{a.short}
                </button>
              ))}
            </div>
          </section>
        </div>
      </>
    );
  } else {
    // all six learned: go back to a place
    body = (
      <>
        <Hero eyebrow="Your pick" title="Go back to a place you loved" />
        <div className="mx-auto mt-6 grid max-w-2xl gap-2 px-5">
          {PLACES.map((p) => {
            const e = [...finished].reverse().find((x) => x.place === p.id);
            const a = ANSWERS.find((x) => x.id === e?.answer);
            return (
              <button key={p.id} type="button" onClick={() => setPick(p.id)}
                className="flex min-h-[56px] items-center justify-between rounded-2xl border border-[#DDC98E]/30 px-4 text-left text-[16px]">
                <span className="flex items-center gap-2">{a && <span className="h-3 w-3 rounded-full" style={{ background: a.color }} />}{p.label}</span>
                <span className="text-[12px] text-[#8f877a]">{(e?.steers ?? []).slice(0, 2).join(", ").toLowerCase()}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] pb-24 text-[#f1ece2]">
      {body}
      {state.introSeen && map}

      {reading !== null && place && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#070707]/95 px-5 pb-8 pt-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setReading(null)} className="min-h-[44px] text-[14px] text-[#a79f90]">Close</button>
              <div className="flex flex-1 gap-1.5">
                {place.touch.map((_, n) => <span key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n <= reading ? "#DDC98E" : "rgba(255,255,255,0.15)" }} />)}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center" key={reading}>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#DDC98E]">{reading + 1} of {place.touch.length}</p>
              <p className="tm-rise mt-3 font-display text-[28px] font-light leading-[1.25]">{place.touch[reading]}</p>
            </div>
            <div className="flex gap-3">
              {reading > 0 && <button type="button" onClick={() => setReading(reading - 1)} className="min-h-[56px] flex-1 rounded-full border border-[#DDC98E]/40 text-[#DDC98E]">Back</button>}
              <button type="button" onClick={() => setReading(reading + 1 < place.touch.length ? reading + 1 : null)}
                className="min-h-[56px] flex-[2] rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">
                {reading + 1 < place.touch.length ? "Next" : "Finished"}
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
