"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllDecks, DECKS, FULL_SET_CONFIG } from "@/data/decks";

function AppHomeContent() {
  const { user, hasAccess, purchasedDecks, signOut, userName } = useAuth();
  const decks = getAllDecks();

  const hasCouples = purchasedDecks.includes("couples") || hasAccess;
  const hasFriends = purchasedDecks.includes("friends");
  const hasTrust = purchasedDecks.includes("trust-repair");
  const hasFullSet = hasCouples && hasFriends && hasTrust;

  const showFullSet = !hasFullSet;

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
                    <span className="text-white/40 text-sm ml-2 line-through">£85</span>
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

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 space-y-3">
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