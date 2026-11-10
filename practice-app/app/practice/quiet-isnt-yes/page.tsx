"use client";

// QUIET ISN'T YES. Free, for men. specs/quiet-isnt-yes.md.
// Built 10 Nov 2026 in the How to Feel Like a Woman look (Juliette: "more like how
// to feel like a woman is put together", "it needs to have pictures in there").
// One evening, three moments. He guesses, he chooses, he sees her side.
// ALL COPY BELOW IS A DRAFT waiting for Juliette's approval.
// What he types in Moment 3 lives only in this component's state: never saved,
// never sent, cleared when he leaves the screen (R13).

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { FreeEmailGate } from "@/components/FreeEmailGate";

const DIR = "/quiet-isnt-yes";
const DOOR_URL = "https://feelfullyyou.com/the-unspoken-distance";
const TOUCH_BASE_AUDIO = "/touch-base/touch-base-guided.m4a";
// R17: fill in once the service and number are checked live on its own site.
// Checked live 10 Nov 2026 on respectphoneline.org.uk: free, Mon to Fri 10am to 5pm.
const SAFETY_SERVICE = "Respect Phoneline is free and confidential: 0808 8024040, Monday to Friday, 10am to 5pm (respectphoneline.org.uk). If anyone is in danger right now, call 999.";
const KEY = "ffy.quiet-isnt-yes.v1";

type MomentId = "dinner" | "sofa" | "bed";
type Saved = { guess: Partial<Record<MomentId, number>>; choice: Partial<Record<MomentId, number>>; done: MomentId[]; spots: number[] };
const EMPTY: Saved = { guess: {}, choice: {}, done: [], spots: [] };

function load(): Saved {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return EMPTY; }
}
function save(s: Saved) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

type Moment = {
  id: MomentId; time: string; place: string; img: string; pos: string;
  scene: string[]; her: number; choices: string[]; sides: string[]; line?: string;
};

const MOMENTS: Moment[] = [
  {
    id: "dinner", time: "7pm", place: "Dinner", img: `${DIR}/dinner.jpg`, pos: "50% 40%",
    scene: ["She's home. Coat still on the back of the chair.", "She's moving food around her plate.", "You ask, “You okay?”", "She doesn't look up. “I'm fine.”"],
    her: 2,
    choices: ["Believe her. Get on with your evening.", "Keep asking until she tells you.", "Say, “Okay. I'm here if you want me.” Then eat."],
    sides: [
      "Her shoulders drop a millimetre. Relief, then something heavier. You heard the word and missed her. She files it with all the others.",
      "Every question lands like a hand on her chest. She has nothing ready to say yet. Now she has to manage you too.",
      "Her jaw softens. Nobody's chasing her. She won't talk tonight. She'll remember you didn't need her to.",
    ],
  },
  {
    id: "sofa", time: "9pm", place: "The sofa", img: `${DIR}/sofa.jpg`, pos: "50% 45%",
    scene: ["The telly's on. Neither of you is watching it.", "You reach over and take her hand.", "She goes still. Her breath stays high in her chest.", "She doesn't pull away."],
    her: 1,
    choices: ["Keep going, gently. She didn't say no.", "Take your hand back, hurt. Go quiet too.", "Say “Okay,” take your hand back, and stay right next to her."],
    sides: [
      "Her body has gone somewhere safer than this sofa. Her hand is in yours. She isn't. Every time you carry on past this, she learns to leave her body when you touch her.",
      "Now she's carrying your hurt as well as her own. Her body learns that her no costs her something. Next time she won't go still. She'll go further away.",
      "Her breath drops, slowly. You didn't need her to want it. You didn't punish her for not wanting it. For the first time in weeks her body feels safe next to you.",
    ],
    line: "Going still is a freeze. It is never a yes.",
  },
  {
    id: "bed", time: "11pm", place: "Bed", img: `${DIR}/phone.jpg`, pos: "50% 40%",
    scene: ["She's gone up without saying goodnight.", "You're downstairs with your phone.", "Your thumb is already typing."],
    her: 3,
    choices: ["I need her to reply.", "I need to know we're okay.", "Nothing. I just want her to know I'm here."],
    sides: [
      "Don't send it. That message is asking her to calm you down. She'll feel it in the first word, at the end of a day she has nothing left for.",
      "Don't send it. She can't promise you that tonight, and now she has to try. Put the phone face down.",
      "That one you can send. One line. Then put the phone face down and leave it there.",
    ],
  },
];

