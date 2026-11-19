"use client";

import Link from "next/link";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { isTouchBase, nextSpeed, readSpeed, saveSpeedFor } from "@/lib/voice-speed";
import { PromptCard } from "@/components/Interactive";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { supabaseBrowser } from "@/lib/supabase/client";
import { MEMBERSHIP_UNLOCKS, membershipMonth, monthOpensOn } from "@/lib/entitlements/config";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import PracticeTimer from "@/components/PracticeTimer";

// SCRUMPTIOUS CONFESSIONS, the membership (specs/scrumptious-confessions-membership.md).
// One story a week with a teaching in it, Touch Base every day with 31 dots, a
// weekly card. Tap answers stay on her phone and are counted with no name.
// Only what she chooses to send reaches Juliette.

const SLUG = "scrumptious-confessions";
const DIR = "/how-to-feel-like-a-woman";
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
  { id: "stories", label: "Mondays" },
  { id: "today", label: "Today" },
  { id: "card", label: "Card" },
  { id: "yours", label: "Your turn" },
  { id: "library", label: "Library" },
];

function Content() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [tab, setTab] = useState<TabId>("stories");
  const top = useRef<HTMLDivElement>(null);

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
        {tab === "today" && <Today />}
        {tab === "card" && <Cards feed={feed} />}
        {tab === "yours" && <YourTurn />}
        {tab === "library" && <Library />}
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
      <GroupLink />
    </article>
  );
}

/* Her Telegram group, where members post with no name (5 Nov 2026). */
// R1, R2 (specs/telegram-gatekeeper.md): each member gets their own one-use
// link from the bot, never the old shared link.
function GroupLink() {
  const [link, setLink] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch("/api/telegram/invite", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json().catch(() => ({}));
      if (!live) return;
      if (res.ok && json.link) setLink(json.link); else setErr(true);
    })();
    return () => { live = false; };
  }, []);
  return (
    <div className="mt-6 rounded-2xl border border-[#DDC98E]/40 p-4 text-center">
      <p className="text-[15px] text-[#cfc8bb]">Our private Telegram channel. No one can see who&rsquo;s in it, and no one can see who asks.</p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E] text-[15px] text-[#DDC98E]">
          Join our channel
        </a>
      ) : (
        <p className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#DDC98E]/40 text-[14px] text-[#8f877a]">
          {err ? "Your channel link isn't ready. Come back in a minute." : "Getting your link\u2026"}
        </p>
      )}
      <a href="https://t.me/SConfessionsBot" target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#DDC98E] text-[15px] font-medium text-[#070707]">
        Post a question or confession
      </a>
      <p className="mt-2 text-[13px] text-[#8f877a]">Message my Confessions bot and it posts your words into the channel with no name on it. Text only, so your voice stays yours. I answer there every week.</p>
    </div>
  );
}

