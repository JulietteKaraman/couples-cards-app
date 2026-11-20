"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { COLLECTION_DECK_TYPES, FREE_DECK_TYPES } from "@/lib/entitlements/config";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

// Spec E6: someone who isn't entitled to a collection must be blocked with
// a clear message if they hit its URL directly, not a silent 404 and
// never the actual content.
function GateContent({
  collectionSlug,
  children,
}: {
  collectionSlug: string;
  children: React.ReactNode;
}) {
  const { entitledCollections, entitlementsReady, user, signOut, refreshEntitlements } = useAuth();
  // "Can't get in?" (20 Nov 2026): checks Stripe right now and lets a paying member straight back in.
  const [check, setCheck] = useState<"idle" | "checking" | "none" | "error">("idle");
  const recheck = async () => {
    setCheck("checking");
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const res = await fetch("/api/confessions/restore", { method: "POST", headers: { Authorization: `Bearer ${data.session?.access_token}` } });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      if (j.member) { await refreshEntitlements(); window.location.reload(); return; }
      setCheck("none");
    } catch { setCheck("error"); }
  };

  // Wait quietly until access has actually been read, so a real buyer never
  // sees "This isn't on your account" flash up first (fixed 24 Oct 2026).
  if (!entitlementsReady && !entitledCollections.includes(collectionSlug)) {
    return <main className="min-h-screen bg-ffy-cream" aria-busy="true" />;
  }

  if (!entitledCollections.includes(collectionSlug)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ffy-cream px-6 text-center">
        <div>
          <p className="font-display text-lg text-ffy-teal">
            This isn&rsquo;t on your account.
          </p>
          <p className="mt-2 max-w-sm text-sm text-ffy-brown">
            {user?.email} doesn&rsquo;t have access to this yet. If you
            think that&rsquo;s wrong, email{" "}
            <a href="mailto:support@feelfullyyou.com" className="underline">
              support@feelfullyyou.com
            </a>
            .
          </p>
          {collectionSlug === "scrumptious-confessions" && (
            <div className="mt-6">
              <button type="button" onClick={recheck} disabled={check === "checking"}
                className="block w-full rounded-full border border-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-teal sm:mx-auto sm:w-auto">
                {check === "checking" ? "Checking your membership\u2026" : "Can\u2019t get in? Check my membership"}
              </button>
              {check === "none" && <p className="mt-2 max-w-sm text-sm text-ffy-brown">I can&rsquo;t find a membership for {user?.email}. If you paid with another email, sign in with that one below.</p>}
              {check === "error" && <p className="mt-2 max-w-sm text-sm text-ffy-brown">That didn&rsquo;t work just now. Try again in a minute, or email support@feelfullyyou.com.</p>}
            </div>
          )}
          {/* The most common cause is signing in with a different email
              from the one used to pay. Give them a way out (24 Oct 2026). */}
          <button
            type="button"
            onClick={async () => {
              const here = window.location.pathname;
              await signOut();
              window.location.href = `/login?next=${encodeURIComponent(here)}`;
            }}
            className="mt-6 block w-full rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream sm:mx-auto sm:w-auto"
          >
            Paid with a different email? Sign in with that one
          </button>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-ffy-teal underline underline-offset-4"
          >
            Back to your library
          </a>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export function CollectionGate({
  collectionSlug,
  children,
}: {
  collectionSlug: string;
  children: React.ReactNode;
}) {
  // Free guides (When She Goes Quiet) open with no sign-in at all
  // (Juliette, 24 Oct 2026: "Now make that free. It doesn't need to be
  // signed in first."). Progress ticks still save for anyone signed in.
  if (FREE_DECK_TYPES.includes(COLLECTION_DECK_TYPES[collectionSlug] ?? collectionSlug)) {
    return <>{children}</>;
  }
  // Local preview only: lets Claude walk a paid product on this computer
  // without a buyer login. Never true on the live site (NODE_ENV is
  // "production" there and the variable is not set).
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_OPEN === "1") {
    return <>{children}</>;
  }
  return (
    <ProtectedRoute>
      <GateContent collectionSlug={collectionSlug}>{children}</GateContent>
    </ProtectedRoute>
  );
}
