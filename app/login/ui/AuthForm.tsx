"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabaseBrowser.auth.signUp({ email, password });
        console.log(error)
        if (error) throw error;
        setMsg("Account created. You can now sign in.");
        setMode("signin");
      } else {
        const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/app";
      }
    } catch (err: any) {
      setMsg(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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
