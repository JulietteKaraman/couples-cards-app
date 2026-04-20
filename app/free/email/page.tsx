"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function FreeEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckType = searchParams.get("deck") || "couples";
  const [submitted, setSubmitted] = useState(false);

  const deckNames: Record<string, string> = {
    couples: "Couples Edition",
    friends: "Friends & Family Edition",
  };

  const deckName = deckNames[deckType] || "Couples Edition";

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "form_submitted" || event.data?.type === "ivorey_form_success") {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/free");
        }, 1500);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

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
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">You're in!</h2>
              <p className="text-white/70">Redirecting to your free cards...</p>
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

              <div 
                className="w-full rounded-2xl overflow-hidden border border-white/10"
                style={{ height: "468px" }}
              >
                <iframe
                  src="https://links.ivorey.io/widget/form/TLzYfnzCX3pUjQd9FAK1"
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "3px" }}
                  id="inline-TLzYfnzCX3pUjQd9FAK1"
                  data-layout='{"id":"INLINE"}'
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Pick A Card"
                  data-height="468"
                  data-layout-iframe-id="inline-TLzYfnzCX3pUjQd9FAK1"
                  data-form-id="TLzYfnzCX3pUjQd9FAK1"
                  title="Pick A Card"
                />
                <script src="https://links.ivorey.io/js/form_embed.js" async></script>
              </div>
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