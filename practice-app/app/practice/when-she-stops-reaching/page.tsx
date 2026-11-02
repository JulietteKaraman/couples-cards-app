"use client";

// WHEN SHE STOPS REACHING, IN THE APP. specs/when-she-stops-reaching-app.md.
// 2 Nov 2026, Juliette: "they feel a bit boring - it needs to be more like the
// scrumptious stroking app". The test for all the funnel bites.
// No sign-in, on purpose: "They don't need a login... They're cheap products."
// Everything he does or writes stays on his phone. Only anonymous counts leave it.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import PracticeTimer from "@/components/PracticeTimer";
import { BITE_CSS, FEELS, Html, Photo, PLAIN_GOLD, Voice, read, write } from "@/components/BiteKit";
import { WSSR } from "@/lib/content/when-she-stops-reaching";
import { count } from "@/lib/count";

const DIR = "/when-she-stops-reaching";
const STATE_KEY = "ffy.wssr.state.v1";
const SITTINGS_KEY = "ffy.wssr.sittings.v1";
const TRUE_KEY = "ffy.wssr.true.v1";

const STEPS = [
  { id: "cover", name: "" },
  { id: "what", name: "What's happening" },
  { id: "this", name: "What this is" },
  { id: "setup", name: "Setting it up" },
  { id: "p1", name: "1 Touch Base" },
  { id: "p2", name: "2 Approach" },
  { id: "p3", name: "3 Full Stop" },
  { id: "now", name: "Do it now" },
  { id: "after", name: "After" },
  { id: "end", name: "That's it" },
] as const;
const idx = (id: string) => STEPS.findIndex((s) => s.id === id);

type Sitting = { at: string; feel?: string; solo?: boolean };
type RunState = { step: number; path: "" | "yes" | "no"; checks: number[]; done: number[]; finished: boolean };
const FRESH: RunState = { step: 0, path: "", checks: [], done: [], finished: false };

