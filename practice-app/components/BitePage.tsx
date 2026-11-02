"use client";

// One engine for the funnel bites in the app. specs/funnel-1-trace-app.md.
// The content comes from lib/content/bites/, made by specs/tools/bite-from-site.py
// so her words are never retyped. No sign-in. What he or she does and writes
// stays on the phone. Only anonymous counts leave it.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import PracticeTimer from "@/components/PracticeTimer";
import { PromptCard } from "@/components/Interactive";
import { BITE_CSS, FEELS, Html, MuteNote, Photo, PLAIN_GOLD, StepBar, Voice, read, write } from "@/components/BiteKit";
import { count } from "@/lib/count";

type PhotoB = { type: "photo"; src: string; alt: string; pos?: string; ratio?: string; maxW?: number; caption?: string };
type Block =
  | { type: "html"; html: string }
  | PhotoB
  | { type: "voice"; lab?: string; title?: string; small?: string; note?: string; src: string; id?: string; welcome?: boolean }
  | { type: "video"; lab?: string; title?: string; small?: string; vimeo: string; ratio: string; note?: string; linkHref?: string; linkText?: string }
  | { type: "watchListen"; lab?: string; title?: string; vimeo: string; ratio: string; watchLabel: string; listenLabel: string; watchNote?: string; listenNote?: string; src: string; first: "watch" | "listen" }
  | { type: "timer"; min: number }
  | { type: "dyad"; cat: string; prompt: string; back1: string; back2: string; min: number; after?: string }
  | { type: "check"; items: string[]; ready?: string }
  | { type: "roles"; q: string; hint: string; tabs: [string, string][]; cards: { role: string; html: string }[] }
  | { type: "path"; lab: string; options: { label: string; html: string }[] }
  | { type: "resp"; items: { b: string; span: string; small?: string; i?: string; html?: string }[] }
  | { type: "cta"; href: string; text: string; small?: string };
type Step = { id: string; name: string; photo?: PhotoB; blocks: Block[] };
export type Bite = { slug: string; short: string; title: string; line: string; meta: string; hero: PhotoB; me: string; checkinStep: string; doneLine: string; doorImg: string; steps: Step[] };
type Sitting = { at: string; feel?: string };

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]";
const vimeoUrl = (id: string) => `https://player.vimeo.com/video/${id}?speed=1&badge=0&autopause=0&player_id=0&app_id=58479`;

function Head({ lab, title, small }: { lab?: string; title?: string; small?: string }) {
  if (!lab && !title) return null;
  return (
    <div>
      {lab && <p className={EYEBROW}>{lab}</p>}
      {title && <p className="mt-1 font-display text-2xl font-light">{title} {small && <span className="text-[13px] text-[#a79f90]">{small}</span>}</p>}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="my-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">{children}</div>;
}

function Video({ active, vimeo, ratio, title }: { active: boolean; vimeo: string; ratio: string; title?: string }) {
  const tall = ratio.startsWith("9");
  return (
    <div className={`mt-4 overflow-hidden rounded-2xl bg-black ${tall ? "mx-auto max-w-[280px]" : ""}`} style={{ aspectRatio: ratio }}>
      {active && <iframe src={vimeoUrl(vimeo)} title={title ?? "Video"} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}
    </div>
  );
}

function WatchListen({ b, active }: { b: Extract<Block, { type: "watchListen" }>; active: boolean }) {
  const [tab, setTab] = useState(b.first);
  const pill = (on: boolean) => `min-h-[44px] rounded-full border px-3 text-[14px] transition ${on ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#DDC98E]"}`;
  return (
    <Frame>
      <Head lab={b.lab} title={b.title} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className={pill(tab === "watch")} onClick={() => setTab("watch")}>{b.watchLabel}</button>
        <button type="button" className={pill(tab === "listen")} onClick={() => setTab("listen")}>{b.listenLabel}</button>
      </div>
      {tab === "watch" ? (
        <>
          <Video active={active} vimeo={b.vimeo} ratio={b.ratio} title={b.title} />
          {b.watchNote && <p className="mt-3 text-[15px] text-[#cfc8bb]">{b.watchNote}</p>}
        </>
      ) : (
        <div className="mt-4">
          {b.listenNote && <p className="text-[15px] text-[#cfc8bb]">{b.listenNote}</p>}
          <Voice src={b.src} label={b.title ?? "Listen"} />
        </div>
      )}
    </Frame>
  );
}

function Check({ items, ready }: { items: string[]; ready?: string }) {
  const [on, setOn] = useState<number[]>([]);
  return (
    <div className="my-4">
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={t}>
            <button type="button" onClick={() => setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))} aria-pressed={on.includes(i)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-[16px] transition ${on.includes(i) ? "border-[#DDC98E] bg-[rgba(221,201,142,0.12)] text-[#f1ece2]" : "border-[#DDC98E]/25 text-[#cfc8bb]"}`}>
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#DDC98E] text-[13px] ${on.includes(i) ? "bg-[#DDC98E] text-[#070707]" : ""}`}>{on.includes(i) ? "✓" : ""}</span>
              <span>{t}</span>
            </button>
          </li>
        ))}
      </ul>
      {ready && on.length === items.length && <p className="mt-4 font-display text-[20px] font-light text-[#EEDE80]">{ready}</p>}
    </div>
  );
}

