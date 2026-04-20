"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function FreeEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckType = searchParams.get("deck") || "couples";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");

  const deckNames: Record<string, string> = {
    couples: "Couples Edition",
    friends: "Friends & Family Edition",
  };

  const deckName = deckNames[deckType] || "Couples Edition";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      // Create user in our app and log to ivorey_submissions
      const res = await fetch("/api/create-free-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, deck: deckType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStep("success");
      setTimeout(() => {
        router.push("/free");
      }, 2000);
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
          {step === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">You're in!</h2>
              <p className="text-white/70">Sending you to your free cards...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold mb-2">Unlock Free Cards</h1>
                <p className="text-white/70">
                  Enter your email to access 5 free {deckName} cards
                </p>
                <p className="text-white/50 text-sm mt-2">
                  We'll also send you updates about our card decks and special offers
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
                  {loading ? "Creating account..." : "Get Free Cards"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-xs text-white/50 text-center mt-4">
          By signing up, you agree to our terms and privacy policy
        </p>
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