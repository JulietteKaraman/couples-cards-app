"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { useRef } from "react";
import { PromptCard } from "@/components/Interactive";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { supabaseBrowser } from "@/lib/supabase/client";
import { count } from "@/lib/count";

// HOW TO FEEL LIKE A WOMAN, IN THE APP. specs/how-to-feel-like-a-woman-app.md.
// Rebuilt 28 Oct night in the 31 Touch Points order after Juliette:
// "it's starting to become a little bit busy and just not very well laid out...
// For 31 touch points, why aren't you doing it here? ... every day they're doing
// this for a month, so that they have 31 days that they could put what they're
// feeling. Remember the coloured points."
//
// Order: TODAY (Scrumptious Stroking, where, how much you felt, I did it, 31 dots)
// then A CARD FROM ME (her instructions button, 5-minute timer, black card)
// then more practices, Scrumptious Confessions, what's coming.
// What a woman writes stays on her phone. Only anonymous counts are sent.

const SLUG = "how-to-feel-like-a-woman";
const DIR = "/how-to-feel-like-a-woman";
// Her recordings. Drop the file into public/how-to-feel-like-a-woman/audio/
// and put its name here. Empty = that part simply doesn't show yet.
const WELCOME_AUDIO = "";
const WRIST_AUDIO = "";
// 30 Oct, Juliette picked the velvet dress video for the Friday wrist drop.
const WRIST_VIDEO = "wrist-velvet.mp4";
const STROKING_AUDIO = "scrumptious-stroking-15.m4a";
const CARD_HOWTO_AUDIO = "/one-touch/voice/on-your-own.m4a"; // her solo how-to, same as the cards app
// Practice Lab: Mon, Wed, Fri 7:30am UK. Returns "today at 7:30am", "tomorrow at 7:30am" or "Friday at 7:30am".
function nextLab(): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const wd = parts.find((x) => x.type === "weekday")?.value || "Mon";
  const h = Number(parts.find((x) => x.type === "hour")?.value || 0), m = Number(parts.find((x) => x.type === "minute")?.value || 0);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days.indexOf(wd), lab = [1, 3, 5];
  for (let k = 0; k < 8; k++) {
    const d = (today + k) % 7;
    if (!lab.includes(d)) continue;
    if (k === 0 && h * 60 + m >= 7 * 60 + 45) continue;
    return k === 0 ? "today at 7:30am" : k === 1 ? "tomorrow at 7:30am" : `${names[d]} at 7:30am`;
  }
  return "Monday at 7:30am";
}
// The How to Feel Like a Woman sisterhood group (from how-to-feel-like-a-woman-welcome.html).
const WHATSAPP_GROUP = "https://chat.whatsapp.com/I6Dda6C70se4jO6kcMEvL8";
const PRACTICE_ROOM = "https://us02web.zoom.us/j/7271652145?pwd=UUVUK283Q0IzSEZ0c3plTkplSG1Udz09";

const lsGet = (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
const dayName = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + "T12:00:00") - Date.parse(a + "T12:00:00")) / 86400000);
const daysAgo = (d: string) => daysBetween(d, todayUK());

type Drop = { id: string; kind: "card" | "confession"; title: string | null; body: string | null; audio: string | null; publish_on: string };
type Next = { kind: "card" | "confession"; publish_on: string } | null;

