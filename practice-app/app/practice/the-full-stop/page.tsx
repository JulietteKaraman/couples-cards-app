"use client";

// THE FULL STOP, IN THE APP. specs/the-full-stop-app.md.
// 2 Nov 2026, Juliette: "I actually really like what you did, so I'm wondering
// if we can do that whole funnel." No sign-in. What he does and writes stays on
// his phone. Only anonymous counts leave it.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BITE_CSS, FEELS, Html, Photo, PLAIN_GOLD, StepBar, Voice, read, write } from "@/components/BiteKit";
import { FS } from "@/lib/content/the-full-stop";
import { count } from "@/lib/count";

const DIR = "/the-full-stop";
const STATE_KEY = "ffy.fs.state.v1";
const DAYS_KEY = "ffy.fs.days.v1";
const TRUE_KEY = "ffy.fs.true.v1";

const STEPS = [
  { id: "cover", name: "" },
  { id: "what", name: "What it is" },
  { id: "why", name: "Why the name" },
  { id: "question", name: "The question" },
  { id: "leaks", name: "Three leaks" },
  { id: "pairs", name: "12 pairs" },
  { id: "nothing", name: "When she says nothing" },
  { id: "practise", name: "Practise it" },
  { id: "week", name: "Your week" },
] as const;

const DAY_NAMES = ["Day one", "Day two", "Day three", "Day four", "Day five", "Day six", "Day seven"];
const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

type Day = { on: string; feel?: string };

