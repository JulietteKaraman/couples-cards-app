// TEMPORARY, QA ONLY — not gated, not linked from anywhere, deleted
// immediately after visual verification.
import Image from "next/image";
import { Blocks } from "@/components/Blocks";
import { communicationRebootKit, REBOOT_KIT_CARDS } from "@/lib/content/communication-reboot-kit";

function CardPreview() {
  const text = REBOOT_KIT_CARDS[0];
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-[#a88538]/25 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
      <Image src="/reboot-kit/card-template.png" alt="card" width={939} height={1331} priority className="h-auto w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-9" style={{ top: "40%", height: "35%" }}>
        <p className="text-center font-display text-lg font-semibold uppercase leading-snug text-ffy-black sm:text-xl">{text}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 pb-[6%]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ffy-black/40">1 of 46</p>
      </div>
    </div>
  );
}

export default function QaPreviewPage() {
  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="flex justify-center bg-white py-10">
        <CardPreview />
      </div>
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
