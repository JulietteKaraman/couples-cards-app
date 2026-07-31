"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs } from "@/lib/entitlements/progress";

function LibraryContent() {
  const { user, entitledCollections, signOut } = useAuth();
  const [completedCount, setCompletedCount] = useState<number | null>(null);

  const owns = entitledCollections.includes(tenTouchRituals.slug);

  useEffect(() => {
    if (!user || !owns) return;
    getCompletedSlugs(user.id, "ten-touch-rituals").then((slugs) =>
      setCompletedCount(slugs.length)
    );
  }, [user, owns]);

  const collections = owns ? [tenTouchRituals] : [];

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section className="relative flex h-[36vh] items-end overflow-hidden md:h-[46vh]">
        <Image
          src="/rituals/hero.png"
          alt="The Feel Fully You App"
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
                    {completedCount ?? 0} of {c.entries.length} done
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
