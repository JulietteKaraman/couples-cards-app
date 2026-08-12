"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || user) return;
    // Juliette, 12 Aug 2026: "it only signs you back to the feel fully you
    // app- where are the cards?" — carry the page someone was actually
    // trying to reach through login, instead of always dropping them on
    // the home library after sign-in. Reads window.location directly
    // (client-only, this effect never runs on the server) rather than
    // useSearchParams(), which would force every page that wraps in
    // ProtectedRoute into its own Suspense boundary just for this.
    const current =
      typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/";
    router.replace(`/login?next=${encodeURIComponent(current)}`);
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ffy-cream">
        <p className="text-ffy-brown">Loading…</p>
      </main>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