// Watch or listen. The video only loads while its step is on screen. If it can't
// load, the listen tab and the written steps still carry the step (E3).
function WatchListen({ active, title, eyebrow, video, ratio, watchLabel, listenLabel, watchNote, listenNote, src, voiceLabel }: {
  active: boolean; title: string; eyebrow: string; video: string; ratio: string; watchLabel: string; listenLabel: string;
  watchNote: string; listenNote?: string; src: string; voiceLabel: string;
}) {
  const [tab, setTab] = useState<"watch" | "listen">("watch");
  const pill = (on: boolean) => `min-h-[44px] rounded-full border px-3 text-[14px] transition ${on ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#DDC98E]"}`;
  return (
    <div className="my-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{eyebrow}</p>
      <p className="mt-1 font-display text-2xl font-light">{title}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className={pill(tab === "watch")} onClick={() => setTab("watch")}>{watchLabel}</button>
        <button type="button" className={pill(tab === "listen")} onClick={() => setTab("listen")}>{listenLabel}</button>
      </div>
      {tab === "watch" ? (
        <div className="mt-4">
          <div className="overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: ratio }}>
            {active && (
              <iframe src={video} title={title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            )}
          </div>
          <p className="mt-3 text-[15px] text-[#cfc8bb]">{watchNote}</p>
        </div>
      ) : (
        <div className="mt-4">
          {listenNote && <p className="text-[15px] text-[#cfc8bb]">{listenNote}</p>}
          <Voice src={src} label={voiceLabel} />
        </div>
      )}
    </div>
  );
}

function Dots({ sittings }: { sittings: Sitting[] }) {
  return (
    <div className="mt-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">Your sittings · {sittings.length}</p>
      <div className="mt-3 flex flex-wrap gap-2.5" data-testid="dots">
        {sittings.length === 0 && <span className="h-4 w-4 rounded-full border border-[#DDC98E]/40" />}
        {sittings.map((s, i) => (
          <span
            key={i}
            data-solo={s.solo ? "1" : "0"}
            data-feel={s.feel ?? ""}
            title={`Sitting ${i + 1}`}
            className="h-4 w-4 rounded-full"
            style={{
              background: FEELS.find((f) => f.id === s.feel)?.color ?? PLAIN_GOLD,
              boxShadow: s.solo ? "0 0 0 2px #070707, 0 0 0 3.5px #DDC98E" : undefined,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => (
          <span key={f.id} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
            {f.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-[#DDC98E]" />
          Gold ring = Touch Base on your own
        </span>
      </div>
    </div>
  );
}

export default function WhenSheStopsReaching() {
  const [ready, setReady] = useState(false);
  const [run, setRun] = useState<RunState>(FRESH);
  const [runId, setRunId] = useState(0);
  const [sittings, setSittings] = useState<Sitting[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [feel, setFeel] = useState("");
  const counted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- phone storage is only readable after mount */
    setRun({ ...FRESH, ...read<RunState>(STATE_KEY, FRESH) });
    setSittings(read<Sitting[]>(SITTINGS_KEY, []));
    setLines(read<string[]>(TRUE_KEY, []));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (!counted.current) {
      counted.current = true;
      count("wssr_open");
    }
  }, []);

  useEffect(() => {
    if (ready) write(STATE_KEY, run);
  }, [run, ready]);

  const update = useCallback((patch: Partial<RunState>) => setRun((r) => ({ ...r, ...patch })), []);
  const solo = run.path === "no";

  const stopAudio = () => document.querySelectorAll<HTMLAudioElement>(".wssr audio").forEach((a) => a.pause());
  const go = useCallback((step: number) => {
    stopAudio();
    setRun((r) => ({ ...r, step: Math.max(0, Math.min(STEPS.length - 1, step)) }));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Her no: Touch Base on his own, then straight to the check-in.
  const nextStep = (i: number) => (solo && STEPS[i].id === "p1" ? idx("now") : i + 1);
  const prevStep = (i: number) => (solo && STEPS[i].id === "now" ? idx("p1") : i - 1);

  const begin = () => {
    go(1);
    // Inside the tap, or a phone refuses to play it. Her minute of welcome.
    document.querySelector<HTMLAudioElement>("#wssr-w1 audio")?.play().catch(() => {});
  };

  // Her voice talks him into the Full Stop when the Approach timer ends. It has
  // to be unlocked inside the tap that starts the timer, or iPhones stay silent.
  const primeW2 = () => {
    const a = document.querySelector<HTMLAudioElement>("#wssr-w2 audio");
    if (!a || a.dataset.primed) return;
    a.dataset.primed = "1";
    a.muted = true;
    a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
  };
  const playW2 = () => {
    window.setTimeout(() => {
      const a = document.querySelector<HTMLAudioElement>("#wssr-w2 audio");
      if (!a) return;
      a.muted = false;
      a.currentTime = 0;
      a.play().catch(() => {});
    }, 4000);
  };

  const toggleDone = (n: number) => setRun((r) => ({ ...r, done: r.done.includes(n) ? r.done.filter((x) => x !== n) : [...r.done, n] }));
  const toggleCheck = (n: number) => setRun((r) => ({ ...r, checks: r.checks.includes(n) ? r.checks.filter((x) => x !== n) : [...r.checks, n] }));

  const saveLine = () => {
    const t = draft.trim();
    if (!t) return;
    const next = [t, ...lines];
    setLines(next);
    write(TRUE_KEY, next);
    setDraft("");
  };

  const iDidIt = () => {
    const s: Sitting = { at: new Date().toISOString(), ...(feel ? { feel } : {}), ...(solo ? { solo: true } : {}) };
    const next = [...sittings, s];
    setSittings(next);
    write(SITTINGS_KEY, next);
    update({ finished: true });
    count(solo ? "wssr_solo" : "wssr_done", undefined, feel || undefined);
  };

  const again = () => {
    stopAudio();
    setFeel("");
    setDraft("");
    setRunId((n) => n + 1);
    setRun({ ...FRESH, step: idx("setup") });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const cur = STEPS[run.step]?.id ?? "cover";
  const show = (id: string) => (cur === id ? "" : "hidden");
  const allChecked = WSSR.yesItems.every((_, i) => run.checks.includes(i));
  const doneBtn = (n: number) => (
    <button type="button" onClick={() => toggleDone(n)} aria-pressed={run.done.includes(n)}
      className={`mt-4 inline-flex min-h-[44px] items-center rounded-full border px-5 text-[14px] transition ${run.done.includes(n) ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/60 text-[#DDC98E]"}`}>
      Done ✓
    </button>
  );
  const goNow = (
    <button type="button" onClick={() => go(idx("now"))} className="mt-2 inline-flex min-h-[44px] items-center text-[15px] text-[#DDC98E] underline underline-offset-4">
      When you&rsquo;re ready, do all three on one screen →
    </button>
  );
  const onCover = cur === "cover";

  return (
    <main className={`wssr min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]`}>
      {/* Stays dark while his phone's saved step is read, so there is no white flash. */}
      <div className="mx-auto max-w-2xl px-5 pb-36 pt-6" style={{ visibility: ready ? "visible" : "hidden" }}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Your library</Link>
          {!onCover && (
            <button type="button" onClick={again} className="inline-flex min-h-[44px] items-center text-sm text-[#DDC98E] underline underline-offset-4">Do it again</button>
          )}
        </div>

        {/* HERO */}
        <section className={show("cover")}>
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
            <Image src={`${DIR}/cover.jpg`} alt="Juliette and her partner standing apart on a lawn at sunset, practising the Approach Ritual" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">15 minutes · 3 parts · For him</p>
          <h1 className="mt-2 font-display text-[38px] font-light leading-[1.08]">When She Stops Reaching</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#cfc8bb]">Fifteen minutes. One sitting. <em className="not-italic text-[#EEDE80]">You touch nobody until she says so.</em></p>
          <div className="mt-6 flex items-center gap-4">
            <Image src={`${DIR}/hub/me.jpg`} alt="Juliette" width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover" />
            <div>
              <p className="text-[16px]">A minute from me first</p>
              <p className="text-[14px] text-[#a79f90]">Tap Begin and I&rsquo;ll welcome you in.</p>
            </div>
          </div>
          <button type="button" onClick={begin} className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">
            Begin →
          </button>
          {sittings.length > 0 && <Dots sittings={sittings} />}
        </section>

        <section className={show("what")}>
          <Photo src={`${DIR}/hub/top-what.jpg`} alt="Juliette and Alex, his kiss on her shoulder" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Start here</p>
          <Voice id="wssr-w1" src={`${DIR}/voice/W1.m4a`} label="A minute from me" />
          <Html html={WSSR.what} />
        </section>

        <section className={show("this")}>
          <Photo src={`${DIR}/hub/top-this.jpg`} alt="Juliette and Alex dancing in the street at night" />
          <Html html={WSSR.this} />
        </section>

        <section className={show("setup")}>
          <Photo src={`${DIR}/peek-selfie.jpg`} alt="Alex's hand hovering near Juliette, not yet touching" pos="50% 35%" />
          <Html html={WSSR.setupIntro} />
          <div className="mt-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">What did she say?</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["yes", "no"] as const).map((a) => (
                <button key={a} type="button" onClick={() => update({ path: a })} aria-pressed={run.path === a}
                  className={`min-h-[48px] rounded-full border px-3 text-[15px] ${run.path === a ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/40 text-[#cfc8bb]"}`}>
                  {a === "yes" ? "She said yes" : "She said no"}
                </button>
              ))}
            </div>
            {run.path === "yes" && (
              <div className="mt-6">
                <p className="lead">Before you begin</p>
                <ul className="mt-3 space-y-2">
                  {WSSR.yesItems.map((t, i) => (
                    <li key={i}>
                      <button type="button" onClick={() => toggleCheck(i)} aria-pressed={run.checks.includes(i)} className="flex w-full items-start gap-3 py-2 text-left text-[16px] text-[#cfc8bb]">
                        <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#DDC98E] text-[12px] ${run.checks.includes(i) ? "bg-[#DDC98E] text-[#070707]" : ""}`}>{run.checks.includes(i) ? "✓" : ""}</span>
                        <span>{t}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {allChecked && <p className="mt-3 font-display text-[20px] font-light text-[#EEDE80]">That&rsquo;s it. You&rsquo;re ready.</p>}
              </div>
            )}
            {solo && (
              <div>
                <Html html={WSSR.no} />
                <button type="button" onClick={() => go(idx("p1"))} className="mt-2 inline-flex min-h-[44px] items-center text-[15px] text-[#DDC98E] underline underline-offset-4">Go to Touch Base →</button>
              </div>
            )}
          </div>
        </section>

        <section className={show("p1")}>
          <Photo src={`${DIR}/hub/top-p1.jpg`} alt="Juliette, eyes soft, on her own" />
          <Html html={WSSR.p1Head} />
          <WatchListen active={cur === "p1"} title="Touch Base" eyebrow="Watch once, then listen"
            video="https://player.vimeo.com/video/1223329859?speed=1&badge=0&autopause=0&player_id=0&app_id=58479" ratio="9 / 14"
            watchLabel="▶ Watch" listenLabel="🎧 Listen · 5 min"
            watchNote="Watch it once so you can see exactly what I'm doing with my hands. After that, the audio is all you need."
            src={`${DIR}/touch-base.mp3`} voiceLabel="Touch Base" />
          <Html html={WSSR.p1Steps} />
          <div className="my-6" key={`t1-${runId}`}><PracticeTimer minutes={[5]} label="Your five minutes" dark /></div>
          {!solo && goNow}
          <Html html={WSSR.p1After} />
        </section>

        <section className={show("p2")}>
          <Html html={WSSR.p2Head} />
          <WatchListen active={cur === "p2"} title="The Approach Ritual" eyebrow="Watch us, or listen first"
            video="https://player.vimeo.com/video/1235783730?speed=1&badge=0&autopause=0&player_id=0&app_id=58479" ratio="1 / 0.6716"
            watchLabel="▶ Watch the demo" listenLabel="🎧 Listen · 2 min"
            watchNote="My partner and I demo it for you."
            listenNote="Two minutes of me talking you through it before you begin. Or read it below."
            src={`${DIR}/approach.m4a`} voiceLabel="The Approach Ritual" />
          <Html html={WSSR.p2Steps} />
          <div className="my-6" key={`t2-${runId}`}><PracticeTimer minutes={[5]} label="Your five minutes" dark /></div>
          {goNow}
          <Html html={WSSR.p2After} />
        </section>

        <section className={show("p3")}>
          <Photo src={`${DIR}/peek-buda1.jpg`} alt="Juliette and Alex hugging on the terrace" pos="45% 12%" />
          <Html html={WSSR.p3} />
        </section>

        {/* DO IT NOW. Practice and check-in sit together, nothing between them. */}
        <section className={show("now")}>
          <Photo src={`${DIR}/hub/top-now.jpg`} alt="Juliette and Alex dancing by the Thames" />
          <p className="partno">All three, one screen</p>
          <h2>Do it now</h2>
          {!solo && <p className="lead">Keep your phone where you can hear it. Do one, tap Done, then the next.</p>}

          <div className="dstep">
            <p className="dn"><span>1</span><b>Touch Base</b><small>Five minutes, on your own</small></p>
            <p>Press play. My voice guides the five minutes.</p>
            <Voice src={`${DIR}/touch-base.mp3`} label="Touch Base" />
            {doneBtn(1)}
          </div>

          {!solo && (
            <>
              <div className="dstep">
                <p className="dn"><span>2</span><b>The Approach Ritual</b><small>Five minutes, she chooses the distance</small></p>
                <p>Stand facing each other with some distance between you. Start the timer. Walk towards her slowly. Stop when she says stop.</p>
                <div className="my-5" onClickCapture={primeW2} key={`t3-${runId}`}><PracticeTimer minutes={[5]} label="Your five minutes" dark onDone={playW2} /></div>
                <div className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">When the timer ends</div>
                <div className="mb-2 font-display text-[20px] font-light">I&rsquo;ll talk you into the Full Stop</div>
                <p>Keep your phone where you can hear it. My voice starts on its own when the timer ends.</p>
                <Voice id="wssr-w2" src={`${DIR}/voice/W2.m4a`} label="I'll talk you into the Full Stop" />
                {doneBtn(2)}
              </div>

              <div className="dstep">
                <p className="dn"><span>3</span><b>The Full Stop</b><small>One true thing. Then stop.</small></p>
                <p>Say one true thing out loud about what you noticed. One sentence. No question mark on the end.</p>
                <label htmlFor="wssr-true" className="mt-4 block text-[14px] text-[#DDC98E]">Write down the one true thing you said</label>
                <textarea id="wssr-true" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="I noticed..."
                  className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
                <button type="button" onClick={saveLine} className="mt-2 inline-flex min-h-[44px] items-center rounded-full border border-[#DDC98E]/60 px-5 text-[14px] text-[#DDC98E]">Save it</button>
                <div className="mt-2 text-[13px] text-[#a79f90]">What you write stays on your phone. Not even I see it.</div>
                {lines.length > 0 && (
                  <ul className="mt-3 space-y-2" data-testid="true-lines">
                    {lines.map((l, i) => <li key={i} className="border-l-2 border-[#DDC98E] pl-3 text-[15px] text-[#cfc8bb]">{l}</li>)}
                  </ul>
                )}
                {doneBtn(3)}
              </div>
            </>
          )}

          <div className="mt-8 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
            {run.finished ? (
              <div className="wssr-done rounded-2xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-5 text-center">
                <span className="block font-display text-3xl font-light text-[#DDC98E]">✓</span>
                {solo ? (
                  <p className="mt-2 text-[15px]">Touch Base, on your own.</p>
                ) : (
                  <p className="big" style={{ marginTop: 8, marginBottom: 0 }}>Five minutes with yourself. Five minutes letting her determine the distance. <em>One true thing. Full stop.</em></p>
                )}
              </div>
            ) : (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">How much did you notice?</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {FEELS.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFeel(feel === f.id ? "" : f.id)} aria-pressed={feel === f.id}
                      className={`flex min-h-[48px] flex-col items-center justify-center gap-2 rounded-full border px-2 py-3 text-[14px] ${feel === f.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/40 text-[#cfc8bb]"}`}>
                      <span className="h-4 w-4 rounded-full" style={{ background: f.color }} />
                      {f.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={iDidIt} className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707]">
                  I did it ✓
                </button>
              </>
            )}
            <Dots sittings={sittings} />
          </div>
        </section>

        <section className={show("after")}>
          <Photo src={`${DIR}/hub/top-after.jpg`} alt="Juliette and Alex on the sofa with their dog" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Before you go</p>
          <Voice src={`${DIR}/voice/W3.m4a`} label="A last word from me" />
          <Html html={WSSR.after} />
        </section>

        {/* THE END. One door only. */}
        <section className={show("end")}>
          <Html html={WSSR.end} className="endcard" />
          <div className="mt-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
            <Dots sittings={sittings} />
            <button type="button" onClick={again} className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/60 text-[15px] text-[#DDC98E]">Do it again</button>
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

      {/* Back and next, on every step */}
      {!onCover && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDC98E]/20 bg-[#070707]/92 px-4 pt-2.5 backdrop-blur" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#8f877a]">{run.step} of {STEPS.length - 1}</p>
          <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr] items-center gap-2.5">
            <button type="button" aria-label="Back" onClick={() => go(prevStep(run.step))} className="h-[52px] w-[52px] rounded-full border border-[#DDC98E]/40 text-lg text-[#DDC98E]">←</button>
            {run.step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(nextStep(run.step))} className="h-[52px] truncate rounded-full bg-[#DDC98E] px-5 font-display text-[16px] font-medium text-[#070707]">
                {STEPS[nextStep(run.step)].name} →
              </button>
            ) : (
              <button type="button" onClick={() => go(0)} className="h-[52px] rounded-full bg-[#DDC98E] px-5 font-display text-[16px] font-medium text-[#070707]">Back to the start</button>
            )}
          </div>
        </nav>
      )}

      <style>{BITE_CSS}</style>
    </main>
  );
}
