"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";

// Juliette, 12 Aug 2026: "it is also clunky to be sent to a different
// app" — this screen said nothing about what someone was actually trying
// to open, just a generic "The Feel Fully You App" gate. Matches the
// `next` path's collection slug to a real title so the screen names the
// actual destination instead. Kept as a plain lookup, not a content-file
// import, so this page stays light — add one line here per new product.
const DESTINATION_TITLES: Record<string, string> = {
  "ten-touch-rituals": "The Touch Rituals",
  "the-unspoken-distance": "The Unspoken Distance",
  "when-she-goes-quiet": "When She Goes Quiet",
  "between-touches": "Between Touches",
  "communication-reboot-kit": "The Communication Reboot Kit",
  "members-app": "Members App",
};

function destinationTitle(next: string | undefined): string | null {
  if (!next) return null;
  const match = next.match(/^\/practice\/([^/?]+)/);
  if (!match) return null;
  return DESTINATION_TITLES[match[1]] ?? null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginShell() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-ffy-teal/10 to-ffy-cream px-6">
      <div className="w-full max-w-sm rounded-2xl border-2 border-ffy-gold/30 bg-white p-8 text-center shadow-[0_25px_60px_-15px_rgba(13,53,53,0.35)]">
        <h1 className="font-display text-2xl font-semibold text-ffy-teal">
          The Feel Fully You App
        </h1>
      </div>
    </main>
  );
}

function LoginPageContent() {
  const { sendMagicLink } = useAuth();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") ?? "";
  // Juliette, 12 Aug 2026: "it only signs you back to the feel fully you
  // app- where are the cards?" — ProtectedRoute now sends people here with
  // ?next=<the page they wanted>, carried through the magic link so
  // sign-in actually lands them back where they were headed.
  const next = searchParams.get("next") || undefined;
  const destination = destinationTitle(next);

  const [email, setEmail] = useState(prefillEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const autoSent = useRef(false);

  async function send(targetEmail: string) {
    if (!targetEmail.trim()) return;
    setStatus("sending");
    const { error } = await sendMagicLink(targetEmail, next);
    if (error) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  // Arriving straight from the checkout thank-you page with ?email= already
  // known (Stripe collected it moments ago via rituals-success) — skip
  // asking again and fire the magic link immediately. This is the fix for
  // Juliette's "sign up again with their name" complaint (1 Aug 2026): the
  // buyer now only ever types their email once, at checkout. Ref guard
  // stops React StrictMode's dev double-invoke from sending two emails.
  useEffect(() => {
    if (prefillEmail && !autoSent.current) {
      autoSent.current = true;
      send(prefillEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await send(email);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-ffy-teal/10 to-ffy-cream px-6">
      <div className="w-full max-w-sm rounded-2xl border-2 border-ffy-gold/30 bg-white p-8 text-center shadow-[0_25px_60px_-15px_rgba(13,53,53,0.35)]">
        <h1 className="font-display text-2xl font-semibold text-ffy-teal">
          {destination ? `Open ${destination}` : "The Feel Fully You App"}
        </h1>

        {status === "sent" ? (
          <div className="mt-6">
            <p className="text-ffy-black">Check your email.</p>
            <p className="mt-2 text-sm text-ffy-brown">
              We sent a code to <strong>{email || prefillEmail}</strong>. Type it here, no password needed.
            </p>
            <CodeBox email={email || prefillEmail} next={next} />
            <p className="mt-4 text-xs text-ffy-brown">
              Or tap the link in the email{destination ? ` to open ${destination}` : ""}. On an iPhone home-screen app, use the code.
            </p>
            <button type="button" onClick={() => send(email || prefillEmail)} className="mt-3 text-sm text-ffy-teal underline underline-offset-4">
              Send a new code
            </button>
          </div>
        ) : status === "sending" && prefillEmail ? (
          <div className="mt-6">
            <p className="text-ffy-black">Sending your code…</p>
            <p className="mt-2 text-sm text-ffy-brown">
              to <strong>{prefillEmail}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-ffy-brown">
              {destination
                ? `Enter your email and we'll send you a code to open ${destination}.`
                : "Enter your email and we’ll send you a code to open your library."}{" "}
              Free practices unlock straight away, no purchase
              needed, plus anything you&rsquo;ve already bought.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-ffy-border px-4 py-3 text-ffy-black outline-none focus:border-ffy-gold"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream transition hover:bg-ffy-black disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send my code"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-700">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}

// Juliette, 30 Oct 2026: from the iPhone home-screen app the email link opens
// in Safari, so the home-screen app stayed signed out and showed sales pages.
// Typing the code here signs in the app she is actually holding.
function CodeBox({ email, next }: { email: string; next?: string }) {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = code.replace(/\D/g, "");
    if (token.length < 6) return;
    setState("checking");
    const { data, error } = await supabaseBrowser.auth.verifyOtp({ email: email.toLowerCase().trim(), token, type: "email" });
    if (error || !data.session) { setState("wrong"); return; }
    try {
      await fetch("/api/resolve-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.session.user.id, email: data.session.user.email }),
      });
    } catch {}
    window.location.href = next || "/";
  }
  return (
    <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={10}
        value={code}
        onChange={(e) => { setCode(e.target.value); if (state === "wrong") setState("idle"); }}
        placeholder="Your code"
        aria-label="Your code from the email"
        className="rounded-xl border border-ffy-border px-4 py-3 text-center text-xl tracking-[0.4em] text-ffy-black outline-none focus:border-ffy-gold"
      />
      <button
        type="submit"
        disabled={state === "checking" || code.replace(/\D/g, "").length < 6}
        className="rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream transition hover:bg-ffy-black disabled:opacity-60"
      >
        {state === "checking" ? "Opening…" : "Open my library"}
      </button>
      {state === "wrong" && (
        <p className="text-sm text-red-700">That code didn&rsquo;t work. Check it, or send a new one.</p>
      )}
    </form>
  );
}
