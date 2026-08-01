"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { theUnspokenDistance } from "@/lib/content/the-unspoken-distance";
import { whenSheGoesQuiet } from "@/lib/content/when-she-goes-quiet";
import { betweenTouches } from "@/lib/content/between-touches";
import { CARDS_TASTER_COVER } from "@/lib/content/cards-taster";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs } from "@/lib/entitlements/progress";
import { COLLECTION_DECK_TYPES, PURCHASE_URLS, FREE_DECK_TYPES } from "@/lib/entitlements/config";

// A collection is "free" if its deck_type is in FREE_DECK_TYPES — these
// always render unlocked, even in the split second before (or if)
// ensure-free-access's grant lands, so a timing hiccup or dropped request
// never shows a free guide behind a paywall-looking locked tile.
function isFreeCollection(slug: string): boolean {
  return FREE_DECK_TYPES.includes(COLLECTION_DECK_TYPES[slug]);
}

// Every collection this app can show, in display order. Adding a new
// product means adding one line here (plus its deck_type in
// entitlements/config.ts) — no other change to this page. Every entry
// shows, always — owned/free ones open, everything else shows locked with
// a "Get access" link out to the real sales page (spec: the library is
// the cross-sell surface between products, not just a delivery box for
// what's already been bought — Juliette, 1 Aug 2026).
const ALL_COLLECTIONS = [tenTouchRituals, theUnspokenDistance, whenSheGoesQuiet, betweenTouches];

// Offers that never live inside this app at all (no PracticeCollection,
// no deck_type, nothing to unlock here) but that Juliette wants
// discoverable from the library anyway, always shown locked, always
// pointing at the real sales page. Not the same as a locked ALL_COLLECTIONS
// tile, which unlocks in-app once owned — these never unlock here, the
// product experience itself lives elsewhere (the cards app, a course).
//
// Repair Kit: purchaseUrl is the real sales page with checkout, NOT
// cards.feelfullyyou.com/app/repair-kit/unlock — that second URL is the
// POST-purchase code-redeem screen (confirmed live 1 Aug 2026, it's a
// sign-in wall, not a way to buy), so it would dead-end anyone who
// doesn't already own it. Juliette asked for the unlock URL specifically;
// swapped for the real purchase path so the tile actually converts.
const EXTERNAL_OFFERS = [
  {
    slug: "repair-kit",
    title: "The Romantic Relationship Repair Kit",
    subtitle: "31 days, one prompt a day, for couples finding their way back to each other.",
    heroImage: "/offers/repair-kit-cover.png",
    purchaseUrl: "https://feelfullyyou.com/romantic-relationship-repair-kit",
  },
  {
    slug: "one-touch",
    title: "One Touch",
    subtitle: "Seven days, self-paced. The Touch Reset course.",
    heroImage: "/offers/one-touch-hero.jpg",
    purchaseUrl: "https://feelfullyyou.com/one-touch",
  },
];

