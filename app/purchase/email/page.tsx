"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PurchaseEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "couples";

  useEffect(() => {
    // Redirect to login, which will redirect back here after login
    // Then after login, user goes to checkout
    const redirectPath = `/app/${product}/unlock`;
    router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}&signup=true`);
  }, [router, product]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/50">Redirecting to sign in...</p>
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