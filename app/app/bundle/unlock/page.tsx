"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { CORE_COLLECTION_CONFIG, FULL_CORE_SET_CONFIG, EVERYTHING_CONFIG, DECKS } from "@/data/decks";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function BundleUnlockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bundleType = searchParams.get("type") || "everything";
  const { user, purchasedDecks } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bundleConfig = {
    everything: {
      ...EVERYTHING_CONFIG,
      decks: [
        { id: "couples", name: "Couples Edition", cover: DECKS.couples.coverImage },
        { id: "friends", name: "Friends & Family", cover: DECKS.friends.coverImage },
        { id: "touch-languages", name: "Touch Languages", cover: DECKS["touch-languages"].coverImage },
        { id: "trust-repair", name: "Trust & Repair", cover: DECKS["trust-repair"].coverImage },
      ],
    },
    "full-core-set": {
      ...FULL_CORE_SET_CONFIG,
      decks: [
        { id: "couples", name: "Couples Edition", cover: DECKS.couples.coverImage },
        { id: "friends", name: "Friends & Family", cover: DECKS.friends.coverImage },
        { id: "touch-languages", name: "Touch Languages", cover: DECKS["touch-languages"].coverImage },
      ],
    },
    "core-collection": {
      ...CORE_COLLECTION_CONFIG,
      decks: [
        { id: "couples", name: "Couples Edition", cover: DECKS.couples.coverImage },
        { id: "friends", name: "Friends & Family", cover: DECKS.friends.coverImage },
      ],
    },
  };

  const currentBundle = bundleConfig[bundleType as keyof typeof bundleConfig] || bundleConfig.everything;
  const totalCards = currentBundle.decks.reduce((sum, d) => sum + DECKS[d.id as keyof typeof DECKS].totalCards, 0);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        router.push(`/login?redirect=/app/bundle/unlock?type=${bundleType}`);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          idempotencyKey: generateIdempotencyKey(),
          product: bundleType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <button 
          onClick={() => router.push("/app")}
          className="text-sm text-white/70 hover:text-white mb-6"
        >
          ← Back to decks
        </button>

        <h1 className="text-2xl font-semibold mb-2">{currentBundle.name}</h1>
        <p className="text-white/60 text-sm mb-6">
          {currentBundle.decks.length} decks • {totalCards} cards total
        </p>

        <div className="space-y-4 mb-8">
          {currentBundle.decks.map((deck, index) => (
            <div key={deck.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={deck.cover}
                  alt={deck.name}
                  width={120}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{deck.name}</p>
                <p className="text-sm text-white/50">{DECKS[deck.id as keyof typeof DECKS].totalCards} cards</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white/80">
              Save £{currentBundle.savings}
            </span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
              Best Value
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold">£{currentBundle.price}</span>
            <span className="text-white/40 text-sm">one-time purchase</span>
          </div>

          <p className="text-white/60 text-sm mb-6">
            {currentBundle.description}
          </p>

          {error && (
            <p className="text-sm text-red-400 mb-4">{error}</p>
          )}

          <button
            onClick={startCheckout}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Opening checkout…" : `Unlock for £${currentBundle.price}`}
          </button>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/50 text-center">
            One-time purchase • Instant access • Play forever
          </p>
        </div>
      </div>
    </main>
  );
}

export default function BundleUnlockPage() {
  return (
    <ProtectedRoute>
      <BundleUnlockContent />
    </ProtectedRoute>
  );
}