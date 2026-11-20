"use client";

// The Sacred No, 20 Nov 2026 (Juliette: "make it more interactive, like One Touch and
// all the other apps", and "the little tile looks different"). Same seven lessons and the
// same one-day-at-a-time rule; the screens now work like One Touch:
//   Today screen: the library tile's photo, seven circles, a Today card, two tabs
//   (Seven days · Your nos).
//   A day: 1 Arrive (how present is your body) · 2 Watch (her lesson) · 3 Your answer
//   (one question from that lesson) · then "I did it", a chime, came in / leaving at.
// Answers stay on her phone (localStorage), like One Touch and Let Her Land.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { localVideoPoster, localVideoSrc } from "@/lib/content/local-audio";

const LS = "ffy.sn.";
function lsGet<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(LS + k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function lsPut(k: string, v: unknown) {
  try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {}
}
function useLS<T>(k: string, d: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(d);
  useEffect(() => { setV(lsGet(k, d)); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  return [v, (nv: T) => { setV(nv); lsPut(k, nv); }];
}
function chime(notes = [523, 659, 784, 1047]) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const a = new AC(); const t = a.currentTime;
    notes.forEach((f, k) => {
      const o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = f;
      const s = t + k * 0.1; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.09, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 1.1); o.connect(g); g.connect(a.destination); o.start(s); o.stop(s + 1.2);
    });
  } catch {}
}

/** One question per day, taken from that lesson's own description. Needs Juliette's approval. */
export const SN_DAY_QUESTION: Record<number, string> = {
  1: "Where did you first learn that a no turns into a yes if someone pushes long enough?",
  2: "What did your body's real yes feel like today? And your real no?",
  3: "Which time did you say yes when your body was already saying no?",
  4: "After two minutes with your own hands, what does your body want right now?",
  5: "Who do you say yes to when you mean no?",
  6: "Which standard do you keep when no one is watching, and which one are you raising?",
  7: "What has already started to shift this week?",
};

type Entry = { slug: string; title: string; eyebrow?: string };
const clean = (t: string) => t.replace(/^\d+\s/, "");

function Circles({ done, today }: { done: number; today: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => (
        <span key={d} aria-label={`Day ${d}`}
          className={`relative h-3.5 w-3.5 rounded-full border ${d <= done ? "border-[#DDC98E] bg-[#DDC98E] shadow-[0_0_12px_rgba(221,201,142,.6)]" : d === today ? "border-[#DDC98E]" : "border-[#DDC98E]/25"}`}>
          {d === today && d > done && <span className="absolute inset-[3px] rounded-full bg-[#DDC98E]/70" />}
        </span>
      ))}
    </div>
  );
}

function TodayCard({ eyebrow, title, line, href, cta }: { eyebrow: string; title: string; line: string; href: string; cta: string }) {
  return (
    <Link href={href} data-testid="sn-today" className="mt-6 block rounded-3xl border border-[#DDC98E]/35 bg-gradient-to-br from-[#1b1710] to-[#0d0d0d] p-6 shadow-[0_30px_70px_-35px_rgba(221,201,142,.45)] transition hover:border-[#DDC98E]/70">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-[28px] font-light leading-tight">{title}</h2>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-[#F6EFE0]/60">{line}</span>
        <span className="shrink-0 rounded-full bg-[#DDC98E] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#070707]">{cta}</span>
      </div>
    </Link>
  );
}

