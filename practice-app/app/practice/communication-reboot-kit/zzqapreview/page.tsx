// TEMPORARY, QA ONLY — not gated, not linked from anywhere, deleted
// immediately after visual verification.
import Image from "next/image";
import { Blocks } from "@/components/Blocks";
import { communicationRebootKit, REBOOT_KIT_CARDS } from "@/lib/content/communication-reboot-kit";

function GoldChevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 110"
      className={`h-14 w-32 ${flip ? "rotate-180" : ""}`}
      fill="none"
      stroke="#a88538"
      strokeWidth={1.75}
    >
      <polyline points="15,8 100,95 185,8" />
      <polyline points="72,50 100,95 128,50" />
    </svg>
  );
}

function CardPreview() {
  const text = REBOOT_KIT_CARDS[0];
  return (
    <div className="flex aspect-[2/3] w-full max-w-xs flex-col overflow-hidden rounded-lg border border-[#a88538]/25 bg-white text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
      <div className="flex w-full flex-col items-center pt-6">
        <GoldChevron />
      </div>
      <div className="w-full bg-ffy-black px-4 py-4">
        <p className="font-display text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-ffy-gold-pale">Communication</p>
        <p className="font-display text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-ffy-gold-pale">&amp; Intimacy</p>
        <p className="mt-1 font-display text-xl font-bold uppercase tracking-[0.15em] text-ffy-gold-pale">Reboot</p>
      </div>
      <div className="flex flex-1 flex-col px-7">
        <p className="mt-10 font-display text-lg font-semibold uppercase leading-snug text-ffy-black sm:text-xl">{text}</p>
        <div className="flex-1" />
        <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-ffy-black/50">feelfullyyou.com</p>
      </div>
      <div className="flex w-full flex-col items-center gap-1 pb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ffy-black/40">1 of 46</p>
        <GoldChevron flip />
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
