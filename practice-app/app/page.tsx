import Link from "next/link";
import Image from "next/image";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";

/**
 * LOCAL PREVIEW ONLY — this stands in for R1/R2 (real Supabase accounts +
 * an entitlement-filtered library) so the reading/watching experience can
 * be seen and approved before live accounts, Stripe entitlement sync, and
 * Supabase are wired in. Not a real login. See NOT COVERED in the build
 * coverage report.
 */
export default function LibraryPreview() {
  const collections = [tenTouchRituals];

  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="bg-ffy-cream-2 px-4 py-2 text-center text-xs text-ffy-brown">
        Local preview, not yet connected to real accounts or purchases
      </div>

      <section className="relative flex h-[36vh] items-end overflow-hidden md:h-[46vh]">
        <Image
          src="/rituals/hero.png"
          alt="The Feel Fully You App"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ffy-black/80 via-ffy-black/10 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-8">
          <h1 className="font-display text-4xl font-semibold text-ffy-cream sm:text-5xl">
            The Feel Fully You App
          </h1>
          <p className="mt-2 text-ffy-gold-pale">The Practice, your rituals, in one place.</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="grid gap-5">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/practice/${c.slug}`}
              className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-ffy-border bg-white/60 p-4 transition hover:border-ffy-gold sm:p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                <Image
                  src={c.heroImage}
                  alt={c.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-semibold text-ffy-black group-hover:text-ffy-teal">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm text-ffy-brown">{c.subtitle}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-ffy-gold-deep">
                  {c.entries.length} entries · browse in any order
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
