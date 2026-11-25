"use client";

// THE SCRUMPTIOUSNESS JOURNAL, in the app. specs/scrumptiousness-journal-and-poems.md (journal part).
// Her 104 printed pages, one page per screen, in her own words (lib/content/scrumptiousness-journal.ts,
// generated from her fillable PDF, never retyped here). Every writing area on the printed page is a
// box she can type in. What she writes stays on her phone, in localStorage, and nowhere else:
// no account, no Supabase, no Kit. Only anonymous counts leave the phone (lib/count).

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HomePrompt, Voice, read, write } from "@/components/BiteKit";
import { count } from "@/lib/count";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { LHL_OFFER_ENDS, SJ_LHL_FLAG, lhlOfferOn } from "@/lib/content/let-her-land";
import VoicePlayer from "@/components/VoicePlayer";
import { COVER, JOURNAL_AUDIO, JOURNAL_BOX_TOTAL, JOURNAL_PAGES, type JItem } from "@/lib/content/scrumptiousness-journal";

const K = {
  answers: "ffy.sj.answers.v1", // { [boxId]: text }
  marks: "ffy.sj.marks.v1", // page numbers she wants to come back to
  pos: "ffy.sj.pos.v1", // index of the page she last had open
  mode: "ffy.sj.mode.v1", // "book" (the printed page, default) or "read" (easy read, plain text)
};

// Wording that is NOT from her book (marked for her approval in the build report).
const UI = {
  privacy: "What you write stays on your phone. Not even I see it.",
  saved: "Saved on this phone.",
  placeholder: "Write whatever comes.",
  keepCopy: "Keep a copy",
  newPhone: "If you get a new phone, this starts fresh. Keep a copy of what you've written.",
  copied: "Copied. Paste it into your notes or an email to yourself.",
  selectIt: "Your phone wouldn't copy it. Select this text and copy it yourself.",
  blocked: "This browser isn't keeping what you write. It works for now, but it will be gone when you close the page.",
  shareTitle: "My Scrumptiousness Journal answers",
  comeBack: "Come back to this",
  marked: "Marked to come back to",
  firstPrompt: "Go straight to the first prompt",
  toMeditation: "Go to the meditation",
  coverTimes: "Write at your own pace. The meditation needs about 20 minutes, headphones and somewhere quiet.",
  beforePlay: "Before you press play: find somewhere quiet and put your headphones on.",
  recordingLength: (len: string) => `The recording is ${len} long.`,
  giveYourself: "Give yourself 20 minutes in all.",
  celebrate: "Celebrate what you've just done. Come back tomorrow for the next part.",
  keepGoing: "Keep going anyway",
  // 25 Nov 2026 (Juliette, from Viv): "flow", the playlist goes straight to Spotify, and her intentions in one place.
  flow: "Flow through it. Do each practice as you reach it, one part a day.",
  opensSpotify: "Opens in your Spotify app.",
  saidTitle: "What I said I’d do",
  saidLine: "Everything you promised yourself in this journal, in one place. Come back to it, and act on it.",
  saidEmpty: "Not written yet.",
  saidWrite: "Write it",
};

// Natural places to stop: the last page of a section that ends in something she has done.
// 22 self-care routine, 33 after the playlist practice and brain dump, 37 the first brags and wins practice,
// 49 to 91 the end of each of the seven days. A gentle card, never a gate.
const SECTION_ENDS = new Set([22, 33, 37, 49, 56, 63, 70, 77, 84, 91]);

// "What I said I'd do" (Viv's idea, Juliette's yes, 25 Nov 2026): the writing spaces where she makes a promise to herself.
const SAID: { page: number; title: string; ids: string[] }[] = [
  { page: 11, title: "My intentions for this journal", ids: ["p11a1"] },
  { page: 37, title: "My commitment to myself", ids: ["p37a5"] },
  { page: 102, title: "Five things I will commit to, long term", ids: ["p102a1", "p102a2", "p102a3", "p102a4", "p102a5"] },
];

// Spotify: try the Spotify app first, and only if it doesn't open, the website (Viv: the website took her into settings).
function openSpotify(href: string) {
  const m = href.match(/open\.spotify\.com\/(playlist|show|album|track|episode)\/([A-Za-z0-9]+)/);
  if (!m) { window.open(href, "_blank"); return; }
  const web = `https://open.spotify.com/${m[1]}/${m[2]}`;
  let left = false;
  const onHide = () => { left = true; };
  document.addEventListener("visibilitychange", onHide, { once: true });
  window.location.href = `spotify:${m[1]}:${m[2]}`;
  setTimeout(() => { document.removeEventListener("visibilitychange", onHide); if (!left && document.visibilityState === "visible") window.open(web, "_blank"); }, 1400);
}

