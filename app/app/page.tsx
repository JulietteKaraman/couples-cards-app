"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllDecks, DECKS, FULL_SET_CONFIG } from "@/data/decks";

function AppHomeContent() {
  const { user, hasAccess, purchasedDecks, signOut, userName, refreshAccess } = useAuth();
  const decks = getAllDecks();
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const hasCouples = purchasedDecks.includes("couples") || hasAccess;
  const hasFriends = purchasedDecks.includes("friends");
  const hasTrust = purchasedDecks.includes("trust-repair");
  const hasFullSet = hasCouples && hasFriends && hasTrust;

  const showFullSet = !hasFullSet;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true" && user && !restoring) {
      handleRestorePurchase();
    }
  }, [user]);

  async function handleRestorePurchase() {
    setRestoring(true);
    setRestoreMessage(null);
    try {
      const res = await fetch("/api/restore-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRestoreMessage("Purchase restored! Refresh to see your decks.");
        await refreshAccess();
        window.history.replaceState({}, "", "/app");
      } else {
        setRestoreMessage(data.error || "Could not restore purchase.");
      }
    } catch (err) {
      console.error("Restore failed:", err);
      setRestoreMessage("Something went wrong. Try again later.");
    } finally {
      setRestoring(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            {userName ? `Welcome back, ${userName}` : "Welcome"}
          </h1>
          <p className="text-white/70">
            {user?.email ? `Signed in as ${user.email}` : "Ready to connect?"}
          </p>
          {restoring && (
            <p className="text-yellow-400 text-sm mt-3">Restoring your purchase...</p>
          )}
          {restoreMessage && (
            <p className="text-green-400 text-sm mt-3">{restoreMessage}</p>
          )}
        </div>

        {/* Decks Grid */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Your Decks</h2>
          
          {decks.map((deck) => {
            const isOwned = purchasedDecks.includes(deck.id) || (deck.id === "couples" && hasAccess);
            
            return (
              <div 
                key={deck.id}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
              >
                <div className="relative">
                  <Image
                    src={deck.coverImage}
                    alt={deck.name}
                    width={1200}
                    height={1600}
                    className="w-full h-auto"
                    priority
                  />
                  {isOwned && (
                    <div className="absolute top-3 right-3 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                      Owned
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{deck.name}</h3>
                    <p className="text-sm text-white/60">{deck.description}</p>
                    <p className="text-xs text-white/40 mt-1">{deck.totalCards} cards</p>
                  </div>
                  
                  {isOwned ? (
                    <Link
                      href={`/app/${deck.id}/draw`}
                      className="block text-center rounded-xl bg-white text-black py-3 font-medium"
                    >
                      Start Playing
                    </Link>
                  ) : (
                    <Link
                      href={`/app/${deck.id}/unlock`}
                      className="block text-center rounded-xl bg-white/10 text-white border border-white/20 py-3 font-medium hover:bg-white/20 transition-colors"
                    >
                      Unlock for £{deck.price}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Full Set Bundle (Trust & Repair + Couples + Friends) */}
          {showFullSet && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Full Set</h3>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Save £30
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Get all three decks: Trust & Repair, Couples, and Friends & Family
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">£{FULL_SET_CONFIG.price}</span>
                  </div>
                  <Link
                    href="/app/bundle/unlock?type=full-set"
                    className="rounded-xl bg-green-500 text-black px-6 py-2 font-medium"
                  >
                    View Bundle
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Restore Purchase */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={handleRestorePurchase}
            disabled={restoring}
            className="w-full rounded-xl border border-white/20 text-white/70 py-3 font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {restoring ? "Restoring..." : "Already purchased? Restore access"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={signOut}
            className="w-full rounded-xl bg-red-500/20 text-red-400 py-3 font-medium hover:bg-red-500/30 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}

export default function AppHome() {
  return (
    <ProtectedRoute>
      <AppHomeContent />
    </ProtectedRoute>
  );
}