"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDeck, DeckType, isValidDeck, BUNDLE_CONFIG, DECKS } from "@/data/decks";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function UnlockPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user, purchasedDecks, refreshAccess } = useAuth();
  
  const deckType = params.deck as string;
  
  if (!isValidDeck(deckType)) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70">Invalid deck type</p>
          <button 
            onClick={() => router.push("/app")}
            className="mt-4 text-white underline"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const deck = getDeck(deckType as DeckType);
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user owns other deck (for bundle upsell)
  const otherDeckType = deckType === "couples" ? "friends" : "couples";
  const hasOtherDeck = purchasedDecks.includes(otherDeckType);
  const showBundleUpsell = !hasOtherDeck;

  async function startCheckout(product: "couples" | "friends" | "bundle") {
    const isBundle = product === "bundle";
    if (isBundle) {
      setBundleLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (!user?.id || !user.email) {
        throw new Error("User not authenticated");
      }

      const idempotencyKey = generateIdempotencyKey();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          email: user.email,
          idempotencyKey,
          product
        }),
      });

      const out = await res.json();
      
      console.log("Checkout API response:", out);

      if (!res.ok) {
        throw new Error(out.error || "Checkout failed");
      }

      if (!out.url) {
        throw new Error("No checkout URL received");
      }

      window.location.href = out.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Unable to start checkout. Please try again.");
      if (isBundle) {
        setBundleLoading(false);
      } else {
        setLoading(false);
      }
    }
  }

  async function restorePurchase() {
    setRestoreLoading(true);
    setRestoreMessage(null);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const res = await fetch("/api/restore-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id
        }),
      });

      const out = await res.json();
      
      console.log("Restore purchase API response:", out);

      if (!res.ok) {
        throw new Error(out.error || "Failed to restore purchase");
      }

      setRestoreMessage("Purchase restored successfully!");
      
      // Refresh auth state to get updated access
      await refreshAccess();
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/app/${deckType}/draw`);
      }, 1500);
      
    } catch (err: any) {
      console.error("Restore purchase error:", err);
      setError(err.message || "Unable to restore purchase.");
    } finally {
      setRestoreLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Back button */}
        <button 
          onClick={() => router.push("/app")}
          className="text-sm text-white/70 hover:text-white mb-6"
        >
          ← Back to decks
        </button>

        {/* Deck Cover */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
          <Image
            src={deck.coverImage}
            alt={deck.name}
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{deck.name}</h1>
          <p className="text-white/70">{deck.description}</p>
          <p className="text-sm text-white/50">{deck.totalCards} cards • 5 sections</p>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Single Deck Purchase */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => startCheckout(deckType as "couples" | "friends")}
              disabled={loading}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
            >
              {loading ? "Opening checkout…" : `Unlock for £${deck.price}`}
            </button>

            <p className="text-xs text-white/50 text-center">
              One-time purchase • Instant access
            </p>
          </div>

          {/* Bundle Upsell */}
          {showBundleUpsell && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete Collection</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Save £{BUNDLE_CONFIG.savings}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Get both {DECKS.couples.name} and {DECKS.friends.name}
                </p>
                <button
                  onClick={() => startCheckout("bundle")}
                  disabled={bundleLoading}
                  className="w-full rounded-xl bg-white/10 text-white border border-white/20 py-3 font-medium disabled:opacity-50 hover:bg-white/20 transition-colors"
                >
                  {bundleLoading ? "Opening checkout…" : `Buy Bundle £${BUNDLE_CONFIG.price}`}
                </button>
              </div>
            </div>
          )}

          {/* Already have other deck? */}
          {hasOtherDeck && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-sm text-white/60 mb-3">
                You already own the {DECKS[otherDeckType as DeckType].name}!
              </p>
              <button
                onClick={() => router.push(`/app/${otherDeckType}/draw`)}
                className="w-full rounded-xl border border-white/20 text-white py-3 font-medium hover:bg-white/5 transition-colors"
              >
                Switch to {DECKS[otherDeckType as DeckType].name}
              </button>
            </div>
          )}

          {/* Restore Purchase */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <p className="text-sm text-white/60 mb-3">
              Already purchased but can't access?
            </p>
            
            {restoreMessage && (
              <p className="text-sm text-green-400 mb-3">{restoreMessage}</p>
            )}
            
            <button
              onClick={restorePurchase}
              disabled={restoreLoading}
              className="w-full rounded-xl border border-white/20 text-white py-3 font-medium disabled:opacity-50 hover:bg-white/5 transition-colors"
            >
              {restoreLoading ? "Restoring..." : "Restore Purchase"}
            </button>
            
            <p className="text-xs text-white/40 mt-2">
              We'll verify your payment and restore access automatically.
            </p>
          </div>

          <p className="text-xs text-white/40 text-center pt-4">
            You can apply a discount code at checkout.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function UnlockPage() {
  return (
    <ProtectedRoute>
      <UnlockPageContent />
    </ProtectedRoute>
  );
}