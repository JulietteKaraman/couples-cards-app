"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { thirtyOneTouchPoints } from "@/lib/content/31-touch-points";
import { theUnspokenDistance } from "@/lib/content/the-unspoken-distance";
import { whenSheGoesQuiet } from "@/lib/content/when-she-goes-quiet";
import { betweenTouches } from "@/lib/content/between-touches";
import { theSacredNo } from "@/lib/content/the-sacred-no";
import { oneTouch } from "@/lib/content/one-touch";
import { touchMap } from "@/lib/content/touch-map";
import { dayOf } from "@/lib/content/31-touch-points-drip";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs } from "@/lib/entitlements/progress";
import { COLLECTION_DECK_TYPES, PURCHASE_URLS, FREE_DECK_TYPES } from "@/lib/entitlements/config";

// ===========================================================================
// THE HOME, rebuilt dark 24 Oct 2026 (specs/feel-fully-you-app-home.md).
// Juliette: "I love the way that the cards look, so I want to carry this on
// into the other app too." 31 Touch Points leads, because it is where she
// sends almost everyone. The order is: Today (if you own something) or the
// featured 31 Touch Points, then Start free, then Yours, then More ways in.
//
// Everything the old shelf did still happens here: the same purchase URLs,
// the 31 Days Closer pin under 31 Touch Points, interest tracking on tiles
// for things you do not own, Talk to me for Sacred No owners, and the free
// guide routing through sign in. History of each decision is in git (the
// previous page.tsx, commit b398b83 and earlier).
// ===========================================================================

function isFreeCollection(slug: string): boolean {
  return FREE_DECK_TYPES.includes(COLLECTION_DECK_TYPES[slug]);
}

// Tiles show the same photo as each sales page (Juliette, 29 Oct 2026: "make sure all the tiles are the same as the sales pages").
// The in-app hub keeps its own hero; only the tile changes.
const TILE_IMAGE: Record<string, string> = {
  "one-touch": "/offers/sales/one-touch.jpg",
  "the-sacred-no": "/offers/sales/the-sacred-no.jpg",
};
// Where each tile photo sits in its square, so heads are never cut off (Juliette, 30 Oct 2026).
const TILE_POS: Record<string, string> = {
  "/offers/sales/sacred-no-quiz.jpg": "50% 6%",
  "/when-she-goes-quiet/real/hero.jpg": "50% 4%",
  "/offers/sales/repair-kit.jpg": "50% 16%",
  "/how-to-feel-like-a-woman/juliette-boudoir.jpg": "78% 45%",
};
function tileImage(c: { slug: string; heroImage: string }): string {
  return TILE_IMAGE[c.slug] ?? c.heroImage;
}

// Paid collections, in display order. When She Goes Quiet is free and sits
// in Start free. Between Touches is back in Start free (27 Oct 2026, her yes).
const PAID_COLLECTIONS = [thirtyOneTouchPoints, oneTouch, touchMap, theUnspokenDistance, theSacredNo];

// 31 Days Closer lives in the cards app. Pinned under 31 Touch Points
// (Juliette, 30 Sep 2026): a month of touch and a month of conversation.
const CARDS_COMPANION = {
  slug: "31-days-closer",
  title: "31 Days Closer",
  subtitle:
    "The other half of the month. Thirty one conversation prompts, one a day, fifteen minutes each.",
  heroImage: "/offers/sales/31-days-closer.jpg",
  purchaseUrl: "https://feelfullyyou.com/31-days-closer",
  note: "Lives in the cards app · £17",
};

// Juliette, 30 Oct 2026: tapping the black card tile took her (owner of everything)
// to a sales page. Card decks live in the cards app, so a signed-in person goes
// straight there; it shows what they own and offers the rest. The owner gets every
// deck unlocked on that phone.
const CARDS_APP = "https://feelfullyyou.com/my-cards/";
const CARDS_APP_ALL = CARDS_APP + "?unlock=31-days-closer,couples,friends-family,trust-repair,repair-kit,touch-languages,holiday,three-answers,fifteen-after,essence,reconnect,one-touch";