// A TASTER for people who are not paying members (Juliette, 19 Nov 2026: "only give a taster of the journal",
// and "the 10 pages is more beautiful and gives a real feel of it"). Pages 4 to 13 of the book: the preface,
// how to use it, the first writing pages and the playlist. Paying Scrumptious Confessions members and the
// admin see every page. Same member check as the Library: a scrumptious-confessions row whose checkout
// session does not start with "free-", or the admin email. The free fortnight does not unlock it.
const TASTER_PAGES = 10;
const MEMBER_URL = "https://feelfullyyou.com/scrumptious-confessions-membership";
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// The first words of a page, for the contents list.
function pageHeading(items: JItem[]): string {
  const t = items.find((i) => i.t === "text") as Extract<JItem, { t: "text" }> | undefined;
  const s = (t?.text ?? "Writing space").replace(/\s+/g, " ").trim();
  return s.length > 64 ? s.slice(0, 61).trimEnd() + "…" : s;
}

// ---- Quotes --------------------------------------------------------------------------------------
// The quote pages are set in capitals in her PDF, so the words in the content file are capitals too.
// Left as they are in the file; here, for display only, a quote is shown in normal sentence case, in italic.
// A quote page: no writing box, one title (the quote), an optional "- Name" line and an optional note.
type QuoteParts = { quote: string; by: string; note: string };
function quoteParts(items: JItem[]): QuoteParts | null {
  if (items.length > 3 || items.some((i) => i.t === "box")) return null;
  const txt = items as Extract<JItem, { t: "text" }>[];
  if (txt[0].k !== "title") return null;
  const by = txt.find((i) => i.k === "kicker");
  const note = txt.find((i) => i.k === "sub");
  if (txt.length !== 1 + (by ? 1 : 0) + (note ? 1 : 0)) return null;
  return { quote: sentenceCase(txt[0].text), by: by ? nameCase(by.text) : "", note: note ? note.text : "" };
}
function sentenceCase(raw: string): string {
  const t = raw.replace(/\s+/g, " ").replace(/,(?=[A-Za-z])/g, ", ").trim().toLowerCase();
  let out = "";
  let cap = true;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (cap && /[a-z]/.test(c)) { out += c.toUpperCase(); cap = false; continue; }
    out += c;
    if (c === "!" || c === "?") cap = true;
    else if (c === ".") {
      const before = t.slice(0, i).trimEnd().slice(-1);
      const after = t.slice(i + 1).trimStart().charAt(0);
      cap = before !== "." && after !== ".";
    }
  }
  return out.replace(/\bi\b/g, "I");
}
function nameCase(raw: string): string {
  const name = raw.replace(/^[-\u2013\u2014]\s*/, "").trim().toLowerCase();
  let first = true;
  return name.replace(/[a-z][a-z.']*/g, (w) => {
    const keep = !first && /^(de|von|van|der|di|le|la)$/.test(w);
    first = false;
    return keep ? w : w[0].toUpperCase() + w.slice(1);
  });
}
function QuoteEasy({ q }: { q: QuoteParts }) {
  return (
    <blockquote className="my-8 border-l-2 border-[#DDC98E]/60 pl-5" data-testid="quote">
      <p className="text-[23px] font-light italic leading-[1.5] text-[#f1ece2]" style={{ fontFamily: "'Playfair Display', serif" }}>{q.quote}</p>
      {q.by && <p className="mt-4 text-[14px] text-[#DDC98E]">{q.by}</p>}
      {q.note && <p className="mt-1 text-[13px] text-[#a79f90]">{q.note}</p>}
    </blockquote>
  );
}

// How long a recording runs, read from the audio file itself. Unknown until it loads, and then left out if it never does.
function useAudioLength(src: string): string {
  const [len, setLen] = useState("");
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      if (!isFinite(a.duration) || a.duration <= 0) return;
      const m = Math.floor(a.duration / 60);
      const r = Math.round(a.duration % 60);
      setLen(`${m}:${String(r).padStart(2, "0")}`);
    };
    a.src = src;
    return () => { a.onloadedmetadata = null; a.removeAttribute("src"); };
  }, [src]);
  return len;
}
function MeditationNote({ src }: { src: string }) {
  const len = useAudioLength(src);
  return (
    <p className="mb-3 mt-4 rounded-2xl border border-[#DDC98E]/30 p-4 text-[15px] leading-relaxed text-[#cfc8bb]" data-testid="meditation-note">
      {UI.beforePlay} {len ? UI.recordingLength(len) + " " : ""}{UI.giveYourself}
    </p>
  );
}

// ---- Keep a copy: every answer with the words above it ------------------------------------------
function answersText(answers: Record<string, string>) {
  const out: string[] = [];
  for (const pg of JOURNAL_PAGES) {
    let lastText = "";
    const parts: string[] = [];
    for (const it of pg.items) {
      if (it.t === "text") {
        // The words above an answer: skip small kicker lines and numbered examples, shorten a long paragraph.
        if (/^\d+[.)]\s/.test(it.text)) continue;
        if (it.k !== "kicker" || !lastText) lastText = it.text.length > 140 ? it.text.slice(0, 137).trimEnd() + "…" : it.text;
        continue;
      }
      const a = (answers[it.id] ?? "").trim();
      if (a) parts.push(`${it.label ? it.label + ". " : ""}${lastText}\n${a}`);
    }
    if (parts.length) out.push(`Page ${pg.n}\n${parts.join("\n\n")}`);
  }
  return out.length ? `The Scrumptiousness Journal\n\n${out.join("\n\n")}` : "";
}

