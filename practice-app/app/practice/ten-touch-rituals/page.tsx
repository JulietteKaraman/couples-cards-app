"use client";

import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CollectionGate } from "@/components/auth/CollectionGate";

// The Touch Rituals now lives as ONE copy, on the marketing site, at
// feelfullyyou.com/touch-rituals.
//
// Until 24 Aug 2026 this app held its own full version of the guide
// (lib/content/ten-touch-rituals.ts). Within a single afternoon the two
// copies had already diverged badly: the hosted page gained the four
// pillars, the safety section, Betty Martin's Wheel of Consent, the real
// testimonial screenshots, the rewritten Approach and the tinted tiers,
// while the in-app copy sat behind and nobody could tell which one a
// reader had seen. That is the exact drift Juliette refused a PDF over
// earlier the same day, and it had happened anyway, in the app.
//
// So the app keeps what only the app can do — the magic-link login, the
// entitlement, the library tile, the progress — and hands the reading
// itself to the single hosted copy. One place to edit, forever.
//
// The entitlement still gates it: this page sits inside ProtectedRoute
// and CollectionGate exactly as before, so the redirect only fires for
// someone who is signed in and actually owns the collection.
const GUIDE_URL = "https://feelfullyyou.com/touch-rituals";

export default function TouchRitualsPage() {
  return (
    <ProtectedRoute>
      <CollectionGate collectionSlug="ten-touch-rituals">
        <Redirector />
      </CollectionGate>
    </ProtectedRoute>
  );
}

function Redirector() {
  useEffect(() => {
    window.location.replace(GUIDE_URL);
  }, []);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-xl font-semibold text-ffy-black">
        The Touch Rituals
      </p>
      <p className="mt-2 text-sm text-ffy-brown">Opening your guide.</p>
      <a
        href={GUIDE_URL}
        className="mt-6 text-sm font-semibold text-ffy-gold underline"
      >
        Tap here if it does not open on its own
      </a>
    </main>
  );
}