export default function HowToFeelLikeAWoman() {
  return (
    <CollectionGate collectionSlug={SLUG}>
      <Content />
    </CollectionGate>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{children}</p>;
}

function Banner({ src, pos, eyebrow, title, children }: { src: string; pos: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="relative h-60 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
      <Image src={src} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" style={{ objectPosition: pos }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5">
        {children}
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-1 font-display text-3xl font-light leading-tight">{title}</h2>
        </div>
      </div>
    </div>
  );
}

function Content() {
  const [drops, setDrops] = useState<Drop[] | null>(null);
  const [next, setNext] = useState<Next>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        const token = data.session?.access_token;
        const res = await fetch(`/api/drops?c=${SLUG}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        setDrops(json.drops);
        setNext(json.next);
      } catch {
        // Local preview has no database: show the one real card so the page can
        // be looked at. Never true live.
        if (process.env.NODE_ENV === "development") {
          setDrops([{ id: "seed", kind: "card", title: null, body: "Tell me what pleasure means to you", audio: null, publish_on: todayUK() }]);
          setNext({ kind: "confession", publish_on: "2026-11-02" });
        } else setDrops([]);
      }
    })();
  }, []);

  const cards = (drops || []).filter((d) => d.kind === "card");
  const confessions = (drops || []).filter((d) => d.kind === "confession");

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        {/* HERO */}
        <div className="relative h-[380px] overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] sm:h-[480px]">
          <Image src={`${DIR}/juliette-boudoir.jpg`} alt="Juliette lying back in navy lace" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover object-[52%_35%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <Eyebrow>How to Feel Like a Woman</Eyebrow>
            <h1 className="mt-2 font-display text-[34px] font-light leading-tight">The Art of Being Turned On After 40</h1>
            <p className="mt-2 text-[15px] text-[#cfc8bb]">Every week I&rsquo;ll be dropping new things in here.</p>
          </div>
        </div>
        {WELCOME_AUDIO && <div className="mt-5"><VoicePlayer src={`${DIR}/audio/${WELCOME_AUDIO}`} label="A welcome from me" dark /></div>}

        {/* 1. TODAY */}
        <Today />

        {/* 2. A CARD FROM ME. 28 Oct, Juliette: "on the photo where it says a card from me,
            add my voice instead of in the box under it. The card(s) should sit under that and then
            a small timer, your 5 minutes, not 2 green blocks." */}
        <section className="mt-16">
          <Banner src={`${DIR}/cards-table.jpg`} pos="50% 72%" eyebrow="This week's card" title="A card from me">
            <RoundVoice src={CARD_HOWTO_AUDIO} img={`${DIR}/juliette.jpg`} label="Hear Juliette: how to use your card" />
          </Banner>
          <p className="mt-3 text-center text-[13px] text-[#a79f90]">Tap my photo to hear how to use your card.</p>
          {drops === null && <p className="mt-4 text-[#8f877a]">…</p>}
          {drops !== null && cards.length === 0 && <p className="mt-6 text-center text-[14px] text-[#a79f90]">Your first card lands here very soon.</p>}
          {cards.map((c, i) => <DropCard key={c.id} drop={c} open={i === 0} />)}
          <MiniTimer minutes={5} label="Your 5 minutes" />
        </section>

        {/* 3. THIS WEEK'S PRACTICE (one a week, building her library) */}
        <Wrist />

        {/* 4. SCRUMPTIOUS CONFESSIONS */}
        <section className="mt-16">
          <Eyebrow>My voice, just for you</Eyebrow>
          <div className="relative mt-3 aspect-square overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
            <Image src={`${DIR}/scrumptious-confessions.jpg`} alt="Scrumptious Confessions" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
          </div>
          {drops !== null && confessions.length === 0 && <p className="mt-4 text-center text-[14px] text-[#a79f90]">My first confession lands here very soon.</p>}
          <div className="mt-4 space-y-4">
            {confessions.map((c) => (
              <div key={c.id} className="rounded-2xl border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.3)] p-4">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">
                  {daysAgo(c.publish_on) <= 3 && <span className="h-2 w-2 rounded-full bg-[#EEDE80] shadow-[0_0_10px_#EEDE80]" />}
                  {dayName(c.publish_on)}
                </p>
                {c.audio && <div className="mt-3"><VoicePlayer src={c.audio} label={c.title || "Listen"} dark /></div>}
                {c.body && <p className="mt-3 text-[15px] text-[#cfc8bb]">{c.body}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* 5. COMING NEXT */}
        {next && (
          <section className="mt-16 rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-6 text-center">
            <Eyebrow>Coming {new Date(next.publish_on + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long" })}</Eyebrow>
            <p className="mt-3 font-display text-[22px] font-light">🔒 {next.kind === "card" ? "A new card" : "A new Scrumptious Confession"}</p>
            <p className="mt-2 text-[14px] text-[#a79f90]">Come back and it&rsquo;ll be waiting.</p>
          </section>
        )}
      </div>
      <style>{`
        @keyframes ffyDone { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
        .ffy-done { animation: ffyDone .6s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .ffy-done { animation: none; } }
      `}</style>
    </main>
  );
}

/* ================= TODAY: the daily practice and her 31 days =================
   "they are meant to practice every day... what they felt: very little, a bit,
   and a whole range, like the coloured dots we had... so I can actually get
   that data". Teal, gold, lemon: the Touch Base family. Day 1 is the first
   day she taps "I did it". Everything is kept on her phone. One anonymous
   count per day (where + how much), never who. */
const FEELS = [
  { id: "little", label: "Very little", color: "#2c7a72" },
  { id: "bit", label: "A bit", color: "#A88538" },
  { id: "range", label: "A whole range", color: "#EEDE80" },
] as const;
const DAYS_KEY = "ffy.htflaw.days.v1";
const START_KEY = "ffy.htflaw.start.v1";
type DayRec = { feel?: string; where?: "solo" | "lab"; done?: boolean };
function readDays(): Record<string, DayRec> { try { return JSON.parse(lsGet(DAYS_KEY) || "{}") || {}; } catch { return {}; } }

function Today() {
  const today = todayUK();
  const [days, setDays] = useState<Record<string, DayRec>>({});
  const [start, setStart] = useState("");
  const [labNext, setLabNext] = useState("");
  useEffect(() => { setDays(readDays()); setStart(lsGet(START_KEY)); setLabNext(nextLab()); }, []);
  const rec = days[today] || {};
  const save = (r: DayRec) => { const all = { ...readDays(), [today]: { ...rec, ...r } }; lsSet(DAYS_KEY, JSON.stringify(all)); setDays(all); };
  const dayNum = start ? Math.min(31, daysBetween(start, today) + 1) : 1;
  const markDone = () => {
    let s = start;
    if (!s) { s = today; lsSet(START_KEY, s); setStart(s); }
    const n = Math.min(31, daysBetween(s, today) + 1);
    save({ done: true });
    count(rec.where === "lab" ? "htflaw_lab" : "htflaw_solo", n, rec.feel);
  };
  const pill = (on: boolean) => `flex min-h-[48px] items-center justify-center gap-2 rounded-full border px-3 text-[15px] ${on ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/30 text-[#f1ece2]/80"}`;

  return (
    <section className="mt-12">
      <Banner src={`${DIR}/scrumptious-stroking.jpg`} pos="50% 40%" eyebrow={`Today · day ${dayNum} of 31`} title="Scrumptious Stroking" />
      <p className="mt-5 text-[17px] leading-relaxed text-[#cfc8bb]">Fifteen minutes, every day. My bells and my voice, so you always know where you are. Press play, put the phone down.</p>
      <SlimPlayer src={`${DIR}/audio/${STROKING_AUDIO}`} label="Practise with me · 15 minutes" />
      <details className="mt-3 rounded-2xl border border-[#DDC98E]/20 px-4 py-3">
        <summary className="cursor-pointer text-[12px] uppercase tracking-[0.18em] text-[#DDC98E]">What the bells mean</summary>
        <ol className="mt-3 space-y-1.5 text-[15px] text-[#cfc8bb]">
          {[["0:00", "Two minutes of downstrokes"], ["2:00", "Eleven minutes of practice"], ["7:30", "We're halfway"], ["13:00", "Two minutes of downstrokes"], ["15:00", "Grounding"]].map(([t, w]) => (
            <li key={t} className="flex gap-3"><span className="w-12 shrink-0 font-display text-[#DDC98E]">{t}</span>{w}</li>
          ))}
        </ol>
      </details>

      <div className="mt-8 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
        <Eyebrow>Where did you practise today?</Eyebrow>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => save({ where: "solo" })} className={pill(rec.where === "solo")}>On my own</button>
          <button type="button" onClick={() => save({ where: "lab" })} className={pill(rec.where === "lab")}>In Practice Lab</button>
        </div>
        {/* 28 Oct, Juliette: "practice labs are on mon, wed, fri at 7.30 am" */}
        <p className="mt-3 text-[14px] text-[#cfc8bb]">Practice Lab: Mon, Wed and Fri at 7:30am UK. {labNext && <span className="text-[#DDC98E]">Next: {labNext}</span>}</p>
        <a href={PRACTICE_ROOM} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[14px] text-[#DDC98E] underline underline-offset-4">Join Practice Lab on Zoom →</a>

        <div className="mt-6"><Eyebrow>How much did you feel?</Eyebrow></div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {FEELS.map((f) => (
            <button key={f.id} type="button" onClick={() => save({ feel: f.id })} className={pill(rec.feel === f.id) + " flex-col py-3 text-[14px]"}>
              <span className="h-4 w-4 rounded-full" style={{ background: f.color }} />{f.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {rec.done ? (
            <div className="ffy-done rounded-2xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-5 text-center">
              <span className="block font-display text-3xl font-light text-[#DDC98E]">Done</span>
              <p className="mt-2 text-[15px]">Day {dayNum} is coloured in. See you tomorrow.</p>
            </div>
          ) : (
            <button type="button" onClick={markDone}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80]">
              I did it ✓
            </button>
          )}
        </div>

        <MonthDots days={days} start={start} />
      </div>

      {/* Touch Base, the other daily practice. 28 Oct, Juliette: not boxy, "in Juliette's voice"
          next to "every day, any time". The gold emblem is the play button. */}
      <div className="mt-10 flex items-center gap-4">
        <RoundVoice src="/touch-base/touch-base-guided.m4a" img="/touch-base/emblem.png" label="Touch Base, in Juliette's voice" />
        <div>
          <Eyebrow>Every day · any time · in Juliette&rsquo;s voice</Eyebrow>
          <h3 className="mt-1 font-display text-2xl font-light">Touch Base</h3>
          <p className="mt-0.5 text-[13px] text-[#a79f90]">Tap the emblem · 5 minutes</p>
        </div>
      </div>
    </section>
  );
}

function MonthDots({ days, start }: { days: Record<string, DayRec>; start: string }) {
  const s = start || todayUK();
  const dateOf = (i: number) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); };
  const doneCount = Array.from({ length: 31 }, (_, i) => days[dateOf(i)]?.done).filter(Boolean).length;
  return (
    <div className="mt-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">Your 31 days · {doneCount} done</p>
      <div className="mt-3 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: 31 }, (_, i) => {
          const r = days[dateOf(i)];
          const c = r?.done ? FEELS.find((f) => f.id === r.feel)?.color ?? "rgba(221,201,142,0.45)" : undefined;
          return (
            <span key={i} title={`Day ${i + 1}`} className="aspect-square rounded-full border"
              style={{ background: c ?? "transparent", borderColor: c ?? "rgba(221,201,142,0.3)", boxShadow: r?.done && r.where === "lab" ? "0 0 0 2px #070707, 0 0 0 3.5px #DDC98E" : undefined }} />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => <span key={f.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />{f.label}</span>)}
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-[#DDC98E]" />Gold ring = Practice Lab</span>
      </div>
      <p className="mt-2 text-xs text-[rgba(254,252,250,0.55)]">Kept on this phone only. Not even I see it.</p>
    </div>
  );
}

/* ---- ONE CARD: black side first, tap to turn, then share or keep it private. */
function DropCard({ drop, open }: { drop: Drop; open: boolean }) {
  const key = `ffy.htflaw.card.${drop.id}.v1`;
  const [note, setNote] = useState("");
  const [show, setShow] = useState(open);
  const [turned, setTurned] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setNote(lsGet(key)), [key]);
  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[#DDC98E]/30 px-4 py-4 text-left">
        <span className="text-[15px] text-[#cfc8bb]">An earlier card</span>
        <span className="text-[12px] text-[#8f877a]">{dayName(drop.publish_on)}</span>
      </button>
    );
  }
  return (
    <div className="mt-2">
      <p className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">
        {daysAgo(drop.publish_on) <= 3 && <span className="h-2 w-2 rounded-full bg-[#EEDE80] shadow-[0_0_10px_#EEDE80]" />}
        {dayName(drop.publish_on)}
      </p>
      <TapToTurn prompt={drop.body || ""} onTurned={() => setTurned(true)} />
      {turned && (
        <>
          {/* 28 Oct: her sisterhood group (link from the course welcome page). Tapping copies the
              card's words, then opens the group, so every answer lands with Juliette. */}
          <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer"
            onClick={() => { try { navigator.clipboard?.writeText(drop.body || ""); } catch {} setCopied(true); }}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80]">
            Answer it in our WhatsApp group
          </a>
          <p className="mt-2 text-center text-[13px] text-[#8f877a]">{copied ? "The card is copied. Paste it in the group with your answer." : "Opens our group. The card's words come with you."}</p>
          <label className="mt-4 block rounded-2xl border-[1.5px] border-[#D8DFE1]/60 bg-[#D8DFE1]/[0.06] p-4">
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#D8DFE1]">Just for you</span>
            <textarea value={note} onChange={(e) => { setNote(e.target.value); lsSet(key, e.target.value); }} rows={3}
              placeholder="Or write it here first…"
              className="mt-2 w-full resize-none bg-transparent text-[16px] leading-relaxed text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:outline-none" />
          </label>
          <p className="mt-2 text-[13px] text-[#8f877a]">Saved on this phone only. Not even I see it.</p>
        </>
      )}
    </div>
  );
}

/* The black-and-gold back first; one tap turns it over, like the other decks. */
function TapToTurn({ prompt, onTurned }: { prompt: string; onTurned: () => void }) {
  const [face, setFace] = useState<"back" | "front">("back");
  const [squash, setSquash] = useState(false);
  const turn = () => {
    if (face === "front") return;
    setSquash(true);
    setTimeout(() => { setFace("front"); setSquash(false); onTurned(); }, 220);
  };
  return (
    <div className="my-6 flex flex-col items-center">
      <div onClick={turn} role={face === "back" ? "button" : undefined} aria-label={face === "back" ? "Turn the card over" : undefined}
        className={`w-full max-w-[300px] transition-transform duration-200 ease-in ${face === "back" ? "cursor-pointer" : ""}`}
        style={{ transform: squash ? "scaleX(0)" : "scaleX(1)" }}>
        {face === "back" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${DIR}/card-back.png`} alt="Feel Like a Woman card, face down"
            className="block w-full border border-white/10 shadow-[0_30px_60px_-28px_rgba(0,0,0,.9),0_0_70px_-10px_rgba(221,201,142,.25)]" />
        ) : (
          <div className="-my-7"><PromptCard deck="Feel Like a Woman" prompt={prompt} /></div>
        )}
      </div>
      {face === "back" && <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[#F6EFE0]/50">Tap to turn it over</p>}
    </div>
  );
}

/* ---- THE WRIST. Her four steps, her order, her question. */
const WRIST_STEPS = [
  { t: "Up, down, lighter", d: "A touch you can say yes to." },
  { t: "Each pleasure language", d: "One at a time, each its own touch." },
  { t: "Add nails", d: "" },
  { t: "Look down", d: "Look down while you're stroking yourself up." },
];
const STOP = [
  { id: "yes", label: "Yes", c: "#5fae5a" },
  { id: "maybe", label: "Maybe", c: "#E8B04B" },
  { id: "no", label: "No", c: "#d0644f" },
];
const WRIST_KEY = "ffy.htflaw.wrist.v1";
// 28 Oct, Juliette: "I'm wondering if I'm just overwhelming them... put just the wrist and then
// make it grey, the up-down lighter... that becomes available on Friday." Touch Base and
// Scrumptious Stroking are always there; the week's practice opens on its day.
const WRIST_OPENS = "2026-10-30"; // Friday
function Wrist() {
  const [ans, setAns] = useState<Record<number, string>>({});
  useEffect(() => { try { setAns(JSON.parse(lsGet(WRIST_KEY) || "{}")); } catch {} }, []);
  const pick = (i: number, id: string) => { if (locked) return; const n = { ...ans, [i]: id }; setAns(n); lsSet(WRIST_KEY, JSON.stringify(n)); };
  const [locked, setLocked] = useState(true);
  useEffect(() => { setLocked(todayUK() < WRIST_OPENS); }, []);
  const opensDay = new Date(WRIST_OPENS + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long" });
  return (
    <section className="mt-16">
      <Banner src={`${DIR}/eso15-feather.jpg`} pos="50% 60%" eyebrow="This week's practice · three minutes" title="The Wrist" />
      <p className="mt-5 text-[17px] leading-relaxed text-[#cfc8bb]">
        Did that increase sensation? Did it decrease it? Is it saying yes? It&rsquo;s harder to tell than you&rsquo;d think.
      </p>
      {locked && (
        <p className="mt-5 flex items-center gap-2 rounded-full border border-[#DDC98E]/40 px-4 py-2.5 text-[14px] text-[#DDC98E]">
          <span aria-hidden="true">🔒</span> Opens {opensDay}. I&rsquo;ll take you through it.
        </p>
      )}
      {!locked && WRIST_VIDEO && (
        <div className="mx-auto mt-6 max-w-[360px]">
          <video src={`${DIR}/video/${WRIST_VIDEO}`} poster={`${DIR}/video/wrist-velvet-poster.jpg`} controls playsInline preload="none"
            className="aspect-[9/16] w-full rounded-2xl border border-[#DDC98E]/30 bg-black object-cover" />
          <p className="mt-2 text-center text-[13px] text-[#8f877a]">Do it with me · 3 minutes</p>
        </div>
      )}
      {!locked && WRIST_AUDIO && <SlimPlayer src={`${DIR}/audio/${WRIST_AUDIO}`} label="Do it with me · 3 minutes" />}
      <ol className={`mt-5 space-y-3 transition ${locked ? "pointer-events-none select-none opacity-35 grayscale" : ""}`} aria-disabled={locked}>
        {WRIST_STEPS.map((s, i) => (
          <li key={i} className="rounded-2xl border border-[#DDC98E]/30 bg-[rgba(13,53,53,0.3)] p-4">
            <p className="font-display text-[18px]"><span className="mr-2 text-[#DDC98E]">{i + 1}</span>{s.t}</p>
            {s.d && <p className="mt-1 text-[14px] text-[#a79f90]">{s.d}</p>}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {STOP.map((o) => (
                <button key={o.id} type="button" onClick={() => pick(i, o.id)}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-full border text-[14px] ${ans[i] === o.id ? "bg-[rgba(221,201,142,0.12)] text-[#f1ece2]" : "text-[#f1ece2]/75"}`}
                  style={{ borderColor: ans[i] === o.id ? o.c : "rgba(221,201,142,0.3)" }}>
                  <span className="h-3 w-3 rounded-full" style={{ background: o.c }} />{o.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* A round photo or emblem that IS the play button, with a gold ring that fills as it plays. */
function RoundVoice({ src, img, label }: { src: string; img: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  return (
    <button type="button" aria-label={playing ? "Pause" : label}
      onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }}
      className="relative h-[72px] w-[72px] shrink-0 rounded-full">
      <Image src={img} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover object-[60%_20%]" />
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="rgba(221,201,142,0.35)" strokeWidth="2" />
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="#DDC98E" strokeWidth="2" strokeDasharray={`${p * 1.037} 200`} />
      </svg>
      <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#DDC98E] text-[11px] text-[#070707] shadow">{playing ? "❚❚" : "▶"}</span>
      <audio ref={ref} src={src} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setP(0); }}
        onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setP((a.currentTime / a.duration) * 100); }} />
    </button>
  );
}

/* A slim player: gold button, one line of text, a thin line. No box. */
function SlimPlayer({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = ref.current; if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur;
  };
  return (
    <div className="mt-5 flex items-center gap-4">
      <button type="button" aria-label={playing ? "Pause" : label}
        onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DDC98E] text-[#070707] shadow-[0_0_28px_-6px_rgba(221,201,142,0.7)]">
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="flex-1">
        <p className="text-[15px] text-[#f1ece2]">{label}</p>
        <div onClick={seek} className="mt-2 h-[3px] cursor-pointer overflow-hidden rounded-full bg-[#DDC98E]/20">
          <div className="h-full bg-[#DDC98E]" style={{ width: dur ? `${(cur / dur) * 100}%` : "0%" }} />
        </div>
        <p className="mt-1.5 text-[12px] text-[#8f877a]">{playing || cur ? `${fmt(cur)} · ${fmt(Math.max(0, dur - cur))} left` : "In Juliette\u2019s voice"}</p>
      </div>
      <audio ref={ref} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)} />
    </div>
  );
}

