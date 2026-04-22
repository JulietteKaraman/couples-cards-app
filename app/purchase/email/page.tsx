"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function PurchaseEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "couples";
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const productDetails: Record<string, { name: string; price: string }> = {
    couples: { name: "Couples Edition", price: "£35" },
    friends: { name: "Friends & Family Edition", price: "£35" },
    "touch-languages": { name: "The Touch Languages", price: "£35" },
    "trust-repair": { name: "Trust & Repair", price: "£15" },
    "core-collection": { name: "Core Collection", price: "£55" },
    "full-core-set": { name: "Full Core Set", price: "£75" },
    "everything": { name: "Everything Bundle", price: "£85" },
  };

  const productDetail = productDetails[product] || { name: "Couples Edition", price: "£35" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-purchase-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, product }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to continue");
      }

      router.push(`/app/${product}/unlock`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col">
        <Link 
          href="/" 
          className="text-sm text-white/70 hover:text-white mb-6"
        >
          ← Back to home
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Unlock {productDetail.name}</h1>
            <p className="text-white/70">
              Enter your details to continue to checkout
            </p>
            <p className="text-white/50 text-sm mt-2">
              One-time purchase of {productDetail.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
            >
              {loading ? "Continuing..." : `Continue to Checkout - ${productDetail.price}`}
            </button>
          </form>

          <p className="text-xs text-white/50 text-center mt-4">
            You'll also receive updates about our card decks and special offers
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PurchaseEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-white/50">Loading...</p></div>}>
      <PurchaseEmailContent />
    </Suspense>
  );
}