function Roles({ b }: { b: Extract<Block, { type: "roles" }> }) {
  const [r, setR] = useState("both");
  return (
    <div className="my-7">
      <p className="font-display text-[22px] font-light">{b.q}</p>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-black/40 p-1">
        {b.tabs.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={r === id} onClick={() => setR(id)} className={`min-h-[44px] rounded-full text-[14px] transition ${r === id ? "bg-[#DDC98E] text-[#070707]" : "text-[#cfc8bb]"}`}>{label}</button>
        ))}
      </div>
      {r === "both" && <p className="mt-3 text-[13px] text-[#a79f90]">{b.hint}</p>}
      {b.cards.map((c) => (
        <div key={c.role} className={r === "both" || r === c.role ? "" : "hidden"}>
          <Html html={c.html} className="rolecard" />
        </div>
      ))}
    </div>
  );
}

function Path({ b }: { b: Extract<Block, { type: "path" }> }) {
  const [p, setP] = useState(-1);
  return (
    <Frame>
      <p className={EYEBROW}>{b.lab}</p>
      <div className="mt-3 grid gap-2">
        {b.options.map((o, i) => (
          <button key={o.label} type="button" aria-pressed={p === i} onClick={() => setP(i)} className={`min-h-[48px] rounded-2xl border px-4 py-2 text-left text-[15px] transition ${p === i ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/40 text-[#cfc8bb]"}`}>{o.label}</button>
        ))}
      </div>
      {p >= 0 && <Html key={p} html={b.options[p].html} />}
    </Frame>
  );
}

function Resp({ b }: { b: Extract<Block, { type: "resp" }> }) {
  const [on, setOn] = useState<number[]>([]);
  return (
    <div className="my-4 grid gap-2.5">
      {b.items.map((x, i) => (
        <button key={x.b} type="button" onClick={() => setOn((o) => (o.includes(i) ? o.filter((v) => v !== i) : [...o, i]))} className={`rounded-2xl border p-4 text-left transition ${on.includes(i) ? "border-[#DDC98E] bg-[rgba(13,53,53,0.6)] shadow-[0_0_30px_-14px_#DDC98E]" : "border-[#DDC98E]/35"}`}>
          {x.small && <small className="float-right mt-1 text-[11px] text-[#a79f90]">{x.small}</small>}
          <span className="block font-display text-[19px] uppercase tracking-[0.06em] text-[#DDC98E]">{x.b}</span>
          <span className="mt-0.5 block text-[15px] text-[#f1ece2]">{x.span}</span>
          {on.includes(i) && x.i && <span className="mt-3 block border-t border-[#DDC98E]/25 pt-3 text-[15px] text-[#cfc8bb]">{x.i}</span>}
          {on.includes(i) && x.html && <span className="more2 mt-3 block border-t border-[#DDC98E]/25 pt-3 text-[15px] text-[#cfc8bb]" dangerouslySetInnerHTML={{ __html: x.html }} />}
        </button>
      ))}
    </div>
  );
}