function LockedOfferTile({
  title,
  subtitle,
  heroImage,
  purchaseUrl,
}: {
  title: string;
  subtitle: string;
  heroImage: string;
  purchaseUrl: string;
}) {
  // Shown, not hidden — this tile IS the cross-sell. Dimmed photo, lock
  // badge, and a real link out to the sales page, never a click into
  // content that isn't there.
  return (
    <a
      href={purchaseUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-ffy-border bg-white/60 p-4 opacity-80 transition hover:border-ffy-gold hover:opacity-100 sm:p-5"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <Image src={heroImage} alt={title} fill sizes="96px" className="object-cover grayscale" />
        <div className="absolute inset-0 flex items-center justify-center bg-ffy-black/45">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-ffy-cream" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-xl font-semibold text-ffy-black">{title}</h2>
        <p className="mt-1 text-sm text-ffy-brown">{subtitle}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ffy-gold-deep">
          Not yet on your account · Get access
        </p>
      </div>
      <span className="text-ffy-gold">→</span>
    </a>
  );
}

function LibraryContent() {
  const { user, entitledCollections, signOut } = useAuth();
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({});

  const unlockedCollections = ALL_COLLECTIONS.filter(
    (c) => entitledCollections.includes(c.slug) || isFreeCollection(c.slug)
  );

  useEffect(() => {
    if (!user || unlockedCollections.length === 0) return;
    Promise.all(
      unlockedCollections.map((c) =>
        getCompletedSlugs(user.id, COLLECTION_DECK_TYPES[c.slug]).then(
          (slugs) => [c.slug, slugs.length] as const
        )
      )
    ).then((results) => setCompletedCounts(Object.fromEntries(results)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, entitledCollections.join(",")]);

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section className="relative flex h-[36vh] items-end overflow-hidden md:h-[46vh]">
        <Image
          src="/app/hero.jpg"
          alt="Juliette Karaman"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/80 via-ffy-black/10 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-8">
          <h1 className="font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">
            The Feel Fully You App
          </h1>
          <p className="mt-2 text-ffy-gold-pale">The Practice, your rituals, in one place.</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between text-sm text-ffy-brown">
          <span>Signed in as {user?.email}</span>
          <button onClick={signOut} className="text-ffy-gold-deep underline">
            Sign out
          </button>
        </div>

        <div className="grid gap-5">
          {ALL_COLLECTIONS.map((c) => {
            const unlocked = entitledCollections.includes(c.slug) || isFreeCollection(c.slug);

            if (unlocked) {
              return (
                <Link
                  key={c.slug}
                  href={`/practice/${c.slug}`}
                  className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-ffy-border bg-white/60 p-4 transition hover:border-ffy-gold sm:p-5"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                    <Image
                      src={c.heroImage}
                      alt={c.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-semibold text-ffy-black group-hover:text-ffy-teal">
                      {c.title}
                    </h2>
                    <p className="mt-1 text-sm text-ffy-brown">{c.subtitle}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-ffy-gold-deep">
                      {completedCounts[c.slug] ?? 0} of {c.entries.length} done
                    </p>
                  </div>
                  <span className="text-ffy-gold">→</span>
                </Link>
              );
            }

            return (
              <LockedOfferTile
                key={c.slug}
                title={c.title}
                subtitle={c.subtitle}
                heroImage={c.heroImage}
                purchaseUrl={PURCHASE_URLS[c.slug]}
              />
            );
          })}

          {/* The Cards taster isn't a linear guide (PracticeCollection),
              it's a draw-one-at-a-time mini-experience, so it's not in
              ALL_COLLECTIONS — always free, always unlocked, no progress
              count, its own route. See lib/content/cards-taster.ts. */}
          <Link
            href="/practice/cards-taster"
            className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-ffy-border bg-white/60 p-4 transition hover:border-ffy-gold sm:p-5"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
              <Image
                src={CARDS_TASTER_COVER}
                alt="Intimacy and Communication Cards, Taster"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-semibold text-ffy-black group-hover:text-ffy-teal">
                The Intimacy and Communication Cards
              </h2>
              <p className="mt-1 text-sm text-ffy-brown">Five free cards from the deck. Pull one, read it aloud.</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-ffy-gold-deep">Free taster</p>
            </div>
            <span className="text-ffy-gold">→</span>
          </Link>

          {/* Touch Base® — same shape as the Cards taster tile: one free
              standalone practice, not a PracticeCollection, its own route. */}
          <Link
            href="/practice/touch-base"
            className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-ffy-border bg-white/60 p-4 transition hover:border-ffy-gold sm:p-5"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24">
              <Image
                src="/offers/touch-base-logo.png"
                alt="Touch Base® Anchor"
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-semibold text-ffy-black group-hover:text-ffy-teal">
                Touch Base®, the Anchor
              </h2>
              <p className="mt-1 text-sm text-ffy-brown">Two minutes, no equipment. A way back to yourself, anywhere, any time.</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-ffy-gold-deep">Free practice</p>
            </div>
            <span className="text-ffy-gold">→</span>
          </Link>

          {/* Offers with no in-app content at all (Repair Kit, One Touch) —
              always locked, always pointing out to the real sales page.
              See EXTERNAL_OFFERS above for why each purchaseUrl is what
              it is. */}
          {EXTERNAL_OFFERS.map((o) => (
            <LockedOfferTile
              key={o.slug}
              title={o.title}
              subtitle={o.subtitle}
              heroImage={o.heroImage}
              purchaseUrl={o.purchaseUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}
