// TEMPORARY, QA ONLY.
import Image from "next/image";
import { REBOOT_KIT_CARDS, RebootCard } from "@/lib/content/communication-reboot-kit";

function Card({ card, index, total }: { card: RebootCard; index: number; total: number }) {
  const isSplit = typeof card !== "string";
  return (
    <>
      <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-[#a88538]/25 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]">
        <Image src="/reboot-kit/card-template.png" alt="card" width={939} height={1331} priority className="h-auto w-full" />
        <div className="absolute inset-x-0 flex flex-col items-center gap-4 px-9" style={{ top: "38%", height: "40%" }}>
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
            {isSplit ? (
              <>
                <p className="text-center font-display text-[0.95rem] font-semibold uppercase leading-snug text-ffy-black sm:text-base">{card.main}</p>
                <p className="text-center font-display text-[0.95rem] font-normal uppercase leading-snug text-ffy-black sm:text-base">{card.secondary}</p>
              </>
            ) : (
              <p className="text-center font-display text-[0.95rem] font-normal uppercase leading-snug text-ffy-black sm:text-base">{card}</p>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-ffy-black/45">feelfullyyou.com</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ffy-black/40">{index + 1} of {total}</p>
    </>
  );
}

export default function QaPreviewPage() {
  return (
    <main className="flex min-h-screen flex-wrap items-start justify-center gap-10 bg-ffy-cream px-6 py-10">
      {REBOOT_KIT_CARDS.map((c, i) => (
        <Card key={i} card={c} index={i} total={REBOOT_KIT_CARDS.length} />
      ))}
    </main>
  );
}
