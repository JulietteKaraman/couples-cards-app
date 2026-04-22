"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function FreeEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckType = searchParams.get("deck") || "couples";
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deckNames: Record<string, string> = {
    couples: "Couples Edition",
    friends: "Friends & Family Edition",
  };

  const deckName = deckNames[deckType] || "Couples Edition";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-free-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, deck: deckType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to continue");
      }

      router.push("/free");
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
            <h1 className="text-2xl font-semibold mb-2">Unlock Free Cards</h1>
            <p className="text-white/70">
              Enter your details to access 5 free {deckName} cards
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
              {loading ? "Continuing..." : "Continue to Free Cards"}
            </button>
          </form>

          <p className="text-xs text-white/50 text-center mt-4">
            We'll also send you updates about our card decks and special offers
          </p>
        </div>
      </div>
    </main>
  );
}

export default function FreeEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-white/50">Loading...</p></div>}>
      <FreeEmailContent />
    </Suspense>
  );
}