// The Dyad, same clips and rules as the cards app: her voice on the turn, Thank
// you the first time, Clarify and Summarise every time, the bell at the end.
function Dyad({ b }: { b: Extract<Block, { type: "dyad" }> }) {
  const [turned, setTurned] = useState(false);
  const [squash, setSquash] = useState(false);
  const [sp, setSp] = useState<"A" | "B">("B");
  const [n, setN] = useState(0);
  const [note, setNote] = useState("");
  const heard = useRef(false);
  const vo = useRef<HTMLAudioElement | null>(null);
  const bell = useRef<HTMLAudioElement | null>(null);
  const actx = useRef<AudioContext | null>(null);
  const ls = sp === "A" ? "B" : "A";
  const voice = (f: string) => {
    document.querySelectorAll<HTMLAudioElement>(".wssr audio").forEach((a) => a.pause());
    vo.current?.pause();
    const a = new Audio(`/bites/voice/${f}.m4a`);
    a.playbackRate = Number(read<number>("ffy.voice.rate", 1)) || 1;
    vo.current = a;
    a.play().catch(() => {});
  };
  const chime = () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = actx.current ?? new Ctx();
      actx.current = ctx;
      void ctx.resume();
      [0, 0.45].forEach((d, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = i ? 1046.5 : 784;
        g.gain.setValueAtTime(0.0001, ctx.currentTime + d);
        g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d + 2);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + d);
        o.stop(ctx.currentTime + d + 2.1);
      });
    } catch {
      /* no sound available */
    }
  };
  const turn = () => {
    if (turned) return;
    setSquash(true);
    voice("1-start");
    window.setTimeout(() => { setTurned(true); setSquash(false); }, 220);
  };
  const thankYou = () => {
    const next = sp === "A" ? "B" : "A";
    setN((v) => v + 1);
    setSp(next);
    setNote(`Thank you. Swap. ${next} takes the same prompt fresh.`);
    if (!heard.current) { heard.current = true; voice("2-thank-you"); } else chime();
  };
  // Unlocked inside the tap that starts the timer, or a phone stays silent.
  const prime = () => {
    if (!bell.current) {
      const a = new Audio("/bites/voice/5-bell.m4a");
      a.muted = true;
      a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
      bell.current = a;
    }
    if (b.after) {
      const a = document.querySelector<HTMLAudioElement>(`#${b.after} audio`);
      if (a && !a.dataset.primed) {
        a.dataset.primed = "1";
        a.muted = true;
        a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
      }
    }
  };
  const onDone = () => {
    const a = bell.current;
    const after = () => {
      if (!b.after) return;
      const v = document.querySelector<HTMLAudioElement>(`#${b.after} audio`);
      if (v) { v.muted = false; v.currentTime = 0; v.play().catch(() => {}); v.scrollIntoView({ behavior: "smooth", block: "center" }); }
    };
    if (!a) { after(); return; }
    let done = false;
    const go = () => { if (!done) { done = true; after(); } };
    a.onended = go;
    a.play().catch(go);
    window.setTimeout(go, 21000);
  };
  const ans = "rounded-2xl border border-[#DDC98E]/50 px-3 py-3 text-left transition";
  return (
    <div className="my-7 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.3)] p-4">
      <div onClick={turn} role={turned ? undefined : "button"} aria-label={turned ? undefined : "Turn the card over"}
        className={`mx-auto w-full max-w-[280px] transition-transform duration-200 ease-in ${turned ? "" : "cursor-pointer"}`} style={{ transform: squash ? "scaleX(0)" : "scaleX(1)" }}>
        {turned ? (
          <div className="-my-7 py-1"><PromptCard deck={b.cat} prompt={b.prompt} /></div>
        ) : (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bites/card-back.png" alt="" className="block w-full border border-white/10 shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_70px_-10px_rgba(221,201,142,.25)]" />
            <div className="absolute inset-x-4 bottom-8 text-center">
              <p className="font-display text-[15px] text-[#DDC98E]">{b.back1}</p>
              <p className="text-[12px] text-[#F6EFE0]/70">{b.back2}</p>
            </div>
          </div>
        )}
      </div>
      {!turned && <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Tap the card to turn it over</p>}
      {turned && (
        <div className="mt-6">
          <p className="text-center font-display text-[22px] font-light"><em className="not-italic text-[#EEDE80]">{sp}</em> is speaking</p>
          <p className="mt-1 text-center text-[14px] text-[#a79f90]">One clear communication. {ls} listens.</p>
          <div className="mt-4 grid gap-2">
            <button type="button" className={ans} onClick={thankYou}><span className="font-display text-[17px] text-[#DDC98E]">Thank you</span> <small className="text-[13px] text-[#cfc8bb]">I&rsquo;ve understood</small></button>
            <button type="button" className={ans} onClick={() => { setNote(`${sp} responds. Then ${ls} chooses again.`); voice("3-clarify"); }}><span className="font-display text-[17px] text-[#DDC98E]">Clarify that</span> <small className="text-[13px] text-[#cfc8bb]">Help me understand</small></button>
            <button type="button" className={ans} onClick={() => { setNote(`${sp} gives the bottom line. Then ${ls} chooses again.`); voice("4-summarise"); }}><span className="font-display text-[17px] text-[#DDC98E]">Summarise that</span> <small className="text-[13px] text-[#cfc8bb]">The bottom line</small></button>
          </div>
          {note && <p className="mt-3 text-center text-[14px] text-[#EEDE80]" data-testid="dyad-note">{note}</p>}
          <p className="mt-2 text-center text-[12px] uppercase tracking-[0.14em] text-[#a79f90]" data-testid="dyad-count">{n} completed communication{n === 1 ? "" : "s"}</p>
          <div className="mt-4" onClickCapture={prime}><PracticeTimer minutes={[b.min]} label={`Your ${b.min} minutes`} dark onDone={onDone} /></div>
        </div>
      )}
    </div>
  );
}

