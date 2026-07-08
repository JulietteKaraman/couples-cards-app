"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDeck, DeckType, isValidDeck, FULL_SET_CONFIG, DECKS } from "@/data/decks";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function UnlockPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promo = searchParams.get("promo");
  const { user, purchasedDecks, refreshAccess } = useAuth();
  
  const deckType = params.deck as string;
  const isBundlePage = deckType === "bundle" || deckType === "all-three" || deckType === "full-set";
  
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
        // Convert bundle products to bundle URL
        let redirectUrl = `/app/${deckType}/unlock`;
        if (product === "full-set") {
          redirectUrl = "/app/bundle/unlock?type=full-set";
        }
        if (promo) {
          redirectUrl += `${redirectUrl.includes("?") ? "&" : "?"}promo=${encodeURIComponent(promo)}`;
        }
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}&signup=true`);
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
          product,
          promo
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
    const bundleConfig = FULL_SET_CONFIG;
    
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
            <div className="grid grid-cols-3 gap-1">
              <Image
                src="/cards/trust/cover.png"
                alt="Trust & Repair"
                width={600}
                height={800}
                className="w-full h-auto"
              />
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
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{bundleConfig.name}</h1>
            
            <div className="space-y-2">
              <p className="text-white/80 font-medium">
                Trust & Repair, Couples, and Friends & Family — all in one collection
              </p>
              <p className="text-white/60 text-sm">
                The complete set for deepening every relationship in your life
              </p>
            </div>
            
            <p className="text-sm text-white/50">
              3 decks • 352 cards total
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
              {promo
                ? `Your ${promo.toUpperCase()} discount is applied automatically at checkout.`
                : "You can apply a discount code at checkout."}
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
  const ownsTrust = ownedDecks.includes("trust-repair");
  const ownsFullSet = ownsCouples && ownsFriends && ownsTrust;

  // Show bundle if user doesn't fully own it yet
  const showFullSetBundle = !ownsFullSet;

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

          {/* Full Set Bundle (Trust & Repair + Couples + Friends) */}
          {showFullSetBundle && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Full Set</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Save £30
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  All three decks: Trust & Repair, Couples, and Friends & Family
                </p>
                <button
                  onClick={() => startCheckout("full-set")}
                  disabled={loading}
                  className="w-full rounded-xl bg-green-500 text-black py-3 font-medium disabled:opacity-50 hover:bg-green-400 transition-colors"
                >
                  {loading ? "Opening checkout…" : `Unlock Full Set for £${FULL_SET_CONFIG.price}`}
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
