"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "./ui/AuthForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const signup = searchParams.get("signup");

  const isPurchaseFlow = redirect && redirect.includes("/unlock");

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">
          {signup === "true" ? "Create account" : "Sign in"}
        </h1>
        <p className="text-sm text-white/70 mt-1">
          {isPurchaseFlow
            ? "Create an account to complete your purchase"
            : "Access your card deck purchase."}
        </p>

        <div className="mt-6">
          <AuthForm redirectAfterLogin={redirect || "/app"} />
        </div>

        <p className="text-xs text-white/50 mt-6">
          By continuing you agree to our terms and privacy policy.
        </p>

        <Link className="text-xs underline text-white/70 mt-3 inline-block" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-white/50">Loading...</p></div>}>
      <LoginPageContent />
    </Suspense>
  );
}