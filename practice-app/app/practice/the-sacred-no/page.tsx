"use client";

import Link from "next/link";
import Image from "next/image";
import { theSacredNo } from "@/lib/content/the-sacred-no";
import { CollectionGate } from "@/components/auth/CollectionGate";

// The Sacred No, 17 Oct 2026 (specs/sacred-no-in-app.md R1/R3). A plain
// free-browse list, same shape as the other non-drip guides: every video is
// open as soon as the buyer has access, no pacing, no unlock clock.
export default function TheSacredNoIndex() {
  return (
    <CollectionGate collectionSlug={theSacredNo.slug}>
      <TheSacredNoIndexContent />
    </CollectionGate>
  );
}

function TheSacredNoIndexContent() {
  const { title, subtitle, heroImage, entries } = theSacredNo;

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
          Watch in order, or come back to any part
        </p>

        <div className="mt-6 flex flex-col divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
          {entries.map((e) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}
