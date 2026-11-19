"use client";

// The way in for the free fortnight (Juliette 16 Nov 2026). The 23 Nov email
// links here. Sign in with your email (no password, no card), and your two
// free weeks of Scrumptious Confessions open on the spot.

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";

const JOIN = "https://buy.stripe.com/cNi8wOfSzfpucm11Yx0co2z";

export default function FreeFortnight() {
  return (
    <ProtectedRoute>
      <Claim />
    </ProtectedRoute>
  );
}

function Claim() {
  const { refreshEntitlements } = useAuth();
  const [state, setState] = useState<"working" | "not-yet" | "closed" | "error">("working");
  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch("/api/confessions/free-claim", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        await refreshEntitlements?.();
        window.location.replace("/practice/scrumptious-confessions");
        return;
      }
      setState(json.state === "not-yet" || json.state === "closed" ? json.state : "error");
    })();
    // Runs once. refreshEntitlements is a new function each render, so it must not be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-center text-ffy-cream">
      <div className="max-w-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Scrumptious Confessions</p>
        {state === "working" && <p className="mt-4 font-display text-[24px] font-light">Opening your two free weeks&hellip;</p>}
        {state === "not-yet" && (
          <>
            <p className="mt-4 font-display text-[26px] font-light leading-tight">Your free place opens on Monday 23 November.</p>
            <p className="mt-3 text-[15px] text-[#a79f90]">Come back to this link that morning and you&rsquo;re in.</p>
          </>
        )}
        {state === "closed" && (
          <>
            <p className="mt-4 font-display text-[26px] font-light leading-tight">The way in is now 7 days free.</p>
            <p className="mt-3 text-[15px] text-[#a79f90]">Your card goes in to start. Nothing is charged for 7 days, then it&apos;s &pound;111 a month. Stop before day 8 and you pay nothing.</p>
            <a href={JOIN} className="mt-6 flex min-h-[52px] items-center justify-center rounded-full bg-[#DDC98E] px-6 text-[16px] font-medium text-[#070707]">Start my 7 days free</a>
          </>
        )}
        {state === "error" && (
          <>
            <p className="mt-4 font-display text-[24px] font-light">That didn&rsquo;t open.</p>
            <p className="mt-3 text-[15px] text-[#a79f90]">Try the link again in a minute, or email support@feelfullyyou.com and I&rsquo;ll let you in.</p>
          </>
        )}
      </div>
    </main>
  );
}
