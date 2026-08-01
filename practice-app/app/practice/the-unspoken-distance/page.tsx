"use client";

import Link from "next/link";
import Image from "next/image";
import { theUnspokenDistance } from "@/lib/content/the-unspoken-distance";
import { CollectionGate } from "@/components/auth/CollectionGate";

export default function TheUnspokenDistanceIndex() {
  return (
    <CollectionGate collectionSlug={theUnspokenDistance.slug}>
      <TheUnspokenDistanceIndexContent />
    </CollectionGate>
  );
}

function TheUnspokenDistanceIndexContent() {
  const { title, subtitle, heroImage, entries } = theUnspokenDistance;

  const dark = theUnspokenDistance.theme === "dark";

  return (
    <main className={dark ? "min-h-screen bg-ffy-black" : "min-h-screen bg-ffy-cream"}>
      <section className="relative flex h-[42vh] items-end overflow-hidden md:h-[52vh]">
        <Image
          src={heroImage}
          alt="The Unspoken Distance"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/90 via-ffy-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-10">
          <Link href="/" className="text-sm text-ffy-gold-pale hover:underline">
            ← Your library
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-lg text-ffy-gold-pale">{subtitle}</p>
        </div>
      </section>

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
              href={`/practice/the-unspoken-distance/${e.slug}`}
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
