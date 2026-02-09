"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function generateIdempotencyKey(): string {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function UnlockPageContent() {
  const [loading, setLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id || !user.email) {
        throw new Error("User not authenticated");
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
      
      console.log("Checkout API response:", out);
      console.log("Response status:", res.status);
      console.log("Checkout URL:", out.url);

      if (!res.ok) {
        throw new Error(out.error || "Checkout failed");
      }

      if (!out.url) {
        throw new Error("No checkout URL received");
      }

      console.log("Redirecting to Stripe:", out.url);
      window.location.href = out.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Unable to start checkout. Please try again.");
      setLoading(false);
    }
  }

  async function restorePurchase() {
    setRestoreLoading(true);
    setRestoreMessage(null);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const res = await fetch("/api/restore-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id
        }),
      });

      const out = await res.json();
      
      console.log("Restore purchase API response:", out);

      if (!res.ok) {
        throw new Error(out.error || "Failed to restore purchase");
      }

      setRestoreMessage("Purchase restored successfully! Redirecting...");
      
      // Reload the page after a short delay to refresh auth state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      console.error("Restore purchase error:", err);
      setError(err.message || "Unable to restore purchase. Please try again or contact support.");
    } finally {
      setRestoreLoading(false);
    }
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

        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-sm text-white/60 mb-3">
            Already purchased but can't access?
          </p>
          
          {restoreMessage && (
            <p className="text-sm text-green-400 mb-3">{restoreMessage}</p>
          )}
          
          <button
            onClick={restorePurchase}
            disabled={restoreLoading}
            className="w-full rounded-xl border border-white/20 text-white py-3 font-medium disabled:opacity-50 hover:bg-white/5 transition-colors"
          >
            {restoreLoading ? "Restoring..." : "Restore Purchase"}
          </button>
          
          <p className="text-xs text-white/40 mt-2">
            We'll verify your payment and restore access automatically.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function UnlockPage() {
  return (
    <ProtectedRoute>
      <UnlockPageContent />
    </ProtectedRoute>
  );
}
