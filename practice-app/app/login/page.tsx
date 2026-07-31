"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    const { error } = await sendMagicLink(email);
    if (error) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ffy-cream px-6">
      <div className="w-full max-w-sm rounded-2xl border border-ffy-border bg-white/70 p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ffy-teal">
          The Feel Fully You App
        </h1>

        {status === "sent" ? (
          <div className="mt-6">
            <p className="text-ffy-black">Check your email.</p>
            <p className="mt-2 text-sm text-ffy-brown">
              We sent a link to <strong>{email}</strong>. Tap it on this
              device to sign in, no password needed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-ffy-brown">
              Enter the email you used to buy, and we&rsquo;ll send you a
              link to open your library.
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
              {status === "sending" ? "Sending…" : "Send my link"}
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
