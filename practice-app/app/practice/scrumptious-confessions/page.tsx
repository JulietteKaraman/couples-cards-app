"use client";

import Link from "next/link";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { SlimPlayer as SpeedPlayer } from "@/components/SlimPlayer";
import { nextSpeed, readSpeed, saveSpeedFor } from "@/lib/voice-speed";
import { PromptCard } from "@/components/Interactive";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { supabaseBrowser } from "@/lib/supabase/client";
import { MEMBERSHIP_UNLOCKS, membershipMonth } from "@/lib/entitlements/config";
import { PLACES } from "@/lib/content/touch-map";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import PracticeTimer from "@/components/PracticeTimer";
import { memberWeeks, onMyClock } from "@/lib/confessions-clock";

// SCRUMPTIOUS CONFESSIONS, the membership (specs/scrumptious-confessions-membership.md).
// One story a week with a teaching in it, Touch Base every day with 31 dots, a
// weekly card. Tap answers stay on her phone and are counted with no name.
// Only what she chooses to send reaches Juliette.

const SLUG = "scrumptious-confessions";
const DIR = "/how-to-feel-like-a-woman";
const DOORS_OPEN = "2026-11-23";
const MAX = 2000;

type Story = { id: string; publish_on: string; title: string; line: string; audio: string };
type Card = { id: string; publish_on: string; prompt: string };
type Feed = { stories: Story[]; cards: Card[]; nextStory: string | null; nextCard: string | null };

const lsGet = (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
const dayName = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const weekday = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long" });
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + "T12:00:00") - Date.parse(a + "T12:00:00")) / 86400000);

async function api(body: Record<string, unknown>) {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  return fetch("/api/confessions", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
}
const tally = (item: string, kind: string, value: string) => { api({ action: "count", item, kind, value }).catch(() => {}); };

export default function ScrumptiousConfessions() {
  return (
    <CollectionGate collectionSlug={SLUG}>
      <Content />
    </CollectionGate>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{children}</p>;
}

const pill = (on: boolean) =>
  `flex min-h-[48px] items-center justify-center gap-2 rounded-full border px-3 text-[15px] ${on ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/35 text-[#f1ece2]/80"}`;

type TabId = "stories" | "today" | "card" | "yours" | "library";
const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "stories", label: "Mondays" },
  { id: "card", label: "Card" },
  { id: "yours", label: "Questions" },
  { id: "library", label: "Library" },
];

function Content() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [tab, setTab] = useState<TabId>("today"); // 20 Nov 2026: everyone lands on Today
  // 21 Nov 2026: the "Build your first week" flow links straight in (?tab=library&topic=menopause).
  useEffect(() => {
    try { const t = new URLSearchParams(window.location.search).get("tab"); if (t === "library" || t === "card" || t === "yours" || t === "stories") setTab(t); } catch {} // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const top = useRef<HTMLDivElement>(null);
  // Doors open Mon 23 Nov 2026 (Juliette 19 Nov: "I do not want people in this week yet").
  // Before then members see one welcome; Juliette (admin) sees everything, to film and check.
  const [early, setEarly] = useState(false);
  useEffect(() => {
    if (todayUK() >= DOORS_OPEN || process.env.NODE_ENV === "development") return;
    supabaseBrowser.auth.getSession().then(({ data }) => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one check after sign-in
      setEarly((data.session?.user.email || "").toLowerCase() !== ADMIN_EMAIL);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        const token = data.session?.access_token;
        const res = await fetch("/api/confessions", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(String(res.status));
        setFeed(await res.json());
      } catch {
        // Local preview has no database, so show one of each. Never true live.
        if (process.env.NODE_ENV === "development") {
          setFeed({
            stories: [{ id: "preview", publish_on: todayUK(), title: "Tilt your beard", line: "The one where I confess who's really in charge.", audio: `${DIR}/audio/confession-2026-11-02-0944cc5b.m4a` }],
            cards: [{ id: "preview-card", publish_on: todayUK(), prompt: "Tell me the last time your body said yes before your head got involved." }],
            nextStory: null,
            nextCard: null,
          });
        } else setFeed({ stories: [], cards: [], nextStory: null, nextCard: null });
      }
    })();
  }, []);

  const pick = (t: TabId) => { setTab(t); top.current?.scrollIntoView({ behavior: "smooth" }); };
  // A gold dot on Questions when Juliette has answered a question this phone asked and it hasn't been read yet.
  const [answeredDot, setAnsweredDot] = useState(false);
  useEffect(() => {
    loadWall().then((w) => {
      if (!w) return;
      const mine = new Set(readIds(MINE_KEY)); const seen = new Set(readIds(SEEN_KEY));
      setAnsweredDot(w.answers.some((a) => mine.has(a.question_id) && !seen.has(a.question_id)));
    }).catch(() => {});
  }, [tab]);

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <a href="/" className="mb-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Your library</a>

        <div className="relative aspect-square overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]">
          <Image src={`${DIR}/scrumptious-confessions.jpg`} alt="Scrumptious Confessions" fill priority sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
        </div>
        <p className="mt-4 text-center text-[16px] text-[#cfc8bb]">Every Monday, a confession in my voice. What people bring me, what I&rsquo;ve learned, and the things I don&rsquo;t say on Instagram.</p>

        {early && (
          <div className="mt-8 rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.45)] p-7 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#DDC98E]">You&rsquo;re in</p>
            <h2 className="mt-3 font-display text-[28px] font-light leading-tight">Doors open Monday 23 November</h2>
            <p className="mt-4 text-[16px] text-[#cfc8bb]">Your 7 free days start that morning, with my first confession.</p>
            <p className="mt-2 text-[16px] text-[#cfc8bb]">Nothing is charged until Monday 30 November. Stop before then and you pay nothing.</p>
            <p className="mt-5 font-display text-[20px] text-[#DDC98E]">See you on Monday.</p>
          </div>
        )}
        {!early && <>
        <div ref={top} className="sticky top-0 z-10 -mx-5 mt-5 bg-[#070707]/95 px-5 py-3">
          <div className="grid grid-cols-5 gap-1.5">
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => pick(t.id)} className={`min-h-[44px] rounded-full border px-0.5 text-[13px] ${tab === t.id ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`}>
                {t.label}{t.id === "yours" && answeredDot ? <span aria-label="I answered you" className="ml-1 inline-block h-2 w-2 rounded-full bg-[#DDC98E] align-middle" /> : null}
              </button>
            ))}
          </div>
        </div>

        {tab === "stories" && <Stories feed={feed} />}
        {tab === "today" && <>
          <TodayIndex />
          <HomeScreen />
          <Part id="part-today" n={1} title="Today's confession, and your week"><WeekStrip onPick={pick} /></Part>
          <Part id="part-questions" n={2} title="This week's questions"><WallPeek onOpen={() => pick("yours")} /></Part>
          <Part id="part-practice" n={3} title="Touch Base" sub="Your kinesthetic anchor, so you feel safe and come back into your body. Five minutes a day, in my voice."><Today /></Part>
          <Part id="part-month" n={4} title="What opens the rest of the month"><ComingUp /></Part>
        </>}
        {tab === "card" && <Cards feed={feed} />}
        {tab === "yours" && <YourTurn />}
        {tab === "library" && <Library />}
        <HomeScreen always />
        <ManageMembership />
        </>}
      </div>
    </main>
  );
}

/* 23 Nov 2026 (Juliette): "Today is split up into different things", in her order: the confession, this week's
   questions, Touch Base and the wrist, then what opens the rest of the month. A short index at the top jumps there. */
