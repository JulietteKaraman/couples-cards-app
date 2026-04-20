"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function PurchaseEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "couples";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const productDetails: Record<string, { name: string; price: string }> = {
    couples: { name: "Couples Edition", price: "£25" },
    friends: { name: "Friends & Family Edition", price: "£25" },
    "touch-languages": { name: "The Touch Languages", price: "£25" },
    "bundle": { name: "Complete Collection", price: "£45" },
    "all-three": { name: "Ultimate Collection", price: "£60" },
  };

  const productDetail = productDetails[product] || { name: "Couples Edition", price: "£25" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-purchase-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, product }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(`/app/${product}/unlock`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Unlock {productDetail.name}</h1>
            <p className="text-white/70">
              Enter your email to continue to checkout
            </p>
            <p className="text-white/50 text-sm mt-2">
              One-time purchase of {productDetail.price}
            </p>
            <p className="text-white/50 text-sm">
              You'll also receive updates about our card decks and special offers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50"
            >
              {loading ? "Please wait..." : `Continue to Checkout - ${productDetail.price}`}
            </button>
          </form>
        </div>

        <p className="text-xs text-white/50 text-center mt-4">
          By signing up, you agree to our terms and privacy policy
        </p>
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