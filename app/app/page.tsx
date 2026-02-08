"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AppHomeContent() {
  const { user, hasAccess, signOut } = useAuth();

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
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ""}. Ready to begin?
          </p>

          {hasAccess ? (
            <Link
              href="/app/onboarding"
              className="block text-center rounded-xl bg-white text-black py-3 font-medium"
            >
              Start
            </Link>
          ) : (
            <Link
              href="/app/unlock"
              className="block text-center rounded-xl bg-white text-black py-3 font-medium"
            >
              Unlock for £25
            </Link>
          )}

          <button
            onClick={signOut}
            className="w-full rounded-xl border border-white/15 py-3 font-medium text-white/70 hover:text-white"
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
