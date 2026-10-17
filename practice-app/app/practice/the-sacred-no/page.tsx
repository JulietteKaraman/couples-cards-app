"use client";

import Link from "next/link";
import Image from "next/image";
import { theSacredNo } from "@/lib/content/the-sacred-no";
import { useEffect, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedWithTimes } from "@/lib/entitlements/progress";
import { adminBypassActive, whenItOpens } from "@/lib/content/31-touch-points-drip";
import { computeSacredNoDrip, snDayOf, snMovesClock } from "@/lib/content/the-sacred-no-drip";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// The Sacred No, 17 Oct 2026 (specs/sacred-no-in-app.md). Seven days, opened
// one at a time once the day's lesson is marked done, the same rule as
// 31 Touch Points. Locked days are listed so a buyer sees the whole shape.
export default function TheSacredNoIndex() {
  return (
    <CollectionGate collectionSlug={theSacredNo.slug}>
      <TheSacredNoIndexContent />
    </CollectionGate>
  );
}

function TheSacredNoIndexContent() {
  const { title, subtitle, heroImage, entries } = theSacredNo;
  const { user } = useAuth();
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    getCompletedWithTimes(user.id, "sacred-no").then((rows) => {
      setDoneSlugs(rows.map((r) => r.slug));
      const times = rows.filter((r) => snMovesClock(r.slug) && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user]);

  const { unlockedThrough, dueAt } = computeSacredNoDrip({
    doneSlugs: doneSlugs ?? [],
    lastDone,
    now,
  });
  const isAdmin = adminBypassActive(user?.email, ADMIN_EMAIL);
  const isLocked = (slug: string) =>
    !isAdmin && doneSlugs !== null && snDayOf(slug) > unlockedThrough;

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section className="relative flex h-[42vh] items-end overflow-hidden md:h-[52vh]">
        <Image src={heroImage} alt={title} fill priority className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/90 via-ffy-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-pale/50 bg-ffy-black/50 px-4 py-2 text-sm font-medium text-ffy-gold-pale backdrop-blur-sm transition hover:bg-ffy-black/70">
            ← Your library
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">{title}</h1>
          <p className="mt-2 max-w-lg text-ffy-gold-pale">{subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
          One day at a time. Mark each lesson done and the next day opens tomorrow
        </p>

        <div className="mt-6 flex flex-col divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
          {entries.map((e) =>
            isLocked(e.slug) ? (
              <div key={e.slug} className="flex items-center gap-4 px-4 py-4 opacity-60 sm:px-6">
                <div className="min-w-0 flex-1">
                  {e.eyebrow && (
                    <p className="text-xs uppercase tracking-wide text-ffy-gold-deep">{e.eyebrow}</p>
                  )}
                  <p className="font-display text-lg text-ffy-black">{e.title}</p>
                  <p className="mt-0.5 text-xs text-ffy-brown">
                    {snDayOf(e.slug) === unlockedThrough + 1 && dueAt
                      ? `Opens ${whenItOpens(dueAt)}`
                      : `Opens after day ${snDayOf(e.slug) - 1}`}
                  </p>
                </div>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-ffy-gold-deep" fill="none" stroke="currentColor" strokeWidth={2} aria-label="Locked">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </div>
            ) : (
            <Link
              key={e.slug}
              href={`/practice/the-sacred-no/${e.slug}`}
              className="group flex items-center gap-4 px-4 py-4 transition hover:bg-ffy-cream-2 sm:px-6"
            >
              <div className="min-w-0 flex-1">
                {e.eyebrow && (
                  <p className="text-xs uppercase tracking-wide text-ffy-gold-deep">{e.eyebrow}</p>
                )}
                <p className="font-display text-lg text-ffy-black group-hover:text-ffy-teal">{e.title}</p>
              </div>
              <span className="text-ffy-gold">→</span>
            </Link>
            )
          )}
        </div>
      </div>
    </main>
  );
}
