"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { theUnspokenDistance } from "@/lib/content/the-unspoken-distance";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs } from "@/lib/entitlements/progress";
import { COLLECTION_DECK_TYPES } from "@/lib/entitlements/config";

// Every collection this app can show, in display order. Adding a new
// product means adding one line here (plus its deck_type in
// entitlements/config.ts) — no other change to this page.
const ALL_COLLECTIONS = [tenTouchRituals, theUnspokenDistance];

function LibraryContent() {
  const { user, entitledCollections, signOut } = useAuth();
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({});

  const collections = ALL_COLLECTIONS.filter((c) =>
    entitledCollections.includes(c.slug)
  );

  useEffect(() => {
    if (!user || collections.length === 0) return;
    Promise.all(
      collections.map((c) =>
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

        {collections.length === 0 ? (
          <div className="rounded-2xl border border-ffy-border bg-white/60 p-8 text-center">
            <p className="font-display text-lg text-ffy-teal">
              Nothing here yet.
            </p>
            <p className="mt-2 text-sm text-ffy-brown">
              This account isn&rsquo;t showing any purchases yet. If you
              believe that&rsquo;s wrong, email{" "}
              <a href="mailto:support@feelfullyyou.com" className="underline">
                support@feelfullyyou.com
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {collections.map((c) => (
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
            ))}
          </div>
        )}
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
