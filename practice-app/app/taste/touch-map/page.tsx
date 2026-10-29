"use client";

// THE TOUCH MAP TASTE = THE STEER (spec S8, 29 Oct 2026). Free, open, no
// sign-in. Her neck-kiss reel on top (190K, the steer that made people stop),
// then one place, the wrist: Touch 1 as it comes, Touch 2 steered with her
// words, "did that add a little frisson?", the wrist colours in, then one
// door. Leave them hungry (Juliette, 27 Oct).

import { useEffect, useState } from "react";
import { count } from "@/lib/count";
import { TapCheck } from "@/components/Interactive";
import { BodyMap, Voice, FullStop, PlaceClip, FirstTouch, SteerTouch, Frisson, type MapEntry } from "@/components/TouchMap";
import { PLACES, ANSWERS, SCRIPTS, TM_AUDIO, TM_BUY_URL, TASTER_CLIP, type Answer } from "@/lib/content/touch-map";

const KEY = "ffy.touchmap.taste.v2";
type Step = "first" | "steer" | "answer" | "stop" | "done";
type Saved = { step: Step; steers?: string[]; answer?: Answer; landed?: string };
const WRIST = PLACES[0];

export default function TasteTouchMap() {
  const [s, setS] = useState<Saved>({ step: "first" });
  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v?.step) setS(v); } catch {}
    count("tm_taster_open", 0);
  }, []);
  const save = (v: Saved) => { setS(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const finish = (answer: Answer, landed: string) => { save({ ...s, answer, landed, step: "done" }); count("tm_taster_done", 0); };

  const entries: MapEntry[] = s.answer ? [{ area: WRIST.area, place: WRIST.id, date: "", steers: s.steers, answer: s.answer }] : [];
  const others = PLACES.slice(1).map((p) => p.label);

  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <p className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">
          The Touch Map · a taste
        </p>

        <PlaceClip src={TASTER_CLIP} label="The neck-kiss reel" poster="/touch-map/taster-neck-kiss-poster.jpg" />

        <p className="mt-7 text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Your free taste · your wrist · about four minutes · just you</p>
        <h1 className="mt-2 font-display text-3xl font-light leading-tight sm:text-4xl">Steer it until it lands</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#cfc8bb]">{TASTER_CLIP ? "You just watched me steer him. Now you steer your own hand." : "I steer Alex out loud, in tiny words. Now you steer your own hand."}</p>

        <div className="mt-6">
          <TapCheck k="tm-taste-ready-v2" label="Before you press play" done="Ready. Press play."
            items={["Sleeves up, somewhere comfy.", "Phone volume up, five quiet minutes.", "Ready to say a few words out loud, even if it feels silly."]} />
        </div>

        <Voice src={TM_AUDIO.taster} label="Listen: about a minute" script={SCRIPTS.taster} />

        {s.step === "first" && <FirstTouch place={WRIST} onDone={() => save({ step: "steer" })} />}
        {s.step === "steer" && <SteerTouch place={WRIST} onDone={(steers) => save({ step: "answer", steers })} />}
        {s.step === "answer" && <Frisson onAnswer={(a, landed) => (a === "no" ? save({ ...s, step: "stop", landed }) : finish(a, landed))} />}
        {s.step === "stop" && <FullStop onContinue={() => finish("no", s.landed ?? "")} />}

        <div className="mt-10">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your map</p>
          <BodyMap entries={entries} active={s.step !== "done" ? WRIST.area : undefined} />
          <p className="mt-2 text-center text-[13px] text-[#8f877a]">
            {s.answer
              ? `Your wrist: ${(s.steers ?? []).join(", ").toLowerCase() || "as it came"}. ${ANSWERS.find((x) => x.id === s.answer)?.label}. Kept on this phone only.`
              : "Your wrist colours in when you answer."}
          </p>
        </div>

        {s.step === "done" && (
          <div className="tm-done mt-8 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
            <span className="block font-display text-4xl font-light leading-none text-[#DDC98E]">Done</span>
            <p className="mt-3 text-[15px]">That&rsquo;s what every day in the Touch Map feels like.</p>
          </div>
        )}

        <div className="mt-12 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">That was one place</p>
          <h2 className="mt-2 font-display text-[28px] font-light leading-tight">Every day, a new place to steer.</h2>
          <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-[15px] text-[#cfc8bb]">
            {others.slice(0, 4).map((l) => <li key={l}>🔒 {l}</li>)}
            <li className="text-[#8f877a]">…and the rest of your body</li>
          </ul>
          <p className="mt-5 text-[15px] text-[#cfc8bb]">My voice in your ear for every place, my whole Touch Menu in your Pleasure Language, your map and your own recipe. Yours to keep.</p>
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
