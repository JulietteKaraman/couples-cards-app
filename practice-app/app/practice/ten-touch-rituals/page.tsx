"use client";

import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CollectionGate } from "@/components/auth/CollectionGate";

// 10 Touch Rituals is its own paid product (£7, Stripe price
// price_1Tlpu0CCw18geY15b8J3jlBW), separate from the free 20-ritual
// course guide at feelfullyyou.com/touch-rituals.
//
// 27 Aug 2026, Juliette: "I do NOT want to give the touch rituals away
// for free anymore. The html is for the course." So the 20-ritual page
// is course content now, not this product's deliverable. This product
// stays the original Gamma-designed 10 Touch Rituals PDF, delivered as
// a real file, not re-typed into the app or the site. Re-typing it was
// exactly what caused real content (Why Touch Matters, the Trace
// Ritual's real steps) to go missing earlier the same day, twice.
// Keeping it as the one real PDF is what stops that happening again.
//
// The entitlement still gates it: this page sits inside ProtectedRoute
// and CollectionGate exactly as before, so the redirect only fires for
// someone who is signed in and actually owns the collection.
const GUIDE_URL = "https://feelfullyyou.com/downloads/10-touch-rituals.pdf";

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
        10 Touch Rituals
      </p>
      <p className="mt-2 text-sm text-ffy-brown">Opening your PDF.</p>
      <a
        href={GUIDE_URL}
        className="mt-6 text-sm font-semibold text-ffy-gold underline"
      >
        Tap here if it does not open on its own
      </a>
    </main>
  );
}
