"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UnlockPage() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user?.id || !user.email) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const out = await res.json();
      window.location.href = out.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Unlock Couples Edition</h1>
        <p className="text-sm text-white/70">One-time purchase • £25</p>

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