const TODAY_PARTS = [
  { id: "part-today", label: "Today's confession" },
  { id: "part-questions", label: "This week's questions" },
  { id: "part-practice", label: "Touch Base" },
  { id: "part-month", label: "The rest of the month" },
];
function TodayIndex() {
  return (
    <nav className="mt-5 rounded-2xl border border-[#DDC98E]/30 p-4" aria-label="Today, in four parts">
      <p className="text-[15px] text-[#f1ece2]">Today comes in four parts.</p>
      <ol className="mt-2 grid grid-cols-2 gap-2">
        {TODAY_PARTS.map((p, i) => (
          <li key={p.id}>
            <button type="button" onClick={() => document.getElementById(p.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex min-h-[44px] w-full items-center gap-2 rounded-full border border-[#DDC98E]/40 px-3 text-left text-[13px] text-[#f1ece2]">
              <span className="text-[#DDC98E]">{i + 1}</span>{p.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
function Part({ id, n, title, sub, children }: { id: string; n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mt-10 scroll-mt-24 border-t border-[#DDC98E]/20 pt-6">
      <p className="font-display text-[22px] font-light leading-tight text-[#f1ece2]"><span className="mr-2 text-[#DDC98E]">{n}</span>{title}</p>
      {sub && <p className="mt-1 text-[14px] leading-snug text-[#a79f90]">{sub}</p>}
      {children}
    </div>
  );
}
/* Juliette 23 Nov 2026: "it should say in the confessions how to do that". Shown on Today until it is on the
   home screen or dismissed; always reachable as a small link at the bottom. */
function HomeScreen({ always }: { always?: boolean }) {
  const key = "ffy.a2hs.confessions.v1";
  const [state, setState] = useState<"hidden" | "card" | "link" | "open" | "mini">("hidden");
  useEffect(() => {
    let standalone = false;
    let dismissed = false;
    try {
      standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
      dismissed = localStorage.getItem(key) === "1";
    } catch { /* treat as a browser */ }
    if (standalone) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- phone storage is only readable after mount
    setState(always ? "link" : dismissed ? "hidden" : "mini");
  }, [always]);
  if (state === "hidden") return null;
  // On Today it starts as one line, so the four parts stay near the top (Juliette 23 Nov 2026: too much scrolling).
  if (state === "mini") return (
    <button type="button" onClick={() => setState("card")} className="mt-4 flex min-h-[48px] w-full items-center justify-between rounded-2xl border border-[#DDC98E]/40 px-4 text-left text-[14px] text-[#f1ece2]">
      <span><span className="text-[#DDC98E]">Put Confessions on your home screen</span>, one tap next time</span>
      <span className="shrink-0 text-[#DDC98E]">How &rarr;</span>
    </button>
  );
  if (state === "link") return (
    <div className="mt-12 text-center">
      <button type="button" onClick={() => setState("open")} className="min-h-[44px] text-[14px] text-[#a79f90] underline underline-offset-4">How to put this on my home screen</button>
    </div>
  );
  return (
    <div className={`${always ? "mt-12" : "mt-5"} rounded-2xl border border-[#DDC98E]/40 p-4 text-[14px] leading-relaxed text-[#cfc8bb]`} data-testid="confessions-home-screen">
      <p className="text-[#f1ece2]"><span className="text-[#DDC98E]">Put Confessions on your home screen</span>, so it opens in one tap, like an app.</p>
      <p className="mt-3"><b className="font-medium text-[#f1ece2]">iPhone</b></p>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li>Open this page in <b className="font-medium text-[#f1ece2]">Safari</b>. If you came from an email, tap the compass or &ldquo;Open in Safari&rdquo; first. Inside Gmail, AOL or Instagram the option isn&rsquo;t there.</li>
        <li>Tap the <b className="font-medium text-[#f1ece2]">Share</b> button: the square with the arrow pointing up. On newer iPhones, tap the three dots first, then Share.</li>
        <li>Scroll down and tap <b className="font-medium text-[#f1ece2]">Add to Home Screen</b>, then <b className="font-medium text-[#f1ece2]">Add</b>.</li>
      </ol>
      <p className="mt-3"><b className="font-medium text-[#f1ece2]">Android</b></p>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li>Open this page in <b className="font-medium text-[#f1ece2]">Chrome</b>.</li>
        <li>Tap the three dots at the top right, then <b className="font-medium text-[#f1ece2]">Add to Home screen</b> (or Install app).</li>
      </ol>
      <p className="mt-3">The first time you open it from your home screen, sign in once more with your email. After that it remembers you.</p>
      {!always && <button type="button" onClick={() => { try { localStorage.setItem(key, "1"); } catch { /* fine */ } setState("hidden"); }} className="mt-2 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Done, hide this</button>}
      {always && <button type="button" onClick={() => setState("link")} className="mt-2 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Close</button>}
    </div>
  );
}

/* Juliette 22 Nov 2026: members cancel themselves, signed in, on Stripe's own page. Never by email. */
function ManageMembership() {
  const [state, setState] = useState<"idle" | "opening" | "gift" | "error">("idle");
  const open = async () => {
    setState("opening");
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const res = await fetch("/api/confessions/manage", { method: "POST", headers: { Authorization: `Bearer ${data.session?.access_token}` } });
      const j = await res.json().catch(() => ({}));
      if (j.url) { window.location.href = j.url; return; }
      setState(j.gift ? "gift" : "error");
    } catch { setState("error"); }
  };
  return (
    <div className="mt-12 border-t border-[#DDC98E]/20 pt-6 text-center">
      <button type="button" onClick={open} disabled={state === "opening"} className="min-h-[44px] text-[14px] text-[#a79f90] underline underline-offset-4">
        {state === "opening" ? "Opening\u2026" : "Manage or cancel my membership"}
      </button>
      {state === "gift" && <p className="mt-2 text-[13px] text-[#8f877a]">Your place is a gift from Juliette. There&rsquo;s nothing to pay and nothing to cancel.</p>}
      {state === "error" && <p className="mt-2 text-[13px] text-[#8f877a]">That didn&rsquo;t open. Email support@feelfullyyou.com and we&rsquo;ll sort it.</p>}
    </div>
  );
}

function Coming({ day, what }: { day: string; what: string }) {
  return (
    <div className="mt-8 rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-6 text-center">
      <Eyebrow>Coming {weekday(day)}</Eyebrow>
      <p className="mt-3 font-display text-[22px] font-light">🔒 {what}</p>
    </div>
  );
}

/* ================= STORIES ================= */
function Stories({ feed }: { feed: Feed | null }) {
  if (!feed) return <p className="mt-6 text-[#8f877a]">…</p>;
  return (
    <section className="mt-4">
      {feed.stories.length === 0 && <p className="mt-6 text-center text-[15px] text-[#a79f90]">Your first story lands here very soon.</p>}
      {feed.stories.map((s, i) => <StoryBlock key={s.id} story={s} open={i === 0} />)}
      {feed.nextStory && <Coming day={feed.nextStory} what="A new confession" />}
    </section>
  );
}

const LANDED = [
  { id: "ick", label: "Ick" },
  { id: "nothing", label: "Nothing" },
  { id: "nice", label: "Nice" },
  { id: "mmm", label: "Mmm" },
  { id: "goosebumps", label: "Goosebumps" },
  { id: "toes-curl", label: "Toes curl" },
];
const WHERE = [
  { id: "chest", label: "Chest" },
  { id: "belly", label: "Belly" },
  { id: "genitals", label: "Genitals" },
  { id: "elsewhere", label: "Somewhere else" },
  { id: "nowhere", label: "Nowhere yet" },
];

function StoryBlock({ story, open }: { story: Story; open: boolean }) {
  const [show, setShow] = useState(open);
  const key = `ffy.confessions.story.${story.id}.v1`;
  const [landed, setLanded] = useState("");
  const [where, setWhere] = useState("");
  useEffect(() => {
    try { const j = JSON.parse(lsGet(key) || "{}"); setLanded(j.landed || ""); setWhere(j.where || ""); } catch {}
  }, [key]);
  const save = (part: { landed?: string; where?: string }) => {
    let was = {};
    try { was = JSON.parse(lsGet(key) || "{}"); } catch {}
    lsSet(key, JSON.stringify({ ...was, ...part }));
  };
  // Counted once per phone: a change of mind updates her phone, not the totals.
  const pickLanded = (v: string) => { if (!landed) tally(story.id, "landed", v); setLanded(v); save({ landed: v }); };
  const pickWhere = (v: string) => { if (!where) tally(story.id, "where", v); setWhere(v); save({ where: v }); };

  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#DDC98E]/30 px-4 py-4 text-left">
        <span className="font-display text-[18px] font-light">{story.title}</span>
        <span className="shrink-0 text-[12px] text-[#8f877a]">{dayName(story.publish_on)}</span>
      </button>
    );
  }
  return (
    <article className="mt-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">{dayName(story.publish_on)}</p>
      <h2 className="mt-1 font-display text-[30px] font-light leading-tight">{story.title}</h2>
      <p className="mt-1 text-[15px] text-[#cfc8bb]">{story.line}</p>
      <div className="mt-4"><VoicePlayer src={story.audio} label={story.title} dark /></div>

      <div className="mt-8 space-y-7 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
        <div>
          <p className="font-display text-[22px] font-light">Tell me how that landed.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANDED.map((o) => <button key={o.id} type="button" onClick={() => pickLanded(o.id)} className={pill(landed === o.id)}>{o.label}</button>)}
          </div>
        </div>
        <div>
          <p className="font-display text-[22px] font-light">Tell me where you felt that.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {WHERE.map((o) => <button key={o.id} type="button" onClick={() => pickWhere(o.id)} className={pill(where === o.id)}>{o.label}</button>)}
          </div>
          <p className="mt-3 text-[13px] text-[#8f877a]">These two are counted with no name attached.</p>
        </div>
        <div>
          <p className="font-display text-[22px] font-light">Tell me what you&rsquo;d love next.</p>
          <SendToMe item={story.id} notice="This one comes to me, with no name on it." button="Send it to me" />
        </div>
      </div>
    </article>
  );
}

/* Telegram is gone (Juliette 20 Nov 2026): questions, Me too and answers all live in the app, on the Questions tab. */

/* What opens the longer you stay (MEMBERSHIP_UNLOCKS, Juliette 16 Nov 2026). */
/* Who this person is in the membership: paying since when, in the free week, or not in (shared by the
   library and the Today tab). Admin counts as paying. */
function useMembership() {
  const [since, setSince] = useState<string | null>(null);
  const [trial, setTrial] = useState(false);
  // Local preview only shows the answers open; never true on the live site.
  const [paid, setPaid] = useState(process.env.NODE_ENV === "development");
  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) return;
      if ((data.session?.user.email || "").toLowerCase() === ADMIN_EMAIL) setPaid(true);
      const { data: row } = await supabaseBrowser.from("user_decks").select("purchased_at, stripe_checkout_session_id, expires_at").eq("user_id", uid).eq("deck_type", "scrumptious-confessions").maybeSingle();
      // When they stop, access ends with what they paid for: an expired row opens nothing (19 Nov 2026).
      if (row?.expires_at && new Date(row.expires_at as string) <= new Date()) return;
      // Free fortnight days don't count: months start with the first payment.
      // The 7 free days ("trial-") are a taste: answers stay locked until day 8 (Juliette 19 Nov 2026).
      const sid = String(row?.stripe_checkout_session_id || "");
      if (row?.purchased_at && sid.startsWith("trial-")) setTrial(true);
      else if (row?.purchased_at && !sid.startsWith("free-")) { setSince(row.purchased_at as string); setPaid(true); }
    })();
  }, []);
  return { since, trial, paid };
}

/* Juliette 19 Nov 2026: "the library is too big and difficult to navigate... it will also be for people in the
   Scrumptious Touch Reset and private clients". Four doors, nothing else. */
const doorCls = "flex min-h-[132px] flex-col justify-between rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-4 text-left";
function Library() {
  const { trial, paid } = useMembership();
  const [door, setDoor] = useState<Door | null>(null);
  const [linkTopic, setLinkTopic] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [redo, setRedo] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    setProfile(readProfile()); // eslint-disable-line react-hooks/set-state-in-effect
    // How many answers each section holds, so an empty one never shows on For you.
    Promise.all([fetch("/scrumptious-confessions/cards.json").then((r) => (r.ok ? r.json() : [])).catch(() => []), fetch("/scrumptious-confessions/answers.json").then((r) => r.json()).catch(() => []), loadWall().then((w) => (w?.answers || []).map((a) => ({ q: a.question }))).catch(() => [])])
      .then(([k, j, m]) => {
        const qs: string[] = [...k, ...j, ...m].filter((a: { slug?: string }) => !a.slug || !HIDE.has(a.slug.split("--")[0])).map((a: { q: string }) => a.q.toLowerCase());
        const c: Record<string, number> = {};
        for (const t of TOPICS) c[t.id] = qs.filter((q) => t.qOnly ? t.words.some((w) => q.includes(w)) && !(t.not || []).some((w) => q.includes(w)) : t.words.some((w) => (" " + q + " ").includes(w))).length;
        setCounts(c);
      });
  }, []);
  // Opened from a link with ?topic=<id> (the first-week plan): go straight to that shelf.
  useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("topic");
      if (!t || !TOPICS.some((x) => x.id === t)) return;
      setLinkTopic(t); setDoor(TOPICS.find((x) => x.id === t)?.men ? "men" : "answers"); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {}
  }, []);
  if (profile === undefined) return null;
  if (door) {
    const d = DOORS.find((x) => x.id === door)!;
    return (
      <>
        <button type="button" onClick={() => { setDoor(null); setLinkTopic(undefined); }} className="mt-6 min-h-[44px] text-[15px] text-[#DDC98E]">&larr; Back to the library</button>
        {door === "touchmap" ? <TouchMapMonth /> : door === "smut" ? <SmutStories /> : <Answers key={door + (linkTopic || "")} paid={paid} trial={trial} start={d.shelves[0]} shelves={d.shelves} men={door === "men"} women={door === "women"} startTopic={linkTopic ?? d.topic} />}
      </>
    );
  }
  if (!profile || redo) return <Welcome onDone={(p) => { saveProfile(p); setProfile(p); setRedo(false); }} />;
  const mine = forYou(profile).filter((id) => id.startsWith("door:") || (counts[id] ?? 0) > 0);
  return (
    <section className="mt-6">
      {mine.length > 0 && (
        <div className="mb-8 rounded-2xl border border-[#DDC98E]/50 bg-[rgba(221,201,142,0.08)] p-4" data-testid="for-you">
          <Eyebrow>For you</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {mine.map((id) => {
              if (id === "door:smut") return <button key={id} type="button" onClick={() => setDoor("smut")} className="min-h-[44px] rounded-full border border-[#DDC98E] px-4 text-[14px] text-[#f1ece2]">Smut Stories</button>;
              const t = TOPICS.find((x) => x.id === id)!;
              return <button key={id} type="button" onClick={() => { setLinkTopic(id); setDoor(t.men ? "men" : "answers"); }} className="min-h-[44px] rounded-full border border-[#DDC98E] px-4 text-[14px] text-[#f1ece2]">{t.label} <span className="text-[#a79f90]">{counts[id]}</span></button>;
            })}
          </div>
          <button type="button" onClick={() => setRedo(true)} className="mt-3 min-h-[40px] text-[13px] text-[#a79f90] underline underline-offset-4">Change my answers</button>
        </div>
      )}
      <Eyebrow>Your library</Eyebrow>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {DOORS.map((x) => (
          <button key={x.id} type="button" onClick={() => setDoor(x.id)} className={doorCls}>
            <span className="font-display text-[21px] font-light leading-tight text-[#f1ece2]">{x.title}</span>
            <span className="text-[13px] text-[#a79f90]">{x.line}</span>
          </button>
        ))}
        <Link href="/practice/scrumptious-poems" className={doorCls}>
          <span className="font-display text-[21px] font-light leading-tight text-[#f1ece2]">Poems</span>
          <span className="text-[13px] text-[#a79f90]">A new one every Wednesday</span>
        </Link>
        <Link href="/practice/scrumptiousness-journal" className={doorCls}>
          <span className="font-display text-[21px] font-light leading-tight text-[#f1ece2]">The Journal</span>
          <span className="text-[13px] text-[#a79f90]">Scrumptiousness, {paid ? "all 103 pages" : "ten pages to start"}</span>
        </Link>
      </div>
    </section>
  );
}