/* What opens the longer you stay (MEMBERSHIP_UNLOCKS, Juliette 16 Nov 2026). */
function Library() {
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
  const month = since ? membershipMonth(since) : 1;
  const [door, setDoor] = useState<Door | null>(null);
  if (door === "months") {
    return (
      <>
        <button type="button" onClick={() => setDoor(null)} className="mt-6 min-h-[44px] text-[15px] text-[#DDC98E]">&larr; Back to the library</button>
    <section className="mt-4 space-y-3">
      <Eyebrow>Opening month by month</Eyebrow>
      <h2 className="font-display text-[28px] font-light leading-tight">Something new opens every month you stay</h2>
      {MEMBERSHIP_UNLOCKS.map((u) => {
        const open = u.month <= month;
        const when = since ? monthOpensOn(since, u.month).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : null;
        const inner = (
          <>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Month {u.month}{open ? " · open" : ""}</span>
            <span className="mt-1 block font-display text-[22px] font-light leading-tight">{u.title}</span>
            <span className="mt-0.5 block text-[14px] text-[#a79f90]">{open ? u.line : `🔒 Opens ${when ?? `in your month ${u.month}`}`}</span>
          </>
        );
        return open ? (
          <a key={u.title} href={u.href} target={u.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="block rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-4">{inner}</a>
        ) : (
          <div key={u.title} className="rounded-3xl border border-[#DDC98E]/20 p-4 opacity-70">{inner}</div>
        );
      })}
    </section>
      </>
    );
  }
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
    <>
    <section className="mt-6">
      <Eyebrow>Your library</Eyebrow>
      <h2 className="mt-3 font-display text-[28px] font-light leading-tight">Where would you like to start?</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/practice/scrumptiousness-journal" className="col-span-2 flex min-h-[96px] flex-col justify-between rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-4">
          <span className="font-display text-[21px] font-light leading-tight text-[#f1ece2]">The Scrumptiousness Journal</span>
          <span className="text-[13px] text-[#a79f90]">{paid ? "All 103 pages" : "Ten pages to start"}</span>
        </Link>
        {DOORS.map((x) => (
          <button key={x.id} type="button" onClick={() => setDoor(x.id)} className={`min-h-[132px] flex flex-col justify-between rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[rgba(13,53,53,0.35)] p-4 text-left`}>
            <span className="font-display text-[21px] font-light leading-tight text-[#f1ece2]">{x.title}</span>
            <span className="text-[13px] text-[#a79f90]">{x.line}</span>
          </button>
        ))}
      </div>
    </section>
    </>
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
  { id: "men", label: "For men", words: [" men", " man ", "for men", "masculin"] },
  { id: "calm", label: "Calm, sleep and clarity", words: ["anxiety", "sleep", "calm", "stress", "breath", "overwhelm", "clarity", "nervous"] },
];
// The library's doors (Juliette 19 Nov 2026: "the library is really not very clear at all").
// Nobody lands on a list: they pick a door first. The Journal door is a link of its own.
type Door = "meditations" | "answers" | "read" | "months";
const DOORS: { id: Door; title: string; line: string; shelves: Shelf[] }[] = [
  { id: "meditations", title: "Meditations", line: "In my voice, a new one every Friday", shelves: ["meditations"] },
  { id: "answers", title: "Answers to your questions", line: "Start with five, or search them all", shelves: ["answers"] },
  { id: "read", title: "Essays and podcast", line: "Read or listen", shelves: ["essays", "podcast"] },
  { id: "months", title: "Practices and programmes", line: "Something new every month you stay", shelves: [] },
];
// Five to start with. Juliette can swap these for her own five favourites.
const STARTERS = ["why-dont-i-feel-anything", "never-in-the-mood-but-enjoy-it", "why-can-i-feel-it-with-someone-else", "sleep-in-same-bed-never-touch", "why-doesnt-my-wife-want-me"];
// Website pages about finding a coach, not members' questions: kept on the site, left out of the library.
const HIDE = new Set(["desire-podcast-women-over-40", "how-an-intimacy-coach-helps", "how-much-does-intimacy-coaching-cost", "intimacy-and-touch-coach", "intimacy-classes-for-couples", "intimacy-coach-women-over-40-uk", "intimacy-expert-uk", "is-an-intimacy-coach-right-for-me", "relationship-coaching-for-men", "relationship-coaching", "somatic-coach-uk", "trauma-informed-intimacy-coach-uk", "what-does-a-touch-expert-do", "what-happens-in-intimacy-coaching", "when-to-get-help-with-intimacy", "who-teaches-couples-to-touch-again"]);
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
  if (next) items.push({ slug: "next", q: `The next one opens on ${next}.`, locked: true, blocks: [] });
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
    const get = shelf === "meditations" ? loadMeditations() : fetch(`/scrumptious-confessions/${shelf}.json`).then((r) => r.json());
    get.then((d) => setData((x) => ({ ...x, [shelf]: d }))).catch(() => setData((x) => ({ ...x, [shelf]: [] })));
  }, [shelf, data]);
  const raw = data[shelf];
  const all = raw && shelf === "answers" ? raw.filter((a) => !HIDE.has(a.slug)) : raw;
  const meta = SHELVES.find((x) => x.id === shelf)!;
  const words = find.toLowerCase().split(/\s+/).filter(Boolean);
  const inQ = (a: Answer) => words.every((w) => a.q.toLowerCase().includes(w));
  const tp = TOPICS.find((t) => t.id === topic);
  const onShelf = (a: Answer) => !tp || a.slug === "next" || (a.shelves ? a.shelves.includes(tp.id) : tp.words.some((w) => (" " + a.q + " " + a.blocks.map((b) => b.x).join(" ") + " ").toLowerCase().includes(w)));
  const shown = (all || [])
    .filter(onShelf)
    .filter((a) => words.every((w) => (a.q + " " + a.blocks.map((b) => b.x).join(" ")).toLowerCase().includes(w)))
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
      <p className="mt-2 text-[15px] text-[#a79f90]">{all ? `${all.length} ${meta.unit} so far, and it grows every week.` : "Opening\u2026"}</p>
      <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search: touch, menopause, desire…"
        className="mt-4 w-full rounded-full border border-[#DDC98E]/40 bg-transparent px-5 py-3 text-[16px] text-[#f1ece2] placeholder:text-[#8f877a]" />
      <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-[#DDC98E]">What&rsquo;s on your mind?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTopic(topic === t.id ? null : t.id); setOpen(null); }}
            className={`min-h-[40px] rounded-full border px-4 text-[14px] ${topic === t.id ? "border-[#DDC98E] bg-[rgba(221,201,142,0.15)] text-[#f1ece2]" : "border-[#DDC98E]/35 text-[#f1ece2]/75"}`}>{t.label}</button>
        ))}
      </div>
      {!paid && <p className="mt-3 text-[14px] text-[#DDC98E]">{trial ? "🔒 In your free week you see every question. The answers open with your first month, on day 8. Three meditations are yours now." : "🔒 These open when you start your 7 days free."}</p>}
      {starter && list.length > 0 && <p className="mt-5 font-display text-[20px] text-[#f1ece2]">Five to start with</p>}
      <ul className="mt-4 space-y-2">
        {(starter ? list : shown.slice(0, find || topic ? 60 : 12)).map((a) => (
          <li key={a.slug} className="rounded-2xl border border-[#DDC98E]/25">
            <button type="button" onClick={() => (paid || (trial && shelf === "meditations")) && !a.locked && setOpen(open === a.slug ? null : a.slug)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
              <span className="text-[16px] leading-snug text-[#f1ece2]">{a.q}</span>
              <span className="shrink-0 text-[#DDC98E]">{a.slug === "next" ? "" : (paid || (trial && shelf === "meditations")) && !a.locked ? (open === a.slug ? "\u2212" : "+") : "🔒"}</span>
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
function SendToMe({ item, notice, button, onType, once }: { item: string; notice: string; button: string; onType?: (v: string) => void; once?: string }) {
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

function YourTurn() {
  return (
    <section className="mt-8">
      <div className="rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-5">
        <Eyebrow>Ask me anything</Eyebrow>
        <p className="mt-2 font-display text-[22px] font-light">Your question about intimacy, touch, desire, sex.</p>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">I answer the questions every week.</p>
        <SendToMe item="question" notice="This comes to me with no name on it." button="Send my question" />
      </div>
      <div className="mt-6 rounded-3xl border-2 border-[#DDC98E]/60 bg-[rgba(13,53,53,0.45)] p-5">
        <Eyebrow>Your confession this week</Eyebrow>
        <p className="mt-2 font-display text-[22px] font-light">I tell you mine every week. Tell me yours.</p>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">A fantasy, a fear, a moment your body surprised you. One a week.</p>
        <SendToMe item="confession" once={weekOf(todayUK())} notice="This comes to me with no name on it. All of it is welcome." button="Send my confession" />
      </div>
      <GroupLink />
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
    </section>
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
          <GroupLink />
        </div>
      )}
    </div>
  );
}
