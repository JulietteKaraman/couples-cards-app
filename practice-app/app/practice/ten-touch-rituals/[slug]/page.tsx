import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { Blocks } from "@/components/Blocks";

export function generateStaticParams() {
  return tenTouchRituals.entries.map((e) => ({ slug: e.slug }));
}

export default async function RitualEntry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = tenTouchRituals.entries;
  const index = entries.findIndex((e) => e.slug === slug);
  const entry = entries[index];
  if (!entry) notFound();

  const prev = entries[index - 1];
  const next = entries[index + 1];
  const imageFirst = entry.imageSide === "left";

  // "closing" pages (Cards upsell, Meet Juliette, Your Next Yes) are built
  // from several stacked photo+text moments in the deck, not one persistent
  // side photo — so they render as a single content column, with each real
  // photo placed inline via a "image" block, instead of the split hero
  // layout used for a single ritual.
  if (entry.kind === "closing") {
    return (
      <main className="min-h-screen bg-ffy-cream">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <Link
            href="/practice/ten-touch-rituals"
            className="text-sm text-ffy-gold-deep hover:underline"
          >
            ← 10 Touch Rituals
          </Link>

          {entry.eyebrow && (
            <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
              {entry.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
            {entry.title}
          </h1>

          <Blocks blocks={entry.body} />

          <div className="mt-12 flex items-center justify-between border-t border-ffy-border pt-6 text-sm">
            {prev ? (
              <Link
                href={`/practice/ten-touch-rituals/${prev.slug}`}
                className="text-ffy-gold-deep hover:underline"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/practice/ten-touch-rituals/${next.slug}`}
                className="text-ffy-gold-deep hover:underline"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ffy-cream">
      <section
        className={`mx-auto flex max-w-5xl flex-col ${
          imageFirst ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div className="relative h-[46vh] w-full md:h-screen md:w-1/2">
          <Image
            src={entry.image}
            alt={entry.imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-14 md:py-0">
          <Link
            href="/practice/ten-touch-rituals"
            className="text-sm text-ffy-gold-deep hover:underline"
          >
            ← 10 Touch Rituals
          </Link>

          {entry.eyebrow && (
            <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">
              {entry.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
            {entry.title}
          </h1>

          <Blocks blocks={entry.body} />
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl items-center justify-between border-t border-ffy-border px-6 py-6 text-sm md:px-14">
        {prev ? (
          <Link
            href={`/practice/ten-touch-rituals/${prev.slug}`}
            className="text-ffy-gold-deep hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/practice/ten-touch-rituals/${next.slug}`}
            className="text-ffy-gold-deep hover:underline"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
