"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDeck, DeckType, isValidDeck, BUNDLE_CONFIG, ALL_THREE_BUNDLE_CONFIG, DECKS, EVERYTHING_CONFIG, FULL_CORE_SET_CONFIG, CORE_COLLECTION_CONFIG } from "@/data/decks";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function UnlockPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user, purchasedDecks, refreshAccess } = useAuth();
  
  const deckType = params.deck as string;
  const isBundlePage = deckType === "bundle" || deckType === "all-three";
  
  if (!isBundlePage && !isValidDeck(deckType)) {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(product: string) {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id || !user.email) {
        router.push(`/login?redirect=/app/${deckType}/unlock`);
        return;
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
      setLoading(false);
    }
  }

  if (isBundlePage) {
    const bundleConfig = deckType === "all-three" ? ALL_THREE_BUNDLE_CONFIG : BUNDLE_CONFIG;
    const isAllThree = deckType === "all-three";
    
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <button 
            onClick={() => router.push("/")}
            className="text-sm text-white/70 hover:text-white mb-6"
          >
            ← Back to home
          </button>

          <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
            <div className="grid grid-cols-2 gap-1">
              <Image
                src="/cards/couples/cover.png"
                alt="Couples Edition"
                width={600}
                height={800}
                className="w-full h-auto"
              />
              <Image
                src="/cards/friends/cover.png"
                alt="Friends Edition"
                width={600}
                height={800}
                className="w-full h-auto"
              />
              {isAllThree && (
                <Image
                  src="/cards/touch/cover.png"
                  alt="Touch Languages"
                  width={600}
                  height={800}
                  className="w-full h-auto col-span-2"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{bundleConfig.name}</h1>
            
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                {isAllThree 
                  ? "Touch Languages, Couples, and Friends & Family — all in one collection"
                  : "Couples Edition and Friends & Family Edition together"
                }
              </p>
              <p className="text-white/60 text-sm">
                {isAllThree
                  ? "The ultimate collection for deepening all your relationships"
                  : "Great value for exploring connection in every relationship"
                }
              </p>
            </div>
            
            <p className="text-sm text-white/50">
              {isAllThree ? "3 decks" : "2 decks"} • {isAllThree ? "427" : "302"} cards total
            </p>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="space-y-3 pt-4">
              <button
                onClick={() => startCheckout(deckType)}
                disabled={loading}
                className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
              >
                {loading ? "Opening checkout…" : `Unlock for £${bundleConfig.price}`}
              </button>

              <p className="text-xs text-white/50 text-center">
                One-time purchase • Instant access to all decks
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

  const deck = getDeck(deckType as DeckType);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

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
      
      await refreshAccess();
      
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

  const ownedDecks = purchasedDecks;
  const ownsCouples = ownedDecks.includes("couples");
  const ownsFriends = ownedDecks.includes("friends");
  const ownsTouch = ownedDecks.includes("touch-languages");
  const ownsTrust = ownedDecks.includes("trust-repair");
  const ownsAllFour = ownsCouples && ownsFriends && ownsTouch && ownsTrust;
  const ownsCoreSet = ownsCouples && ownsFriends && ownsTouch;
  const ownsCoreCollection = ownsCouples && ownsFriends;

  // Show bundles user doesn't fully own yet
  const showEverythingBundle = !ownsAllFour;
  const showFullCoreSetBundle = !ownsCoreSet;
  const showCoreCollectionBundle = !ownsCoreCollection;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <button 
          onClick={() => router.push("/app")}
          className="text-sm text-white/70 hover:text-white mb-6"
        >
          ← Back to decks
        </button>

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
          
          {deckType === "couples" && (
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                150 prompts exploring Love, Desire, Body, Communication, and Repair
              </p>
              <p className="text-white/60 text-sm">
                Perfect for date nights or quiet evenings when you want to feel each other again
              </p>
            </div>
          )}
          
          {deckType === "friends" && (
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                152 prompts around Life, Beliefs, Emotions, Family and Everyday Connection
              </p>
              <p className="text-white/60 text-sm">
                For family dinners, car rides, or conversations that go deeper than small talk
              </p>
            </div>
          )}

          {deckType === "touch-languages" && (
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                125 prompts exploring Erotic, Physical, Emotional, Spiritual, and Energetic Touch
              </p>
              <p className="text-white/60 text-sm">
                For couples who want to deepen their intimacy through the language of touch
              </p>
            </div>
          )}

          {deckType === "trust-repair" && (
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                50 prompts navigating the drift and returning to trust together
              </p>
              <p className="text-white/60 text-sm">
                For couples who want to deepen their intimacy and repair trust
              </p>
            </div>
          )}
          
          <p className="text-sm text-white/50">{deck.totalCards} cards</p>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="space-y-3 pt-4">
            <button
              onClick={() => startCheckout(deckType)}
              disabled={loading}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
            >
              {loading ? "Opening checkout…" : `Unlock for £${deck.price}`}
            </button>

            <p className="text-xs text-white/50 text-center">
              One-time purchase • Instant access
            </p>
          </div>

          {/* Everything Bundle (All 4) */}
          {showEverythingBundle && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Everything Bundle</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Save £60
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  All four decks: Touch Languages, Couples, Friends & Family, and Trust & Repair
                </p>
                <button
                  onClick={() => startCheckout("everything")}
                  disabled={loading}
                  className="w-full rounded-xl bg-green-500 text-black py-3 font-medium disabled:opacity-50 hover:bg-green-400 transition-colors"
                >
                  {loading ? "Opening checkout…" : `Unlock Everything for £${EVERYTHING_CONFIG.price}`}
                </button>
              </div>
            </div>
          )}

          {/* Full Core Set Bundle (3 core decks) */}
          {showFullCoreSetBundle && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Full Core Set</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Save £30
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Three core decks: Touch Languages, Couples, and Friends & Family
                </p>
                <button
                  onClick={() => startCheckout("full-core-set")}
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50 hover:bg-white/90 transition-colors"
                >
                  {loading ? "Opening checkout…" : `Unlock Core Set for £${FULL_CORE_SET_CONFIG.price}`}
                </button>
              </div>
            </div>
          )}

          {/* Core Collection Bundle (Couples + Friends) */}
          {showCoreCollectionBundle && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Core Collection</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Save £15
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Couples and Friends & Family editions together
                </p>
                <button
                  onClick={() => startCheckout("core-collection")}
                  disabled={loading}
                  className="w-full rounded-xl bg-white/10 text-white border border-white/20 py-3 font-medium disabled:opacity-50 hover:bg-white/20 transition-colors"
                >
                  {loading ? "Opening checkout…" : `Unlock Core Collection for £${CORE_COLLECTION_CONFIG.price}`}
                </button>
              </div>
            </div>
          )}

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
