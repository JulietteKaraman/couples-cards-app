import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function AppHome() {
  // This page is server-rendered by default, so we won't use supabase client here.
  // We'll keep this page simple and move entitlement checking to a client page next.
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
            Welcome back. Ready to begin?
          </p>

          <Link
            href="/app/onboarding"
            className="block text-center rounded-xl bg-white text-black py-3 font-medium"
          >
            Start
          </Link>
        </div>
      </div>
    </main>
  );
}
