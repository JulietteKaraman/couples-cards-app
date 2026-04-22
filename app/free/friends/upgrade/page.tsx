import Image from "next/image";
import Link from "next/link";
import { DECKS, CORE_COLLECTION_CONFIG, FULL_CORE_SET_CONFIG, EVERYTHING_CONFIG } from "@/data/decks";

export default function FriendsTasterUpgradePage() {
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
            Unlock 147 more cards in the full Friends Edition
          </p>
        </div>

        {/* Full Deck Promotion */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
          <Image
            src={DECKS.friends.coverImage}
            alt="Friends & Family Edition"
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Friends & Family Edition</h2>
          <p className="text-white/70">
            150 prompts around Life, Beliefs, Emotions, Family and Everyday Connection
          </p>
          <p className="text-white/50 text-sm">
            For family dinners, car rides, or conversations that go deeper than small talk
          </p>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">£{DECKS.friends.price}</span>
            <span className="text-white/40">one-time purchase</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Link
            href="/app/friends/unlock"
            className="block text-center rounded-xl bg-white text-black py-4 font-medium text-lg"
          >
            Unlock Full Friends Deck
          </Link>
          
          <Link
            href="/free"
            className="block text-center rounded-xl border border-white/20 text-white py-3 font-medium"
          >
            Try Couples Taster Instead
          </Link>
        </div>

        {/* Everything Bundle */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Everything Bundle</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                Save £60
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Get all four decks: Touch Languages, Couples, Friends & Family, and Trust & Repair
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">£{EVERYTHING_CONFIG.price}</span>
                <span className="text-white/40 text-sm ml-2 line-through">£145</span>
              </div>
              <Link
                href="/app/bundle/unlock?type=everything"
                className="rounded-xl bg-green-500 text-black px-6 py-2 font-medium"
              >
                View Bundle
              </Link>
            </div>
          </div>
        </div>

        {/* Full Core Set Bundle */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Full Core Set</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                Save £30
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Get all three core decks: Touch Languages, Couples, and Friends & Family
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">£{FULL_CORE_SET_CONFIG.price}</span>
                <span className="text-white/40 text-sm ml-2 line-through">£105</span>
              </div>
              <Link
                href="/app/bundle/unlock?type=full-core-set"
                className="rounded-xl bg-white text-black px-6 py-2 font-medium"
              >
                View Bundle
              </Link>
            </div>
          </div>
        </div>

        {/* Core Collection Bundle */}
        <div className="border-t border-white/10 pt-8">
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Core Collection</h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                Save £15
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Get Couples and Friends & Family editions together
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">£{CORE_COLLECTION_CONFIG.price}</span>
                <span className="text-white/40 text-sm ml-2 line-through">£70</span>
              </div>
              <Link
                href="/app/bundle/unlock?type=core-collection"
                className="rounded-xl bg-white/10 border border-white/20 px-6 py-2 font-medium hover:bg-white/20 transition-colors"
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