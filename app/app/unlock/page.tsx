"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export default function UnlockPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await supabaseBrowser.auth.getUser();
      const user = data.user;

      if (!user?.id || !user.email) {
        router.push("/login");
        return;
      }

      const idempotencyKey = generateIdempotencyKey();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          email: user.email,
          idempotencyKey 
        }),
      });

      const out = await res.json();

      if (!res.ok) {
        throw new Error(out.error || "Checkout failed");
      }

      if (!out.url) {
        throw new Error("No checkout URL received");
      }

      window.location.href = out.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Unable to start checkout. Please try again.");
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-white/50">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Unlock Couples Edition</h1>
        <p className="text-sm text-white/70">One-time purchase • £25</p>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
        >
          {loading ? "Opening checkout…" : "Unlock for £25"}
        </button>

        <p className="text-xs text-white/50">
          You can apply a discount or retreat code at checkout.
        </p>
      </div>
    </main>
  );
}
