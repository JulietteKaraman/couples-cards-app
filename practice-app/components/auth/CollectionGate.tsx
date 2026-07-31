"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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
  const { entitledCollections, user } = useAuth();

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
          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream"
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
  return (
    <ProtectedRoute>
      <GateContent collectionSlug={collectionSlug}>{children}</GateContent>
    </ProtectedRoute>
  );
}
