import Image from "next/image";
import Link from "next/link";
import { DECKS, FULL_SET_CONFIG } from "@/data/decks";

export default function CouplesTasterUpgradePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-4">
            Taster Complete
          </span>
          <h1 className="text-2xl font-semibold mb-2">Enjoyed the Taster?</h1>
          <p className="text-white/60">
            Unlock 145 more cards in the full Couples Edition
          </p>
        </div>

        {/* Full Deck Promotion */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
          <Image
            src={DECKS.couples.coverImage}
            alt="Couples Edition"
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Couples Edition</h2>
          <p className="text-white/70">
            150 prompts exploring Love, Desire, Body, Communication, and Repair
          </p>
          <p className="text-white/50 text-sm">
            Perfect for date nights or quiet evenings when you want to feel each other again
          </p>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">£{DECKS.couples.price}</span>
            <span className="text-white/40">one-time purchase</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Link
            href="/app/couples/unlock"
            className="block text-center rounded-xl bg-white text-black py-4 font-medium text-lg"
          >
            Unlock Full Couples Deck
          </Link>
          
          <Link
            href="/free"
            className="block text-center rounded-xl border border-white/20 text-white py-3 font-medium"
          >
            Try Friends Taster Instead
          </Link>
        </div>

        {/* Full Set Bundle (Trust & Repair + Couples + Friends) */}
        <div className="border-t border-white/10 pt-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-3">
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

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}