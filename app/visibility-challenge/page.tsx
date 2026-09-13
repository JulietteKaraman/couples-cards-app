"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VisibilityChallengeEntryPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-visibility-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("visibility_challenge_email", email.trim().toLowerCase());
      localStorage.setItem("visibility_challenge_started_at", data.startedAt);
      router.push("/visibility-challenge/day");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        <p className="text-xs tracking-widest text-white/50 uppercase text-center mb-4">
          Feel Fully You
        </p>
        <h1 className="text-3xl font-semibold text-center mb-4">
          The Visibility Challenge
        </h1>
        <p className="text-white/70 text-center mb-2">
          21 days. One question a day. No app to download, no password to remember.
        </p>
        <p className="text-white/50 text-sm text-center mb-8">
          Enter your email once, come back here any day and enter it again to pick up exactly
          where you left off.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50"
          />
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-4 font-medium text-lg disabled:opacity-50"
          >
            {loading ? "One moment…" : "Start Day 1"}
          </button>
        </form>

        <p className="text-xs text-white/30 text-center mt-6">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </main>
  );
}