// R11. Three open, four locked for The Unspoken Distance. x/y are % on the photo.
const SPOTS = [
  { name: "Her jaw", x: 52, y: 37, text: "A tiny tightening. She's holding back something she's decided isn't safe to say." },
  { name: "Her shoulders", x: 66, y: 45, text: "Lifting, drawing forward. Her body builds a wall before her mind has decided anything." },
  { name: "Her breath", x: 40, y: 56, text: "High and shallow, stuck in her chest. When she feels safe it drops. Watch where it lives." },
  { name: "Her gaze", x: 40, y: 22, locked: true },
  { name: "The stillness", x: 32, y: 91, locked: true },
  { name: "Her back", x: 88, y: 62, locked: true },
  { name: "The turning away", x: 64, y: 16, locked: true },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{children}</p>;
}

function Banner({ src, pos, eyebrow, title, tall }: { src: string; pos: string; eyebrow: string; title: string; tall?: boolean }) {
  return (
    <div className={`relative ${tall ? "h-[380px] sm:h-[460px]" : "h-60"} overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]`}>
      <Image src={src} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" style={{ objectPosition: pos }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-1 font-display text-3xl font-light leading-tight">{title}</h2>
      </div>
    </div>
  );
}

function Gold({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-disabled={disabled}
      className={`mt-6 min-h-[52px] w-full rounded-full px-6 text-[16px] font-medium transition ${disabled ? "bg-[#DDC98E]/30 text-[#070707]/60" : "bg-[#DDC98E] text-[#070707] hover:bg-[#EEDE80]"}`}>
      {children}
    </button>
  );
}

export default function QuietIsntYes() {
  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <Evening />
      </div>
    </main>
  );
}

