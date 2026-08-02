"use client";

import Link from "next/link";
import Image from "next/image";
import { betweenTouches } from "@/lib/content/between-touches";
import { CollectionGate } from "@/components/auth/CollectionGate";

export default function BetweenTouchesIndex() {
  return (
    <CollectionGate collectionSlug={betweenTouches.slug}>
      <BetweenTouchesIndexContent />
    </CollectionGate>
  );
}

function BetweenTouchesIndexContent() {
  const { title, subtitle, heroImage, entries } = betweenTouches;

  const dark = betweenTouches.theme === "dark";

  return (
    <main className={dark ? "min-h-screen bg-ffy-black" : "min-h-screen bg-ffy-cream"}>
      {/* This cover already has the title, subtitle, and byline designed
          into the image itself (a book-cover graphic, not a mood photo),
          so it renders object-contain at full width instead of the
          object-cover crop every other guide's plain background photo
          uses — cropping this one cut the baked-in title off at both
          edges. No separate live heading either, it would just repeat
          what the cover already says. */}
      <div className={`relative w-full overflow-hidden ${dark ? "bg-ffy-black" : "bg-ffy-cream"}`}>
        <Image
          src={heroImage}
          alt={`${title} — ${subtitle}`}
          width={1600}
          height={1258}
          priority
          className="h-auto w-full"
        />
        <div className="absolute left-0 top-0 p-4">
          <Link
            href="/"
            className={`text-sm hover:underline ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
          >
            ← Your library
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className={`text-xs uppercase tracking-[0.15em] ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
          Read in order, or come back to any part
        </p>

        <div
          className={
            dark
              ? "mt-6 flex flex-col divide-y divide-ffy-gold/20 overflow-hidden rounded-2xl border border-ffy-gold/30 bg-white/5"
              : "mt-6 flex flex-col divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60"
          }
        >
          {entries.map((e) => (
            <Link
              key={e.slug}
              href={`/practice/between-touches/${e.slug}`}
              className={`group flex items-center gap-4 px-4 py-4 transition sm:px-6 ${
                dark ? "hover:bg-white/5" : "hover:bg-ffy-cream-2"
              }`}
            >
              {e.image && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                  <Image
                    src={e.image}
                    alt={e.imageAlt ?? ""}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {e.eyebrow && (
                  <p className={`text-xs uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
                    {e.eyebrow}
                  </p>
                )}
                <p
                  className={`font-display text-lg ${
                    dark ? "text-ffy-cream group-hover:text-ffy-gold-pale" : "text-ffy-black group-hover:text-ffy-teal"
                  }`}
                >
                  {e.title}
                </p>
              </div>
              <span className="text-ffy-gold">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
