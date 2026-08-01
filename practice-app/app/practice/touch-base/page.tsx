"use client";

// Touch Base® Anchor — the practice Juliette teaches every single client,
// and the foundation under everything else in the app (Distance, Between
// Touches, and the Rituals all lean on it). Standalone here on purpose:
// it's one two-minute practice, not a multi-entry guide, so it gets its
// own light single page instead of being forced into the PracticeCollection
// model. Not gated — same frictionless, no-login-needed spirit as the
// marketing site's own free version and the cards taster.
//
// Video is the real one from feelfullyyou.com/touch-base-anchor
// (YouTube, not Vimeo, so this doesn't use the shared "video" ContentBlock,
// which is Vimeo-only) — embedded directly here since this is a one-off
// standalone page, not a recurring block kind.

import Link from "next/link";

export default function TouchBasePage() {
  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/" className="text-sm text-ffy-gold-deep hover:underline">
          ← Your library
        </Link>

        <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">Free practice</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
          Touch Base®, the Anchor
        </h1>
        <p className="mt-3 text-lg text-ffy-brown">A tiny gesture. A massive shift. Two minutes, no equipment.</p>

        <div className="mt-8 overflow-hidden rounded-2xl bg-ffy-black" style={{ position: "relative", paddingBottom: "56.25%" }}>
          <iframe
            src="https://www.youtube.com/embed/qWaZ3rk0His"
            title="Touch Base® — The Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        <div className="mt-8 flex flex-col gap-5 text-[1.05rem] leading-relaxed text-ffy-black">
          <p>
            This is the tool Juliette teaches every single client. It's discreet enough that no one around you will
            notice, but your body will.
          </p>

          <div className="rounded-xl border border-ffy-border bg-white/70 px-5 py-4">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-ffy-gold-deep">The Practice</p>
            <div className="mt-3 flex flex-col gap-3">
              <p><span className="font-display text-lg font-bold text-ffy-gold-deep">Press thumb to forefinger:</span> begin with this simple, grounding gesture.</p>
              <p><span className="font-display text-lg font-bold text-ffy-gold-deep">Move slowly, like honey:</span> feel every ridge of your skin. Slower than you think slow is. Then slower still.</p>
              <p><span className="font-display text-lg font-bold text-ffy-gold-deep">Notice and release:</span> notice where you want to speed up, notice the thoughts that rise, and let them pass.</p>
              <p><span className="font-display text-lg font-bold text-ffy-gold-deep">Remind yourself:</span> there is no tiger in the room. I am safe.</p>
              <p><span className="font-display text-lg font-bold text-ffy-gold-deep">Two minutes, twice a day:</span> morning and evening. Before you begin, rate how you feel one to ten. After two minutes, rate again.</p>
            </div>
          </div>

          <div className="rounded-xl bg-ffy-teal px-5 py-5 text-ffy-cream">
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-ffy-gold-pale">Why it works</p>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ffy-cream/90">
              Paired with slowness, breath and attention, this gesture downregulates the stress response. You are
              gently teaching your system to associate this moment with safety. Thirty-one days, it becomes
              automatic. Ninety days, it is muscle memory, you will reach for it instinctively.
            </p>
          </div>

          <p className="font-display text-lg font-semibold text-ffy-teal">
            The body follows the focus. Give it something worth finding.
          </p>
        </div>
      </div>
    </main>
  );
}
