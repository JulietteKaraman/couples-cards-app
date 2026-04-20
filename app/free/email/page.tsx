"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function FreeEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckType = searchParams.get("deck") || "couples";
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const deckNames: Record<string, string> = {
    couples: "Couples Edition",
    friends: "Friends & Family Edition",
  };

  const deckName = deckNames[deckType] || "Couples Edition";

  // Listen for Ivorey form submission
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "form_submitted" || 
          (event.data && typeof event.data === 'object' && event.data.type === 'form_submission_success') ||
          (event.data && typeof event.data === 'string' && event.data.includes('submitted'))) {
        setShowContinue(true);
        setTimeout(() => {
          router.push("/free");
        }, 1500);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  // Show continue button as fallback after iframe loads
  function handleContinue() {
    setShowContinue(true);
    router.push("/free");
  }

  // Show success state
  if (showContinue) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">You're in!</h2>
            <p className="text-white/70">Sending you to your free cards...</p>
          </div>
        </div>
      </main>
    );
  }

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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Unlock Free Cards</h1>
            <p className="text-white/70">
              Enter your email to access 5 free {deckName} cards
            </p>
            <p className="text-white/50 text-sm mt-2">
              We'll also send you updates about our card decks and special offers
            </p>
          </div>

          {/* Ivorey embed */}
          <div 
            className="w-full rounded-2xl overflow-hidden border border-white/10"
            style={{ height: "380px" }}
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
              data-height="380"
              data-layout-iframe-id="inline-TLzYfnzCX3pUjQd9FAK1"
              data-form-id="TLzYfnzCX3pUjQd9FAK1"
              title="Pick A Card"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>

          {/* Continue button as fallback */}
          <div className="mt-6 w-full">
            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-white text-black py-3 font-medium"
            >
              Continue to Free Cards
            </button>
            <p className="text-xs text-white/50 text-center mt-2">
              Already submitted your email? Click to continue
            </p>
          </div>
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