/* A small timer: one line, counts down by the clock, keeps the screen awake, and rings
   the singing bowl from her practice track at the end. The bell is a real sound file
   (not a synthesised tone), unlocked by the Start tap, so it also rings on an iPhone
   with the silent switch on. Local preview: ?t=5 makes it 5 seconds to test. */
function MiniTimer({ minutes, label }: { minutes: number; label: string }) {
  const [total, setTotal] = useState(minutes * 60);
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);
  const bell = useRef<HTMLAudioElement | null>(null);
  const lock = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const q = Number(new URLSearchParams(window.location.search).get("t"));
      if (q > 0) { setTotal(q); setLeft(q); }
    }
  }, []);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const s = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        setRunning(false);
        const b = bell.current; if (b) { b.currentTime = 0; b.volume = 1; b.play().catch(() => {}); }
        try { lock.current?.release(); } catch {}
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);
  const start = async () => {
    // Unlock the bell inside the tap, silently, so the browser lets it ring later.
    const b = bell.current;
    if (b) { try { b.volume = 0; await b.play(); b.pause(); b.currentTime = 0; b.volume = 1; } catch {} }
    try { if ("wakeLock" in navigator) lock.current = await navigator.wakeLock.request("screen"); } catch {}
    const secs = left > 0 && left < total ? left : total;
    endAt.current = Date.now() + secs * 1000; setLeft(secs); setRunning(true);
  };
  const stop = () => { setRunning(false); try { lock.current?.release(); } catch {} };
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const done = left === 0;
  return (
    <div className="mx-auto mt-6 max-w-[300px]">
      <div className="flex items-center justify-between gap-3 rounded-full border border-[#DDC98E]/40 py-2 pl-5 pr-2">
        <span className="text-[13px] uppercase tracking-[0.16em] text-[#DDC98E]">{done ? "Done" : label}</span>
        <span className="font-display text-[20px] tabular-nums text-[#f1ece2]">{mm}</span>
        <button type="button" onClick={running ? stop : done ? () => setLeft(total) : start}
          className="rounded-full bg-[#DDC98E] px-4 py-2 text-[13px] font-medium text-[#070707]">
          {running ? "Pause" : done ? "Again" : left < total ? "Go on" : "Start"}
        </button>
      </div>
      <p className="mt-2 text-center text-[12px] text-[#8f877a]">A bell rings at the end. Keep the screen on.</p>
      <audio ref={bell} src={`${DIR}/audio/card-bell.m4a`} preload="auto" />
    </div>
  );
}