/* The practices that have opened for this member, on the Today tab. Only what is open: no locked list. */
function OpenedForYou() {
  const { since, trial, paid } = useMembership();
  if (!paid && !trial) return null;
  // The free week opens the freeWeek gifts (Holiday Survival Kit, Quiet Isn't Yes), theirs to keep (21 Nov 2026).
  const month = since ? membershipMonth(since) : 1;
  const open = trial && !paid ? MEMBERSHIP_UNLOCKS.filter((u) => u.freeWeek) : MEMBERSHIP_UNLOCKS.filter((u) => u.month <= month);
  if (!open.length) return null;
  return (
    <div className="mt-6" data-testid="opened-for-you">
      <Eyebrow>Opened for you</Eyebrow>
      <div className="mt-3 space-y-2">
        {open.map((u) => (
          <a key={u.title} href={u.href} target={u.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="block rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4">
            <span className="block font-display text-[19px] font-light leading-tight">{u.title}</span>
            <span className="mt-0.5 block text-[13px] text-[#a79f90]">{u.line}</span>
          </a>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-[#8f877a]">{trial && !paid ? "My gift to you: these are yours to keep, whatever you decide. The Trace and the full library open on day 8." : "Something new opens every month you stay."}</p>
    </div>
  );
}

/* Every question Juliette has answered, searchable (Juliette 16 Nov 2026: "a library of
   questions that I have answered that the members get answers to after they pay").
   Seeded from her published answer pages; grows with members' own questions.
   Free-fortnight people see the questions, and the answers open once they stay. */
type Answer = { slug: string; q: string; audio?: string; shelves?: string[]; locked?: boolean; blocks: { t: "h" | "p" | "li"; x: string }[] };
type Shelf = "answers" | "essays" | "podcast" | "meditations";
const SHELVES: { id: Shelf; label: string; title: string; unit: string }[] = [
  { id: "answers", label: "Answers", title: "Every question I\u2019ve answered", unit: "questions" },
  { id: "essays", label: "Essays", title: "Every essay I\u2019ve written", unit: "essays" },
  { id: "podcast", label: "Podcast", title: "Every episode, to listen here", unit: "episodes" },
  { id: "meditations", label: "Meditations", title: "My meditations, a new one every Friday", unit: "meditations" },
];
// The living library's shelves (specs/living-library.md, names locked by Juliette 19 Nov 2026).
// Meditations carry their shelves; everything else is matched on its own words.
// 23 Nov 2026 (Juliette): a section for freezing, and a men's door (her profile visitors are often men 27 to 40).
// These match on the QUESTION only, like menopause, so an answer lands there for what it asks, not a passing word.
const TOPICS: { id: string; label: string; words: string[]; qOnly?: boolean; not?: string[]; men?: boolean }[] = [
  { id: "numb", label: "Feeling nothing", words: ["numb", "nothing", "flat", "shut down", "don't want to be touched", "dont want", "no desire", "disconnected"] },
  { id: "touch", label: "Touch and the body", words: ["touch", "body", "skin", "trace", "hug", "hands"] },
  { id: "desire", label: "Desire and pleasure", words: ["desire", "pleasure", "orgasm", "turn on", "turned on", "sex", "erotic", "libido", "want"] },
  { id: "us", label: "Him, her, us", words: ["partner", "husband", "wife", "marriage", "couple", "him", "relationship", "reaching", "distance"] },
  { id: "safe", label: "Safety and trust", words: ["safe", "safety", "trust", "boundar", "saying no", "the no", "consent", "brace"] },
  { id: "freeze", label: "When your body freezes", qOnly: true, words: ["freeze", "froze", "frozen", "flinch", "tense up", "go still", "stiffen", "pull away", "brace", "after trauma", "safe being touched", "refuse to relax", "cringe"], not: ["she ", "she'", "her ", "her,", "her?", "my wife", "girlfriend", "gain weight"] },
  { id: "shame", label: "Shame and the past", words: ["shame", "past", "trauma", "child", "guilt", "abuse", "mother", "father"] },
  { id: "menopause", label: "Menopause and a changing body", qOnly: true, words: ["menopause", "perimenopause", "oestrogen", "postmenopausal", "hot flush"] },
  { id: "more", label: "When it's good and you want more", qOnly: true, words: ["spark", "more intimacy", "want more", "fantas", "kink", "power and control", "adventur", "go deeper", "more pleasure"] },
  { id: "men-her", label: "Understanding her", men: true, qOnly: true, words: ["she says she", "what she", "what is happening in her", "her body", "she tense", "she tighten", "she flinch", "flinches when i", "help her feel safe", "she go blank", "she goes quiet", "go quiet", "she really means", "starting to tense", "what does she need", "she closes"] },
  { id: "men-away", label: "When she pulls away", men: true, qOnly: true, words: ["pulled away", "pull away when i", "cold and distant", "doesn't want", "doesnt want", "wife want", "used to open up", "she feel it with someone else", "other men", "gone quiet", "trust me again", "closes and", "lights up"], not: ["why do i pull", "my partner tries"] },
  { id: "men-body", label: "His body", men: true, qOnly: true, words: ["erect", "get hard", "stay hard", "performance anxiety", "testosterone", "viagra", "his body changing", "my body is changing"], not: ["she ", "her "] },
  { id: "men-you", label: "You, too", men: true, qOnly: true, words: ["i need touch", "do i freeze, go cold", "how do i tell her", "every instinct", "why do i pull back"] },
  { id: "men", label: "For men", words: [" men", " man ", "for men", "masculin"] },
  { id: "calm", label: "Calm, sleep and clarity", words: ["anxiety", "sleep", "calm", "stress", "breath", "overwhelm", "clarity", "nervous"] },
];
// 23 Nov 2026 (Juliette): three questions the first time someone opens the Library, so they land in the part
// that's theirs. Kept on their phone only; "Change my answers" starts again.
// 23 Nov 2026 (Juliette): ONE question only, "What brings you here?", for women and men alike.
type Profile = { why: string[] };
const PKEY = "ffy.sc.profile.v2";
function readProfile(): Profile | null { try { const v = localStorage.getItem(PKEY); return v ? JSON.parse(v) : null; } catch { return null; } }
function saveProfile(p: Profile) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch { /* fine */ } }
const WHY: { id: string; label: string; to: string[] }[] = [
  { id: "more", label: "It's good, and we want more", to: ["more", "door:smut"] },
  { id: "numb", label: "I feel nothing anymore", to: ["numb"] },
  { id: "freeze", label: "I freeze when my partner reaches for me", to: ["freeze"] },
  { id: "desire", label: "I want my desire back", to: ["desire"] },
  { id: "approach", label: "I don't know how to approach her anymore", to: ["men-her", "men-away"] },
  { id: "us", label: "We've drifted apart", to: ["us"] },
  { id: "body", label: "My body is changing", to: ["menopause", "men-body"] },
];
function forYou(p: Profile): string[] {
  return Array.from(new Set(p.why.flatMap((w) => WHY.find((x) => x.id === w)?.to ?? [])));
}
function Welcome({ onDone }: { onDone: (p: Profile) => void }) {
  const [why, setWhy] = useState<string[]>([]);
  const pill = (on: boolean) => `min-h-[48px] rounded-full border px-4 text-left text-[15px] ${on ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`;
  return (
    <section className="mt-6" data-testid="library-welcome">
      <Eyebrow>Your library</Eyebrow>
      <h2 className="mt-3 font-display text-[26px] font-light leading-tight">What brings you here?</h2>
      <p className="mt-2 text-[14px] text-[#a79f90]">Pick as many as are true, and I&rsquo;ll take you to your part. Only you see this.</p>
      <div className="mt-5 flex flex-col gap-2">
        {WHY.map((w) => (
          <button key={w.id} type="button" aria-pressed={why.includes(w.id)} onClick={() => setWhy(why.includes(w.id) ? why.filter((x) => x !== w.id) : [...why, w.id])} className={pill(why.includes(w.id))}>{w.label}</button>
        ))}
      </div>
      <button type="button" disabled={!why.length} onClick={() => onDone({ why })} className="mt-6 min-h-[48px] w-full rounded-full bg-[#DDC98E] text-[16px] font-medium text-[#070707] disabled:opacity-40">Take me to my part</button>
      <button type="button" onClick={() => onDone({ why: [] })} className="mt-4 min-h-[40px] text-[13px] text-[#a79f90] underline underline-offset-4">Skip, show me everything</button>
    </section>
  );
}
// The library's doors (Juliette 19 Nov 2026: "the library is really not very clear at all").
// Nobody lands on a list: they pick a door first. The Journal door is a link of its own.
type Door = "meditations" | "answers" | "women" | "men" | "touchmap" | "smut";
// 20 Nov 2026, Juliette: "if I can't even find it, how the hell are they going to find it?" Menopause and
// The Touch Map get doors of their own, not buried in a topic chip or at the bottom of Today.
const DOORS: { id: Door; title: string; line: string; shelves: Shelf[]; topic?: string }[] = [
  { id: "answers", title: "Your questions, answered", line: "Search, or start with five", shelves: ["answers"] },
  { id: "meditations", title: "Meditations", line: "A new one every Friday", shelves: ["meditations"] },
  // 23 Nov 2026 (Juliette): Menopause is no longer a door of its own; the welcome questions take each person to their part.
  // 23 Nov 2026 (Juliette): a For women door beside For men.
  { id: "women", title: "For women", line: "Your body, your desire", shelves: ["answers"] },
  { id: "men", title: "For men", line: "Understanding her, and you", shelves: ["answers"], topic: "men-her" },
  { id: "touchmap", title: "The Touch Map", line: "One place a month, in my voice", shelves: [] },
  // 21 Nov 2026, Juliette: "put them in, I already have them on the women's app". The late night shelf is SMUT STORIES (canon).
  { id: "smut", title: "Smut Stories", line: "Late at night, in my voice", shelves: [] },
  // 23 Nov 2026 (Juliette): the How to Feel Like a Woman cards do NOT belong in Confessions. Never add them.
];
// Smut Stories: her recorded fiction, in her voice (first recorded for How to Feel Like a Woman, Nov 2026).
const SMUT: { title: string; line: string; src: string; minutes: number }[] = [
  // 23 Nov 2026 (Juliette): this one is a Smut Story, not a confession.
  { title: "Tilt Your Beard", line: "The one where I confess who's really in charge.", src: "/how-to-feel-like-a-woman/audio/confession-2026-11-02-0944cc5b.m4a", minutes: 6 },
  { title: "The Piano Tuner", line: "He comes every spring. This year she stays in the room.", src: "/scrumptious-confessions/audio/smut-the-piano-tuner.m4a", minutes: 14 },
  { title: "The Dressmaker", line: "A dress for her daughter's wedding, and hands that take their time.", src: "/scrumptious-confessions/audio/smut-the-dressmaker.m4a", minutes: 10 },
];
function SmutStories() {
  return (
    <section className="mt-6">
      <h2 className="font-display text-[28px] font-light leading-tight">Smut Stories</h2>
      <p className="mt-2 text-[15px] text-[#a79f90]">Late at night, in my voice. Headphones in.</p>
      <div className="mt-6 space-y-6">
        {SMUT.map((x) => (
          <div key={x.src} className="rounded-2xl border border-[#DDC98E]/30 p-4">
            <p className="mb-3 text-[14px] text-[#cfc8bb]">{x.line} <span className="text-[#8f877a]">&middot; {x.minutes} min</span></p>
            <SpeedPlayer src={x.src} label={x.title} />
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-[#8f877a]">More stories are on their way.</p>
    </section>
  );
}
// Five to start with. Juliette can swap these for her own five favourites.
const STARTERS = ["why-dont-i-feel-anything", "never-in-the-mood-but-enjoy-it", "why-can-i-feel-it-with-someone-else", "sleep-in-same-bed-never-touch", "why-doesnt-my-wife-want-me"];
// Website pages about finding a coach, not members' questions: kept on the site, left out of the library.
// 20 Nov 2026: the EMDR and "somatic" answers are out too (words Juliette doesn't use for her work).
const HIDE = new Set(["emdr-and-intimacy", "somatic-coach-uk", "what-is-somatic-touch-therapy", "desire-podcast-women-over-40", "how-an-intimacy-coach-helps", "how-much-does-intimacy-coaching-cost", "intimacy-and-touch-coach", "intimacy-classes-for-couples", "intimacy-coach-women-over-40-uk", "intimacy-expert-uk", "is-an-intimacy-coach-right-for-me", "relationship-coaching-for-men", "relationship-coaching", "somatic-coach-uk", "trauma-informed-intimacy-coach-uk", "what-does-a-touch-expert-do", "what-happens-in-intimacy-coaching", "when-to-get-help-with-intimacy", "who-teaches-couples-to-touch-again"]);
async function loadMeditations(): Promise<Answer[]> {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch("/api/meditations", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  const json = await res.json();
  const next = json.next?.publish_on ? new Date(json.next.publish_on + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : null;
  const items: Answer[] = (json.items || []).map((m: { slug: string; title: string; minutes: number; shelves: string[]; audio: string | null }) => ({
    slug: m.slug, q: `${m.title} \u00b7 ${m.minutes} min`, audio: m.audio || undefined, shelves: m.shelves, locked: !m.audio,
    blocks: [{ t: "p" as const, x: "Put your headphones in, and give yourself this time." }],
  }));
  // What's coming, so people see what they'd stay for: the next Fridays, by title.
  const up = (json.upcoming || []) as { title: string; minutes: number; publish_on: string }[];
  for (const u of up) {
    const day = new Date(u.publish_on + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" });
    items.push({ slug: `next-${u.publish_on}`, q: `${u.title} \u00b7 ${u.minutes} min \u00b7 opens ${day}`, locked: true, blocks: [] });
  }
  if (!up.length && next) items.push({ slug: "next", q: `The next one opens on ${next}.`, locked: true, blocks: [] });
  return items;
}
// Juliette 16 Nov: answers, then "all the substacks, and the podcast". Seeded from her
// published pages (answers, essays, episodes), so every word is hers.
function Answers({ paid, trial, start, shelves, startTopic, men, women }: { paid: boolean; trial?: boolean; start: Shelf; shelves: Shelf[]; startTopic?: string; men?: boolean; women?: boolean }) {
  // For women leaves out the answers written to men.
  const forMen = (q: string) => TOPICS.some((t) => t.men && t.words.some((w) => q.toLowerCase().includes(w)) && !(t.not || []).some((w) => q.toLowerCase().includes(w)));
  const chips = TOPICS.filter((t) => !!t.men === !!men);
  const startTp = TOPICS.find((t) => t.id === startTopic);
  const [shelf, setShelf] = useState<Shelf>(start);
  const [data, setData] = useState<Record<Shelf, Answer[] | null>>({ answers: null, essays: null, podcast: null, meditations: null });
  const [find, setFind] = useState("");
  const [topic, setTopic] = useState<string | null>(startTopic || null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    if (data[shelf]) return;
    // Her Thursday answers to members' questions join the library for good, newest first (20 Nov 2026).
    const fromMembers = (): Promise<Answer[]> => loadWall().then((w) => (w?.answers || []).map((a) => ({ slug: `m-${a.id}`, q: a.question, blocks: a.answer.split(/\n+/).filter(Boolean).map((x) => ({ t: "p" as const, x })) }))).catch(() => []);
    const get = shelf === "meditations" ? loadMeditations()
      // Juliette's answer cards (20 Nov 2026): her own essay lines, sorted by topic, alongside the written answers.
      : shelf === "answers" ? Promise.all([fromMembers(), fetch(`/scrumptious-confessions/cards.json`).then((r) => (r.ok ? r.json() : [])).catch(() => []), fetch(`/scrumptious-confessions/answers.json`).then((r) => r.json())]).then(([m, k, j]) => [...m, ...k, ...j])
      : fetch(`/scrumptious-confessions/${shelf}.json`).then((r) => r.json());
    get.then((d) => setData((x) => ({ ...x, [shelf]: d }))).catch(() => setData((x) => ({ ...x, [shelf]: [] })));
  }, [shelf, data]);
  const raw = data[shelf];
  const all = raw && shelf === "answers" ? raw.filter((a) => !HIDE.has(a.slug.split("--")[0]) && !(women && forMen(a.q))) : raw;
  const meta = SHELVES.find((x) => x.id === shelf)!;
  // Phones type curly apostrophes ("don’t"); the library has straight ones. Search ignores
  // apostrophes and punctuation, so "why don't i feel anything" always finds it (19 Nov 2026).
  const norm = (x: string) => x.toLowerCase().replace(/['\u2018\u2019`]/g, "").replace(/[^a-z0-9\s]/g, " ");
  const words = norm(find).split(/\s+/).filter(Boolean);
  const inQ = (a: Answer) => words.every((w) => norm(a.q).includes(w));
  const tp = TOPICS.find((t) => t.id === topic);
  // Menopause only shows answers whose QUESTION is about menopause (Juliette 20 Nov 2026: the baby answer
  // and the hug answers were landing there because the word appeared somewhere in the body).
  const onShelf = (a: Answer) => !tp || a.slug.startsWith("next") || (tp.qOnly ? tp.words.some((w) => a.q.toLowerCase().includes(w)) && !(tp.not || []).some((w) => a.q.toLowerCase().includes(w)) : a.shelves ? a.shelves.includes(tp.id) : tp.words.some((w) => (" " + a.q + " " + a.blocks.map((b) => b.x).join(" ") + " ").toLowerCase().includes(w)));
  const shown = (all || [])
    .filter(onShelf)
    .filter((a) => { const t = norm(a.q + " " + a.blocks.map((b) => b.x).join(" ")); return words.every((w) => t.includes(w)); })
    .sort((a, b) => Number(inQ(b)) - Number(inQ(a)));
  const starter = shelf === "answers" && !find && !topic && !women;
  const list = starter ? STARTERS.map((id) => (all || []).find((a) => a.slug === id)).filter((a): a is Answer => !!a) : shown;
  return (
    <section className="mt-6">
      {shelves.length > 1 && <div className="mt-3 grid grid-cols-2 gap-2">
        {SHELVES.filter((x) => shelves.includes(x.id)).map((x) => (
          <button key={x.id} type="button" onClick={() => { setShelf(x.id); setOpen(null); }}
            className={`min-h-[44px] rounded-full border text-[14px] ${shelf === x.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/35 text-[#f1ece2]/75"}`}>{x.label}</button>
        ))}
      </div>}
      <h2 className="mt-5 font-display text-[28px] font-light leading-tight">{men ? "For men" : women && !startTp ? "For women" : startTp ? startTp.label : meta.title}</h2>
      <p className="mt-2 text-[15px] text-[#a79f90]">{men ? "What's happening in her, and in you. More every week." : women && !startTp ? "Your body, your desire, and what's in the way. More every week." : startTp ? "My answers, and more every week." : all ? `${all.filter((a) => !a.slug.startsWith("next")).length} ${meta.unit} so far, and it grows every week.` : "Opening\u2026"}</p>
      <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search: touch, menopause, desire…"
        className="mt-4 w-full rounded-full border border-[#DDC98E]/40 bg-transparent px-5 py-3 text-[16px] text-[#f1ece2] placeholder:text-[#8f877a]" />
      {shelf === "answers" && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Topics">
          {chips.map((t) => (
            <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => { setTopic(topic === t.id ? null : t.id); setOpen(null); }}
              className={`min-h-[40px] rounded-full border px-3 text-[13px] ${topic === t.id ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`}>{t.label}</button>
          ))}
        </div>
      )}
      {!paid && <p className="mt-3 text-[14px] text-[#DDC98E]">{trial ? "🔒 In your free week you see every question. The answers open with your first month, on day 8. Three meditations are yours now." : "🔒 These open when you start your 7 days free."}</p>}
      {starter && list.length > 0 && <p className="mt-5 font-display text-[20px] text-[#f1ece2]">Five to start with</p>}
      <ul className="mt-4 space-y-2">
        {(starter ? list : shelf === "meditations" ? shown : shown.slice(0, find || topic ? 60 : 12)).map((a) => (
          <li key={a.slug} className="rounded-2xl border border-[#DDC98E]/25">
            <button type="button" onClick={() => (paid || (trial && shelf === "meditations")) && !a.locked && setOpen(open === a.slug ? null : a.slug)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
              <span className="text-[16px] leading-snug text-[#f1ece2]">{a.q}</span>
              <span className="shrink-0 text-[#DDC98E]">{a.slug.startsWith("next") ? <span className="text-[12px] uppercase tracking-[0.14em] text-[#a79f90]">Soon</span> : (paid || (trial && shelf === "meditations")) && !a.locked ? (open === a.slug ? "\u2212" : "+") : "🔒"}</span>
            </button>
            {(paid || (trial && shelf === "meditations")) && !a.locked && open === a.slug && (
              <div className="space-y-3 px-4 pb-5 text-[15px] leading-relaxed text-[#cfc8bb]">
                {a.audio && <SpeedPlayer src={a.audio} label="Hear my answer" />}
                {a.blocks.map((b, i) => b.t === "h"
                  ? <p key={i} className="pt-2 font-display text-[19px] text-[#f1ece2]">{b.x}</p>
                  : <p key={i} className={b.t === "li" ? "pl-4" : ""}>{b.t === "li" && <span className="-ml-4 mr-2 text-[#DDC98E]">&bull;</span>}{b.x}</p>)}
              </div>
            )}
          </li>
        ))}
      </ul>
      {!find && !topic && !starter && all && all.length > 12 && <p className="mt-3 text-[13px] text-[#8f877a]">Search to see all {all.length}.</p>}
    </section>
  );
}

/* A box whose words go to Juliette, always with no name attached. */
function SendToMe({ item, notice, button, onType, once, onSent, light }: { item: string; notice: string; button: string; onType?: (v: string) => void; once?: string; onSent?: () => void; light?: boolean }) {
  const draftKey = `ffy.confessions.draft.${item}.v1`;
  // once = a week id: one send per week from this phone (her weekly confession).
  const sentKey = `ffy.confessions.sent.${item}${once ? `.${once}` : ""}.v1`;
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  useEffect(() => { setText(lsGet(draftKey)); if (lsGet(sentKey)) setState("sent"); }, [draftKey, sentKey]);

  const send = async () => {
    setState("sending");
    try {
      const res = await api({ action: "send", item, body: text.trim() });
      if (!res.ok) throw new Error(String(res.status));
      if (item === "question") { const j = await res.json().catch(() => ({})); if (j.id) lsSet(MINE_KEY, JSON.stringify([...readIds(MINE_KEY), j.id].slice(-50))); }
      lsSet(sentKey, "1");
      lsSet(draftKey, "");
      setState("sent");
      onType?.("");
      onSent?.();
    } catch {
      setState("failed");
    }
  };

  if (state === "sent") {
    return (
      <div className={`mt-3 rounded-2xl border p-4 ${light ? "border-[#0d3535]/30" : "border-[#DDC98E]/50"}`}>
        <p className="text-[16px]">{light ? "It\u2019s on the wall. Thank you." : "It\u2019s with me. Thank you."}</p>
        {once ? <p className="mt-1 text-[14px] text-[#cfc8bb]">Your next one opens on Monday.</p> : <button type="button" onClick={() => { lsSet(sentKey, ""); setText(""); setState("idle"); }} className={`mt-1 inline-flex min-h-[44px] items-center text-[14px] underline underline-offset-4 ${light ? "text-[#0d3535]" : "text-[#DDC98E]"}`}>{light ? "Ask another" : "Send me another"}</button>}
      </div>
    );
  }
  return (
    <div className="mt-3">
      <textarea value={text} maxLength={MAX} rows={4} placeholder={light ? "Type your question here…" : "Write it here…"}
        onChange={(e) => { setText(e.target.value); lsSet(draftKey, e.target.value); onType?.(e.target.value); }}
        className={light ? "w-full resize-none rounded-2xl border-[1.5px] border-[#0d3535]/30 bg-white p-4 text-[16px] leading-relaxed text-[#0d3535] placeholder:text-[#0d3535]/45 focus:outline-none" : "w-full resize-none rounded-2xl border-[1.5px] border-[#D8DFE1]/50 bg-[#D8DFE1]/[0.06] p-4 text-[16px] leading-relaxed text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:outline-none"} />
      <p className={`mt-2 text-[14px] ${light ? "text-[#0d3535]/75" : "text-[#cfc8bb]"}`}>{notice}</p>
      <button type="button" disabled={!text.trim() || state === "sending"} onClick={send}
        className={`mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-full font-display text-[16px] font-medium transition disabled:opacity-40 ${light ? "bg-[#0d3535] text-[#fefcfa]" : "bg-[#DDC98E] text-[#070707] hover:bg-[#EEDE80]"}`}>
        {state === "sending" ? "Sending…" : button}
      </button>
      {state === "failed" && <p className="mt-2 text-center text-[14px] text-[#EEDE80]">That didn&rsquo;t send. Try again.</p>}
    </div>
  );
}

/* ================= YOUR TURN: questions and confessions (11 Nov 2026) ================= */
// The Monday that starts this week, so a confession can go once a week.
const weekOf = (d: string) => { const x = new Date(d + "T12:00:00"); const back = (x.getDay() + 6) % 7; x.setDate(x.getDate() - back); return x.toISOString().slice(0, 10); };

type WallQ = { id: string; body: string; metoo: number; created_at: string };
type WallA = { id: string; question_id: string; question: string; answer: string; created_at: string };
type WallData = { questions: WallQ[]; thisWeek: WallA[]; answers: WallA[]; confessed?: { id: string; body: string; created_at: string }[] };
// The questions this phone asked (ids only, never words), so it can show "I answered you" (20 Nov 2026).
const MINE_KEY = "ffy.confessions.mine.v1";
const SEEN_KEY = "ffy.confessions.seen.v1";
const readIds = (k: string): string[] => { try { const j = JSON.parse(lsGet(k) || "[]"); return Array.isArray(j) ? j : []; } catch { return []; } };
async function loadWall(): Promise<WallData | null> {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  const res = await fetch("/api/confessions/wall", { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
  return res?.ok ? res.json() : null;
}
const normQ = (x: string) => x.toLowerCase().replace(/['\u2018\u2019`]/g, "").replace(/[^a-z0-9\s]/g, " ");
const STOP = new Set("i me my we our you your he she him her it its a an the and or but to of in on for with is am are was do does did have has why how what when can cant dont not so that this just".split(" "));
const keyWords = (x: string) => normQ(x).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

// From Juliette's 2am questions bank: real questions people typed (Quora, Mumsnet), each one already answered in the
// library. Shown as what they are, never as members' questions (20 Nov 2026).
const TWO_AM = [
  "Why don't I feel anything during sex anymore?",
  "Why do I flinch whenever my husband tries to touch me?",
  "Why won't my wife let me touch her?",
];

/* "Coming this month" on Today (Juliette 20 Nov 2026): the next 30 days on this member's own clock, plus the
   programme their next paid month opens. Titles only. Cards come every Tuesday and Saturday, so they're one line. */
function ComingUp() {
  const [items, setItems] = useState<{ date: string; kind: string; title: string }[] | null>(null);
  const { since, trial } = useMembership();
  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const res = await fetch("/api/confessions/coming", { headers: { Authorization: `Bearer ${data.session?.access_token}` } }).catch(() => null);
      if (res?.ok) setItems((await res.json()).items || []);
    })();
  }, []);
  const month = since ? membershipMonth(since) : 0;
  const nextProgrammes = MEMBERSHIP_UNLOCKS.filter((u) => u.month === (trial || !since ? 1 : month + 1));
  if (!items) return null;
  return (
    <section className="mt-6">
      <Eyebrow>Coming this month</Eyebrow>
      <ul className="mt-3 divide-y divide-[#DDC98E]/15 rounded-2xl border border-[#DDC98E]/25">
        {items.map((i) => (
          <li key={i.kind + i.date + i.title} className="flex items-baseline justify-between gap-3 px-4 py-3">
            <span className="text-[15px] text-[#f1ece2]"><span className="text-[12px] uppercase tracking-[0.14em] text-[#a79f90]">{i.kind}</span><br />{i.title}</span>
            <span className="shrink-0 text-[13px] text-[#DDC98E]">{new Date(i.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
          </li>
        ))}
        <li className="px-4 py-3 text-[14px] text-[#cfc8bb]">A new card every Tuesday and Saturday, and my answers every Thursday.</li>
        {nextProgrammes.length > 0 && (
          <li className="px-4 py-3 text-[14px] text-[#cfc8bb]">
            <span className="text-[#DDC98E]">{trial || !since ? "Opens with your first month:" : "Opens next month:"}</span> {nextProgrammes.map((u) => u.title).join(", ")}. Yours to keep.
          </li>
        )}
      </ul>
    </section>
  );
}

/* A peek at the wall on Today (Juliette 20 Nov 2026: "People like to see what others are asking"). */
function WallPeek({ onOpen }: { onOpen: () => void }) {
  const [wall, setWall] = useState<WallData | null>(null);
  useEffect(() => { loadWall().then((w) => w && setWall(w)); }, []);
  const qs = (wall?.questions || []).slice(0, 3);
  return (
    <section className="mt-6">
      <Eyebrow>This week&rsquo;s questions</Eyebrow>
      <div className="mt-3 space-y-2">
        {qs.map((q) => <p key={q.id} className="rounded-2xl bg-[#D8DFE1] p-3 text-[15px] leading-snug text-[#0d3535]">{q.body}</p>)}
        {wall && qs.length === 0 && <p className="text-[15px] text-[#a79f90]">Nobody has asked yet this week. Be the first.</p>}
      </div>
      <button type="button" onClick={onOpen} className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#DDC98E] text-[15px] font-medium text-[#070707]">Ask yours, or tap Me too</button>
    </section>
  );
}

/* ================= QUESTIONS: the wall, Me too, her answers (Juliette 20 Nov 2026) ================= */
// Telegram is gone. Every member sees this week's questions here the moment they're sent, taps Me too
// instead of asking the same thing again, and reads Juliette's answers on Thursday.
function YourTurn() {
  const [wall, setWall] = useState<WallData | null>(null);
  const [draft, setDraft] = useState("");
  const [openA, setOpenA] = useState<string | null>(null);
  const [tapped, setTapped] = useState<Record<string, boolean>>({});
  const refresh = () => loadWall().then((w) => w && setWall(w));
  const mine = new Set(typeof window === "undefined" ? [] : readIds(MINE_KEY));
  const mineAnswered = (wall?.answers || []).filter((a) => mine.has(a.question_id));
  useEffect(() => { refresh(); try { setTapped(JSON.parse(lsGet("ffy.confessions.metoo.v1") || "{}")); } catch {} }, []);

  const metoo = async (q: WallQ) => {
    if (tapped[q.id]) return;
    const next = { ...tapped, [q.id]: true };
    setTapped(next); lsSet("ffy.confessions.metoo.v1", JSON.stringify(next));
    setWall((w) => w && { ...w, questions: w.questions.map((x) => (x.id === q.id ? { ...x, metoo: x.metoo + 1 } : x)) });
    const { data } = await supabaseBrowser.auth.getSession();
    fetch("/api/confessions/wall", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` }, body: JSON.stringify({ action: "metoo", id: q.id }) }).catch(() => {});
  };

  // As they type: questions already on the wall or already answered that look the same.
  const kw = keyWords(draft);
  const score = (t: string) => { const k = new Set(keyWords(t)); return kw.filter((w) => k.has(w)).length; };
  const similar = kw.length >= 2 && wall ? [
    ...wall.answers.map((a) => ({ kind: "answered" as const, id: a.id, text: a.question, s: score(a.question), a })),
    ...wall.questions.map((q) => ({ kind: "waiting" as const, id: q.id, text: q.body, s: score(q.body), q })),
  ].filter((x) => x.s >= 2).sort((a, b) => b.s - a.s).slice(0, 3) : [];

  return (
    <section className="mt-8 space-y-6">
      {/* How it works, in three steps (Juliette 20 Nov 2026: "somewhere ... we have to explain how it works"). */}
      <ol className="grid grid-cols-3 gap-2 text-center text-[13px] leading-snug text-[#cfc8bb]">
        <li className="rounded-2xl border border-[#DDC98E]/30 p-3"><span className="block font-display text-[20px] text-[#DDC98E]">1</span>Ask, with no name</li>
        <li className="rounded-2xl border border-[#DDC98E]/30 p-3"><span className="block font-display text-[20px] text-[#DDC98E]">2</span>Everyone sees it and taps Me too</li>
        <li className="rounded-2xl border border-[#DDC98E]/30 p-3"><span className="block font-display text-[20px] text-[#DDC98E]">3</span>I answer on Thursday. It stays in the library</li>
      </ol>
      {/* Its own colour so it reads as the place to type (Juliette 20 Nov 2026). */}
      <div className="ask-tile rounded-3xl bg-[#DDC98E] p-5 text-[#0d3535]">{/* gold = the place to type; light blue = the wall (Juliette 20 Nov 2026) */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d3535]/80">Ask me anything</p>
        <p className="mt-2 font-display text-[22px] font-light text-[#0d3535]">Your question about intimacy, Touch, desire, sex.</p>
        <p className="mt-2 text-[15px] text-[#0d3535]/80">Type it below. It goes on the wall with no name. I answer every Thursday.</p>
        <SendToMe item="question" light onType={setDraft} onSent={refresh} notice="No name goes with it, ever. Everyone in Scrumptious Confessions can read it." button="Ask my question" />
        {similar.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[13px] uppercase tracking-[0.14em] text-[#0d3535]/70">Someone may have asked this already</p>
            {similar.map((x) => x.kind === "answered" ? (
              <button key={x.id} type="button" onClick={() => setOpenA(x.id)} className="block w-full rounded-2xl border border-[#0d3535]/25 bg-white/60 p-3 text-left text-[15px] text-[#0d3535]">
                {x.text} <span className="font-semibold">· answered, read it</span>
              </button>
            ) : (
              <div key={x.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#0d3535]/25 bg-white/60 p-3 text-[15px] text-[#0d3535]">
                <span>{x.text}</span>
                <button type="button" onClick={() => metoo(x.q!)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] ${tapped[x.id] ? "border-[#0d3535] bg-[#0d3535] text-[#fefcfa]" : "border-[#0d3535] text-[#0d3535]"}`}>Me too</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {wall && wall.thisWeek.length > 0 && (
        <div className="rounded-3xl border border-[#DDC98E]/50 p-5">
          <Eyebrow>This week&rsquo;s answers</Eyebrow>
          <div className="mt-3 space-y-3">
            {wall.thisWeek.map((a) => <AnswerItem key={a.id} a={a} open={openA === a.id} onOpen={() => setOpenA(openA === a.id ? null : a.id)} />)}
          </div>
        </div>
      )}

      {mineAnswered.length > 0 && (
        <div className="rounded-3xl border-2 border-[#DDC98E] bg-[rgba(221,201,142,0.12)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#DDC98E]">&#9679; I answered you</p>
          <div className="mt-3 space-y-3">
            {mineAnswered.map((a) => <AnswerItem key={a.id} a={a} open={openA === a.id} onOpen={() => { setOpenA(openA === a.id ? null : a.id); lsSet(SEEN_KEY, JSON.stringify([...new Set([...readIds(SEEN_KEY), a.question_id])])); }} />)}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-[#DDC98E]/40 p-5">
        <Eyebrow>This week&rsquo;s questions</Eyebrow>
        {/* Juliette's opening line, from what her last group told her (20 Nov 2026). */}
        <p className="mt-3 text-[16px] leading-relaxed text-[#f1ece2]">My last group were surprised how hard it was to stay with their own body for fifteen minutes. Sensation isn&rsquo;t always pleasure. What&rsquo;s coming up for you?</p>
        <p className="mt-1 text-[13px] text-[#a79f90]">Juliette</p>
        <div className="mt-4 space-y-2">
          {!wall && <p className="text-[#8f877a]">…</p>}
          {wall && wall.questions.length === 0 && <p className="text-[15px] text-[#a79f90]">Be the first to ask this week.</p>}
          {wall?.questions.map((q) => (
            <div key={q.id} className="flex items-start justify-between gap-3 rounded-2xl bg-[#D8DFE1] p-3 text-[#0d3535]">
              <p className="whitespace-pre-wrap text-[15px] leading-snug">{q.body}</p>
              <button type="button" onClick={() => metoo(q)} aria-pressed={!!tapped[q.id]} className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] tabular-nums ${tapped[q.id] ? "border-[#0d3535] bg-[#0d3535] text-[#fefcfa]" : "border-[#0d3535] text-[#0d3535]"}`}>Me too · {q.metoo}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[#D8DFE1]/40 p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8DFE1]">Asked at 2am</p>
        <p className="mt-2 text-[14px] text-[#a79f90]">Real questions women and men type into their phones at night. I&rsquo;ve answered these in the library.</p>
        <div className="mt-3 space-y-2">
          {TWO_AM.map((q) => <p key={q} className="rounded-2xl bg-[#D8DFE1]/15 p-3 text-[15px] leading-snug text-[#f1ece2]">{q}</p>)}
        </div>
      </div>

      {openA && wall && !wall.thisWeek.some((a) => a.id === openA) && (() => { const a = wall.answers.find((x) => x.id === openA); return a ? <div className="rounded-3xl border border-[#DDC98E]/50 p-5"><AnswerItem a={a} open onOpen={() => setOpenA(null)} /></div> : null; })()}

      {/* Confessions: their own colour, deep teal with a lemon edge, and private (Juliette 20 Nov 2026). */}
      {wall?.confessed && wall.confessed.length > 0 && (
        <div className="rounded-3xl border border-[#EEDE80]/50 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#EEDE80]">You confessed</p>
          <p className="mt-1 text-[13px] text-[#a79f90]">Shared with no name, the ones I chose.</p>
          <div className="mt-3 space-y-2">
            {wall.confessed.map((c) => <p key={c.id} className="whitespace-pre-wrap rounded-2xl bg-[#EEDE80]/10 p-3 text-[15px] leading-snug text-[#f1ece2]">{c.body}</p>)}
          </div>
        </div>
      )}

      <div className="rounded-3xl border-2 border-[#EEDE80] bg-[#0d3535] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#EEDE80]">Confess to me &middot; only I see this</p>
        <p className="mt-2 font-display text-[22px] font-light">I tell you mine every week. Tell me yours.</p>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">Tell me what you want more of, what you&rsquo;ve never said, what surprised your body. Your confessions shape what I make next. Sometimes I&rsquo;ll answer one in a Monday confession, with no name.</p>
        <SendToMe item="confession" once={weekOf(todayUK())} notice="This comes to me with no name on it. All of it is welcome." button="Send my confession" />
      </div>
    </section>
  );
}

function AnswerItem({ a, open, onOpen }: { a: WallA; open: boolean; onOpen: () => void }) {
  return (
    <div className="rounded-2xl border border-[#DDC98E]/25">
      <button type="button" onClick={onOpen} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <span className="text-[16px] leading-snug">{a.question}</span>
        <span className="shrink-0 text-[#DDC98E]">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <div className="space-y-3 px-4 pb-5 text-[15px] leading-relaxed text-[#cfc8bb]">{a.answer.split(/\n+/).map((x, i) => <p key={i}>{x}</p>)}</div>}
    </div>
  );
}

/* ================= YOUR WEEK: one thing a day (Juliette 20 Nov 2026) =================
   "Every day it opens something. You can go 2 days ahead, but you can't go much further than that."
   Each member's own clock moves whole weeks, so the weekdays are the same for everyone. Thursday's
   answers are live, the same day for everyone, so they never open early. */
const WEEK: { what: string; go: TabId | "poems" | "meditations"; early: boolean }[] = [
  { what: "A confession", go: "stories", early: true },
  { what: "A card", go: "card", early: true },
  { what: "A poem", go: "poems", early: true },
  { what: "My answers", go: "yours", early: false },
  { what: "A meditation", go: "meditations", early: true },
  { what: "A card", go: "card", early: true },
  { what: "Touch Base and your week", go: "today", early: true },
];
function WeekStrip({ onPick }: { onPick: (t: TabId) => void }) {
  const today = todayUK();
  const monday = weekOf(today);
  const days = WEEK.map((w, i) => {
    const d = new Date(monday + "T12:00:00"); d.setDate(d.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const ahead = daysBetween(today, date);
    const state = ahead < 0 ? "past" : ahead === 0 ? "today" : w.early && ahead <= 2 ? "early" : "locked";
    return { ...w, date, state, short: d.toLocaleDateString("en-GB", { weekday: "short" }) };
  });
  const go = (g: (typeof WEEK)[number]["go"]) => {
    if (g === "poems") { window.location.assign("/practice/scrumptious-poems"); return; }
    onPick(g === "meditations" ? "library" : g);
  };
  const now = days.find((d) => d.state === "today")!;
  return (
    <section className="mt-6" data-testid="week-strip">
      <Eyebrow>Your week</Eyebrow>
      <button type="button" onClick={() => go(now.go)} className="mt-3 flex w-full items-center justify-between gap-3 rounded-3xl border-2 border-[#DDC98E] bg-[rgba(221,201,142,0.12)] p-5 text-left">
        <span>
          <span className="block text-[12px] uppercase tracking-[0.18em] text-[#DDC98E]">Today</span>
          <span className="mt-1 block font-display text-[24px] font-light">{now.what}</span>
        </span>
        <span className="text-[#DDC98E]">Open &rarr;</span>
      </button>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const open = d.state !== "locked";
          return (
            <button key={d.date} type="button" disabled={!open} onClick={() => go(d.go)} aria-label={`${d.short}: ${d.what}${open ? "" : `, opens ${weekday(d.date)}`}`}
              className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border px-0.5 text-center text-[11px] leading-tight ${d.state === "today" ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : d.state === "early" ? "border-dashed border-[#DDC98E]/70 text-[#f1ece2]" : d.state === "past" ? "border-[#DDC98E]/30 bg-[rgba(221,201,142,0.08)] text-[#f1ece2]" : "border-[#DDC98E]/15 text-[#6f6a60]"}`}>
              <span className="font-display text-[14px]">{d.short}</span>
              <span className="mt-0.5">{open ? (d.state === "early" ? "peek" : "open") : "🔒"}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[13px] text-[#8f877a]">Something opens every day. You can look up to two days ahead.</p>
    </section>
  );
}

/* ================= TODAY: Touch Base and 31 dots ================= */
const FEELS = [
  { id: "little", label: "Very little", color: "#2c7a72" },
  { id: "bit", label: "A bit", color: "#A88538" },
  { id: "range", label: "A whole range", color: "#EEDE80" },
] as const;
const DAYS_KEY = "ffy.confessions.days.v1";
const START_KEY = "ffy.confessions.start.v1";
type DayRec = { feel?: string; done?: boolean; missed?: boolean };
const readDays = (): Record<string, DayRec> => { try { return JSON.parse(lsGet(DAYS_KEY) || "{}") || {}; } catch { return {}; } };
const shift = (d: string, n: number) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

function Today() {
  const today = todayUK();
  const [days, setDays] = useState<Record<string, DayRec>>({});
  const [start, setStart] = useState("");
  const [sel, setSel] = useState(today);
  useEffect(() => { setDays(readDays()); setStart(lsGet(START_KEY)); }, []);

  const rec = days[sel] || {};
  const save = (r: DayRec) => { const all = { ...readDays(), [sel]: { ...rec, ...r } }; lsSet(DAYS_KEY, JSON.stringify(all)); setDays(all); };
  const dayNum = start ? Math.max(1, daysBetween(start, sel) + 1) : 1;
  const past31 = !!start && daysBetween(start, today) >= 31;
  const canBack = !!start && sel > start;
  const canFwd = sel < today;
  const isToday = sel === today;
  const markDone = () => {
    if (!start) { lsSet(START_KEY, today); setStart(today); }
    if (!rec.done) tally("touchbase", "touchbase_done", "yes"); // counted with no name (11 Nov 2026)
    save({ done: true, missed: false });
  };
  const startAgain = () => { lsSet(START_KEY, today); setStart(today); setSel(today); };

  return (
    <section className="mt-5">
      <div className="flex items-center gap-4">
        <RoundVoice src="/touch-base/touch-base-guided-music.m4a" img="/touch-base/emblem.png" label="Touch Base, in Juliette's voice" />
        <div>
          <Eyebrow>Every day · in my voice</Eyebrow>
          <h2 className="mt-1 font-display text-[28px] font-light leading-tight">Touch Base</h2>
          <p className="mt-0.5 text-[13px] text-[#a79f90]">Tap the emblem · 5 minutes</p>
        </div>
      </div>

      {past31 && (
        <div className="mt-6 rounded-2xl border border-[#DDC98E]/50 p-4 text-center">
          <p className="text-[16px]">Your 31 days are up. Your dots stay here.</p>
          <button type="button" onClick={startAgain} className="mt-2 inline-flex min-h-[48px] items-center rounded-full border border-[#DDC98E] px-5 text-[15px] text-[#DDC98E]">Start a new 31 days</button>
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
        <div className="flex items-center justify-between text-sm">
          {canBack ? <button type="button" onClick={() => setSel(shift(sel, -1))} className="min-h-[44px] text-[#DDC98E]">← Back a day</button> : <span />}
          <span className="text-[12px] uppercase tracking-[0.18em] text-[#a79f90]">{isToday ? `Today · day ${Math.min(dayNum, 31)}` : `Day ${Math.min(dayNum, 31)}`}</span>
          {canFwd ? <button type="button" onClick={() => setSel(shift(sel, 1))} className="min-h-[44px] text-[#DDC98E]">Forward →</button> : <span />}
        </div>
        <div className="mt-3"><Eyebrow>How much did you feel?</Eyebrow></div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FEELS.map((f) => (
            <button key={f.id} type="button" onClick={() => save({ feel: f.id })} className={pill(rec.feel === f.id) + " flex-col py-3 text-[14px]"}>
              <span className="h-4 w-4 rounded-full" style={{ background: f.color }} />{f.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {rec.done ? (
            <div className="rounded-2xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-5 text-center">
              <span className="block font-display text-3xl font-light text-[#DDC98E]">Done</span>
              <button type="button" onClick={() => save({ done: false })} className="mt-2 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Do it again</button>
            </div>
          ) : (
            <>
              {rec.missed && <p className="mb-3 text-center text-[15px] text-[#cfc8bb]">Marked as missed. That&rsquo;s information too.</p>}
              <button type="button" onClick={markDone} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80]">I did it ✓</button>
              {!isToday && !rec.missed && (
                <button type="button" onClick={() => save({ missed: true })} className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/60 text-[15px] text-[#DDC98E]">I missed this day</button>
              )}
            </>
          )}
        </div>
        <MonthDots days={days} start={start} sel={sel} onPick={(d) => { if (d <= today) setSel(d); }} />
      </div>
      <TouchMapMonth />
      <OpenedForYou />
    </section>
  );
}

/* THE TOUCH MAP, one a month on a Monday, on each member's own clock since 20 Nov 2026 (Juliette 19 Nov 2026: "one of the practises from a touch map, it
   just gives people more awareness... I would call it the TOUCH MAP and yes the first monday of each month").
   One place at a time, her recorded Touch Map days, her words and her voice. */
// Juliette 20 Nov 2026: the first place opens in week one, then once a month, on a Monday
// (the launch group's dates; everyone else's move with their own clock).
const TOUCH_MAP_MONTHS: { on: string; place: string }[] = [
  { on: "2026-11-23", place: "wrist" },
  { on: "2026-12-21", place: "inner-elbow" },
  { on: "2027-01-25", place: "elbow-armpit" },
  { on: "2027-02-22", place: "heart" },
  { on: "2027-03-22", place: "collarbone" },
  { on: "2027-04-26", place: "back-of-neck" },
];
function TouchMapMonth() {
  const today = todayUK();
  // Each member's own clock (lib/confessions-clock.ts, Juliette 20 Nov 2026): the wrist in their own third
  // week, then one place a month, on a Monday. Read fresh from the server so a new start date counts at once.
  const [weeks, setWeeks] = useState<number | null>(null);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      const u = data?.user;
      const isAdmin = (u?.email || "").toLowerCase() === ADMIN_EMAIL;
      setAdmin(isAdmin);
      setWeeks(!u || isAdmin ? 0 : memberWeeks(u));
    }).catch(() => setWeeks(0));
  }, []);
  if (weeks === null) return null;
  const months = TOUCH_MAP_MONTHS.map((m) => ({ ...m, on: onMyClock(m.on, weeks) }));
  const opened = months.filter((m) => m.on <= today);
  // Juliette sees the first place before it opens, so she can film and check it (20 Nov 2026).
  const early = admin && !opened.length;
  const now = early ? months[0] : opened[opened.length - 1];
  const next = months.find((m) => m.on > (early ? months[0].on : today));
  const p = now ? PLACES.find((x) => x.id === now.place) : null;
  return (
    <div className="mt-6 rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-5" data-testid="touch-map-month">
      <Eyebrow>The Touch Map</Eyebrow>
      {p ? (
        <>
          <h3 className="mt-2 font-display text-[24px] font-light leading-tight">{p.label}</h3>
          <p className="mt-1 text-[13px] text-[#a79f90]">{early ? `Only you see this early. Members get it on ${dayName(months[0].on)}.` : "This month\u2019s place. One a month, on a Monday."}</p>
          {p.audio && <div className="mt-4"><VoicePlayer src={p.audio} label={`The Touch Map: ${p.label}`} dark /></div>}
          <div className="mt-4 space-y-3">
            {p.touch.map((l, i) => <p key={i} className="text-[16px] leading-relaxed text-[#f1ece2]">{l}</p>)}
          </div>
          {next && <p className="mt-4 text-[13px] text-[#8f877a]">The next place opens on {dayName(next.on)}.</p>}
          {/* Juliette 19 Nov 2026: a way to buy the whole map, without leaving the app. */}
          <p className="mt-4 text-[14px] text-[#cfc8bb]">This is one place from The Touch Map. Want the whole map? <Link href="/taste/touch-map" className="text-[#DDC98E] underline underline-offset-4">Open it here, &pound;197</Link>.</p>
        </>
      ) : (
        <p className="mt-2 text-[16px] text-[#cfc8bb]">One place on your body, once a month, in my voice. The first one opens on {next ? dayName(next.on) : "a Monday soon"}.</p>
      )}
    </div>
  );
}

function MonthDots({ days, start, sel, onPick }: { days: Record<string, DayRec>; start: string; sel: string; onPick: (d: string) => void }) {
  const s = start || todayUK();
  const dateOf = (i: number) => shift(s, i);
  const done = Array.from({ length: 31 }, (_, i) => days[dateOf(i)]?.done).filter(Boolean).length;
  return (
    <div className="mt-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">Your 31 days · {done} done</p>
      <div className="mt-3 grid grid-cols-[repeat(11,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: 31 }, (_, i) => {
          const r = days[dateOf(i)];
          const c = r?.done ? FEELS.find((f) => f.id === r.feel)?.color ?? "rgba(221,201,142,0.45)" : undefined;
          const missed = !r?.done && !!r?.missed;
          return (
            <button type="button" key={i} aria-label={`Day ${i + 1}${missed ? ", missed" : ""}`} onClick={() => onPick(dateOf(i))}
              className="flex aspect-square items-center justify-center rounded-full border text-[10px] text-[#DDC98E]"
              style={{ background: c ?? "transparent", borderColor: dateOf(i) === sel ? "#EEDE80" : missed ? "#DDC98E" : c ?? "rgba(221,201,142,0.3)" }}>
              {missed ? "×" : ""}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[rgba(254,252,250,0.7)]">
        {FEELS.map((f) => <span key={f.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />{f.label}</span>)}
      </div>
      <p className="mt-2 text-xs text-[rgba(254,252,250,0.55)]">Your days stay on this phone. I only see how many days everyone did in total, never who.</p>
    </div>
  );
}

/* The emblem IS the play button, with a gold ring that fills as it plays. */
// Every recording gets a speed button (Juliette, 20 Nov 2026: "all the voice notes, everything, they can speed up").
// Touch Base 1x/1.1x/1.2x, everything else up to 1.5x (lib/voice-speed).
function RoundVoice({ src, img, label }: { src: string; img: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const [rate, setRate] = useState(1);
  useEffect(() => { setRate(readSpeed(src)); }, [src]); // eslint-disable-line react-hooks/set-state-in-effect
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate]);
  const play = (a: HTMLAudioElement) => {
    try { const n = navigator as unknown as { audioSession?: { type: string } }; if (n.audioSession) n.audioSession.type = "playback"; } catch {}
    a.playbackRate = rate;
    a.play().catch(() => { a.load(); a.playbackRate = rate; a.play().catch(() => {}); });
  };
  const cycle = () => { const v = nextSpeed(src, rate); setRate(v); saveSpeedFor(src, v); };
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
    <button type="button" aria-label={playing ? "Pause" : label} onClick={() => { const a = ref.current; if (!a) return; if (a.paused) play(a); else a.pause(); }} className="relative h-[72px] w-[72px] shrink-0 rounded-full">
      <Image src={img} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover" />
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="rgba(221,201,142,0.35)" strokeWidth="2" />
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="#DDC98E" strokeWidth="2" strokeDasharray={`${p * 1.037} 200`} />
      </svg>
      <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#DDC98E] text-[11px] text-[#070707] shadow">{playing ? "❚❚" : "▶"}</span>
      <audio ref={ref} src={src} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setP(0); }}
        onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate; }}
        onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setP((a.currentTime / a.duration) * 100); }} />
    </button>
    {(
      <button type="button" onClick={cycle} aria-label={`Speed ${rate}x. Tap to change`} className="min-h-[32px] min-w-[52px] rounded-full border border-[#DDC98E]/50 px-2 text-[12px] text-[#DDC98E]">
        {rate}×
      </button>
    )}
    </div>
  );
}

/* ================= THE WEEKLY CARD ================= */
function Cards({ feed }: { feed: Feed | null }) {
  if (!feed) return <p className="mt-6 text-[#8f877a]">…</p>;
  return (
    <section className="mt-4">
      {feed.cards.length === 0 && <p className="mt-6 text-center text-[15px] text-[#a79f90]">Your first card lands here very soon.</p>}
      {feed.cards.map((c, i) => <CardBlock key={c.id} card={c} open={i === 0} />)}
      {feed.nextCard && <Coming day={feed.nextCard} what="A new card" />}
      <YourAnswers cards={feed.cards} />
      {/* Juliette 19 Nov 2026: "it has two audios, which is weird... the 15-minute timer there... and the
          5-minute timer there as well, so that they understand it's solo or it's together". */}
      <div className="mt-10 space-y-3">
        <Eyebrow>How to use your card</Eyebrow>
        {[
          { who: "On your own", line: "Five minutes, just you and the card.", src: "/one-touch/voice/on-your-own.m4a", img: `${DIR}/juliette.jpg`, min: 5 },
          { who: "Together", line: "Fifteen minutes, the two of you, with the Dyad.", src: "/one-touch/voice/with-someone.m4a", img: `${DIR}/juliette-gold.jpg`, min: 15 },
        ].map((w) => (
          <div key={w.who} className="rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
            <div className="flex items-center gap-4">
              <RoundVoice src={w.src} img={w.img} label={`${w.who}: how to use your card`} />
              <div>
                <p className="font-display text-[24px] font-light leading-tight">{w.who}</p>
                <p className="mt-1 text-[14px] text-[#cfc8bb]">{w.line}</p>
                <p className="mt-1 text-[12px] text-[#a79f90]">Tap my photo to hear how.</p>
              </div>
            </div>
            {w.min === 15 && <WhoSpeaks />}
            <div className="mt-4"><PracticeTimer minutes={[w.min]} dark solo={w.min === 5} label={w.min === 5 ? "Your five minutes" : "Your fifteen minutes"} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Who's speaking first, like the cards app's Dyad sitting (Juliette 20 Nov 2026: "there is a place to type in
   who is asking, so it holds time for them"). Names stay on this phone. "Thank you" hands the turn over. */
function WhoSpeaks() {
  const KEY = "ffy.confessions.names.v1";
  const [names, setNames] = useState<[string, string]>(["", ""]);
  const [first, setFirst] = useState(0);
  const [turn, setTurn] = useState(0);
  useEffect(() => { try { const j = JSON.parse(lsGet(KEY) || "{}"); if (Array.isArray(j.n)) setNames([j.n[0] || "", j.n[1] || ""]); if (j.f === 1) { setFirst(1); setTurn(1); } } catch {} }, []);
  const save = (n: [string, string], f: number) => lsSet(KEY, JSON.stringify({ n, f }));
  const nm = (i: number) => names[i].trim() || (i === 0 ? "Speaker one" : "Speaker two");
  return (
    <div className="mt-4 rounded-2xl border border-[#DDC98E]/30 p-4">
      <p className="text-[13px] uppercase tracking-[0.16em] text-[#a79f90]">Who&rsquo;s speaking first?</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1.5">
            <input value={names[i]} maxLength={20} placeholder="Name" aria-label={i === 0 ? "First name" : "Second name"}
              onChange={(e) => { const n: [string, string] = [...names] as [string, string]; n[i] = e.target.value; setNames(n); save(n, first); }}
              className="w-full rounded-full border border-[#DDC98E]/40 bg-transparent px-4 py-2 text-[15px] text-[#f1ece2] placeholder:text-[#8f877a]" />
            <button type="button" onClick={() => { setFirst(i); setTurn(i); save(names, i); }}
              className={`min-h-[40px] w-full rounded-full border text-[13px] ${first === i ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`}>Speaks first</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[15px] text-[#f1ece2]"><span className="text-[#DDC98E]">{nm(turn)}</span> speaking &middot; {nm(1 - turn)} listening</p>
      <button type="button" onClick={() => setTurn(1 - turn)} className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#DDC98E]/60 text-[14px] text-[#DDC98E]">Thank you. {nm(1 - turn)}, your turn</button>
    </div>
  );
}

function CardBlock({ card, open }: { card: Card; open: boolean }) {
  const answeredKey = `ffy.confessions.card.${card.id}.answered.v1`;
  const [show, setShow] = useState(open);
  const [face, setFace] = useState<"back" | "front">("back");
  // Counted once: that she answered, never what she wrote.
  const onType = (v: string) => { if (v.trim() && !lsGet(answeredKey)) { lsSet(answeredKey, "1"); tally(card.id, "card_answered", "yes"); } };

  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[#DDC98E]/30 px-4 py-4 text-left">
        <span className="text-[15px] text-[#cfc8bb]">An earlier card</span>
        <span className="text-[12px] text-[#8f877a]">{dayName(card.publish_on)}</span>
      </button>
    );
  }
  return (
    <div className="mt-5">
      <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">{dayName(card.publish_on)}</p>
      <div className="my-5 flex justify-center">
        <div onClick={() => setFace("front")} role={face === "back" ? "button" : undefined} aria-label={face === "back" ? "Turn the card over" : undefined} className={`w-full max-w-[300px] ${face === "back" ? "cursor-pointer" : ""}`}>
          {face === "back" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/scrumptious-confessions/card-back.png" alt="Card, face down" className="block w-full border border-white/10" />
          ) : (
            <div className="-my-7"><PromptCard deck="Scrumptious Confessions" prompt={card.prompt} /></div>
          )}
        </div>
      </div>
      {face === "front" && <CardAnswers card={card} onType={onType} />}
    </div>
  );
}

/* 21 Nov 2026 (Juliette: "how do we write on the cards... where do all those answers live... how can they look back").
   Same as Let Her Land's Be seen: her voice ("Listen to me here") and her 5-minute gong timer right under the card,
   then answers one at a time (room for 15 to 20), kept on this phone per card, even after she sends one to Juliette. */
const answersKey = (id: string) => `ffy.confessions.card.${id}.answers.v1`;
const readAnswers = (id: string): string[] => { try { const j = JSON.parse(lsGet(answersKey(id)) || "[]"); return Array.isArray(j) ? j : []; } catch { return []; } };
function CardAnswers({ card, onType }: { card: Card; onType: (v: string) => void }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [breath, setBreath] = useState("");
  const [timeUp, setTimeUp] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => { setAnswers(readAnswers(card.id)); }, [card.id]); // eslint-disable-line react-hooks/set-state-in-effect
  const save = (next: string[]) => { setAnswers(next); lsSet(answersKey(card.id), JSON.stringify(next)); try { window.dispatchEvent(new Event("ffy-card-answers")); } catch {} };
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    save([...answers, t]);
    onType(t);
    setDraft("");
    setBreath("Take a breath. Read the card again, and give the next one.");
    setTimeout(() => setBreath(""), 4000);
  };
  return (
    <div className="mt-8" data-testid="card-answers">
      <div className="rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
        <div className="flex items-center gap-4">
          <RoundVoice src="/one-touch/voice/on-your-own.m4a" img={`${DIR}/juliette.jpg`} label="Listen to me here: how to sit with your card" />
          <div>
            <p className="font-display text-[22px] font-light leading-tight">Listen to me here</p>
            <p className="mt-1 text-[14px] text-[#cfc8bb]">Five minutes, just you and the card.</p>
            <p className="mt-1 text-[12px] text-[#a79f90]">Tap my photo to hear how.</p>
          </div>
        </div>
        <div className="mt-4"><PracticeTimer minutes={[5]} dark solo label="Your five minutes" onDone={() => setTimeUp(true)} /></div>
      </div>
      <p className="mt-6 font-display text-[20px] font-light">Answer {answers.length + 1}</p>
      <p className="text-[13px] text-[#8f877a]">Write one, add it, then the next. Fifteen or twenty things often come up.</p>
      <textarea value={draft} rows={3} onChange={(e) => setDraft(e.target.value)} placeholder="Write one answer here." aria-label={`Answer ${answers.length + 1}`}
        className="mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-4 text-[16px] leading-relaxed text-[#f1ece2] outline-none placeholder:text-[#8f877a] focus:border-[#DDC98E]" />
      <p className="min-h-[22px] text-center text-[14px] text-[#EEDE80]" aria-live="polite">{breath}</p>
      <button type="button" data-testid="card-add" disabled={!draft.trim()} onClick={add} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[16px] text-[#DDC98E] disabled:opacity-40">Add it, and write the next one</button>
      {answers.length > 0 && (
        <ol className="mt-4 grid gap-2" data-testid="card-answer-list">
          {answers.map((t, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border border-[#DDC98E]/20 bg-[rgba(13,53,53,0.3)] px-4 py-2.5 text-[15px] text-[#f1ece2]">
              <span className="font-display text-[#DDC98E]">{i + 1}</span><span className="flex-1">{t}</span>
              <button type="button" aria-label={`Remove answer ${i + 1}`} onClick={() => save(answers.filter((_, k) => k !== i))} className="text-[#8f877a]">×</button>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-[13px] text-[#8f877a]">Saved on this phone. Only you see these.</p>
      {/* 21 Nov 2026 (Juliette: "how do they go on if they have written enough and want to finish?"). A clear finish as
          soon as there is one answer, timer or no timer; it also saves anything still in the box. */}
      {finished ? (
        <div className="mt-6 rounded-3xl border border-[#DDC98E]/30 p-5 text-center" data-testid="card-finished">
          <p className="font-display text-[26px] font-light">Pause.</p>
          <p className="mt-1 text-[15px] text-[#cfc8bb]">Notice how your body feels. Often there&rsquo;s a little more breath, more space, more aliveness.</p>
          <p className="mt-3"><b className="font-display text-[34px] font-light text-[#DDC98E]">{answers.length}</b><span className="ml-2 text-[14px] text-[#a79f90]">answers on this card, kept under Your answers</span></p>
          <button type="button" onClick={() => setFinished(false)} className="mt-3 text-[13px] text-[#DDC98E] underline">Add more</button>
        </div>
      ) : (answers.length > 0 || draft.trim()) ? (
        <div className="mt-6" data-testid="card-finish">
          {timeUp ? <p className="mb-3 text-center font-display text-[20px] font-light">Pause. That&rsquo;s your five minutes.</p>
            : <p className="mb-3 text-center text-[13px] text-[#8f877a]">Written all you need for today? You can finish now. Your answers are saved.</p>}
          <button type="button" data-testid="card-done" onClick={() => { add(); setFinished(true); }} className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">I&rsquo;m done with this card ✓</button>
        </div>
      ) : null}
      <details className="mt-6 rounded-2xl border border-[#DDC98E]/25 px-4 py-3">
        <summary className="cursor-pointer text-[14px] text-[#DDC98E]">Want to send one to me? No name on it.</summary>
        <div className="mt-3">
          <SendToMe item={card.id} notice="It comes to me with no name on it. Your answers above stay on your phone." button="Send it to me" />
        </div>
      </details>
    </div>
  );
}

/** Every card she has answered, newest first, from this phone. */
function YourAnswers({ cards }: { cards: Card[] }) {
  const [rows, setRows] = useState<{ card: Card; answers: string[] }[]>([]);
  useEffect(() => {
    const load = () => setRows(cards.map((c) => ({ card: c, answers: readAnswers(c.id) })).filter((r) => r.answers.length));
    load(); // eslint-disable-line react-hooks/set-state-in-effect
    window.addEventListener("ffy-card-answers", load);
    return () => window.removeEventListener("ffy-card-answers", load);
  }, [cards]);
  if (!rows.length) return null;
  return (
    <div className="mt-10" data-testid="your-answers">
      <Eyebrow>Your answers, every card</Eyebrow>
      <p className="mt-1 text-[13px] text-[#8f877a]">Everything you wrote lives on this phone, in this browser. Copy anything you want to keep if you change phones.</p>
      <div className="mt-3 grid gap-3">
        {rows.map(({ card, answers }) => (
          <div key={card.id} className="rounded-2xl border border-[#DDC98E]/20 bg-[rgba(13,53,53,0.25)] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">{dayName(card.publish_on)}</p>
            <p className="mt-1 text-[14px] text-[#cfc8bb]">{card.prompt}</p>
            <ol className="mt-2 grid gap-1">{answers.map((a, i) => <li key={i} className="font-display text-[16px] font-light italic text-[#f1ece2]"><span className="mr-2 not-italic text-[#DDC98E]">{i + 1}</span>{a}</li>)}</ol>
          </div>
        ))}
      </div>
    </div>
  );
}