function Evening() {
  const [s, setS] = useState<Saved>(EMPTY);
  const [open, setOpen] = useState<MomentId | "after" | null>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => { setS(load()); }, []);
  const update = (n: Saved) => { setS(n); save(n); };
  const go = (v: MomentId | "after" | null) => { setOpen(v); top.current?.scrollIntoView({ behavior: "smooth" }); };
  const allDone = MOMENTS.every((m) => s.done.includes(m.id));
  const nextUp = MOMENTS.find((m) => !s.done.includes(m.id));

  return (
    <div ref={top}>
      {open === null && (
        <>
          <div className="relative h-[440px] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] sm:h-[520px]">
            <Image src={`${DIR}/hero.jpg`} alt="A woman standing alone in a dark doorway" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover object-[50%_40%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <Eyebrow>For men who love women they can no longer reach</Eyebrow>
              <h1 className="mt-2 font-display text-[40px] font-light leading-tight">Quiet Isn&rsquo;t Yes</h1>
              <p className="mt-2 text-[15px] text-[#cfc8bb]">One evening. About eight minutes. Watch it from her side.</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4 rounded-3xl border border-[#DDC98E]/25 bg-[rgba(13,53,53,0.45)] p-5">
            <Image src={`${DIR}/me.jpg`} alt="Juliette" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
            <div className="text-[15px] leading-relaxed text-[#e8e1d4]">
              <p>You love her. You can feel her going somewhere you can&rsquo;t follow.</p>
              <p className="mt-2">I was that woman once. Let me show you what I couldn&rsquo;t say.</p>
              <p className="mt-2 text-[13px] text-[#DDC98E]">Juliette</p>
            </div>
          </div>

          <FreeEmailGate freebie="quiet-isnt-yes">
            <section className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <Eyebrow>Tonight</Eyebrow>
                  <h2 className="mt-1 font-display text-[28px] font-light leading-tight">Your evening</h2>
                </div>
                <div className="flex gap-2 pb-2" aria-label={`${s.done.length} of 3 moments done`}>
                  {MOMENTS.map((m) => (
                    <span key={m.id} className={`h-3 w-3 rounded-full ${s.done.includes(m.id) ? "bg-[#DDC98E] shadow-[0_0_10px_#DDC98E]" : "border border-[#DDC98E]/50"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {MOMENTS.map((m, i) => {
                  const done = s.done.includes(m.id);
                  const ready = i === 0 || s.done.includes(MOMENTS[i - 1].id);
                  return (
                    <button key={m.id} type="button" onClick={() => ready && go(m.id)} aria-disabled={!ready}
                      className={`relative block h-32 w-full overflow-hidden rounded-3xl border-[1.5px] text-left transition ${ready ? "border-[rgba(221,201,142,0.45)] hover:border-[#DDC98E]" : "border-white/10 opacity-50"}`}>
                      <Image src={m.img} alt="" fill sizes="672px" className="object-cover" style={{ objectPosition: m.pos }} />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/70 to-transparent" />
                      <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
                        <Eyebrow>{m.time}{done ? " · seen" : !ready ? " · after the one before" : ""}</Eyebrow>
                        <p className="mt-1 font-display text-[26px] font-light">{m.place}</p>
                      </div>
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[22px] text-[#DDC98E]">{done ? "✓" : ready ? "→" : "🔒"}</span>
                    </button>
                  );
                })}
                <button type="button" onClick={() => allDone && go("after")} aria-disabled={!allDone}
                  className={`block w-full rounded-3xl border-2 p-5 text-left transition ${allDone ? "border-[#DDC98E]/70 bg-[rgba(13,53,53,0.55)]" : "border-white/10 opacity-50"}`}>
                  <Eyebrow>{allDone ? "Ready" : "After the evening"}</Eyebrow>
                  <p className="mt-1 font-display text-[24px] font-light">{allDone ? "What was missing all evening →" : "🔒 What was missing"}</p>
                </button>
              </div>
              {nextUp && s.done.length > 0 && (
                <Gold onClick={() => go(nextUp.id)}>Carry on: {nextUp.time}, {nextUp.place.toLowerCase()}</Gold>
              )}
            </section>
          </FreeEmailGate>
        </>
      )}

      {open && open !== "after" && (
        <MomentView key={open} m={MOMENTS.find((x) => x.id === open)!} s={s} update={update}
          onBack={() => go(null)}
          onDone={() => {
            const i = MOMENTS.findIndex((x) => x.id === open);
            const next = MOMENTS[i + 1];
            go(next ? next.id : "after");
          }} />
      )}

      {open === "after" && <After s={s} onBack={() => go(null)} />}
    </div>
  );
}

function MomentView({ m, s, update, onBack, onDone }: { m: Moment; s: Saved; update: (n: Saved) => void; onBack: () => void; onDone: () => void }) {
  const [guess, setGuess] = useState<number | null>(s.guess[m.id] ?? null);
  const [pick, setPick] = useState<number | null>(s.choice[m.id] ?? null);
  const [revealed, setRevealed] = useState(s.done.includes(m.id));
  const [step, setStep] = useState<"choose" | "side" | "tap">(s.done.includes(m.id) ? "side" : "choose");
  const [typed, setTyped] = useState(""); // R13: never leaves this component
  const [err, setErr] = useState("");
  const [spot, setSpot] = useState<number | null>(null);
  const [opened, setOpened] = useState<number[]>(s.spots);

  const reveal = () => {
    if (guess === null) return setErr("Move the slider first.");
    if (pick === null) return setErr(m.id === "bed" ? "Answer the question first." : "Pick what you'd do first.");
    setErr("");
    setRevealed(true);
    setStep("side");
    setTyped("");
    update({ ...s, guess: { ...s.guess, [m.id]: guess }, choice: { ...s.choice, [m.id]: pick } });
  };
  const finish = () => {
    const done = s.done.includes(m.id) ? s.done : [...s.done, m.id];
    update({ ...s, guess: { ...s.guess, [m.id]: guess! }, choice: { ...s.choice, [m.id]: pick! }, done, spots: opened });
    onDone();
  };

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">
        ← Your evening
      </button>
      <Banner src={m.img} pos={m.pos} eyebrow={`${m.time} · ${m.place}`} title={step === "choose" ? "What's happening" : step === "side" ? "Her side" : "Where is she telling you?"} />

      {step === "choose" && (
        <section className="mt-6">
          <div className="space-y-1 font-display text-[21px] font-light leading-snug text-[#f1ece2]">
            {m.scene.map((l) => <p key={l}>{l}</p>)}
          </div>

          {m.id === "bed" && (
            <div className="mt-6">
              <label htmlFor="qiy-text" className="text-[14px] text-[#DDC98E]">Type the message you&rsquo;d send her</label>
              <textarea id="qiy-text" rows={3} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off"
                placeholder="Hey, are we okay?"
                className="mt-2 w-full rounded-[18px] border border-[#DDC98E]/40 bg-[#1a1814] px-4 py-3 text-base text-[#f1ece2] placeholder:text-[#a79f90] focus:border-[#DDC98E] focus:outline-none" />
              <p className="mt-1 text-[12px] text-[#a79f90]">This stays on your phone. It is never saved or sent anywhere.</p>
            </div>
          )}

          <div className="mt-7 rounded-3xl border border-[#DDC98E]/25 bg-[#211e19] p-5">
            <p className="text-[15px] text-[#e8e1d4]">How sure are you she&rsquo;s okay right now?</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[12px] text-[#a79f90]">Not at all</span>
              <input type="range" min={0} max={10} step={1} value={guess ?? 5} aria-label="How sure are you she's okay, 0 to 10"
                onChange={(e) => { setGuess(Number(e.target.value)); setErr(""); }} className="flex-1 accent-[#DDC98E]" />
              <span className="text-[12px] text-[#a79f90]">Certain</span>
            </div>
            <p className="mt-3 text-center font-display text-[34px] font-light text-[#DDC98E]">{guess ?? "?"}</p>
          </div>

          <p className="mt-7 text-[15px] text-[#DDC98E]">{m.id === "bed" ? "What do you need from this message?" : "What do you do?"}</p>
          <div className="mt-3 space-y-2.5">
            {m.choices.map((c, i) => (
              <button key={c} type="button" onClick={() => { setPick(i); setErr(""); }}
                className={`block min-h-[56px] w-full rounded-[18px] border-[1.5px] px-5 py-3 text-left text-[15.5px] leading-snug transition ${pick === i ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/35 text-[#f1ece2] hover:border-[#DDC98E]"}`}>
                {c}
              </button>
            ))}
          </div>
          {err && <p role="alert" className="mt-3 text-[14px] text-[#f0a8a0]">{err}</p>}
          <Gold onClick={reveal} disabled={guess === null || pick === null}>See her side</Gold>
        </section>
      )}

      {step === "side" && revealed && pick !== null && guess !== null && (
        <section className="mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white/15 p-4 text-center">
              <p className="text-[12px] uppercase tracking-[0.15em] text-[#a79f90]">Your guess</p>
              <p className="mt-1 font-display text-[44px] font-light">{guess}</p>
            </div>
            <div className="rounded-3xl border-2 border-[#DDC98E]/70 bg-[rgba(13,53,53,0.55)] p-4 text-center">
              <p className="text-[12px] uppercase tracking-[0.15em] text-[#DDC98E]">Where she was</p>
              <p className="mt-1 font-display text-[44px] font-light text-[#DDC98E]">{m.her}</p>
            </div>
          </div>
          {guess - m.her >= 3 && <p className="mt-3 text-center text-[14px] text-[#cfc8bb]">You were {guess - m.her} away from her. She was right next to you.</p>}

          <div className="mt-6 rounded-3xl bg-[#f1ece2] p-6 text-[#0D3535]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0D3535]/70">{m.id === "bed" ? "You said" : "You chose"}: {m.choices[pick]}</p>
            <p className="mt-3 font-display text-[21px] leading-snug">{m.sides[pick]}</p>
          </div>

          {m.line && (
            <div className="mt-6 rounded-3xl border-2 border-[#DDC98E]/60 p-6 text-center">
              <p className="font-display text-[28px] font-light leading-tight">{m.line}</p>
              <p className="mt-2 text-[13px] uppercase tracking-[0.2em] text-[#DDC98E]">Quiet isn&rsquo;t yes</p>
            </div>
          )}

          <p className="mt-8 text-[14px] text-[#DDC98E]">{m.id === "bed" ? "The other answers" : "If you'd chosen differently"}</p>
          <div className="mt-3 space-y-2.5">
            {m.choices.map((c, i) => i !== pick && (
              <details key={c} className="group rounded-[18px] border border-[#DDC98E]/25 bg-[#211e19] px-5 py-4">
                <summary className="cursor-pointer list-none text-[15px] text-[#f1ece2]">
                  <span className="mr-2 text-[#DDC98E] group-open:hidden">+</span><span className="mr-2 hidden text-[#DDC98E] group-open:inline">&minus;</span>{c}
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[#cfc8bb]">{m.sides[i]}</p>
              </details>
            ))}
          </div>

          <Gold onClick={() => (m.id === "sofa" ? setStep("tap") : finish())}>
            {m.id === "sofa" ? "Look at her again" : m.id === "bed" ? "Put the phone down" : "On to 9pm"}
          </Gold>
        </section>
      )}

      {step === "tap" && (
        <section className="mt-6">
          <p className="font-display text-[22px] font-light leading-snug text-[#f1ece2]">Her body told you before she said a word.</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#cfc8bb]">Tap each gold word on her to see what it was saying.</p>
          <div className="relative mt-4 aspect-[3/4] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
            <Image src={`${DIR}/her-seated.jpg`} alt="Juliette sitting, looking straight at you" fill sizes="672px" className="object-cover" />
            {SPOTS.map((p, i) => !p.locked && (
              <button key={p.name} type="button" onClick={() => { setSpot(i); if (!opened.includes(i)) setOpened([...opened, i]); }}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border-2 px-4 py-2 text-[14px] font-medium shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition ${spot === i ? "scale-110 border-[#070707] bg-[#DDC98E] text-[#070707]" : opened.includes(i) ? "border-[#DDC98E] bg-[#070707]/80 text-[#DDC98E]" : "animate-pulse border-[#DDC98E] bg-[#DDC98E] text-[#070707]"}`}>
                {opened.includes(i) ? "✓ " : ""}{p.name.replace("Her ", "").replace(/^./, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          {spot !== null && !SPOTS[spot].locked && (
            <div className="mt-4 rounded-3xl bg-[#f1ece2] p-5 text-[#0D3535]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0D3535]/70">{SPOTS[spot].name}</p>
              <p className="mt-2 font-display text-[19px] leading-snug">{SPOTS[spot].text}</p>
            </div>
          )}
          <p className="mt-3 text-center text-[13px] text-[#a79f90]">{opened.filter((i) => !SPOTS[i].locked).length} of 3 read</p>

          <div className="mt-6 rounded-3xl border border-white/15 p-5">
            <p className="text-[15px] text-[#e8e1d4]">She was telling you in four more places.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPOTS.filter((p) => p.locked).map((p) => (
                <span key={p.name} className="rounded-full border border-white/25 px-3 py-1.5 text-[13px] text-[#cfc8bb]">🔒 {p.name.replace("Her ", "").replace(/^The /, "").replace(/^./, (c) => c.toUpperCase())}</span>
              ))}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[#cfc8bb]">All seven, and what to do when you see them, are inside The Unspoken Distance.</p>
            <a href={DOOR_URL} target="_blank" rel="noopener"
              className="mt-4 flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] px-5 text-[15px] text-[#DDC98E] transition hover:bg-[#DDC98E] hover:text-[#070707]">
              See The Unspoken Distance · £97 →
            </a>
            <p className="mt-2 text-center text-[12px] text-[#a79f90]">Opens in a new tab. Your evening stays right here.</p>
          </div>

          <Gold onClick={() => opened.filter((i) => !SPOTS[i].locked).length === 3 && finish()} disabled={opened.filter((i) => !SPOTS[i].locked).length < 3}>On to 11pm</Gold>
        </section>
      )}
    </div>
  );
}

function After({ s, onBack }: { s: Saved; onBack: () => void }) {
  const gaps = MOMENTS.map((m) => Math.max(0, (s.guess[m.id] ?? m.her) - m.her));
  const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">
        ← Your evening
      </button>

      <section>
        <Eyebrow>Your evening</Eyebrow>
        <h2 className="mt-1 font-display text-[30px] font-light leading-tight">Where you thought she was, and where she was</h2>
        <div className="mt-5 space-y-4 rounded-3xl border border-[#DDC98E]/25 bg-[#211e19] p-5">
          {MOMENTS.map((m) => (
            <div key={m.id}>
              <p className="text-[13px] text-[#cfc8bb]">{m.time} · {m.place}</p>
              <div className="relative mt-2 h-2 rounded-full bg-white/10">
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-[#070707]" style={{ left: `${(s.guess[m.id] ?? m.her) * 10}%` }} title="You" />
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DDC98E] shadow-[0_0_10px_#DDC98E]" style={{ left: `${m.her * 10}%` }} title="Her" />
              </div>
            </div>
          ))}
          <p className="pt-1 text-[12px] text-[#a79f90]"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-white/70" /> you · <span className="mx-1 inline-block h-2.5 w-2.5 rounded-full bg-[#DDC98E]" /> her</p>
        </div>
        <p className="mt-4 font-display text-[22px] font-light leading-snug">
          {avg >= 2 ? <>On average you were {avg} away from her. That gap is the unspoken distance.</> : <>You read her closely tonight. Most men are miles off. The distance is still there, underneath.</>}
        </p>
      </section>

      <section className="mt-12">
        <Banner src="/touch-base/hero.jpg" pos="50% 20%" eyebrow="What was missing" title="You, settled" />
        <div className="mt-5 space-y-2 text-[16px] leading-relaxed text-[#e8e1d4]">
          <p>All evening you looked for the right words.</p>
          <p>What she needed was you, settled. She feels it before you say anything.</p>
          <p>This is Touch Base. Do it now, with me, before you reach for her or your phone.</p>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <Image src="/touch-base/emblem.png" alt="The Touch Base emblem: thumb pressed to forefinger" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full shadow-[0_0_30px_-6px_rgba(221,201,142,0.7)]" />
          <div className="flex-1"><VoicePlayer src={TOUCH_BASE_AUDIO} label="Touch Base, with me" dark /></div>
        </div>
      </section>

      <section className="mt-12">
        <Banner src={`${DIR}/tomorrow.jpg`} pos="50% 40%" eyebrow="Tomorrow night" title="One thing" />
        <div className="mt-5 space-y-2 font-display text-[21px] font-light leading-snug">
          <p>Ask, &ldquo;Can I hold your hand?&rdquo;</p>
          <p>If she says yes, hold it. Nothing next.</p>
          <p>If she says not right now, say &ldquo;Okay,&rdquo; and mean it.</p>
        </div>
        <p className="mt-3 text-[15px] text-[#cfc8bb]">That okay is the most intimate thing you&rsquo;ll do all week.</p>
      </section>

      <section className="mt-12 overflow-hidden rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.55)]">
        <div className="relative h-48">
          <Image src={`${DIR}/door.jpg`} alt="The Unspoken Distance" fill sizes="672px" className="object-cover" />
        </div>
        <div className="p-6">
          <Eyebrow>That was one evening</Eyebrow>
          <h2 className="mt-1 font-display text-[30px] font-light leading-tight">The Unspoken Distance</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-[#e8e1d4]">It maps what sits underneath every evening like this one. Nine short parts, and a 15-minute daily embodiment sequence with my voice in your ears, so your body learns to stay steady when she goes quiet.</p>
          <p className="mt-4 font-display text-[34px] font-light text-[#DDC98E]">£97</p>
          <a href={DOOR_URL} className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 text-[16px] font-medium text-[#070707] hover:bg-[#EEDE80]">
            Get The Unspoken Distance
          </a>
        </div>
      </section>

      <p className="mt-10 text-[13px] leading-relaxed text-[#a79f90]">
        If she&rsquo;s afraid of you, or you&rsquo;re afraid of what you do when she goes quiet, talk to someone today.
        {SAFETY_SERVICE ? <> {SAFETY_SERVICE}</> : <> [UK service and number go here, checked live before this goes out]</>}
      </p>
    </div>
  );
}