function BodyCheck({ value, onChange, label }: { value: number | null; onChange: (v: number) => void; label: string }) {
  return (
    <div className="mt-6">
      <p className="text-center font-display text-lg font-light">{label}</p>
      <div className="mt-4 grid grid-cols-10 gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={`aspect-square rounded-full border text-sm transition ${value === n ? "scale-110 border-[#EEDE80] bg-[#EEDE80] text-[#070707]" : value !== null && n < value ? "border-[#DDC98E]/60 bg-[#DDC98E]/25 text-[#F6EFE0]" : "border-[#DDC98E]/30 text-[#F6EFE0]/70"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#F6EFE0]/40"><span>Not here</span><span>Fully here</span></div>
    </div>
  );
}

export function SnVideo({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex justify-center">
      <video src={localVideoSrc(id)} poster={localVideoPoster(id)} controls playsInline preload="metadata" controlsList="nodownload"
        className="block h-auto max-h-[72vh] w-auto max-w-full rounded-2xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-black shadow-[0_0_50px_-20px_rgba(221,201,142,0.55)]">
        {label}
      </video>
    </div>
  );
}

function icsFor(title: string, url: string) {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(d.getTime() + 15 * 60000);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Feel Fully You//The Sacred No//EN", "BEGIN:VEVENT",
    `UID:sacredno-${d.getTime()}@feelfullyyou.com`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(d)}`, `DTEND:${f(end)}`,
    `SUMMARY:The Sacred No: ${title}`, `DESCRIPTION:Your next lesson. ${url}`, `URL:${url}`,
    "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", "DESCRIPTION:The Sacred No", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sacred-no-tomorrow.ics"; a.click();
}

/* ================= TODAY SCREEN ================= */
export function SacredNoToday(props: {
  entries: Entry[]; doneSlugs: string[] | null; dayOf: (s: string) => number; dayLesson: Record<number, string>;
  unlockedThrough: number; dueAt: number; whenItOpens: (t: number) => string; heroImage: string; thumbOf: (s: string) => string | null;
  isAdmin: boolean;
}) {
  const { entries, doneSlugs, dayOf, dayLesson, unlockedThrough, dueAt, whenItOpens, heroImage, thumbOf, isAdmin } = props;
  const [tab, setTab] = useState<"days" | "nos">("days");
  const done = doneSlugs ? Object.values(dayLesson).filter((s) => doneSlugs.includes(s)).length : 0;
  const welcomed = !!doneSlugs?.includes("welcome");
  const allDone = done >= 7;
  const todayDay = Math.min(7, done + 1);
  const today = entries.find((e) => e.slug === dayLesson[todayDay]);
  const waiting = !allDone && !isAdmin && todayDay > unlockedThrough;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    const a: Record<number, string> = {};
    for (let d = 1; d <= 7; d++) { const v = lsGet<string>(`answer-${dayLesson[d]}`, ""); if (v.trim()) a[d] = v; }
    setAnswers(a); // eslint-disable-line react-hooks/set-state-in-effect
  }, [tab, dayLesson]);

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <section className="relative h-[54vh] overflow-hidden">
        <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-[50%_18%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/40 via-[#070707]/10 to-[#070707]" />
        <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col justify-between px-5 pb-6 pt-5">
          <Link href="/" className="self-start rounded-full border border-[#DDC98E]/40 bg-[#070707]/50 px-4 py-1.5 text-xs text-[#DDC98E] backdrop-blur">← Your library</Link>
          <div>
            <p className="font-display text-[34px] font-light leading-none">The Sacred No</p>
            <div className="mt-3 flex items-center justify-between">
              <Circles done={done} today={todayDay} />
              <span className="text-xs tracking-[0.2em] text-[#F6EFE0]/60">{allDone ? "7 of 7" : `Day ${todayDay} of 7`}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-5 pb-16">
        {!welcomed ? (
          <TodayCard eyebrow="Before you begin" title="Welcome to The Sacred No" line="Start here. A minute from me." href="/practice/the-sacred-no/welcome" cta="Begin" />
        ) : allDone ? (
          <TodayCard eyebrow="You did all seven" title="You know your no now" line="Your bonus meditation is waiting." href="/practice/the-sacred-no/bonus-meditation" cta="Open" />
        ) : waiting ? (
          <div className="mt-6 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-6" data-testid="sn-today">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
            <h2 className="mt-2 font-display text-2xl font-light leading-snug">{today ? clean(today.title) : ""}</h2>
            <p className="mt-2 text-sm text-[#F6EFE0]/60">Opens {dueAt ? whenItOpens(dueAt) : "tomorrow"}. Today is done. Let it land.</p>
          </div>
        ) : today ? (
          <TodayCard eyebrow={`Today · Day ${todayDay}`} title={clean(today.title)} line="About 15 minutes. Three small steps." href={`/practice/the-sacred-no/${today.slug}`} cta="Begin" />
        ) : null}

        <div className="mt-8 flex gap-2">
          {(["days", "nos"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`flex-1 rounded-full border py-2.5 text-xs uppercase tracking-[0.2em] transition ${tab === t ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/30 text-[#DDC98E]"}`}>
              {t === "days" ? "Seven days" : "Your nos"}
            </button>
          ))}
        </div>

        {tab === "days" ? (
          <div className="mt-5 space-y-2.5">
            {entries.map((e) => {
              const d = e.slug === "welcome" ? 0 : dayOf(e.slug);
              const bonus = e.slug === "bonus-meditation";
              const isDone = !!doneSlugs?.includes(e.slug);
              const open = isAdmin || e.slug === "welcome" || d <= unlockedThrough;
              const thumb = thumbOf(e.slug);
              const inner = (
                <div className={`flex items-center gap-4 rounded-2xl border px-3 py-3 ${open ? "border-[#DDC98E]/20 bg-white/[0.03]" : "border-white/5 opacity-45"}`}>
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#0d3535]">
                    {thumb && <Image src={thumb} alt="" fill sizes="56px" className={`object-cover ${open ? "" : "grayscale"}`} />}
                    <span className={`absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border font-display text-[11px] ${isDone ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/60 bg-[#070707]/70 text-[#DDC98E]"}`}>
                      {isDone ? "✓" : d === 0 ? "★" : bonus ? "+" : d}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-[#DDC98E]/80">{d === 0 ? "Welcome" : bonus ? "Bonus" : `Day ${d}`}</span>
                    <span className="block font-display text-[17px] font-light leading-snug">{clean(e.title)}</span>
                  </span>
                  {!open && <span className="text-xs text-[#F6EFE0]/40">Locked</span>}
                </div>
              );
              return open ? <Link key={e.slug} href={`/practice/the-sacred-no/${e.slug}`}>{inner}</Link> : <div key={e.slug}>{inner}</div>;
            })}
          </div>
        ) : (
          <div className="mt-5" data-testid="sn-nos">
            <p className="text-center text-sm text-[#F6EFE0]/60">Everything you wrote this week, in one place. Only you see this.</p>
            {Object.keys(answers).length === 0 ? (
              <p className="mt-6 rounded-2xl border border-[#DDC98E]/15 p-5 text-center text-sm text-[#F6EFE0]/50">Nothing here yet. Each day you answer shows up here.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {Object.entries(answers).map(([d, a]) => (
                  <div key={d} className="rounded-2xl border border-[#DDC98E]/20 bg-white/[0.03] p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#DDC98E]">Day {d}</p>
                    <p className="mt-1 text-sm text-[#F6EFE0]/60">{SN_DAY_QUESTION[Number(d)]}</p>
                    <p className="mt-3 whitespace-pre-wrap font-display text-[17px] font-light italic">{a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

/* ================= A DAY: three steps ================= */
export function SacredNoDay(props: {
  slug: string; day: number; title: string; line: string; videoId: string; extra?: React.ReactNode;
  nextTitle?: string; alreadyDone: boolean; prevHref?: string; nextHref?: string; onDone: () => Promise<void> | void;
}) {
  const { slug, day, title, line, videoId, extra, nextTitle, alreadyDone, onDone, prevHref, nextHref } = props;
  const [step, setStep] = useState(0); // 0 arrive · 1 watch · 2 answer · 3 done
  const [before, setBefore] = useLS<number | null>(`check-${slug}-before`, null);
  const [after, setAfter] = useLS<number | null>(`check-${slug}-after`, null);
  const [answer, setAnswer] = useLS<string>(`answer-${slug}`, "");
  const top = useRef<HTMLDivElement>(null);
  const go = (s: number) => { setStep(s); top.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (alreadyDone) setStep(3); }, [alreadyDone]); // eslint-disable-line react-hooks/set-state-in-effect
  const steps = ["Arrive", "Watch", "Your answer"];

  return (
    <main className="min-h-screen bg-[#070707] text-[#F6EFE0]">
      <div ref={top} className="mx-auto max-w-xl px-5 pb-20 pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← Your library</Link>
            <Link href="/practice/the-sacred-no" className="rounded-full border border-[#DDC98E]/40 px-4 py-1.5 text-xs text-[#DDC98E]">← The Sacred No</Link>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Day {day} of 7</span>
        </div>
        <h1 className="mt-6 font-display text-[32px] font-light leading-tight">{title}</h1>

        {step < 3 && (
          <div className="mt-5 flex gap-2">
            {steps.map((s, i) => (
              <button key={s} type="button" onClick={() => i <= step && go(i)} className="flex-1 text-left">
                <span className={`block h-1 rounded-full ${i <= step ? "bg-[#DDC98E]" : "bg-[#DDC98E]/15"}`} />
                <span className={`mt-1.5 block text-[10px] uppercase tracking-[0.2em] ${i === step ? "text-[#DDC98E]" : "text-[#F6EFE0]/35"}`}>{i + 1} · {s}</span>
              </button>
            ))}
          </div>
        )}

        {step === 0 && (
          <section className="mt-8">
            <p className="text-center text-[15px] leading-relaxed text-[#F6EFE0]/75">Take a breath in through your nose, and exhale through your mouth. Notice what&rsquo;s happening in this body of yours.</p>
            <BodyCheck value={before} onChange={setBefore} label="How present is your body right now?" />
            <button type="button" disabled={before === null} onClick={() => go(1)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707] disabled:opacity-30">Next</button>
          </section>
        )}

        {step === 1 && (
          <section className="mt-8">
            <p className="mb-5 text-[15px] leading-relaxed text-[#F6EFE0]/75">{line}</p>
            <SnVideo id={videoId} label={title} />
            {extra}
            <button type="button" onClick={() => go(2)} className="mt-8 w-full rounded-full bg-[#DDC98E] py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#070707]">I&rsquo;ve watched it</button>
          </section>
        )}

        {step === 2 && (
          <section className="mt-8">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Today&rsquo;s question</p>
            <p className="mt-3 text-center font-display text-[24px] font-light leading-snug">{SN_DAY_QUESTION[day]}</p>
            <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Your answer · only you see this</p>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Write it here, or say it out loud and write one line."
              className="mt-2 w-full resize-y rounded-2xl border border-[#DDC98E]/25 bg-[#14120e] p-4 font-display text-[17px] font-light italic text-[#F6EFE0] placeholder:text-[#F6EFE0]/30" />
            <p className="mt-4 text-center text-xs text-[#F6EFE0]/50">Done when you&rsquo;ve written one line.</p>
            <button type="button" disabled={!answer.trim()} onClick={async () => { await onDone(); chime(); go(3); }}
              className="mt-4 w-full rounded-full bg-[#EEDE80] py-4 text-sm font-medium uppercase tracking-[0.22em] text-[#070707] shadow-[0_0_40px_-6px_rgba(238,222,128,.7)] disabled:opacity-30 disabled:shadow-none">I did it</button>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 text-center" data-testid="sn-done">
            <div className="sn-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#EEDE80] text-3xl text-[#EEDE80] shadow-[0_0_60px_rgba(238,222,128,.55)]">✓</div>
            <h2 className="mt-5 font-display text-3xl font-light">Day {day}, done.</h2>
            {after === null ? (
              <BodyCheck value={after} onChange={setAfter} label="And now? How present is your body?" />
            ) : (
              <p className="mt-5 font-display text-xl font-light text-[#DDC98E]">
                {before !== null ? <>You came in at {before}.<br />You&rsquo;re leaving at {after}.</> : <>You&rsquo;re leaving at {after}.</>}
              </p>
            )}
            {answer.trim() && (
              <div className="mt-6 rounded-2xl border border-[#DDC98E]/15 bg-white/[0.02] p-4 text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#DDC98E]">You wrote</p>
                <p className="mt-2 whitespace-pre-wrap font-display text-[16px] font-light italic">{answer}</p>
              </div>
            )}
            {extra && day === 7 ? <div className="mt-6 text-left">{extra}</div> : null}
            {nextTitle ? (
              <div className="mt-8 rounded-3xl border border-[#DDC98E]/20 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DDC98E]">Tomorrow</p>
                <p className="mt-2 font-display text-xl font-light">{nextTitle}</p>
                <button type="button" onClick={() => icsFor(nextTitle, "https://app.feelfullyyou.com/practice/the-sacred-no")} className="mt-4 rounded-full border border-[#DDC98E] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#DDC98E]">Remind me tomorrow</button>
              </div>
            ) : null}
            <button type="button" onClick={() => go(0)} className="mt-6 block w-full rounded-full border border-[#DDC98E] py-3 text-xs uppercase tracking-[0.22em] text-[#DDC98E]">Do it again</button>
            <Link href="/practice/the-sacred-no" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-[#F6EFE0]/50 underline">Back to The Sacred No</Link>
          </section>
        )}

        {(prevHref || nextHref) && (
          <div className="mt-10 flex items-center justify-between border-t border-[#DDC98E]/15 pt-5 text-sm">
            {prevHref ? <Link href={prevHref} className="min-h-[44px] py-3 text-[#DDC98E]">← Day {day - 1}</Link> : <span />}
            {nextHref ? <Link href={nextHref} className="min-h-[44px] py-3 text-[#DDC98E]">Day {day + 1} →</Link> : <span />}
          </div>
        )}
      </div>
      <style>{`.sn-pop{animation:snpop .7s cubic-bezier(.2,.8,.2,1) both}@keyframes snpop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}`}</style>
    </main>
  );
}
