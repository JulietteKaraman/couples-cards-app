import Image from "next/image";
import Link from "next/link";
import { DECKS } from "@/data/decks";

export default function FreeTasterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full mb-4">
            Taster Pack
          </span>
          <h1 className="text-2xl font-semibold mb-2">Try Before You Buy</h1>
          <p className="text-white/60">
            Experience 5 cards from each deck for free
          </p>
        </div>

        {/* Couples Taster */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden border border-white/10 mb-4">
            <Image
              src={DECKS.couples.coverImage}
              alt="Couples Edition Taster"
              width={1200}
              height={1600}
              className="w-full h-auto"
              priority
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Couples Taster</h2>
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                5 Cards
              </span>
            </div>
            <p className="text-white/70 text-sm">
              150 prompts exploring Love, Desire, Body, Communication, and Repair
            </p>
            <p className="text-white/50 text-xs">
              Perfect for date nights or quiet evenings when you want to feel each other again
            </p>
            
            <Link
              href="/free/couples/play"
              className="block text-center rounded-xl bg-white text-black py-3 font-medium mt-4"
            >
              Try Couples Taster
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Friends Taster */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden border border-white/10 mb-4">
            <Image
              src={DECKS.friends.coverImage}
              alt="Friends & Family Edition Taster"
              width={1200}
              height={1600}
              className="w-full h-auto"
              priority
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Friends Taster</h2>
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                5 Cards
              </span>
            </div>
            <p className="text-white/70 text-sm">
              150 prompts around Life, Beliefs, Emotions, Family and Everyday Connection
            </p>
            <p className="text-white/50 text-xs">
              For family dinners, car rides, or conversations that go deeper than small talk
            </p>
            
            <Link
              href="/free/friends/play"
              className="block text-center rounded-xl bg-white text-black py-3 font-medium mt-4"
            >
              Try Friends Taster
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 mb-3">
            Ready for the full experience?
          </p>
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white underline"
          >
            View Full Versions
          </Link>
        </div>
      </div>
    </main>
  );
}