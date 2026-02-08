import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <Image
            src="/cards/couples/cover.png"
            alt="Couples Edition"
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="mt-6 space-y-3">
          <h1 className="text-xl font-semibold">Couples Edition</h1>
          <p className="text-sm text-white/70">
            Communication & Intimacy • One-time purchase • £25
          </p>

          <Link
            href="/login"
            className="block text-center rounded-xl bg-white text-black py-3 font-medium"
          >
            Sign in
          </Link>

          <Link
            href="/app/unlock"
            className="block text-center rounded-xl border border-white/15 py-3 font-medium"
          >
            Unlock for £25
          </Link>
        </div>
      </div>
    </main>
  );
}