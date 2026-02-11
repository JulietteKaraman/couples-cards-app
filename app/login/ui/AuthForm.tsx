"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, error: authError, clearError } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    clearError();
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, firstName, lastName);
        setMsg("Account created. You can now sign in.");
        setMode("signin");
        // Clear form
        setFirstName("");
        setLastName("");
      } else {
        await signIn(email, password);
        window.location.href = "/app";
      }
    } catch (err: any) {
      // Error is handled in context, but we display it here
      setMsg(authError ?? err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {mode === "signup" && (
        <>
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </>
      )}
      <input
        className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-white text-black py-2 font-medium disabled:opacity-60"
      >
        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>

      <button
        type="button"
        className="w-full rounded-xl border border-white/15 py-2 text-sm text-white/80"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "Create an account" : "I already have an account"}
      </button>

      {msg && <p className="text-sm text-white/70">{msg}</p>}
    </form>
  );
}
