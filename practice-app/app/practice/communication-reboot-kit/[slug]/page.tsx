"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";
import { Blocks } from "@/components/Blocks";
import { CollectionGate } from "@/components/auth/CollectionGate";

export default function RebootKitEntry() {
  return (
    <CollectionGate collectionSlug={communicationRebootKit.slug}>
      <RebootKitEntryContent />
    </CollectionGate>
  );
}

function RebootKitEntryContent() {
  const params = useParams();
  const slug = params.slug as string;

  const entries = communicationRebootKit.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];

  if (!entry) notFound();

  const prev = entries[index - 1];
  const next = entries[index + 1];

  // Editorial layout matching The Unspoken Distance's own entry template
  // (app/practice/the-unspoken-distance/[slug]/page.tsx): a full-width
  // photo at the top, then the content below. This was MISSING here until
  // 12 Aug 2026 — entry.image was set on every entry but this page never
  // rendered it, so none of the real per-page photography ever showed on
  // the actual live page. Caught only because Juliette sent screenshots of
  // the real, live, rendered pages and none of them had a photo on them.
  return (
    <main className="min-h-screen bg-ffy-cream">
      {entry.image && (
        <div className="relative h-[42vh] w-full overflow-hidden sm:h-[56vh]">
          <Image src={entry.image} alt={entry.imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 pb-14 pt-10">
        <Link
          href="/practice/communication-reboot-kit"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← The Communication Reboot Kit
        </Link>

        {entry.eyebrow && (
          <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">{entry.eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
          {entry.title}
        </h1>

        <Blocks blocks={entry.body} />
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between border-t border-ffy-border px-6 py-6 text-sm">
        {prev ? (
          <Link href={`/practice/communication-reboot-kit/${prev.slug}`} className="text-ffy-gold-deep hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/practice/communication-reboot-kit/${next.slug}`} className="text-ffy-gold-deep hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
