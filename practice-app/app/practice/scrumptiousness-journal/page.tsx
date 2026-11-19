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
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// The first words of a page, for the contents list.
function pageHeading(items: JItem[]): string {
  const t = items.find((i) => i.t === "text") as Extract<JItem, { t: "text" }> | undefined;
  const s = (t?.text ?? "Writing space").replace(/\s+/g, " ").trim();
  return s.length > 64 ? s.slice(0, 61).trimEnd() + "…" : s;
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

function BookPage({ n, answers, setAnswer }: { n: number; answers: Record<string, string>; setAnswer: (id: string, v: string) => void }) {
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
  return (
    <div ref={box} className="relative mx-auto w-full overflow-hidden bg-[#070707] shadow-[0_0_60px_-20px_rgba(221,201,142,0.35)] sm:rounded-lg" style={{ aspectRatio: "432 / 648", maxWidth: 900 }} data-testid="bookpage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/scrumptiousness-journal/pages/p${pad3(n)}.webp`} alt={`Page ${n} of The Scrumptiousness Journal`} className="absolute inset-0 h-full w-full select-none" draggable={false} />
      {cur && (
        <svg viewBox="0 0 432 648" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {cur.lines.map((l, i) => (
            <text key={i} x={l[0]} y={l[1]} textLength={l[2]} lengthAdjust="spacing" fill={l[7]} fontSize={l[6]} fontWeight={l[4] === 300 && l[6] < 8 ? 400 : l[4]} fontStyle={l[5] ? "italic" : "normal"} style={{ fontFamily: FONT_VAR[l[3]] ?? FONT_VAR.Jost, whiteSpace: "pre" }}>{l[8]}</text>
          ))}
        </svg>
      )}
      {slot && slot.src && slot.at && (
        <div className="absolute" style={{ left: `${slot.at.x * 100}%`, top: `${slot.at.y * 100}%`, width: `${slot.at.w * 100}%` }} data-testid="slot-player">
          <VoicePlayer src={slot.src} label={slot.label} />
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
  const [view, setView] = useState<"cover" | "page" | "contents">("cover");
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [book, setBook] = useState(true);
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
    setReady(true);
    count("sj_open");
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

  const open = (i: number) => {
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
  const bg = "min-h-screen bg-[#070707] [background-image:radial-gradient(120%_60%_at_50%_0%,rgba(13,53,53,0.55),transparent_70%)]";

  if (!ready) return <main className={bg} />;

  // ---- Contents --------------------------------------------------------------------------------
  if (view === "contents") {
    return (
      <main className={bg}>
        <div className={wrap}>
          <button type="button" onClick={() => setView(pos >= 0 ? "page" : "cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Back to the page</button>
          <h1 className="font-display mt-2 text-[30px] font-light">Contents</h1>
          <p className="mt-1 text-[14px] text-[#a79f90]">{answered} of {JOURNAL_BOX_TOTAL} writing spaces answered</p>
          <ul className="mt-5">
            {JOURNAL_PAGES.map((p, i) => (
              <li key={p.n}>
                <button type="button" onClick={() => open(i)} className="flex min-h-[48px] w-full items-center gap-3 border-b border-[rgba(221,201,142,0.15)] py-2 text-left" data-testid={`toc-${p.n}`}>
                  <span className="font-display w-9 shrink-0 text-[15px] text-[#DDC98E]">{p.n}</span>
                  <span className="min-w-0 flex-1 truncate text-[15px] text-[#cfc8bb]">{pageHeading(p.items)}</span>
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
        <div className={wrap}>
          <Link href="/" className="inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E]">← The app</Link>
          <div className="relative mx-auto mt-2 w-full overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]" style={{ aspectRatio: "2 / 3", maxWidth: 340 }}>
            <Image src="/scrumptiousness-journal/cover.jpg" alt="The Scrumptiousness Journal, a woman by candlelight" fill sizes="340px" className="object-cover" priority />
          </div>
          <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#DDC98E]">{COVER.by}</p>
          <h1 className="font-display mt-2 text-center text-[32px] font-light leading-[1.12]">{COVER.title}</h1>
          <p className="mx-auto mt-3 max-w-[420px] text-center text-[16px] leading-relaxed text-[#cfc8bb]">{COVER.line}</p>

          <div className="mt-7 rounded-2xl border border-[#DDC98E]/30 p-4" data-testid="progress">
            <div className="h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]" aria-hidden="true">
              <div className="h-full rounded-full bg-[#DDC98E]" style={{ width: `${frac * 100}%` }} />
            </div>
            <p className="mt-2 text-[14px] text-[#a79f90]">{answered} of {JOURNAL_BOX_TOTAL} writing spaces answered</p>
          </div>

          <button type="button" onClick={() => { count("sj_begin"); open(started ? pos : 0); }} data-testid="begin" className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E]">
            {started ? "Pick up where you left off" : "Begin"}
          </button>
          <button type="button" onClick={() => setView("contents")} data-testid="contents" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[15px] text-[#cfc8bb]">Contents</button>

          <p className="mt-6 text-center text-[15px] leading-relaxed text-[#EEDE80]">{UI.privacy}</p>
          {blocked && <p role="status" className="mt-3 rounded-2xl border border-[#DDC98E]/40 p-3 text-[14px] text-[#cfc8bb]" data-testid="blocked">{UI.blocked}</p>}
          <KeepCopy answers={answers} />
          <HomePrompt slug="scrumptiousness-journal" />
          <p className="mt-8 text-center text-[12px] leading-relaxed text-[#8f877a]">{COVER.copyright}</p>
        </div>
      </main>
    );
  }

  // ---- A page ----------------------------------------------------------------------------------
  const pg = JOURNAL_PAGES[pos];
  const audio = JOURNAL_AUDIO[pg.n];
  const hasBox = pg.items.some((i) => i.t === "box");
  return (
    <main className={bg}>
      <div className={wrap}>
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setView("cover")} className="min-h-[44px] text-[14px] text-[#DDC98E]">← Journal</button>
          <span className="text-[13px] text-[#a79f90]" data-testid="pageno">Page {pg.n}</span>
          <button type="button" onClick={() => setView("contents")} className="min-h-[44px] text-[14px] text-[#DDC98E]">Contents</button>
        </div>
        <div className="mb-4 mt-1 h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]" aria-hidden="true">
          <div className="h-full rounded-full bg-[#DDC98E] transition-all duration-500" style={{ width: `${((pos + 1) / JOURNAL_PAGES.length) * 100}%` }} />
        </div>

        <div className="flex justify-center">
          <button type="button" onClick={toggleBook} data-testid="mode" className="min-h-[40px] rounded-full border border-[#DDC98E]/40 px-4 text-[13px] text-[#DDC98E]">
            {book ? "Easy read" : "Book pages"}
          </button>
        </div>

        {book ? (
          <div className="relative left-1/2 mt-3 w-screen -translate-x-1/2 sm:w-[min(calc(100vw-24px),900px)]">
            <BookPage n={pg.n} answers={answers} setAnswer={setAnswer} />
          </div>
        ) : (
          pg.items.map((it, i) => <Item key={i} it={it} answers={answers} setAnswer={setAnswer} />)
        )}

        {audio?.src && (!book || !audio.at) && <Voice src={audio.src} label={audio.label} />}
        {audio?.href && (
          <a href={audio.href} target="_blank" rel="noreferrer" data-testid="audio" className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] px-6 text-center font-display text-[16px] font-medium text-[#DDC98E]">{audio.label}</a>
        )}

        {hasBox && (
          <button type="button" onClick={() => toggleMark(pg.n)} data-testid="mark" className="mt-6 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">
            {marks.includes(pg.n) ? `★ ${UI.marked}` : `☆ ${UI.comeBack}`}
          </button>
        )}

        <div className="mt-8 flex gap-3">
          <button type="button" disabled={pos === 0} onClick={() => open(pos - 1)} data-testid="prev" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-[#DDC98E]/40 text-[16px] text-[#cfc8bb] disabled:opacity-30">Back</button>
          <button type="button" disabled={pos === JOURNAL_PAGES.length - 1} onClick={() => open(pos + 1)} data-testid="next" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E] disabled:opacity-30">Next</button>
        </div>
        <p className="mt-6 text-center text-[13px] text-[#8f877a]">{UI.privacy}</p>
      </div>
    </main>
  );
}
