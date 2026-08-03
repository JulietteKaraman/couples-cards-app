"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";

// Landing page for the link Supabase emails from resetPassword() (see
// AuthProvider). supabase-js reads the recovery token out of the URL on
// load and establishes a session automatically — this page just waits for
// that, then lets the person set a new password. Fixes the login page's
// previously-dead "reset it from the login screen" line, which pointed at
// nothing (Juliette, 3 Aug 2026).
function ResetPasswordContent() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // If the recovery link already produced a session, we're ready
    // immediately. Otherwise wait for the PASSWORD_RECOVERY event
    // supabase-js fires once it finishes reading the URL.
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => router.push("/app"), 1500);
    } catch (err: any) {
      setError(err.message ?? "Unable to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Set a new password</h1>

        {!ready && !done && (
          <p className="text-sm text-white/70 mt-4">
            Opening your reset link…
          </p>
        )}

        {ready && !done && (
          <form onSubmit={onSubmit} className="space-y-3 mt-4">
            <input
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
              placeholder="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <input
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
              placeholder="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
            <button
              disabled={loading}
              className="w-full rounded-xl bg-white text-black py-2 font-medium disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save new password"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
        )}

        {done && (
          <p className="text-sm text-white/70 mt-4">
            Password updated. Taking you in…
          </p>
        )}

        <p className="text-xs text-white/50 mt-6">
          Link expired or not opening?{" "}
          <Link href="/login" className="underline text-white/70">
            Request a new one
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}
