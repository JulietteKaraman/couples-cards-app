"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { COLLECTION_DECK_TYPES, FREE_DECK_TYPES } from "@/lib/entitlements/config";

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
  const { entitledCollections, entitlementsReady, user, signOut } = useAuth();

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
  return (
    <ProtectedRoute>
      <GateContent collectionSlug={collectionSlug}>{children}</GateContent>
    </ProtectedRoute>
  );
}