// Offers with no content in this app: they unlock elsewhere (a deck, a code).
const EXTERNAL_OFFERS = [
  {
    slug: "repair-kit",
    title: "The Romantic Relationship Repair Kit",
    subtitle: "31 days, one prompt a day, for couples finding their way back to each other.",
    heroImage: "/offers/sales/repair-kit.jpg",
    purchaseUrl: "https://feelfullyyou.com/romantic-relationship-repair-kit",
    note: "Delivered as a card deck · code by email",
  },
];

// Clicking something you do not own is a real signal of interest
// (9 Aug 2026). Fire and forget, never blocks the link.
function trackInterest(slug?: string, email?: string | null) {
  if (!slug || !email) return;
  fetch("/api/track-interest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, offerSlug: slug }),
  }).catch(() => {});
}

const tileBase =
  "ffy-rise group relative flex items-center gap-4 overflow-hidden rounded-2xl border-[1.5px] border-[rgba(221,201,142,0.55)] bg-[linear-gradient(135deg,rgba(13,53,53,0.55),rgba(254,252,250,0.04))] p-3.5 shadow-[0_0_30px_-18px_rgba(221,201,142,0.6)] transition duration-300 hover:-translate-y-0.5 hover:border-[#DDC98E] sm:p-4";

function Tile({
  href,
  external,
  title,
  subtitle,
  heroImage,
  note,
  imageFit = "cover",
  onClick,
}: {
  href: string;
  external?: boolean;
  title: string;
  subtitle: string;
  heroImage: string;
  note: string;
  imageFit?: "cover" | "contain";
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#0d3535] sm:h-24 sm:w-24">
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="96px"
          className={imageFit === "contain" ? "object-contain p-2" : "object-cover"}
          style={TILE_POS[heroImage] ? { objectPosition: TILE_POS[heroImage] } : undefined}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-normal leading-snug text-ffy-cream">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[rgba(254,252,250,0.78)]">{subtitle}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#DDC98E]">{note}</p>
      </div>
      <span className="text-[#DDC98E] transition group-hover:translate-x-0.5">→</span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={tileBase}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={tileBase}>
      {inner}
    </Link>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4 mt-12">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">{eyebrow}</p>
      <h2 className="font-display mt-1 text-2xl font-light text-ffy-cream">{title}</h2>
    </div>
  );
}

