"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface AuthFormProps {
  redirectAfterLogin?: string;
}

export default function AuthForm({ redirectAfterLogin = "/app" }: AuthFormProps) {
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
        
        // Add user to Ivorey email list
        try {
          const ivoreyRes = await fetch("/api/add-to-ivorey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              firstName,
              lastName,
            }),
          });
          
          if (!ivoreyRes.ok) {
            console.error("Failed to add to Ivorey:", await ivoreyRes.text());
          } else {
            console.log("Successfully added to Ivorey");
          }
        } catch (ivoreyErr) {
          console.error("Error adding to Ivorey:", ivoreyErr);
        }
        
        setMsg("Account created. You can now sign in.");
        setMode("signin");
        // Clear form
        setFirstName("");
        setLastName("");
      } else {
        await signIn(email, password);
        window.location.href = redirectAfterLogin;
      }
    } catch (err: any) {
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

      <details className="pt-2 text-xs text-white/50">
        <summary className="cursor-pointer text-white/60 hover:text-white/80 list-none">
          Can&apos;t log in?
        </summary>
        <ul className="mt-2 space-y-1.5 pl-1">
          <li>
            Use the exact email you paid with. If you&apos;re not sure, check your
            Stripe or PayPal receipt.
          </li>
          <li>
            First time here? Tap &ldquo;Create an account&rdquo; above and use your
            purchase email.
          </li>
          <li>Forgot your password? Reset it from the login screen.</li>
          <li>
            Still stuck? Email{" "}
            <a href="mailto:support@feelfullyyou.com" className="underline text-white/70">
              support@feelfullyyou.com
            </a>{" "}
            and we&apos;ll unlock it for you.
          </li>
        </ul>
      </details>
    </form>
  );
}