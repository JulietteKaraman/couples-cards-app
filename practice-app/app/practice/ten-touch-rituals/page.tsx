"use client";

import Link from "next/link";
import Image from "next/image";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { CollectionGate } from "@/components/auth/CollectionGate";

// 10 Touch Rituals is back to being a real £7 purchase (27 Aug 2026),
// delivered natively in the app, not a redirect to a flat PDF.
//
// Why not the PDF: the PDF can't play the Trace Ritual or Touch Base's
// videos, a PDF is a static format. The real fix is this native index
// (restored from before 24 Aug's "one hosted copy" experiment) plus the
// per-ritual pages, which carry real Vimeo embeds.
//
// The content below (lib/content/ten-touch-rituals.ts) is a verbatim
// transcription of the live Gamma deck (g_ue6g0xx1slcn9ie), so what
// someone sees here matches what Juliette built in Gamma, images and
// all, not a re-typed or shortened version.
export default function TenTouchRitualsIndex() {
  return (
    <CollectionGate collectionSlug={tenTouchRituals.slug}>
      <TenTouchRitualsIndexContent />
    </CollectionGate>
  );
}

function TenTouchRitualsIndexContent() {
  const { title, subtitle, heroImage, entries } = tenTouchRituals;

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section className="relative flex h-[42vh] items-end overflow-hidden md:h-[52vh]">
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/80 via-ffy-black/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-pale/40 px-4 py-2 text-sm font-medium text-ffy-gold-pale transition hover:bg-white/10">
            ← Your library
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-lg text-ffy-gold-pale">{subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
          Use these in any order, out of order, or one a week
        </p>

        <div className="mt-6 flex flex-col divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
          {entries.map((e) => (
            <Link
              key={e.slug}
              href={`/practice/ten-touch-rituals/${e.slug}`}
              className="group flex items-center gap-4 px-4 py-4 transition hover:bg-ffy-cream-2 sm:px-6"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ffy-cream-2 sm:h-20 sm:w-20">
                {e.image && (
                  <Image
                    src={e.image}
                    alt={e.imageAlt ?? ""}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {e.eyebrow && (
                  <p className="text-xs uppercase tracking-wide text-ffy-gold-deep">
                    {e.eyebrow}
                  </p>
                )}
                <p className="font-display text-lg text-ffy-black group-hover:text-ffy-teal">
                  {e.title}
                </p>
              </div>
              <span className="text-ffy-gold">→</span>
            </Link>
          ))}
        </div>

        <a
          href="https://feelfullyyou.com/downloads/10-touch-rituals.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ffy-gold-deep underline"
        >
          Prefer the PDF? Download your copy →
        </a>
      </div>
    </main>
  );
}