function WeekDots({ days }: { days: Day[] }) {
  const rows = Math.max(1, Math.ceil(days.length / 7) + (days.length > 0 && days.length % 7 === 0 ? 1 : 0));
  return (
    <div className="mt-6" data-testid="week">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="mb-4">
          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map((name, i) => {
              const d = days[r * 7 + i];
              return (
                <div key={name} className="flex flex-col items-center gap-1.5">
                  <span data-filled={d ? "1" : "0"} data-feel={d?.feel ?? ""} className={`h-6 w-6 rounded-full border ${r * 7 + i === days.length - 1 ? "dot-pop" : ""}`}
                    style={{ background: d ? (FEELS.find((f) => f.id === d.feel)?.color ?? PLAIN_GOLD) : "transparent", borderColor: d ? "transparent" : "rgba(221,201,142,0.4)" }} />
                  <span className="text-center text-[10px] leading-tight text-[#a79f90]">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => (
          <span key={f.id} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Pairs() {
  const [i, setI] = useState(0);
  const [attached, setAttached] = useState(false);
  const [reached, setReached] = useState(1);
  const [stop, withQ] = FS.pairs[i];
  const seg = (on: boolean) => `min-h-[44px] rounded-full px-2 text-[13px] transition ${on ? "bg-[#DDC98E] text-[#070707]" : "text-[#cfc8bb]"}`;
  const move = (n: number) => {
    const next = (i + n + FS.pairs.length) % FS.pairs.length;
    setI(next);
    setAttached(false);
    setReached((r) => Math.max(r, next + 1));
  };
  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-black/40 p-1">
        <button type="button" className={seg(!attached)} aria-pressed={!attached} onClick={() => setAttached(false)}>Full stop</button>
        <button type="button" className={seg(attached)} aria-pressed={attached} onClick={() => setAttached(true)}>With something attached</button>
      </div>
      <button key={`${i}-${attached}`} type="button" data-testid="pair" onClick={() => setAttached((a) => !a)}
        className={`wssr-flip mt-3 flex min-h-[170px] w-full items-center rounded-3xl border-[1.5px] p-6 text-left font-display text-[23px] font-light leading-snug transition ${attached ? "border-[#EEDE80]/60 bg-[rgba(168,133,56,0.16)] text-[#EEDE80]" : "border-[#DDC98E]/45 bg-[rgba(13,53,53,0.45)] text-[#f1ece2]"}`}>
        {attached ? withQ : stop}
      </button>
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {FS.pairs.map((p, n) => <span key={p[0]} className={`h-2 w-2 rounded-full transition ${n === i ? "scale-125 bg-[#EEDE80]" : n < reached ? "bg-[#DDC98E]" : "bg-[rgba(221,201,142,0.2)]"}`} />)}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" aria-label="Previous pair" onClick={() => move(-1)} className="h-11 w-11 rounded-full border border-[#DDC98E]/40 text-[#DDC98E]">←</button>
        <span data-testid="pair-count" className="text-[12px] uppercase tracking-[0.18em] text-[#a79f90]">{i + 1} of {FS.pairs.length}</span>
        <button type="button" aria-label="Next pair" onClick={() => move(1)} className="h-11 w-11 rounded-full border border-[#DDC98E]/40 text-[#DDC98E]">→</button>
      </div>
      {/* Every pair stays in the page for screen readers. */}
      <ul className="sr-only">
        {FS.pairs.map((p) => <li key={p[0]}>{p[0]} {p[1]}</li>)}
      </ul>
    </div>
  );
}

export default function TheFullStop() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [days, setDays] = useState<Day[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [feel, setFeel] = useState("");
  const [today, setToday] = useState("");
  const counted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- phone storage is only readable after mount */
    setStep(read<number>(STATE_KEY, 0));
    setDays(read<Day[]>(DAYS_KEY, []));
    setLines(read<string[]>(TRUE_KEY, []));
    setToday(todayUK());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (!counted.current) {
      counted.current = true;
      count("fs_open");
    }
  }, []);

  useEffect(() => {
    if (ready) write(STATE_KEY, step);
  }, [step, ready]);

  const go = (n: number) => {
    document.querySelectorAll<HTMLAudioElement>(".wssr audio").forEach((a) => a.pause());
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const begin = () => {
    go(1);
    // Inside the tap, or a phone refuses to play it.
    document.querySelector<HTMLAudioElement>("#fs-f1 audio")?.play().catch(() => {});
  };

  const iDidIt = () => {
    const d: Day = { on: today || todayUK(), ...(feel ? { feel } : {}) };
    const next = [...days, d];
    setDays(next);
    write(DAYS_KEY, next);
    setFeel("");
    count("fs_day", ((next.length - 1) % 7) + 1, feel || undefined);
  };
  const saveLine = () => {
    const t = draft.trim();
    if (!t) return;
    const next = [t, ...lines];
    setLines(next);
    write(TRUE_KEY, next);
    setDraft("");
  };

  const cur = STEPS[step]?.id ?? "cover";
  const show = (id: string) => (cur === id ? "" : "hidden");
  const doneToday = days.length > 0 && days[days.length - 1].on === today;
  const weekFull = days.length > 0 && days.length % 7 === 0;
  const dayName = DAY_NAMES[days.length % 7];
  const last = step === STEPS.length - 1;

  return (
    <main className="wssr min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      {/* Stays dark while his phone's saved step is read, so there is no white flash. */}
      <div className="mx-auto max-w-2xl px-5 pb-36 pt-6" style={{ visibility: ready ? "visible" : "hidden" }}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Your library</Link>
          {cur !== "cover" && (
            <button type="button" onClick={() => go(1)} className="inline-flex min-h-[44px] items-center text-sm text-[#DDC98E] underline underline-offset-4">Do it again</button>
          )}
        </div>

        {cur !== "cover" && <StepBar step={step} total={STEPS.length - 1} />}

        <section className={show("cover")}>
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
            <Image src={`${DIR}/cover.jpg`} alt="Juliette on a sofa, looking away, quiet" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">One a day · For a week · 12 worked pairs</p>
          <h1 className="mt-2 font-display text-[38px] font-light leading-[1.08]">The Full Stop</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#cfc8bb]">One true thing. <em className="not-italic text-[#EEDE80]">No question on the end.</em></p>
          <div className="mt-6 flex items-center gap-4">
            <Image src={`${DIR}/hub/me.jpg`} alt="Juliette" width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover" />
            <div>
              <p className="text-[16px]">A minute from me first</p>
              <p className="text-[14px] text-[#a79f90]">Tap Begin and I&rsquo;ll welcome you in.</p>
            </div>
          </div>
          <button type="button" onClick={begin} className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">Begin →</button>
        </section>

        <section className={show("what")}>
          <Photo src={`${DIR}/photos/peek-her.jpg`} alt="Juliette on a blue sofa, looking straight at you" pos="50% 45%" ratio="3 / 2" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Start here</p>
          <Voice id="fs-f1" src={`${DIR}/voice/F1.m4a`} label="A minute from me" />
          <Html html={FS.what} />
        </section>

        <section className={show("why")}>
          <Photo src={`${DIR}/photos/juli-03.jpg`} alt="Juliette and Alex in black tie" pos="50% 20%" ratio="4 / 5" />
          <Html html={FS.why} />
        </section>

        <section className={show("question")}>
          <Photo src={`${DIR}/photos/jp-36.jpg`} alt="Juliette smiling, reaching towards the camera" pos="50% 50%" ratio="8 / 5" />
          <Html html={FS.question} />
        </section>

        <section className={show("leaks")}>
          <Photo src={`${DIR}/photos/jp-16.jpg`} alt="Juliette, close up" pos="50% 50%" ratio="4 / 5" />
          <Html html={FS.leaks} />
        </section>

        <section className={show("pairs")}>
          <Photo src={`${DIR}/photos/peek-kiss.jpg`} alt="Juliette and Alex hugging on the terrace, her in a white dress" pos="50% 7%" ratio="4 / 5" />
          <Html html={FS.pairsIntro} />
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Listen</p>
          <Voice src={`${DIR}/voice/F2.m4a`} label="Hear the difference" />
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#a79f90]">Or tap any one to hear the difference</p>
          <Pairs />
          <Html html={FS.pairsAfter} />
        </section>

        <section className={show("nothing")}>
          <Photo src={`${DIR}/photos/jp-18.jpg`} alt="Juliette in a white dress, quiet" pos="50% 8%" ratio="4 / 5" />
          <Html html={FS.nothing} />
        </section>

        <section className={show("practise")}>
          <Photo src={`${DIR}/photos/peek-buda2.jpg`} alt="Juliette and Alex, a selfie in the evening" pos="50% 53%" ratio="4 / 5" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Your week</p>
          <Voice src={`${DIR}/voice/F3.m4a`} label="How to practise it" />
          <Html html={FS.practise} />
        </section>

        <section className={show("week")}>
          <Photo src={`${DIR}/photos/juli-24.jpg`} alt="Juliette and Alex, a selfie under the leaves" pos="50% 85%" ratio="4 / 5" />
          <Html html={FS.weekHead} />

          <div className="mt-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
            {doneToday ? (
              <div className="wssr-done rounded-2xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-5 text-center" data-testid="done-today">
                <span className="block font-display text-3xl font-light text-[#DDC98E]">✓</span>
                <p className="mt-2 font-display text-[20px] font-light">{weekFull ? "A week of Full Stops. That is enough." : "One a day is enough."}</p>
              </div>
            ) : (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{dayName}</p>
                <p className="mt-1 font-display text-[20px] font-light">How much did you notice?</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {FEELS.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFeel(feel === f.id ? "" : f.id)} aria-pressed={feel === f.id}
                      style={feel === f.id ? { boxShadow: `0 0 26px -4px ${f.color}`, borderColor: f.color } : undefined}
                      className={`flex min-h-[48px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-[14px] transition ${feel === f.id ? "bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/40 text-[#cfc8bb]"}`}>
                      <span className={`h-4 w-4 rounded-full transition ${feel === f.id ? "scale-150" : ""}`} style={{ background: f.color }} />
                      {f.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={iDidIt} className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">I did it ✓</button>
              </>
            )}
            <WeekDots days={days} />
          </div>

          <div className="mt-6">
            <label htmlFor="fs-true" className="block text-[14px] text-[#DDC98E]">Write down today&rsquo;s one true thing</label>
            <textarea id="fs-true" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="I liked that jumper on you."
              className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
            <button type="button" onClick={saveLine} className="mt-2 inline-flex min-h-[44px] items-center rounded-full border border-[#DDC98E]/60 px-5 text-[14px] text-[#DDC98E]">Save it</button>
            <div className="mt-2 text-[13px] text-[#a79f90]">What you write stays on your phone. Not even I see it.</div>
            {lines.length > 0 && (
              <ul className="mt-3 space-y-2" data-testid="true-lines">
                {lines.map((l, i) => <li key={i} className="border-l-2 border-[#DDC98E] pl-3 text-[15px] text-[#cfc8bb]">{l}</li>)}
              </ul>
            )}
          </div>

          <p className="kicker" style={{ marginTop: 36 }}>Keep going</p>
          <a href="https://feelfullyyou.com/31-touch-points" className="flex items-center gap-4 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] p-3">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
              <Image src={`${DIR}/up-31tp.jpg`} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-[20px] font-light leading-tight">31 Touch Points</span>
              <span className="mt-1 block text-[14px] text-[#cfc8bb]">31 days back to each other, through touch, fun and play. One small practice a day, in the app.</span>
              <span className="mt-1 block text-[15px] text-[#DDC98E]">£27 →</span>
            </span>
          </a>
        </section>
      </div>

      {cur !== "cover" && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDC98E]/20 bg-[#070707]/92 px-4 pt-2.5 backdrop-blur" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#8f877a]">{step} of {STEPS.length - 1}</p>
          <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr] items-center gap-2.5">
            <button type="button" aria-label="Back" onClick={() => go(step - 1)} className="h-[52px] w-[52px] rounded-full border border-[#DDC98E]/40 text-lg text-[#DDC98E]">←</button>
            <button type="button" onClick={() => go(last ? 0 : step + 1)} className="h-[52px] truncate rounded-full bg-[#DDC98E] px-5 font-display text-[16px] font-medium text-[#070707]">
              {last ? "Back to the start" : `${STEPS[step + 1].name} →`}
            </button>
          </div>
        </nav>
      )}

      <style>{BITE_CSS}</style>
    </main>
  );
}
