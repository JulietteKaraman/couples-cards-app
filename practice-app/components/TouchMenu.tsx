"use client";

// The Touch Map, full version (29 Oct 2026): her whole Touch Menu in the app,
// led by her Pleasure Language. Everything she marks lives on this phone only
// (same rule as the rest of the Touch Map).

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MENU, type MenuTouch } from "@/lib/content/touch-menu";
import { ANSWERS, LANGUAGES, LANG_STYLE, type Answer, type LanguageId } from "@/lib/content/touch-map";

export type MenuMark = { date: string; steps: (Answer | null)[]; steers: string[]; answer: Answer; landed?: string };
export type MenuState = { languages: LanguageId[]; marks: Record<string, MenuMark>; scores?: Record<LanguageId, number> };

const KEY = "ffy.touchmap.menu.v1";
const empty = (): MenuState => ({ languages: [], marks: {} });

export function useMenuState() {
  const [state, setState] = useState<MenuState | null>(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null");
      setState(v && Array.isArray(v.languages) ? { ...empty(), ...v } : empty());
    } catch { setState(empty()); }
  }, []);
  const save = (next: MenuState) => {
    setState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  return [state, save] as const;
}

export const languageOf = (id: string) => LANGUAGES.find((l) => l.id === id);
export const colourOf = (a?: Answer) => ANSWERS.find((x) => x.id === a)?.color;
export const touchesFor = (lang: string) => MENU.filter((t) => t.language === lang);

// Today's touch: the first unmarked touch in her languages, her way in first.
export function nextTouch(state: MenuState): MenuTouch | undefined {
  for (const l of state.languages) {
    const t = touchesFor(l).find((x) => !state.marks[x.slug]);
    if (t) return t;
  }
  return undefined;
}

// One touch from a language she hasn't chosen, for curiosity.
export function curiousTouch(state: MenuState): MenuTouch | undefined {
  const other = LANGUAGES.map((l) => l.id).filter((id) => !state.languages.includes(id));
  for (const l of other) {
    const t = touchesFor(l).find((x) => !state.marks[x.slug]);
    if (t) return t;
  }
  return undefined;
}

export function LanguagePicker({ onDone }: { onDone: (langs: LanguageId[]) => void }) {
  const [picked, setPicked] = useState<LanguageId[]>([]);
  const toggle = (id: LanguageId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <section className="mt-7">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Your way in</p>
      <h1 className="mt-2 font-display text-3xl font-light leading-tight">Which one sounds like you?</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-[#cfc8bb]">Nobody is only one. Tap your way in first, then any others that make you curious.</p>
      <div className="mt-5 grid gap-2">
        {LANGUAGES.map((l) => {
          const i = picked.indexOf(l.id);
          return (
            <button key={l.id} type="button" onClick={() => toggle(l.id)}
              className={`flex min-h-[64px] items-center justify-between rounded-2xl border-[1.5px] px-5 text-left ${i >= 0 ? "border-[#DDC98E] bg-[rgba(221,201,142,0.14)]" : "border-[#DDC98E]/30"}`}>
              <span><span className="block font-display text-[20px] text-[#f1ece2]">{l.label}</span><span className="block text-[14px] text-[#a79f90]">{l.line}</span></span>
              {i >= 0 && <span className="text-[12px] uppercase tracking-[0.14em] text-[#DDC98E]">{i === 0 ? "Way in" : "Also"}</span>}
            </button>
          );
        })}
      </div>
      <button type="button" disabled={!picked.length} onClick={() => onDone(picked)}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[15px] font-medium text-[#070707] disabled:opacity-40 sm:w-auto">
        That&rsquo;s me
      </button>
    </section>
  );
}

const modeLabel = (t: MenuTouch) => (t.mode === "solo" ? "on your own" : t.mode === "partnered" ? "with a partner" : "solo or together");

// Today's touch: a big photo card in the touch's own language colour.
export function TouchCard({ t, eyebrow }: { t: MenuTouch; eyebrow?: string }) {
  const lang = languageOf(t.language);
  const st = LANG_STYLE[t.language as LanguageId];
  return (
    <Link href={`/practice/touch-map/t/${t.slug}`}
      className="group relative block h-56 overflow-hidden rounded-[26px] border-2 transition active:scale-[0.99]" style={{ borderColor: st.color }}>
      <Image src={st.img} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: st.pos }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/75 to-[#070707]/10" />
      <div className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-end p-5">
        {eyebrow && <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "#DDC98E" }}>{eyebrow}</span>}
        <span className="mt-1 font-display text-[28px] font-light leading-tight text-[#f1ece2]">{t.title}</span>
        <span className="mt-1 text-[13px] text-[#cfc8bb]">{lang?.label} · {modeLabel(t)}{t.minutes ? ` · ${t.minutes} min` : ""}</span>
        <span className="mt-4 inline-flex h-11 w-fit items-center gap-2 rounded-full px-5 text-[14px] font-medium" style={{ background: st.color, color: st.ink }}>▶ Start</span>
      </div>
    </Link>
  );
}

// The whole library: one swipeable row per language, her photo at the head of
// each row, every touch a card that takes on its colour once it's been tried.
export function MenuGlance({ state }: { state: MenuState }) {
  const order = [...state.languages, ...(LANGUAGES.map((l) => l.id) as LanguageId[]).filter((id) => !state.languages.includes(id))];
  return (
    <div className="space-y-9">
      {order.map((id) => {
        const l = languageOf(id)!;
        const st = LANG_STYLE[id];
        const list = touchesFor(id);
        if (!list.length) return null;
        const tried = list.filter((t) => state.marks[t.slug]).length;
        return (
          <div key={id}>
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: st.color }}>
                <Image src={st.img} alt="" fill sizes="48px" className="object-cover" style={{ objectPosition: st.pos }} />
              </span>
              <div className="flex-1">
                <p className="font-display text-[22px] leading-none">{l.label}{state.languages[0] === id ? <span className="ml-2 align-middle text-[10px] uppercase tracking-[0.18em]" style={{ color: "#DDC98E" }}>your way in</span> : null}</p>
                <p className="mt-1 text-[13px] text-[#a79f90]">{l.line}</p>
              </div>
              <span className="text-[12px] text-[#8f877a]">{tried}/{list.length}</span>
            </div>
            <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {list.map((t) => {
                const m = state.marks[t.slug];
                const c = m ? colourOf(m.answer) : undefined;
                return (
                  <Link key={t.slug} href={`/practice/touch-map/t/${t.slug}`}
                    className="relative flex h-40 w-36 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl p-3.5 transition active:scale-[0.97]"
                    style={{ background: `linear-gradient(165deg, ${st.color}aa 0%, ${st.color}40 38%, #0b1c1c 78%, #070707 100%)`, border: `1.5px solid ${c ?? st.color + "55"}` }}>
                    <span className="flex items-center justify-between text-[11px] text-[#cfc8bb]">
                      <span>{t.minutes ? `${t.minutes} min` : ""}</span>
                      {m ? <span className="h-3 w-3 rounded-full" style={{ background: c }} /> : <span className="h-3 w-3 rounded-full border" style={{ borderColor: st.color }} />}
                    </span>
                    <span>
                      <span className="block font-display text-[17px] leading-tight text-[#f1ece2]">{t.title}</span>
                      <span className="mt-1 block text-[11px] text-[#a79f90]">{modeLabel(t)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
