import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Communication & Intimacy Cards</h1>
          <p className="text-white/60 mb-2">Deep conversations for deeper connections</p>
          <p className="text-white/50 text-sm italic mb-6">Because every relationship deserves to feel seen, heard and understood</p>
          
          <Link
            href="/free/email"
            className="inline-block rounded-xl bg-white/10 border border-white/20 text-white px-6 py-3 font-medium hover:bg-white/20 transition-colors"
          >
            Try 5 Cards Free
          </Link>
        </div>

        {/* Trust & Repair */}
        <div className="mb-10">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/cards/trust/cover.png"
              alt="Trust & Repair"
              width={1200}
              height={1600}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-xl font-semibold">Trust & Repair</h2>
            <p className="text-white/70 text-sm">
              50 prompts navigating the drift and returning to trust together
            </p>
            <p className="text-white/60 text-xs">
              For couples who want to deepen their intimacy through the language of touch
            </p>

            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block text-center rounded-xl bg-white text-black py-3 font-medium"
              >
                Sign in
              </Link>

              <Link
                href="/purchase/email?product=trust-repair"
                className="block text-center rounded-xl border border-white/15 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                Unlock for £15
              </Link>
            </div>
          </div>
        </div>

        {/* Touch Languages Edition */}
        <div className="mb-10">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/cards/touch/cover.png"
              alt="The Touch Languages"
              width={1200}
              height={1600}
              className="w-full h-auto"
            />
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-xl font-semibold">The Touch Languages</h2>
            <p className="text-white/70 text-sm">
              125 prompts exploring Erotic, Physical, Emotional, Spiritual, and Energetic Touch
            </p>
            <p className="text-white/60 text-xs">
              For couples who want to deepen their intimacy through the language of touch
            </p>

            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block text-center rounded-xl bg-white text-black py-3 font-medium"
              >
                Sign in
              </Link>

              <Link
                href="/purchase/email?product=touch-languages"
                className="block text-center rounded-xl border border-white/15 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                Unlock for £35
              </Link>
            </div>
          </div>
        </div>

        {/* Couples Edition */}
        <div className="mb-10">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/cards/couples/cover.png"
              alt="Couples Edition"
              width={1200}
              height={1600}
              className="w-full h-auto"
            />
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-xl font-semibold">Couples Edition</h2>
            <p className="text-white/70 text-sm">
              150 prompts exploring Love, Desire, Body, Communication, and Repair
            </p>
            <p className="text-white/60 text-xs">
              Perfect for date nights or quiet evenings when you want to feel each other again
            </p>

            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block text-center rounded-xl bg-white text-black py-3 font-medium"
              >
                Sign in
              </Link>

              <Link
                href="/purchase/email?product=couples"
                className="block text-center rounded-xl border border-white/15 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                Unlock for £35
              </Link>
            </div>
          </div>
        </div>

        {/* Friends & Family Edition */}
        <div className="mb-10">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/cards/friends/cover.png"
              alt="Friends & Family Edition"
              width={1200}
              height={1600}
              className="w-full h-auto"
            />
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-xl font-semibold">Friends & Family Edition</h2>
            <p className="text-white/70 text-sm">
              152 prompts around Life, Beliefs, Emotions, Family and Everyday Connection
            </p>
            <p className="text-white/60 text-xs">
              For family dinners, car rides, or conversations that go deeper than small talk
            </p>

            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block text-center rounded-xl bg-white text-black py-3 font-medium"
              >
                Sign in
              </Link>

              <Link
                href="/purchase/email?product=friends"
                className="block text-center rounded-xl border border-white/15 py-3 font-medium hover:bg-white/5 transition-colors"
              >
                Unlock for £35
              </Link>
            </div>
          </div>
        </div>

        {/* Full Set (Trust & Repair + Couples + Friends) */}
        <div className="border-t border-white/10 pt-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Full Set</h2>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Save £30
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Get all three decks: Trust & Repair, Couples Edition, and Friends & Family Edition. The complete set for every relationship in your life.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">£55</span>
              </div>
              <Link
                href="/purchase/email?product=full-set"
                className="rounded-xl bg-green-500 text-black px-6 py-2 font-medium"
              >
                View Bundle
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            One-time purchase • Instant access • Play forever
          </p>
        </div>
      </div>
    </main>
  );
}