function LibraryContent() {
  const { user, entitledCollections, signOut } = useAuth();
  const [completed, setCompleted] = useState<Record<string, string[]>>({});
  const [loaded, setLoaded] = useState(false);

  const owns = (slug: string) => !!user && entitledCollections.includes(slug);
  const ownedPaid = PAID_COLLECTIONS.filter((c) => owns(c.slug));
  const freeOpen = !!user ? [whenSheGoesQuiet, betweenTouches] : [];
  const progressCollections = [...ownedPaid, ...freeOpen];

  useEffect(() => {
    if (!user || progressCollections.length === 0) return;
    Promise.all(
      progressCollections.map((c) =>
        getCompletedSlugs(user.id, COLLECTION_DECK_TYPES[c.slug]).then((s) => [c.slug, s] as const)
      )
    ).then((r) => {
      setCompleted(Object.fromEntries(r));
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, entitledCollections.join(",")]);

  // Count only real, distinct entries of that collection, so a renamed or
  // repeated entry can never show "37 of 35 done" (30 Oct 2026).
  const doneCount = (slug: string) => {
    const c = [...PAID_COLLECTIONS, whenSheGoesQuiet, betweenTouches].find((x) => x.slug === slug);
    const done = new Set(completed[slug] || []);
    return c ? (c.entries as { slug?: string }[]).filter((e) => !!e.slug && done.has(e.slug)).length || Math.min(done.size, c.entries.length) : done.size;
  };

  // TODAY: 31 Touch Points if owned, otherwise the owned practice with the
  // most progress. Day = days completed + 1, capped at 31.
  const owns31 = owns(thirtyOneTouchPoints.slug);
  const days31 = (completed[thirtyOneTouchPoints.slug] || []).filter((s) => dayOf(s) > 0).length;
  const nextDay = Math.min(31, days31 + 1);
  const finished31 = days31 >= 31;
  const todayOther = !owns31 && ownedPaid.length
    ? [...ownedPaid].sort((a, b) => doneCount(b.slug) - doneCount(a.slug))[0]
    : null;

  // The Communication Reboot Kit is removed for everyone, past buyers included (Juliette, 29 Oct 2026).
  const lockedPaid = PAID_COLLECTIONS.filter((c) => !owns(c.slug) && c.slug !== thirtyOneTouchPoints.slug);

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream">
      <style>{`
        @keyframes ffyRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .ffy-rise { animation: ffyRise .7s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .ffy-rise { animation: none; } }
      `}</style>

      {/* Hero */}
      <section className="relative flex h-[42vh] items-end overflow-hidden md:h-[58vh]">
        <Image src="/app/hero.jpg" alt="Juliette Karaman" fill priority className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-7">
          <h1 className="font-display text-4xl font-light text-ffy-cream sm:text-5xl">The Feel Fully You App</h1>
          <p className="mt-2 text-[#DDC98E]">Your practices, in one place.</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 [background-image:radial-gradient(90%_50%_at_50%_30%,rgba(13,53,53,0.55)_0%,rgba(7,7,7,0)_70%)]">
        {!user && (
          <p className="mb-2 text-sm text-[rgba(254,252,250,0.78)]">
            Already bought something?{" "}
            <Link href="/login" className="text-[#DDC98E] underline underline-offset-4">
              Sign in to open it
            </Link>
          </p>
        )}

        {/* TODAY, for an owner */}
        {owns31 && (
          <Link
            href={`/practice/${thirtyOneTouchPoints.slug}`}
            className="ffy-rise group mt-4 block overflow-hidden rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 shadow-[0_0_70px_-20px_rgba(221,201,142,0.35)] sm:p-8"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">{finished31 ? "Your practice" : "Today"}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-light text-ffy-cream sm:text-3xl">31 Touch Points</h2>
                {!finished31 && (
                  <p className="mt-2 text-sm text-[rgba(254,252,250,0.78)]">One touch point a day. Nothing is lost if you miss one.</p>
                )}
              </div>
              {loaded && !finished31 && (
                <div className="shrink-0 text-right">
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-[rgba(254,252,250,0.78)]">Day</span>
                  <span className="font-display block text-6xl font-light leading-none text-[#DDC98E]">{nextDay}</span>
                </div>
              )}
            </div>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]">
              <div className="h-full rounded-full bg-[#DDC98E] transition-all duration-700" style={{ width: `${(Math.min(days31, 31) / 31) * 100}%` }} />
            </div>
            <span className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707] transition group-hover:bg-[#EEDE80]">
              {finished31 ? "Open 31 Touch Points" : loaded ? `Open day ${nextDay}` : "Carry on"}
            </span>
          </Link>
        )}

        {!owns31 && todayOther && (
          <Link
            href={`/practice/${todayOther.slug}`}
            className="ffy-rise group mt-4 block rounded-3xl border-2 border-[#DDC98E] bg-[rgba(13,53,53,0.6)] p-6 sm:p-8"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Today</p>
            <h2 className="font-display mt-3 text-2xl font-light text-ffy-cream">Carry on with {todayOther.title}</h2>
            <p className="mt-2 text-sm text-[rgba(254,252,250,0.78)]">
              {doneCount(todayOther.slug)} of {todayOther.entries.length} done
            </p>
            <span className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707]">
              Carry on
            </span>
          </Link>
        )}

        {/* FEATURED 31 Touch Points, for everyone who does not own it */}
        {!owns31 && (
          <>
            <a
              href={PURCHASE_URLS[thirtyOneTouchPoints.slug]}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackInterest(thirtyOneTouchPoints.slug, user?.email)}
              className="ffy-rise group relative mt-5 block overflow-hidden rounded-3xl border-2 border-[#DDC98E] bg-[#0b1414] shadow-[0_0_70px_-24px_rgba(221,201,142,0.35)]"
            >
              <div className="relative h-56 overflow-hidden sm:h-72">
                <Image src={thirtyOneTouchPoints.heroImage} alt={thirtyOneTouchPoints.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1414] via-transparent to-transparent" />
              </div>
              <div className="relative -mt-10 p-6 pt-0 sm:p-8 sm:pt-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#DDC98E]">Where most people start</p>
                <h2 className="font-display mt-2 text-3xl font-light text-ffy-cream sm:text-4xl">{thirtyOneTouchPoints.title}</h2>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[rgba(254,252,250,0.82)]">{thirtyOneTouchPoints.subtitle}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[rgba(254,252,250,0.78)]">
                  <span><b className="font-display mr-1 text-2xl font-light text-[#DDC98E]">31</b>days</span>
                  <span><b className="font-display mr-1 text-2xl font-light text-[#DDC98E]">1</b>a day</span>
                  <span className="text-[11px] uppercase tracking-[0.14em]">Buy once, keep it</span>
                </div>
                <span className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-[#DDC98E] px-6 text-[15px] font-medium text-[#070707] transition group-hover:bg-[#EEDE80]">
                  See inside 31 Touch Points
                </span>
              </div>
            </a>
            <div className="mt-3">
              <Tile
                href={CARDS_COMPANION.purchaseUrl}
                external
                title={CARDS_COMPANION.title}
                subtitle={CARDS_COMPANION.subtitle}
                heroImage={CARDS_COMPANION.heroImage}
                note={CARDS_COMPANION.note}
                onClick={() => trackInterest(CARDS_COMPANION.slug, user?.email)}
              />
            </div>
          </>
        )}

        {/* YOURS */}
        {user && (ownedPaid.length > 0 || entitledCollections.includes("how-to-feel-like-a-woman")) && (
          <>
            <SectionHead eyebrow="Yours" title="Your practices" />
            <div className="grid gap-3">
              {ownedPaid.map((c) => (
                <Tile
                  key={c.slug}
                  href={`/practice/${c.slug}`}
                  title={c.title}
                  subtitle={c.subtitle}
                  heroImage={tileImage(c)}
                  note={`${doneCount(c.slug)} of ${c.entries.length} done`}
                />
              ))}
              {owns31 && (
                <Tile
                  href={user?.email?.toLowerCase() === "juliette@feelfullyyou.com" ? CARDS_APP_ALL : CARDS_APP}
                  external
                  title={CARDS_COMPANION.title}
                  subtitle={CARDS_COMPANION.subtitle}
                  heroImage={CARDS_COMPANION.heroImage}
                  note={CARDS_COMPANION.note}
                  onClick={() => trackInterest(CARDS_COMPANION.slug, user?.email)}
                />
              )}
              {entitledCollections.includes("how-to-feel-like-a-woman") && (
                <Tile
                  href="/practice/how-to-feel-like-a-woman"
                  title="How to Feel Like a Woman"
                  subtitle="Your cards, your practices, my voice. New things every week."
                  heroImage="/how-to-feel-like-a-woman/juliette-boudoir.jpg"
                  note="Practice Lab · cards · Scrumptious Confessions"
                />
              )}
              {entitledCollections.includes(theSacredNo.slug) && (
                <Tile
                  href="https://tidycal.com/juliette2/the-touch-reset-call"
                  external
                  title="Talk to me"
                  subtitle="Somewhere in The Sacred No, or through the other side of it? Book a call and we look at where you are and what comes next."
                  heroImage="/offers/talk-to-me.jpg"
                  note="Touch Reset call · book a time"
                />
              )}
            </div>
          </>
        )}

        {/* START FREE */}
        <SectionHead eyebrow="Free" title="Start here" />
        {/* Quiz card = the website pop-up, exactly (Juliette, 30 Oct 2026) */}
        <a
          href="https://feelfullyyou.com/touch-reset-quiz"
          target="_blank"
          rel="noreferrer"
          style={{ maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}
          className="ffy-rise group relative block overflow-hidden rounded-[22px] bg-[#fefcfa] text-center text-[#0D3535] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="relative h-60 sm:h-64">
            <Image src="/offers/touch-reset-quiz-bw-full.jpg" alt="Juliette and Alex, black and white, her eyes closed" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" style={{ objectPosition: "50% 24%" }} />
            <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-b from-transparent to-[#fefcfa]" />
          </div>
          <div className="relative px-6 pb-7 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7a6236]">Free · two minutes</p>
            <h3 className="font-display mt-2 text-[2rem] font-semibold leading-[1.08] text-[#0D3535]">
              Where did
              <em className="block italic text-[#A88538]">the touch go?</em>
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#1c1714]">Sixteen quick taps. Your body answers.</p>
            <span className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-[#0D3535] px-8 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#fefcfa] transition group-hover:bg-[#070707]">
              Take the quiz
            </span>
          </div>
        </a>
        <div className="mt-3 grid gap-3">
          <Tile
            href="https://feelfullyyou.com/sacred-no-quiz"
            external
            title="The Sacred No Quiz"
            subtitle="Are you saying yes when you mean no? Twelve honest questions. Let your body answer first."
            heroImage="/offers/sales/sacred-no-quiz.jpg"
            note="Free"
          />
          <Tile
            href="/practice/touch-base"
            title="Touch Base®, the Anchor"
            subtitle="Two minutes, no equipment. A way back to yourself, anywhere, any time."
            heroImage="/offers/touch-base-logo.png"
            imageFit="contain"
            note="Free practice"
          />
          <Tile
            href={`/practice/${whenSheGoesQuiet.slug}`}
            title={whenSheGoesQuiet.title}
            subtitle={whenSheGoesQuiet.subtitle}
            heroImage={whenSheGoesQuiet.heroImage}
            note={
              user
                ? `Free · ${doneCount(whenSheGoesQuiet.slug)} of ${whenSheGoesQuiet.entries.length} done`
                : "Free · open it now"
            }
          />
          <Tile
            href={`/practice/${betweenTouches.slug}`}
            title={betweenTouches.title}
            subtitle={betweenTouches.subtitle}
            heroImage={betweenTouches.heroImage}
            note={
              user
                ? `Free · ${doneCount(betweenTouches.slug)} of ${betweenTouches.entries.length} done`
                : "Free · open it now"
            }
          />
        </div>

        {/* MORE WAYS IN */}
        {(lockedPaid.length > 0 || EXTERNAL_OFFERS.length > 0 || !entitledCollections.includes("how-to-feel-like-a-woman")) && (
          <>
            <SectionHead eyebrow="When you want more" title="More ways in" />
            <div className="grid gap-3">
              {/* 28 Oct, Juliette: show it to everyone so they can click through and join. */}
              {!entitledCollections.includes("how-to-feel-like-a-woman") && (
                <Tile
                  href={PURCHASE_URLS["how-to-feel-like-a-woman"]}
                  external
                  title="How to Feel Like a Woman"
                  subtitle="For women. Fifteen minutes a day with my voice, a card from me every week, Practice Lab with me three mornings a week."
                  heroImage="/how-to-feel-like-a-woman/juliette-boudoir.jpg"
                  note="Women only · join any time · see what is inside"
                  onClick={() => trackInterest("how-to-feel-like-a-woman", user?.email)}
                />
              )}
              {lockedPaid.map((c) => (
                <Tile
                  key={c.slug}
                  href={PURCHASE_URLS[c.slug]}
                  external
                  title={c.title}
                  subtitle={c.subtitle}
                  heroImage={tileImage(c)}
                  note="Buy once, keep it · see what is inside"
                  onClick={() => trackInterest(c.slug, user?.email)}
                />
              ))}
              {EXTERNAL_OFFERS.map((o) => (
                <Tile
                  key={o.slug}
                  href={user?.email?.toLowerCase() === "juliette@feelfullyyou.com" ? CARDS_APP_ALL : o.purchaseUrl}
                  external
                  title={o.title}
                  subtitle={o.subtitle}
                  heroImage={o.heroImage}
                  note={o.note}
                  onClick={() => trackInterest(o.slug, user?.email)}
                />
              ))}
            </div>
          </>
        )}

        {user && (
          <div className="mt-14 flex items-center justify-between border-t border-[rgba(221,201,142,0.15)] pt-5 text-xs text-[rgba(254,252,250,0.5)]">
            <span className="truncate pr-4">Signed in as {user.email}</span>
            <button onClick={signOut} className="min-h-[44px] shrink-0 text-[#DDC98E] underline underline-offset-4">
              Sign out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// The shelf is public (30 Sep 2026): signed out you can see everything,
// signing in is only needed to OPEN something, gated per collection.
export default function LibraryPage() {
  return <LibraryContent />;
}
