"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { betweenTouches } from "@/lib/content/between-touches";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedSlugs, markComplete } from "@/lib/entitlements/progress";

export default function BetweenTouchesEntry() {
  return (
    <CollectionGate collectionSlug={betweenTouches.slug}>
      <BetweenTouchesEntryContent />
    </CollectionGate>
  );
}

function BetweenTouchesEntryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const dark = betweenTouches.theme === "dark";

  const entries = betweenTouches.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  useEffect(() => {
    if (!user || !entry || entry.kind !== "ritual") return;
    getCompletedSlugs(user.id, "between-touches").then((slugs) =>
      setCompleted(slugs.includes(entry.slug))
    );
  }, [user, entry]);

  if (!entry) notFound();

  async function handleMarkComplete() {
    if (!user || !entry) return;
    await markComplete(user.id, "between-touches", entry.slug);
    setCompleted(true);
  }

  const prev = entries[index - 1];
  const next = entries[index + 1];

  const markCompleteBlock =
    entry.kind === "ritual" ? (
      <div className="mt-8">
        {completed ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-ffy-gold px-5 py-2.5 font-display text-sm font-medium text-ffy-black">
            ✓ Marked done
          </p>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="rounded-full border border-ffy-gold px-5 py-2.5 font-display text-sm font-medium text-ffy-gold-pale transition hover:bg-ffy-gold hover:text-ffy-black"
          >
            Mark this one done
          </button>
        )}
      </div>
    ) : null;

  const navRow = (
    <div
      className={`mx-auto mt-12 flex max-w-2xl items-center justify-between border-t px-6 py-6 text-sm ${
        dark ? "border-ffy-gold/20" : "border-ffy-border"
      }`}
    >
      {prev ? (
        <Link
          href={`/practice/between-touches/${prev.slug}`}
          className={dark ? "text-ffy-gold-pale hover:underline" : "text-ffy-gold-deep hover:underline"}
        >
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/practice/between-touches/${next.slug}`}
          className={dark ? "text-ffy-gold-pale hover:underline" : "text-ffy-gold-deep hover:underline"}
        >
          {next.title} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );

  // Editorial layout, matching the deck's own presentation: a full-width
  // photo at the top, then one flowing column of content below — not a
  // 50/50 split screen. Same shape for every entry kind (the "closing"
  // entries don't need a separate treatment here, they read the same way).
  return (
    <main className={dark ? "min-h-screen bg-ffy-black" : "min-h-screen bg-ffy-cream"}>
      {entry.image && (
        <div
          className={`relative h-[42vh] w-full overflow-hidden sm:h-[56vh] ${
            entry.imageFocus === "top" ? (dark ? "bg-ffy-black" : "bg-ffy-cream") : ""
          }`}
        >
          <Image
            src={entry.image}
            alt={entry.imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={entry.imageFocus === "top" ? "object-contain" : "object-cover"}
          />
          {dark && entry.imageFocus !== "top" && (
            <div className="absolute inset-0 bg-gradient-to-t from-ffy-black via-ffy-black/10 to-transparent" />
          )}
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 pb-14 pt-10">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${dark ? "border-ffy-gold-pale/40 text-ffy-gold-pale hover:bg-white/5" : "border-ffy-gold-deep/40 text-ffy-gold-deep hover:bg-ffy-gold-deep/5"}`}
        >
          ← Your library
        </Link>

        {entry.eyebrow && (
          <p className={`mt-6 text-xs uppercase tracking-[0.15em] ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
            {entry.eyebrow}
          </p>
        )}
        <h1
          className={`mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl ${
            dark ? "text-ffy-cream" : "text-ffy-teal"
          }`}
        >
          {entry.title}
        </h1>

        <Blocks blocks={entry.body} dark={dark} />
        {markCompleteBlock}
      </div>

      {navRow}
    </main>
  );
}