function BlockView({ b, active }: { b: Block; active: boolean }) {
  switch (b.type) {
    case "html": return <Html html={b.html} />;
    case "photo": return <Photo src={b.src} alt={b.alt} pos={b.pos} ratio={b.ratio} />;
    case "voice":
      return (
        <div className="my-6">
          {b.lab && <p className={EYEBROW}>{b.lab}</p>}
          {b.note && <p className="mt-1 text-[15px] text-[#cfc8bb]">{b.note}</p>}
          <Voice id={b.welcome ? "bite-welcome" : b.id || undefined} src={b.src} label={b.title ?? "Listen"} />
        </div>
      );
    case "video":
      return (
        <Frame>
          <Head lab={b.lab} title={b.title} small={b.small} />
          <Video active={active} vimeo={b.vimeo} ratio={b.ratio} title={b.title} />
          {b.note && <p className="mt-3 text-[15px] text-[#cfc8bb]">{b.note}</p>}
          {b.linkHref && <a href={b.linkHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">{b.linkText}</a>}
        </Frame>
      );
    case "watchListen": return <WatchListen b={b} active={active} />;
    case "timer": return <div className="my-6"><PracticeTimer minutes={[b.min]} label={`Your ${b.min} minutes`} dark /></div>;
    case "dyad": return <Dyad b={b} />;
    case "check": return <Check items={b.items} ready={b.ready} />;
    case "roles": return <Roles b={b} />;
    case "path": return <Path b={b} />;
    case "resp": return <Resp b={b} />;
    case "cta":
      return (
        <a href={b.href} className="my-5 block rounded-full bg-[#DDC98E] px-5 py-4 text-center font-display text-[17px] font-medium text-[#070707]">
          {b.text}
          {b.small && <small className="mt-0.5 block text-[12px] font-normal">{b.small}</small>}
        </a>
      );
  }
}

function Dots({ sittings }: { sittings: Sitting[] }) {
  return (
    <div className="mt-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">Your sittings · {sittings.length}</p>
      <div className="mt-3 flex flex-wrap gap-2.5" data-testid="dots">
        {sittings.length === 0 && <span className="h-4 w-4 rounded-full border border-[#DDC98E]/40" />}
        {sittings.map((s, i) => (
          <span key={i} data-feel={s.feel ?? ""} className={`h-4 w-4 rounded-full ${i === sittings.length - 1 ? "dot-pop" : ""}`} style={{ background: FEELS.find((f) => f.id === s.feel)?.color ?? PLAIN_GOLD }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => <span key={f.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />{f.label}</span>)}
      </div>
    </div>
  );
}

export default function BitePage({ bite }: { bite: Bite }) {
  const STATE = `ffy.${bite.short}.state.v1`;
  const SITTINGS = `ffy.${bite.short}.sittings.v1`;
  const STEPS = bite.steps;
  const last = STEPS.length; // 0 is the hero, then one per step
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feel, setFeel] = useState("");
  const [sittings, setSittings] = useState<Sitting[]>([]);
  const counted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- phone storage is only readable after mount */
    const s = read<{ step: number; finished: boolean }>(STATE, { step: 0, finished: false });
    setStep(s.step);
    setFinished(s.finished);
    setSittings(read<Sitting[]>(SITTINGS, []));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (!counted.current) {
      counted.current = true;
      count(`${bite.short}_open`);
    }
  }, [STATE, SITTINGS, bite.short]);

  useEffect(() => {
    if (ready) write(STATE, { step, finished });
  }, [step, finished, ready, STATE]);

  const go = useCallback((n: number) => {
    document.querySelectorAll<HTMLAudioElement>(".wssr audio").forEach((a) => a.pause());
    setStep(Math.max(0, Math.min(last, n)));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [last]);
  const begin = () => {
    go(1);
    document.querySelector<HTMLAudioElement>("#bite-welcome audio")?.play().catch(() => {});
  };
  const again = () => {
    setRunId((r) => r + 1);
    setFinished(false);
    setFeel("");
    go(1);
  };
  const iDidIt = () => {
    const next = [...sittings, { at: new Date().toISOString(), ...(feel ? { feel } : {}) }];
    setSittings(next);
    write(SITTINGS, next);
    setFinished(true);
    count(`${bite.short}_done`, undefined, feel || undefined);
  };

  const onCover = step === 0;
  return (
    <main className="wssr min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-36 pt-6" style={{ visibility: ready ? "visible" : "hidden" }}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Your library</Link>
          {!onCover && <button type="button" onClick={again} className="inline-flex min-h-[44px] items-center text-sm text-[#DDC98E] underline underline-offset-4">Do it again</button>}
        </div>
        {!onCover && <StepBar step={step} total={last} />}

        <section className={onCover ? "" : "hidden"}>
          <Photo src={bite.hero.src} alt={bite.hero.alt} pos={bite.hero.pos} ratio={bite.hero.ratio} />
          <p className={EYEBROW}>{bite.meta}</p>
          <h1 className="mt-2 font-display text-[36px] font-light leading-[1.08]">{bite.title}</h1>
          <div className="bite-line mt-3 text-[17px] leading-relaxed text-[#cfc8bb]" dangerouslySetInnerHTML={{ __html: bite.line }} />
          <div className="mt-6 flex items-center gap-4">
            <Image src={bite.me} alt="Juliette" width={58} height={58} className="h-[58px] w-[58px] rounded-full border border-[#DDC98E] object-cover" />
            <div>
              <p className="text-[16px]">A minute from me first</p>
              <p className="text-[14px] text-[#a79f90]">Tap Begin and I&rsquo;ll welcome you in.</p>
            </div>
          </div>
          <MuteNote />
          <button type="button" onClick={begin} className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">Begin →</button>
        </section>

        {STEPS.map((s, i) => (
          <section key={s.id} data-step={s.id} className={step === i + 1 ? "" : "hidden"}>
            {s.photo && (
              <>
                <Photo src={s.photo.src} alt={s.photo.alt} pos={s.photo.pos} ratio={s.photo.ratio} maxW={s.photo.maxW} />
                {s.photo.caption && <p className="-mt-3 mb-6 text-center font-display text-[17px] font-light text-[#f1ece2]">{s.photo.caption}</p>}
              </>
            )}
            <div key={runId}>
              {s.blocks.map((b, n) => <BlockView key={n} b={b} active={step === i + 1} />)}
            </div>

            {s.id === bite.checkinStep && (
              <div className="mt-8 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
                {finished ? (
                  <div className="wssr-done rounded-2xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-5 text-center" data-testid="done">
                    <span className="block font-display text-3xl font-light text-[#DDC98E]">✓</span>
                    <p className="mt-2 font-display text-[20px] font-light">{bite.doneLine}</p>
                  </div>
                ) : (
                  <>
                    <p className={EYEBROW}>How much did you notice?</p>
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
                <Dots sittings={sittings} />
              </div>
            )}

            {i === STEPS.length - 1 && (
              <>
                <p className="kicker" style={{ marginTop: 36 }}>Keep going</p>
                <a href="https://feelfullyyou.com/31-touch-points" className="flex items-center gap-4 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] p-3">
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl"><Image src={bite.doorImg} alt="" fill sizes="80px" className="object-cover" /></span>
                  <span className="flex-1">
                    <span className="block font-display text-[20px] font-light leading-tight">31 Touch Points</span>
                    <span className="mt-1 block text-[14px] text-[#cfc8bb]">31 days back to each other, through touch, fun and play. One small practice a day, in the app.</span>
                    <span className="mt-1 block text-[15px] text-[#DDC98E]">£27 →</span>
                  </span>
                </a>
              </>
            )}
          </section>
        ))}
      </div>

      {!onCover && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDC98E]/20 bg-[#070707]/92 px-4 pt-2.5 backdrop-blur" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#8f877a]">{step} of {last}</p>
          <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr] items-center gap-2.5">
            <button type="button" aria-label="Back" onClick={() => go(step - 1)} className="h-[52px] w-[52px] rounded-full border border-[#DDC98E]/40 text-lg text-[#DDC98E]">←</button>
            <button type="button" onClick={() => go(step === last ? 0 : step + 1)} className="h-[52px] truncate rounded-full bg-[#DDC98E] px-5 font-display text-[16px] font-medium text-[#070707]">
              {step === last ? "Back to the start" : `${STEPS[step].name} →`}
            </button>
          </div>
        </nav>
      )}
      <style>{BITE_CSS}</style>
    </main>
  );
}
