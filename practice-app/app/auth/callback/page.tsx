"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-ffy-cream">
          <p className="text-ffy-brown">Signing you in…</p>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Juliette, 12 Aug 2026: "it only signs you back to the feel fully you
  // app- where are the cards?" — always landed home before. Now returns
  // to whatever page the sign-in was actually started from.
  const next = searchParams.get("next") || "/";
  const [status, setStatus] = useState<"working" | "expired" | "error">(
    "working"
  );

  useEffect(() => {
    async function run() {
      // Supabase's client picks the magic-link token up from the URL hash
      // automatically once a session is available.
      const { data, error } = await supabaseBrowser.auth.getSession();

      if (error || !data.session) {
        // E5: expired or already-used link — show a clear state, not a
        // raw error, with a way back to request a new one.
        setStatus("expired");
        return;
      }

      const user = data.session.user;
      try {
        await fetch("/api/resolve-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, email: user.email }),
        });
      } catch {
        // Resolve is best-effort here; the library page loads whatever
        // entitlements exist regardless, and this call is idempotent so
        // a retry costs nothing.
      }

      router.replace(next);
    }
    run();
  }, [router, next]);

  if (status === "expired") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ffy-cream px-6 text-center">
        <div>
          <p className="font-display text-lg text-ffy-teal">
            That link&rsquo;s expired.
          </p>
          <p className="mt-2 text-sm text-ffy-brown">
            Links are one-time and time-limited. Request a new one below.
          </p>
          <a
            href={`/login?next=${encodeURIComponent(next)}`}
            className="mt-6 inline-block rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream"
          >
            Get a new link
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ffy-cream">
      <p className="text-ffy-brown">Signing you in…</p>
    </main>
  );
}
