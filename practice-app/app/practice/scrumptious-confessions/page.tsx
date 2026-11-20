"use client";

import Link from "next/link";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { isTouchBase, nextSpeed, readSpeed, saveSpeedFor } from "@/lib/voice-speed";
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
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "stories" && <Stories feed={feed} />}
        {tab === "today" && <><WeekStrip onPick={pick} /><Today /></>}
        {tab === "card" && <Cards feed={feed} />}
        {tab === "yours" && <YourTurn />}
        {tab === "library" && <Library />}
        </>}
      </div>
    </main>
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
      {feed.nextStory && <Coming day={feed.nextStory} what="A new story" />}
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
  if (door) {
    const d = DOORS.find((x) => x.id === door)!;
    return (
      <>
        <button type="button" onClick={() => setDoor(null)} className="mt-6 min-h-[44px] text-[15px] text-[#DDC98E]">&larr; Back to the library</button>
        <Answers key={door} paid={paid} trial={trial} start={d.shelves[0]} shelves={d.shelves} />
      </>
    );
  }
  return (
    <section className="mt-6">
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
  if (!paid) {
    return trial ? <p className="mt-6 text-center text-[14px] text-[#a79f90]">Your first practices open with your first month, on day 8.</p> : null;
  }
  const month = since ? membershipMonth(since) : 1;
  const open = MEMBERSHIP_UNLOCKS.filter((u) => u.month <= month);
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
      <p className="mt-2 text-[12px] text-[#8f877a]">Something new opens every month you stay.</p>
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
const TOPICS: { id: string; label: string; words: string[] }[] = [
  { id: "numb", label: "Feeling nothing", words: ["numb", "nothing", "flat", "shut down", "don't want to be touched", "dont want", "no desire", "disconnected"] },
  { id: "touch", label: "Touch and the body", words: ["touch", "body", "skin", "trace", "hug", "hands"] },
  { id: "desire", label: "Desire and pleasure", words: ["desire", "pleasure", "orgasm", "turn on", "turned on", "sex", "erotic", "libido", "want"] },
  { id: "us", label: "Him, her, us", words: ["partner", "husband", "wife", "marriage", "couple", "him", "relationship", "reaching", "distance"] },
  { id: "safe", label: "Safety and trust", words: ["safe", "safety", "trust", "boundar", "saying no", "the no", "consent", "brace"] },
  { id: "shame", label: "Shame and the past", words: ["shame", "past", "trauma", "child", "guilt", "abuse", "mother", "father"] },
  { id: "menopause", label: "Menopause and a changing body", words: ["menopause", "perimenopause", "oestrogen", "postmenopausal", "after having a baby", "hot flush"] },
  { id: "men", label: "For men", words: [" men", " man ", "for men", "masculin"] },
  { id: "calm", label: "Calm, sleep and clarity", words: ["anxiety", "sleep", "calm", "stress", "breath", "overwhelm", "clarity", "nervous"] },
];
// The library's doors (Juliette 19 Nov 2026: "the library is really not very clear at all").
// Nobody lands on a list: they pick a door first. The Journal door is a link of its own.
type Door = "meditations" | "answers";
const DOORS: { id: Door; title: string; line: string; shelves: Shelf[] }[] = [
  { id: "answers", title: "Your questions, answered", line: "Search, or start with five", shelves: ["answers"] },
  { id: "meditations", title: "Meditations", line: "A new one every Friday", shelves: ["meditations"] },
];
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
function Answers({ paid, trial, start, shelves }: { paid: boolean; trial?: boolean; start: Shelf; shelves: Shelf[] }) {
  const [shelf, setShelf] = useState<Shelf>(start);
  const [data, setData] = useState<Record<Shelf, Answer[] | null>>({ answers: null, essays: null, podcast: null, meditations: null });
  const [find, setFind] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
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
  const all = raw && shelf === "answers" ? raw.filter((a) => !HIDE.has(a.slug)) : raw;
  const meta = SHELVES.find((x) => x.id === shelf)!;
  // Phones type curly apostrophes ("don’t"); the library has straight ones. Search ignores
  // apostrophes and punctuation, so "why don't i feel anything" always finds it (19 Nov 2026).
  const norm = (x: string) => x.toLowerCase().replace(/['\u2018\u2019`]/g, "").replace(/[^a-z0-9\s]/g, " ");
  const words = norm(find).split(/\s+/).filter(Boolean);
  const inQ = (a: Answer) => words.every((w) => norm(a.q).includes(w));
  const tp = TOPICS.find((t) => t.id === topic);
  const onShelf = (a: Answer) => !tp || a.slug.startsWith("next") || (a.shelves ? a.shelves.includes(tp.id) : tp.words.some((w) => (" " + a.q + " " + a.blocks.map((b) => b.x).join(" ") + " ").toLowerCase().includes(w)));
  const shown = (all || [])
    .filter(onShelf)
    .filter((a) => { const t = norm(a.q + " " + a.blocks.map((b) => b.x).join(" ")); return words.every((w) => t.includes(w)); })
    .sort((a, b) => Number(inQ(b)) - Number(inQ(a)));
  const starter = shelf === "answers" && !find && !topic;
  const list = starter ? STARTERS.map((id) => (all || []).find((a) => a.slug === id)).filter((a): a is Answer => !!a) : shown;
  return (
    <section className="mt-6">
      {shelves.length > 1 && <div className="mt-3 grid grid-cols-2 gap-2">
        {SHELVES.filter((x) => shelves.includes(x.id)).map((x) => (
          <button key={x.id} type="button" onClick={() => { setShelf(x.id); setOpen(null); }}
            className={`min-h-[44px] rounded-full border text-[14px] ${shelf === x.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/35 text-[#f1ece2]/75"}`}>{x.label}</button>
        ))}
      </div>}
      <h2 className="mt-5 font-display text-[28px] font-light leading-tight">{meta.title}</h2>
      <p className="mt-2 text-[15px] text-[#a79f90]">{all ? `${all.filter((a) => !a.slug.startsWith("next")).length} ${meta.unit} so far, and it grows every week.` : "Opening\u2026"}</p>
      <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search: touch, menopause, desire…"
        className="mt-4 w-full rounded-full border border-[#DDC98E]/40 bg-transparent px-5 py-3 text-[16px] text-[#f1ece2] placeholder:text-[#8f877a]" />
      {shelf === "answers" && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Topics">
          {TOPICS.map((t) => (
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
                {a.audio && <audio controls preload="none" src={a.audio} className="w-full" />}
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
function SendToMe({ item, notice, button, onType, once, onSent }: { item: string; notice: string; button: string; onType?: (v: string) => void; once?: string; onSent?: () => void }) {
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
      <div className="mt-3 rounded-2xl border border-[#DDC98E]/50 p-4">
        <p className="text-[16px]">It&rsquo;s with me. Thank you.</p>
        {once ? <p className="mt-1 text-[14px] text-[#cfc8bb]">Your next one opens on Monday.</p> : <button type="button" onClick={() => { lsSet(sentKey, ""); setText(""); setState("idle"); }} className="mt-1 inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">Send me another</button>}
      </div>
    );
  }
  return (
    <div className="mt-3">
      <textarea value={text} maxLength={MAX} rows={4} placeholder="Write it here…"
        onChange={(e) => { setText(e.target.value); lsSet(draftKey, e.target.value); onType?.(e.target.value); }}
        className="w-full resize-none rounded-2xl border-[1.5px] border-[#D8DFE1]/50 bg-[#D8DFE1]/[0.06] p-4 text-[16px] leading-relaxed text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:outline-none" />
      <p className="mt-2 text-[14px] text-[#cfc8bb]">{notice}</p>
      <button type="button" disabled={!text.trim() || state === "sending"} onClick={send}
        className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] transition hover:bg-[#EEDE80] disabled:opacity-40">
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
type WallData = { questions: WallQ[]; thisWeek: WallA[]; answers: WallA[] };
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

/* ================= QUESTIONS: the wall, Me too, her answers (Juliette 20 Nov 2026) ================= */
// Telegram is gone. Every member sees this week's questions here the moment they're sent, taps Me too
// instead of asking the same thing again, and reads Juliette's answers on Thursday.
function YourTurn() {
  const [wall, setWall] = useState<WallData | null>(null);
  const [draft, setDraft] = useState("");
  const [openA, setOpenA] = useState<string | null>(null);
  const [tapped, setTapped] = useState<Record<string, boolean>>({});
  const refresh = () => loadWall().then((w) => w && setWall(w));
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
      <div className="rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-5">
        <Eyebrow>Ask me anything</Eyebrow>
        <p className="mt-2 font-display text-[22px] font-light">Your question about intimacy, Touch, desire, sex.</p>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">It goes on the wall for every member to see, with no name. I answer every Thursday.</p>
        <SendToMe item="question" onType={setDraft} onSent={refresh} notice="No name goes with it, ever. Everyone in Scrumptious Confessions can read it." button="Ask my question" />
        {similar.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[13px] uppercase tracking-[0.14em] text-[#a79f90]">Someone may have asked this already</p>
            {similar.map((x) => x.kind === "answered" ? (
              <button key={x.id} type="button" onClick={() => setOpenA(x.id)} className="block w-full rounded-2xl border border-[#DDC98E]/40 p-3 text-left text-[15px]">
                {x.text} <span className="text-[#DDC98E]">· answered, read it</span>
              </button>
            ) : (
              <div key={x.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#DDC98E]/25 p-3 text-[15px]">
                <span>{x.text}</span>
                <button type="button" onClick={() => metoo(x.q!)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] ${tapped[x.id] ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E] text-[#DDC98E]"}`}>Me too</button>
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

      <div className="rounded-3xl border border-[#DDC98E]/40 p-5">
        <Eyebrow>This week&rsquo;s questions</Eyebrow>
        {/* Juliette's opening line, from what her last group told her (20 Nov 2026). */}
        <p className="mt-3 text-[16px] leading-relaxed text-[#f1ece2]">My last group were surprised how hard it was to stay with their own body for fifteen minutes. Sensation isn&rsquo;t always pleasure. What&rsquo;s coming up for you?</p>
        <p className="mt-1 text-[13px] text-[#a79f90]">Juliette</p>
        <div className="mt-4 space-y-2">
          {!wall && <p className="text-[#8f877a]">…</p>}
          {wall && wall.questions.length === 0 && <p className="text-[15px] text-[#a79f90]">Be the first to ask this week.</p>}
          {wall?.questions.map((q) => (
            <div key={q.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white/[0.03] p-3">
              <p className="whitespace-pre-wrap text-[15px] leading-snug">{q.body}</p>
              <button type="button" onClick={() => metoo(q)} aria-pressed={!!tapped[q.id]} className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] tabular-nums ${tapped[q.id] ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E] text-[#DDC98E]"}`}>Me too · {q.metoo}</button>
            </div>
          ))}
        </div>
      </div>

      {openA && wall && !wall.thisWeek.some((a) => a.id === openA) && (() => { const a = wall.answers.find((x) => x.id === openA); return a ? <div className="rounded-3xl border border-[#DDC98E]/50 p-5"><AnswerItem a={a} open onOpen={() => setOpenA(null)} /></div> : null; })()}

      <div className="rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-5">
        <Eyebrow>Your confession this week</Eyebrow>
        <p className="mt-2 font-display text-[22px] font-light">I tell you mine every week. Tell me yours.</p>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">A fantasy, a fear, a moment your body surprised you. One a week. Only I see it.</p>
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
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      const u = data?.user;
      setWeeks(!u || (u.email || "").toLowerCase() === ADMIN_EMAIL ? 0 : memberWeeks(u));
    }).catch(() => setWeeks(0));
  }, []);
  if (weeks === null) return null;
  const months = TOUCH_MAP_MONTHS.map((m) => ({ ...m, on: onMyClock(m.on, weeks) }));
  const opened = months.filter((m) => m.on <= today);
  const now = opened[opened.length - 1];
  const next = months.find((m) => m.on > today);
  const p = now ? PLACES.find((x) => x.id === now.place) : null;
  return (
    <div className="mt-6 rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-5" data-testid="touch-map-month">
      <Eyebrow>The Touch Map</Eyebrow>
      {p ? (
        <>
          <h3 className="mt-2 font-display text-[24px] font-light leading-tight">{p.label}</h3>
          <p className="mt-1 text-[13px] text-[#a79f90]">This month&rsquo;s place. One a month, on a Monday.</p>
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
// Touch Base gets a speed button, 1x, 1.1x or 1.2x (lib/voice-speed, 12 Nov 2026).
function RoundVoice({ src, img, label }: { src: string; img: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const [rate, setRate] = useState(1);
  const tb = isTouchBase(src);
  useEffect(() => { if (tb) setRate(readSpeed(src)); }, [src, tb]);
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
    {tb && (
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
            <div className="mt-4"><PracticeTimer minutes={[w.min]} dark solo={w.min === 5} label={w.min === 5 ? "Your five minutes" : "Your fifteen minutes"} /></div>
          </div>
        ))}
      </div>
    </section>
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
      {face === "front" && (
        <div className="mt-8">
          <p className="font-display text-[20px] font-light">Your answer</p>
          <SendToMe item={card.id} onType={onType} notice="Saved on this phone. It stays private unless you send it to me, and then it comes with no name on it." button="Send it to me" />
            </div>
      )}
    </div>
  );
}
