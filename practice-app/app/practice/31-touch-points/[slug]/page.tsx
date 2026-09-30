"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { thirtyOneTouchPoints } from "@/lib/content/31-touch-points";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs, markComplete } from "@/lib/entitlements/progress";

export default function TouchPointEntry() {
  return (
    <CollectionGate collectionSlug={thirtyOneTouchPoints.slug}>
      <TouchPointEntryContent />
    </CollectionGate>
  );
}

function TouchPointEntryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);

  const entries = thirtyOneTouchPoints.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  useEffect(() => {
    if (!user || !entry) return;
    getCompletedSlugs(user.id, "31-touch-points").then((slugs) => {
      setDoneSlugs(slugs);
      setCompleted(slugs.includes(entry.slug));
    });
  }, [user, entry]);

  if (!entry) notFound();

  async function handleMarkComplete() {
    if (!user || !entry) return;
    await markComplete(user.id, "31-touch-points", entry.slug);
    setCompleted(true);
    setDoneSlugs((prev) => (prev && prev.includes(entry.slug) ? prev : [...(prev ?? []), entry.slug]));
  }

  // ONE DAY AT A TIME. Juliette, 30 Sep: "we had decided that it would only
  // open day by day". `unlockMode: "sequential"` on the collection is only a
  // string and nothing in the app ever read it, so every day was reachable
  // by prev/next or by typing the URL. This is the real gate.
  //
  // The three essays are always open, and so is day 1. Day N opens once day
  // N-1 has been marked done. That matches what she says in The Container
  // recording: "if you skip a day, it doesn't matter, it will be there for
  // you the next time you come back to the app."
  const dayOf = (sl: string) => {
    const m = sl.match(/^day-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const done = doneSlugs ?? [];
  let unlockedThrough = 1;
  while (unlockedThrough <= 31) {
    const e = entries.find((x) => dayOf(x.slug) === unlockedThrough);
    if (e && done.includes(e.slug)) unlockedThrough += 1;
    else break;
  }
  const thisDay = dayOf(entry.slug);
  // doneSlugs === null means progress has not loaded yet: never flash a lock.
  const locked = doneSlugs !== null && thisDay > unlockedThrough;
  const lastOpen = entries.find((x) => dayOf(x.slug) === unlockedThrough);

  const prev = entries[index - 1];
  const nextRaw = entries[index + 1];
  const next = nextRaw && dayOf(nextRaw.slug) > unlockedThrough ? undefined : nextRaw;

  if (locked) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">Not yet</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ffy-teal">
          {entry.title} opens after day {thisDay - 1}
        </h1>
        <p className="mt-5 text-ffy-black/70">
          One day at a time, on purpose. A month you can finish teaches your body far more than a
          month you read in one sitting.
        </p>
        <p className="mt-3 text-ffy-black/70">
          Nothing is lost if you miss a day. It waits for you.
        </p>
        {lastOpen && (
          <Link
            href={`/practice/31-touch-points/${lastOpen.slug}`}
            className="mt-8 inline-block rounded-full bg-ffy-gold px-6 py-3 font-display text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to {lastOpen.title}
          </Link>
        )}
      </main>
    );
  }
  const imageFirst = entry.imageSide === "left";

  const markCompleteBlock =
    entry.kind === "ritual" ? (
      <div className="mt-8">
        {completed ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-ffy-teal px-5 py-2.5 font-display text-sm font-medium text-ffy-cream">
            ✓ Marked done
          </p>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="rounded-full border border-ffy-gold px-5 py-2.5 font-display text-sm font-medium text-ffy-teal transition hover:bg-ffy-gold hover:text-ffy-cream"
          >
            Mark this one done
          </button>
        )}
      </div>
    ) : null;

  // "closing" pages (Cards upsell, Meet Juliette, Your Next Yes) are built
  // from several stacked photo+text moments in the deck, not one persistent
  // side photo — so they render as a single content column, with each real
  // photo placed inline via a "image" block, instead of the split hero
  // layout used for a single ritual.
  if (entry.kind === "closing") {
    return (
      <main className="min-h-screen bg-ffy-cream">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
          >
            ← Your library
          </Link>

          {entry.eyebrow && (
            <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
              {entry.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
            {entry.title}
          </h1>

          <Blocks blocks={entry.body} />

          <div className="mt-12 flex items-center justify-between border-t border-ffy-border pt-6 text-sm">
            {prev ? (
              <Link
                href={`/practice/31-touch-points/${prev.slug}`}
                className="text-ffy-gold-deep hover:underline"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/practice/31-touch-points/${next.slug}`}
                className="text-ffy-gold-deep hover:underline"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section
        className={`mx-auto flex max-w-5xl flex-col ${
          imageFirst ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {entry.image && (
          <div className="relative h-[46vh] w-full md:h-screen md:w-1/2">
            <Image
              src={entry.image}
              alt={entry.imageAlt ?? ""}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className={entry.imageFocus === "top" ? "object-cover object-[center_20%]" : "object-cover"}
            />
          </div>
        )}

        <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-14 md:py-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
          >
            ← Your library
          </Link>

          {entry.eyebrow && (
            <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
              {entry.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
            {entry.title}
          </h1>

          <Blocks blocks={entry.body} />
          {markCompleteBlock}
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl items-center justify-between border-t border-ffy-border px-6 py-6 text-sm md:px-14">
        {prev ? (
          <Link
            href={`/practice/31-touch-points/${prev.slug}`}
            className="text-ffy-gold-deep hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/practice/31-touch-points/${next.slug}`}
            className="text-ffy-gold-deep hover:underline"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
