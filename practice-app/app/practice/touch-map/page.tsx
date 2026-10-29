"use client";

// The Touch Map hub (29 Oct 2026). The step after One Touch.
// Juliette: "Build this from everything that we have... everything lives in the
// app." Start here = the steer week. Then her whole Touch Menu, led by your
// Pleasure Language, one touch a day, steered, coloured in on your map.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { count } from "@/lib/count";
import { useMenuState, LanguagePicker, TouchCard, MenuGlance, nextTouch, curiousTouch, languageOf } from "@/components/TouchMenu";
import { todayStr } from "@/components/TouchMap";
import { PLACES, TM_APPLY_URL, TM_VIP_BOOK_URL, TM_SLUG, LANGUAGES, LANG_STYLE, type LanguageId } from "@/lib/content/touch-map";
import { PleasureQuiz, QUIZ_CSS } from "@/components/PleasureQuiz";

export default function TouchMapHub() {
  return (
    <CollectionGate collectionSlug={TM_SLUG}>
      <Hub />
    </CollectionGate>
  );
}

function Hub() {
  const [state, save] = useMenuState();
  const [steerDone, setSteerDone] = useState(0);
  const [chooseMyself, setChooseMyself] = useState(false);
  // ?retake=1 always starts the quiz fresh (used by the review page and "Retake the quiz")
  useEffect(() => {
    if (!state) return;
    try {
      if (new URLSearchParams(window.location.search).get("retake") === "1" && state.languages.length) {
        save({ ...state, languages: [], scores: undefined });
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch {}
  }, [state, save]);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("ffy.touchmap.v2") || "null");
      const places = new Set((v?.entries ?? []).filter((e: { partial?: boolean; place?: string }) => !e.partial && e.place).map((e: { place: string }) => e.place));
      setSteerDone(places.size);
    } catch {}
  }, []);

  if (!state) return <main className="min-h-screen bg-[#070707]" aria-busy="true" />;

  const shell = (children: React.ReactNode) => (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-6">
        <Link href="/" className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← The Feel Fully You App</Link>
        {children}
      </div>
      <style>{QUIZ_CSS}</style>
    </main>
  );

  if (!state.languages.length) {
    return shell(
      chooseMyself ? (
        <>
          <LanguagePicker onDone={(languages) => save({ ...state, languages })} />
          <button type="button" onClick={() => setChooseMyself(false)} className="mt-5 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Take the quiz instead</button>
        </>
      ) : (
        <PleasureQuiz onChooseMyself={() => setChooseMyself(true)} onDone={(languages, scores) => save({ ...state, languages, scores })} />
      ),
    );
  }

  const today = todayStr();
  const doneToday = Object.values(state.marks).some((m) => m.date === today);
  const next = nextTouch(state);
  const curious = curiousTouch(state);
  const way = languageOf(state.languages[0]);
  const anyDone = Object.keys(state.marks).length > 0 || steerDone > 0;
  const wayStyle = LANG_STYLE[state.languages[0]];
  const mix = (LANGUAGES.map((l) => [l.id, state.scores?.[l.id] ?? 0]) as [LanguageId, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const mixTotal = mix.reduce((a, [, n]) => a + n, 0);

  return shell(
    <>
      {/* Her photo for your way in, and your mix */}
      <div className="relative mt-6 h-72 overflow-hidden rounded-[28px] border-2" style={{ borderColor: wayStyle.color }}>
        <Image src={wayStyle.img} alt="" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover" style={{ objectPosition: wayStyle.pos }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#DDC98E" }}>Your Touch Map · way in: {way?.label}</p>
          <h1 className="mt-1 font-display text-[34px] font-light leading-tight">Touch it. Then steer it.</h1>
          {mixTotal > 0 && (
            <div className="mt-3 flex h-2 overflow-hidden rounded-full" aria-label="Your Pleasure Language mix">
              {mix.map(([id, n]) => <span key={id} style={{ width: `${(n / mixTotal) * 100}%`, background: LANG_STYLE[id].color }} />)}
            </div>
          )}
        </div>
      </div>

      {/* Start here: the steer week, as six places */}
      <Link href="/practice/touch-map/steer" className="mt-4 block rounded-[24px] border-[1.5px] border-[#DDC98E]/50 bg-[rgba(13,53,53,0.45)] p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">{steerDone >= PLACES.length ? "You've learned the steer" : "Start here · learn the steer"}</span>
          <span className="text-[13px] text-[#DDC98E]">→</span>
        </div>
        <div className="mt-4 flex justify-between">
          {PLACES.map((p, n) => (
            <span key={p.id} className="flex w-12 flex-col items-center gap-1.5 text-center">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] text-[13px] ${n < steerDone ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : n === steerDone ? "border-[#DDC98E] text-[#DDC98E] shadow-[0_0_18px_-4px_rgba(221,201,142,0.9)]" : "border-white/20 text-white/40"}`}>{n < steerDone ? "✓" : n + 1}</span>
              <span className="text-[10px] leading-tight text-[#a79f90]">{p.label.replace(/^Your |^The /, "")}</span>
            </span>
          ))}
        </div>
      </Link>

      {/* Your touch today */}
      <div className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your touch today</p>
        <div className="mt-3">
          {doneToday ? (
            <p className="rounded-2xl border border-[#DDC98E]/30 p-5 text-[15px] text-[#cfc8bb]">That&rsquo;s today. Let it settle. Your next touch is here tomorrow.</p>
          ) : next ? (
            <TouchCard t={next} eyebrow={`${languageOf(next.language)?.label} · for you`} />
          ) : (
            <p className="rounded-2xl border border-[#DDC98E]/30 p-5 text-[15px] text-[#cfc8bb]">You&rsquo;ve tried every touch in your languages. Go back to a green one, or get curious below.</p>
          )}
        </div>
        {curious && !doneToday && (
          <div className="mt-3"><TouchCard t={curious} eyebrow={`Feeling curious? Try ${languageOf(curious.language)?.label}`} /></div>
        )}
        <p className="mt-3 text-[13px] text-[#8f877a]">One touch a day is plenty. Capacity builds.</p>
      </div>

      {/* The whole library, for life */}
      <div className="mt-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your Touch Menu · yours for life</p>
        <h2 className="mt-1 font-display text-[28px] font-light leading-tight">Every touch I teach, in my voice</h2>
        <p className="mt-2 text-[14px] text-[#a79f90]">Swipe along each row. Each touch takes on your colour once you&rsquo;ve tried it.</p>
        <div className="mt-6"><MenuGlance state={state} /></div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[13px] text-[#8f877a]">Kept on this phone only. Not even I see it.</p>
          <button type="button" onClick={() => save({ ...state, languages: [], scores: undefined })} className="min-h-[44px] text-[13px] text-[#a79f90] underline underline-offset-4">Retake the quiz</button>
        </div>
      </div>

      {anyDone && !TM_VIP_BOOK_URL && (
        <p className="mt-12 text-center text-[15px] text-[#a79f90]">Want me there with you? <a href={TM_APPLY_URL} className="inline-flex min-h-[44px] items-center text-[#DDC98E] underline underline-offset-4">Talk to me about 1:1</a></p>
      )}
      {anyDone && TM_VIP_BOOK_URL && (
        <div className="mt-12 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">When you want me there</p>
          <h2 className="mt-2 font-display text-[28px] font-light leading-tight">The VIP Touch Map</h2>
          <p className="mt-3 text-[15px] text-[#cfc8bb]">Thirty minutes online, the two of you, me guiding you both through your map.</p>
          {TM_VIP_BOOK_URL ? (
            <a href={TM_VIP_BOOK_URL} onClick={() => count("tm_vip_click", 0)}
              className="mt-5 inline-flex min-h-[52px] items-center rounded-full bg-[#DDC98E] px-7 text-[16px] font-medium text-[#070707]">Book your VIP Touch Map</a>
          ) : null}
          <p className="mt-6 text-[14px] text-[#a79f90]">Or <a href={TM_APPLY_URL} className="inline-flex min-h-[44px] items-center text-[#DDC98E] underline underline-offset-4">talk to me about 1:1</a>.</p>
        </div>
      )}
    </>,
  );
}