function KeepCopy({ answers }: { answers: Record<string, string> }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const text = answersText(answers);
  const run = async () => {
    const body = text || "The Scrumptiousness Journal\n\n(Nothing written yet.)";
    setMsg("");
    setShow(false);
    count("sj_copy");
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: UI.shareTitle, text: body });
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return; // she closed the sheet
    }
    try {
      await navigator.clipboard.writeText(body);
      setMsg(UI.copied);
      return;
    } catch {
      /* both blocked: show the text to select */
    }
    setMsg(UI.selectIt);
    setShow(true);
  };
  return (
    <div className="mt-8 rounded-2xl border border-[#DDC98E]/30 p-4" data-testid="keep-copy">
      <button type="button" onClick={run} className="inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E]/60 px-6 text-[15px] text-[#DDC98E]">{UI.keepCopy}</button>
      <p className="mt-3 text-[14px] leading-relaxed text-[#a79f90]">{UI.newPhone}</p>
      {msg && <p role="status" className="mt-2 text-[14px] text-[#EEDE80]" data-testid="copy-msg">{msg}</p>}
      {show && <textarea readOnly value={text} rows={8} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-3 text-[14px] text-[#f1ece2]" data-testid="copy-text" />}
    </div>
  );
}

// ---- A writing area: grows with what she writes, saves as she types ----------------------------------
function Area({ id, label, lines, value, onChange }: { id: string; label?: string; lines: number; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const rows = clamp(Math.round(lines * 0.7), 2, 12);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`; // never clips her words
  }, [value]);
  return (
    <div className="mt-3 flex items-start gap-3" data-testid="area">
      {label && <span className="font-display mt-3 w-6 shrink-0 text-right text-[22px] font-light text-[#DDC98E]">{label}</span>}
      <div className="min-w-0 flex-1">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          value={value}
          placeholder={UI.placeholder}
          aria-label={label ? `Your answer ${label}` : "Your answer"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]"
        />
        <p className="mt-1 text-[12px] text-[#8f877a]">{value ? UI.saved : ""}&nbsp;</p>
      </div>
    </div>
  );
}

function Item({ it, answers, setAnswer }: { it: JItem; answers: Record<string, string>; setAnswer: (id: string, v: string) => void }) {
  if (it.t === "box") return <Area id={it.id} label={it.label} lines={it.lines} value={answers[it.id] ?? ""} onChange={(v) => setAnswer(it.id, v)} />;
  switch (it.k) {
    case "title":
      return <h2 className="font-display my-7 whitespace-pre-line text-[28px] font-light leading-[1.2] text-[#f1ece2]">{it.text}</h2>;
    case "kicker":
      return <p className="my-5 text-[12px] font-medium uppercase leading-relaxed tracking-[0.16em] text-[#DDC98E]">{it.text}</p>;
    case "sub":
      return <p className="font-display my-5 text-[19px] font-light leading-[1.45] text-[#f1ece2]">{it.text}</p>;
    default:
      return <p className="my-4 text-[17px] leading-[1.65] text-[#cfc8bb]">{it.text}</p>;
  }
}

// ---- The printed page itself: her design, her photos, her fonts, and boxes she types into --------------
// Each page of the book is a picture with the words taken out (public/scrumptiousness-journal/pages/pNNN.webp),
// her words put back exactly where they sit in the book (SVG text, same fonts and sizes), and a live
// text box over every writing area. Page layout data: pNNN.json next to the picture.
type L = [number, number, number, string, number, number, number, string, string]; // x, baseline y, width, font, weight, italic, size, colour, text
type A = { id: string; x: number; y: number; w: number; h: number; n: number; g: number; lab?: string };
type Lay = { n: number; lines: L[]; areas: A[] };
const layCache = new Map<number, Lay>();
const FONT_VAR: Record<string, string> = { Jost: "Jost, sans-serif", Marcellus: "Marcellus, serif", Playfair: "'Playfair Display', serif", Bodoni: "'Bodoni Moda', serif" };
const pad3 = (n: number) => String(n).padStart(3, "0");
async function loadLay(n: number): Promise<Lay | null> {
  const hit = layCache.get(n);
  if (hit) return hit;
  try {
    const r = await fetch(`/scrumptiousness-journal/pages/p${pad3(n)}.json`);
    if (!r.ok) return null;
    const j = (await r.json()) as Lay;
    layCache.set(n, j);
    return j;
  } catch {
    return null;
  }
}

function BookPage({ n, answers, setAnswer, quote }: { n: number; answers: Record<string, string>; setAnswer: (id: string, v: string) => void; quote: QuoteParts | null }) {
  const slot = JOURNAL_AUDIO[n]?.src && JOURNAL_AUDIO[n]?.at ? JOURNAL_AUDIO[n] : null;
  const [lay, setLay] = useState<Lay | null>(layCache.get(n) ?? null);
  const [w, setW] = useState(375);
  const [failed, setFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let live = true;
    loadLay(n).then((l) => {
      if (!live) return;
      if (l) { setLay(l); setFailed(false); } else setFailed(true);
    });
    loadLay(n + 1); // the next page is ready before she taps Next
    return () => { live = false; };
  }, [n]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  if (failed) return <p className="my-10 text-center text-[15px] text-[#a79f90]" data-testid="book-failed">This page could not load. Use Easy read at the top.</p>;
  const k = w / 432; // screen pixels per printed point
  const cur = lay && lay.n === n ? lay : null;
  // A quote page: her capitals are taken off the page and the quote is set again in normal case, softer, in italic.
  // Lines below y 600 (the footer and page number) stay as printed.
  const body = quote && cur ? cur.lines.filter((l) => l[1] < 600) : [];
  const qBox = body.length ? (() => {
    const minX = Math.min(...body.map((l) => l[0]));
    const flushLeft = body.every((l) => Math.abs(l[0] - body[0][0]) < 0.5);
    const top = Math.min(...body.map((l) => l[1] - l[6]));
    return flushLeft ? { x: minX, y: top, w: 432 - minX - 40, h: 560 - top, flushLeft } : { x: 92, y: 170, w: 248, h: 330, flushLeft };
  })() : null;
  const qLen = quote ? quote.quote.length : 0;
  const qPt = qBox?.flushLeft ? 22 : qLen > 250 ? 14 : qLen > 120 ? 16 : 19;
  return (
    <div ref={box} className="relative mx-auto w-full overflow-hidden bg-[#070707] shadow-[0_0_60px_-20px_rgba(221,201,142,0.35)] sm:rounded-lg" style={{ aspectRatio: "432 / 648", maxWidth: 900 }} data-testid="bookpage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/scrumptiousness-journal/pages/p${pad3(n)}.webp`} alt={`Page ${n} of The Scrumptiousness Journal`} className="absolute inset-0 h-full w-full select-none" draggable={false} />
      {cur && (
        <svg viewBox="0 0 432 648" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {cur.lines.filter((l) => !qBox || l[1] >= 600).map((l, i) => (
            <text key={i} x={l[0]} y={l[1]} textLength={l[2]} lengthAdjust="spacing" fill={l[7]} fontSize={l[6]} fontWeight={l[4] === 300 && l[6] < 8 ? 400 : l[4]} fontStyle={l[5] ? "italic" : "normal"} style={{ fontFamily: FONT_VAR[l[3]] ?? FONT_VAR.Jost, whiteSpace: "pre" }}>{l[8]}</text>
          ))}
        </svg>
      )}
      {qBox && quote && (
        <div
          className={`absolute flex flex-col ${qBox.flushLeft ? "justify-start text-left" : "justify-center text-center"}`}
          style={{ left: `${(qBox.x / 432) * 100}%`, top: `${(qBox.y / 648) * 100}%`, width: `${(qBox.w / 432) * 100}%`, height: `${(qBox.h / 648) * 100}%` }}
          data-testid="quote"
        >
          <p style={{ fontFamily: FONT_VAR.Playfair, fontStyle: "italic", fontWeight: 400, fontSize: qPt * k, lineHeight: 1.5, color: body[0][7] }}>{quote.quote}</p>
          {quote.by && <p style={{ fontFamily: FONT_VAR.Jost, fontSize: 9 * k, marginTop: 14 * k, letterSpacing: "0.06em", color: body[body.length - 1][7] }}>{quote.by}</p>}
          {quote.note && <p style={{ fontFamily: FONT_VAR.Jost, fontSize: 8.5 * k, marginTop: 4 * k, color: body[body.length - 1][7] }}>{quote.note}</p>}
        </div>
      )}
      {slot && slot.src && slot.at && (
        <div className="absolute" style={{ left: `${slot.at.x * 100}%`, top: `${slot.at.y * 100}%`, width: `${slot.at.w * 100}%` }} data-testid="slot-player">
          <VoicePlayer noScene src={slot.src} label={slot.label} />
        </div>
      )}
      {cur?.areas.map((a) => {
        const pitch = (a.h / Math.max(1, a.n)) * k; // one printed line, in screen pixels
        const vis = a.g ? Math.min(17, Math.max(12.5, k * 11)) : Math.min(17, Math.max(11.5, pitch * 0.82)); // what she sees
        const s = vis / 16; // the box types at 16px (so a phone never zooms in) and is shrunk to what she sees
        return (
          <div key={a.id} className="absolute" style={{ left: `${(a.x / 432) * 100}%`, top: `${(a.y / 648) * 100}%`, width: `${(a.w / 432) * 100}%`, height: `${(a.h / 648) * 100}%` }}>
            <textarea
              id={a.id}
              data-testid="area"
              value={answers[a.id] ?? ""}
              onChange={(e) => setAnswer(a.id, e.target.value)}
              aria-label={a.lab ? `Your answer ${a.lab}` : "Your answer"}
              spellCheck
              className="absolute left-0 top-0 resize-none border-0 bg-transparent text-[#231f20] outline-none focus:bg-[rgba(221,201,142,0.16)]"
              style={{
                width: `${100 / s}%`,
                height: `${100 / s}%`,
                transform: `scale(${s})`,
                transformOrigin: "top left",
                fontSize: 16,
                fontFamily: FONT_VAR.Jost,
                lineHeight: a.g ? 1.4 : `${pitch / s}px`,
                padding: a.g ? "10px 12px" : "0 2px",
                overflowY: "auto",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function ScrumptiousnessJournal() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [view, setView] = useState<"cover" | "page" | "contents" | "said">("cover");
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [book, setBook] = useState(true);
  const [paid, setPaid] = useState(false);
  // Pages a non-member may open: 10 in the free week, none for someone who hasn't started it (Juliette 19 Nov 2026).
  const [limit, setLimit] = useState(0);
  const [memberKnown, setMemberKnown] = useState(false);
  // The small "back to Scrumptious Confessions" pill (components/BackToConfessions) floats at the top right
  // once someone has come through Confessions this visit. When it is there, the page starts lower so it covers nothing.
  const [pill, setPill] = useState(false);
  const answersRef = useRef<Record<string, string>>({});
  const counted = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Phone storage is only readable after the page opens on the phone.
    let b = false;
    try {
      localStorage.setItem("ffy.sj.test", "1");
      localStorage.removeItem("ffy.sj.test");
    } catch {
      b = true;
    }
    const a = read<Record<string, string>>(K.answers, {});
    answersRef.current = a;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(a);
    setMarks(read<number[]>(K.marks, []));
    setBook(read<string>(K.mode, "book") !== "read");
    const p = read<number>(K.pos, -1);
    if (Number.isInteger(p) && p >= 0 && p < JOURNAL_PAGES.length) setPos(p);
    setBlocked(b);
    try { setPill(sessionStorage.getItem("ffy.from.confessions") === "1"); } catch { /* no session storage: no pill to make room for */ }
    setReady(true);
    count("sj_open");
  }, []);

  useEffect(() => {
    (async () => {
      let ok = false;
      let inWeek = false;
      try {
        if (process.env.NODE_ENV === "development" && localStorage.getItem("ffy.sj.member") === "1") ok = true; // local preview only
        // Let Her Land (Already Her bundle, 20 Nov 2026): the whole journal is part of it. Opened from Let Her Land
        // before the offer ends, the flag stays on this phone and keeps the journal open after 12 Dec too.
        try {
          if (lhlOfferOn() && new URLSearchParams(window.location.search).get("from") === "let-her-land" && !localStorage.getItem(SJ_LHL_FLAG)) localStorage.setItem(SJ_LHL_FLAG, new Date().toISOString());
          const f = localStorage.getItem(SJ_LHL_FLAG);
          if (f && new Date(f) < new Date(LHL_OFFER_ENDS)) ok = true;
        } catch { /* storage blocked: the usual check below */ }
        const { data } = await supabaseBrowser.auth.getSession();
        const uid = data.session?.user.id;
        if (uid) {
          if ((data.session?.user.email || "").toLowerCase() === ADMIN_EMAIL) ok = true;
          const { data: row } = await supabaseBrowser.from("user_decks").select("purchased_at, stripe_checkout_session_id, expires_at").eq("user_id", uid).eq("deck_type", "scrumptious-confessions").maybeSingle();
          // Access ends with what they paid for (plus the webhook's grace): after that the Journal locks again.
          const live = !!row?.purchased_at && (!row.expires_at || new Date(row.expires_at as string) > new Date());
          // "free-" (the old free fortnight) and "trial-" (the 7-day trial) are not paying members: they get the taster.
          if (live && !/^(free|trial)-/.test(String(row?.stripe_checkout_session_id || ""))) ok = true;
          else if (live && new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date()) >= "2026-11-23") inWeek = true; // free week starts when doors open
        }
      } catch {
        /* not signed in, or no connection: she sees the taster */
      }
      setPaid(ok);
      setLimit(inWeek ? TASTER_PAGES : 0);
      setMemberKnown(true);
    })();
  }, []);

  const setAnswer = useCallback((id: string, v: string) => {
    const next = { ...answersRef.current, [id]: v };
    answersRef.current = next;
    setAnswers(next);
    write(K.answers, next);
    if (v.trim() && !counted.current.has(id)) {
      counted.current.add(id);
      count("sj_answer"); // anonymous: no id, no words
    }
  }, []);

  const answered = useMemo(() => JOURNAL_PAGES.reduce((n, p) => n + p.items.filter((i) => i.t === "box" && (answers[i.id] ?? "").trim()).length, 0), [answers]);
  const pageDone = (i: number) => JOURNAL_PAGES[i].items.some((it) => it.t === "box" && (answers[it.id] ?? "").trim());
  const frac = JOURNAL_BOX_TOTAL ? answered / JOURNAL_BOX_TOTAL : 0;

  const open = (rawI: number) => {
    const i = paid ? rawI : Math.min(rawI, limit);
    setPos(i);
    write(K.pos, i);
    setView("page");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };
  const toggleBook = () => {
    const next = !book;
    setBook(next);
    write(K.mode, next ? "book" : "read");
  };
  const toggleMark = (n: number) => {
    const next = marks.includes(n) ? marks.filter((x) => x !== n) : [...marks, n];
    setMarks(next);
    write(K.marks, next);
  };

  const wrap = "ffy-sj mx-auto w-full max-w-[560px] px-5 pb-28 pt-6 text-[#f1ece2]";
  const wrapStyle = pill ? { paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)" } : undefined;
  const bg = "min-h-screen bg-[#070707] [background-image:radial-gradient(120%_60%_at_50%_0%,rgba(13,53,53,0.55),transparent_70%)]";

  if (!ready || !memberKnown) return <main className={bg} />;
  const locked = !paid && pos >= limit;
  // Shortcuts: the first page with a writing box, and the meditation recording (her only recording played in the app).
  const firstBoxIdx = JOURNAL_PAGES.findIndex((p) => p.items.some((i) => i.t === "box"));
  const medIdx = JOURNAL_PAGES.findIndex((p) => JOURNAL_AUDIO[p.n]?.src);
  const canFirst = firstBoxIdx >= 0 && (paid || limit > firstBoxIdx);
  const canMed = medIdx >= 0 && paid;
  const saidAny = SAID.some((g) => g.ids.some((id) => (answers[id] || "").trim()));

  // ---- What I said I'd do ---------------------------------------------------------------------------
  if (view === "said") {
    return (
      <main className={bg}>
        <div className={wrap} style={wrapStyle}>
          <button type="button" onClick={() => setView(pos >= 0 ? "page" : "cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Back</button>
          <h1 className="font-display mt-2 text-[30px] font-light">{UI.saidTitle}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#cfc8bb]">{UI.saidLine}</p>
          {SAID.map((g) => {
            const idx = JOURNAL_PAGES.findIndex((p) => p.n === g.page);
            const lines = g.ids.map((id) => (answers[id] || "").trim()).filter(Boolean);
            const canOpen = idx >= 0 && (paid || idx < limit);
            return (
              <section key={g.page} className="mt-6 rounded-2xl border border-[#DDC98E]/35 bg-[rgba(13,53,53,0.35)] p-5" data-testid={`said-${g.page}`}>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#DDC98E]">{g.title}</p>
                {lines.length ? (
                  g.ids.length > 1
                    ? <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] leading-relaxed text-[#f1ece2]">{lines.map((l, i) => <li key={i} className="whitespace-pre-wrap">{l}</li>)}</ol>
                    : <p className="mt-3 whitespace-pre-wrap text-[16px] leading-relaxed text-[#f1ece2]">{lines[0]}</p>
                ) : <p className="mt-3 text-[15px] text-[#a79f90]">{UI.saidEmpty}</p>}
                {canOpen && <button type="button" onClick={() => open(idx)} className="mt-3 min-h-[40px] text-[14px] text-[#DDC98E] underline underline-offset-4">{lines.length ? `Page ${g.page}` : UI.saidWrite}</button>}
              </section>
            );
          })}
          <p className="mt-6 text-center text-[13px] text-[#8f877a]">{UI.privacy}</p>
        </div>
      </main>
    );
  }

  // ---- Contents --------------------------------------------------------------------------------
  if (view === "contents") {
    return (
      <main className={bg}>
        <div className={wrap} style={wrapStyle}>
          <button type="button" onClick={() => setView(pos >= 0 ? "page" : "cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Back to the page</button>
          <h1 className="font-display mt-2 text-[30px] font-light">Contents</h1>
          <p className="mt-1 text-[14px] text-[#a79f90]">{answered} of {JOURNAL_BOX_TOTAL} writing spaces answered</p>
          {canMed && <button type="button" onClick={() => open(medIdx)} data-testid="to-meditation" className="mt-4 inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E]/40 px-5 text-[15px] text-[#DDC98E]">{UI.toMeditation}</button>}
          <ul className="mt-5">
            {JOURNAL_PAGES.map((p, i) => (
              <li key={p.n}>
                <button type="button" onClick={() => open(i)} className="flex min-h-[48px] w-full items-center gap-3 border-b border-[rgba(221,201,142,0.15)] py-2 text-left" data-testid={`toc-${p.n}`}>
                  <span className="font-display w-9 shrink-0 text-[15px] text-[#DDC98E]">{p.n}</span>
                  <span className="min-w-0 flex-1 truncate text-[15px] text-[#cfc8bb]">{pageHeading(p.items)}</span>
                  {!paid && i >= limit && <span className="text-[12px] text-[#a79f90]">Members</span>}
                  {marks.includes(p.n) && <span aria-label={UI.marked} title={UI.marked} className="text-[#EEDE80]">★</span>}
                  {pageDone(i) && <span aria-label="Answered" className="text-[#DDC98E]">✓</span>}
                </button>
              </li>
            ))}
          </ul>
          <KeepCopy answers={answers} />
        </div>
      </main>
    );
  }

  // ---- Cover -----------------------------------------------------------------------------------
  if (view === "cover") {
    const started = answered > 0 || pos > 0;
    return (
      <main className={bg}>
        <div className={wrap} style={wrapStyle}>
          <Link href="/" className="inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E]">← The app</Link>
          <div className="relative mx-auto mt-2 w-full overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]" style={{ aspectRatio: "2 / 3", maxWidth: 340 }}>
            <Image src="/scrumptiousness-journal/cover.jpg" alt="The Scrumptiousness Journal, a woman by candlelight" fill sizes="340px" className="object-cover" priority />
          </div>
          <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#DDC98E]">{COVER.by}</p>
          <h1 className="font-display mt-2 text-center text-[32px] font-light leading-[1.12]">{COVER.title}</h1>
          <p className="mx-auto mt-3 max-w-[420px] text-center text-[16px] leading-relaxed text-[#cfc8bb]">{COVER.line}</p>
          <p className="mx-auto mt-2 max-w-[420px] text-center text-[14px] leading-relaxed text-[#a79f90]" data-testid="cover-times">{UI.coverTimes}</p>
          <p className="mx-auto mt-2 max-w-[420px] text-center text-[14px] leading-relaxed text-[#cfc8bb]" data-testid="cover-flow">{UI.flow}</p>

          <div className="mt-7 rounded-2xl border border-[#DDC98E]/30 p-4" data-testid="progress">
            <div className="h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]" aria-hidden="true">
              <div className="h-full rounded-full bg-[#DDC98E]" style={{ width: `${frac * 100}%` }} />
            </div>
            <p className="mt-2 text-[14px] text-[#a79f90]">{answered} of {JOURNAL_BOX_TOTAL} writing spaces answered</p>
          </div>

          <button type="button" onClick={() => { count("sj_begin"); open(started ? pos : 0); }} data-testid="begin" className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E]">
            {started ? "Pick up where you left off" : "Begin"}
          </button>
          {!started && canFirst && <button type="button" onClick={() => open(firstBoxIdx)} data-testid="first-prompt" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#DDC98E]">{UI.firstPrompt}</button>}
          <button type="button" onClick={() => setView("contents")} data-testid="contents" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#cfc8bb]">Contents</button>
          {canMed && <button type="button" onClick={() => open(medIdx)} data-testid="to-meditation" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#cfc8bb]">{UI.toMeditation}</button>}
          {saidAny && <button type="button" onClick={() => setView("said")} data-testid="to-said" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#DDC98E]">{UI.saidTitle}</button>}

          <p className="mt-6 text-center text-[15px] leading-relaxed text-[#EEDE80]">{UI.privacy}</p>
          {blocked && <p role="status" className="mt-3 rounded-2xl border border-[#DDC98E]/40 p-3 text-[14px] text-[#cfc8bb]" data-testid="blocked">{UI.blocked}</p>}
          <KeepCopy answers={answers} />
          <HomePrompt slug="scrumptiousness-journal" />
          <p className="mt-8 text-center text-[12px] leading-relaxed text-[#8f877a]">{COVER.copyright}</p>
        </div>
      </main>
    );
  }

  // ---- The lock, after the taster -------------------------------------------------------------------
  if (locked) {
    return (
      <main className={bg}>
        <div className={wrap} style={wrapStyle}>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setView("cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Journal</button>
            <button type="button" onClick={() => setView("contents")} className="min-h-[44px] text-[14px] text-[#DDC98E]">Contents</button>
          </div>
          <div className="mt-8 rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.45)] p-7 text-center shadow-[0_0_40px_-18px_rgba(221,201,142,0.6)]" data-testid="locked">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#DDC98E]">The Scrumptiousness Journal</p>
            <h1 className="font-display mt-3 text-[28px] font-light leading-[1.2]">{limit ? "The rest opens when you join Scrumptious Confessions" : "Ten pages open with your 7 days free, and all 103 once you stay"}</h1>
            <a href={MEMBER_URL} data-testid="join" onClick={() => count("sj_join_click")} className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] px-6 font-display text-[16px] font-medium text-[#070707]">{limit ? "See Scrumptious Confessions" : "Start my 7 days free"}</a>
            {limit > 0 && <button type="button" onClick={() => open(limit - 1)} className="mt-4 inline-flex min-h-[48px] items-center text-[15px] text-[#DDC98E] underline underline-offset-4">Back to the last page</button>}
          </div>
          <p className="mt-6 text-center text-[13px] text-[#8f877a]">{UI.privacy}</p>
        </div>
      </main>
    );
  }

  // ---- A page ----------------------------------------------------------------------------------
  const pg = JOURNAL_PAGES[pos];
  const audio = JOURNAL_AUDIO[pg.n];
  const hasBox = pg.items.some((i) => i.t === "box");
  const quote = quoteParts(pg.items);
  const onOpening = canFirst && pos < firstBoxIdx;
  return (
    <main className={bg}>
      <div className={wrap} style={wrapStyle}>
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setView("cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Journal</button>
          <span className="text-[13px] text-[#a79f90]" data-testid="pageno">Page {pg.n}</span>
          <button type="button" onClick={() => setView("contents")} className="min-h-[44px] text-[14px] text-[#DDC98E]">Contents</button>
        </div>
        <div className="mb-4 mt-1 h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]" aria-hidden="true">
          <div className="h-full rounded-full bg-[#DDC98E] transition-all duration-500" style={{ width: `${((pos + 1) / JOURNAL_PAGES.length) * 100}%` }} />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={toggleBook} data-testid="mode" className="min-h-[40px] rounded-full border border-[#DDC98E]/40 px-4 text-[13px] text-[#DDC98E]">
            {book ? "Easy read" : "Book pages"}
          </button>
          {onOpening && <button type="button" onClick={() => open(firstBoxIdx)} data-testid="first-prompt-top" className="min-h-[40px] rounded-full border border-[#DDC98E]/40 px-4 text-[13px] text-[#DDC98E]">{UI.firstPrompt}</button>}
        </div>
        {hasBox && <p className="mt-3 text-center text-[13px] text-[#EEDE80]" data-testid="privacy-top">{UI.privacy}</p>}
        {audio?.src && <MeditationNote src={audio.src} />}

        {book ? (
          <div className="relative left-1/2 mt-3 w-screen -translate-x-1/2 sm:w-[min(calc(100vw-24px),900px)]">
            <BookPage n={pg.n} answers={answers} setAnswer={setAnswer} quote={quote} />
          </div>
        ) : quote ? (
          <QuoteEasy q={quote} />
        ) : (
          pg.items.map((it, i) => <Item key={i} it={it} answers={answers} setAnswer={setAnswer} />)
        )}

        {audio?.src && (!book || !audio.at) && <Voice src={audio.src} label={audio.label} />}
        {audio?.href && (
          <>
            <a href={audio.href} target="_blank" rel="noreferrer" onClick={(e) => { e.preventDefault(); openSpotify(audio.href!); }} data-testid="audio" className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] px-6 text-center font-display text-[16px] font-medium text-[#DDC98E]">{audio.label}</a>
            <p className="mt-2 text-center text-[13px] text-[#a79f90]">{UI.opensSpotify}</p>
          </>
        )}

        {hasBox && (
          <button type="button" onClick={() => toggleMark(pg.n)} data-testid="mark" className="mt-6 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">
            {marks.includes(pg.n) ? `★ ${UI.marked}` : `☆ ${UI.comeBack}`}
          </button>
        )}

        {onOpening && <button type="button" onClick={() => open(firstBoxIdx)} data-testid="first-prompt" className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#DDC98E]">{UI.firstPrompt}</button>}

        {SECTION_ENDS.has(pg.n) && pos < JOURNAL_PAGES.length - 1 && (
          <div className="mt-8 rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5 text-center" data-testid="section-end">
            <p className="font-display text-[19px] font-light leading-[1.45] text-[#f1ece2]">{UI.celebrate}</p>
            <button type="button" onClick={() => open(pos + 1)} data-testid="keep-going" className="mt-4 inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E]/50 px-6 text-[15px] text-[#DDC98E]">{UI.keepGoing}</button>
          </div>
        )}

        {pos === JOURNAL_PAGES.length - 1 && (
          <button type="button" onClick={() => setView("said")} data-testid="said-end" className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E]">{UI.saidTitle} &rarr;</button>
        )}

        <div className="mt-8 flex gap-3">
          <button type="button" disabled={pos === 0} onClick={() => open(pos - 1)} data-testid="prev" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-[#DDC98E]/40 text-[16px] text-[#cfc8bb] disabled:opacity-30">Back</button>
          <button type="button" disabled={pos === JOURNAL_PAGES.length - 1 || (!paid && pos >= limit)} onClick={() => open(pos + 1)} data-testid="next" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E] disabled:opacity-30">Next</button>
        </div>
        <p className="mt-6 text-center text-[13px] text-[#8f877a]">{UI.privacy}</p>
      </div>
    </main>
  );
}
