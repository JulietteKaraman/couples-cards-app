// TEMPORARY, QA ONLY — not gated, not linked from anywhere, deleted
// immediately after visual verification. Renders the real per-entry
// template (image banner + Blocks) against the real content so this can
// actually be checked by eye, not just typechecked.
import Image from "next/image";
import { Blocks } from "@/components/Blocks";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";

export default function QaPreviewPage() {
  return (
    <main className="min-h-screen bg-ffy-cream">
      {communicationRebootKit.entries.map((entry) => (
        <div key={entry.slug} className="border-b-8 border-ffy-black">
          {entry.image && (
            <div className="relative h-[42vh] w-full overflow-hidden sm:h-[56vh]">
              <Image src={entry.image} alt={entry.imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
            </div>
          )}
          <div className="mx-auto max-w-2xl px-6 pb-14 pt-10">
            {entry.eyebrow && (
              <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">{entry.eyebrow}</p>
            )}
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
              {entry.title}
            </h1>
            <Blocks blocks={entry.body} />
          </div>
        </div>
      ))}
    </main>
  );
}
