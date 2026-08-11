"use client";

import Link from "next/link";
import Image from "next/image";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";
import { CollectionGate } from "@/components/auth/CollectionGate";

export default function CommunicationRebootKitIndex() {
  return (
    <CollectionGate collectionSlug={communicationRebootKit.slug}>
      <CommunicationRebootKitIndexContent />
    </CollectionGate>
  );
}

function CommunicationRebootKitIndexContent() {
  const { title, subtitle, heroImage, entries } = communicationRebootKit;

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section className="relative flex h-[42vh] items-end overflow-hidden md:h-[52vh]">
        <Image src={heroImage} alt={title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/90 via-ffy-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-pale/40 px-4 py-2 text-sm font-medium text-ffy-gold-pale transition hover:bg-white/10">
            ← Your library
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">{title}</h1>
          <p className="mt-2 max-w-lg text-ffy-gold-pale">{subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Tracker and journal are real, persisted, interactive features,
            not reading entries, so they get their own prominent row above
            the reading list rather than being just another Link in the
            entries loop below (spec R6/R7). */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/practice/communication-reboot-kit/tracker"
            className="flex items-center justify-between gap-3 rounded-2xl border border-ffy-gold bg-ffy-teal px-5 py-4 text-ffy-cream transition hover:bg-ffy-teal/90"
          >
            <div>
              <p className="font-display text-lg font-semibold">Your 31-day tracker</p>
              <p className="mt-0.5 text-sm text-ffy-gold-pale">Twice a day, two minutes each</p>
            </div>
            <span className="text-ffy-gold">→</span>
          </Link>
          <Link
            href="/practice/communication-reboot-kit/journal"
            className="flex items-center justify-between gap-3 rounded-2xl border border-ffy-gold bg-ffy-teal px-5 py-4 text-ffy-cream transition hover:bg-ffy-teal/90"
          >
            <div>
              <p className="font-display text-lg font-semibold">Your reflection journal</p>
              <p className="mt-0.5 text-sm text-ffy-gold-pale">Come back to it any time</p>
            </div>
            <span className="text-ffy-gold">→</span>
          </Link>
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
          Read in order, or come back to any part
        </p>

        <div className="mt-6 flex flex-col divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
          {entries.map((e) => (
            <Link
              key={e.slug}
              href={`/practice/communication-reboot-kit/${e.slug}`}
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
