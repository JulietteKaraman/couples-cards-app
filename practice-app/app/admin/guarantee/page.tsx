"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// JULIETTE'S GUARANTEE PAGE (9 Nov 2026). 31 Touch Points "do the work"
// guarantee: 21 of 31 days, claim between day 31 and day 60 after purchase.
// Someone emails asking for a refund; she types their email here and sees
// which days they did, and when. Never what they wrote. Refunds by hand in Stripe.

type Result = {
  found: boolean; email: string; owns?: boolean; purchasedAt?: string | null;
  windowOpens?: string | null; windowCloses?: string | null; inWindow?: boolean;
  needed?: number; doneCount?: number; meets?: boolean; fillCheckFrom?: string;
  days?: { day: number; at: string }[];
};

const nice = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "unknown";

export default function GuaranteePage() {
  // Local preview only, same rule as the drop page: never true live.
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_OPEN === "1") return <Lookup />;
  return (
    <ProtectedRoute>
      <Gate />
    </ProtectedRoute>
  );
}

function Gate() {
  const { user } = useAuth();
  if (user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return <main className="flex min-h-screen items-center justify-center bg-[#070707] text-[#f1ece2]">This page is only for Juliette.</main>;
  }
  return <Lookup />;
}

function Lookup() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [r, setR] = useState<Result | null>(null);
  // Local preview only: ?demo=1 fills in the made-up example straight away.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (new URLSearchParams(window.location.search).get("demo") !== "1") return;
    const days = Array.from({ length: 23 }, (_, i) => ({ day: i + 1, at: new Date(Date.parse("2026-11-10T08:00:00Z") + i * 86400000 + Math.floor(i / 5) * 86400000).toISOString() }));
    setEmail("example@preview.local");
    setR({ found: true, email: "example@preview.local", owns: true, purchasedAt: "2026-11-09T10:00:00Z", windowOpens: "2026-12-10T10:00:00Z", windowCloses: "2027-01-08T10:00:00Z", inWindow: false, needed: 21, doneCount: 23, meets: true, fillCheckFrom: "2026-11-09", days });
  }, []);

  async function find(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setR(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your session expired. Refresh and sign in again.");
      const res = await fetch(`/api/admin/guarantee?email=${encodeURIComponent(email)}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setR(json);
    } catch (e2) {
      // Local preview has no database: show a made-up example so the layout can be checked.
      if (process.env.NODE_ENV === "development") {
        const days = Array.from({ length: 23 }, (_, i) => ({ day: i + 1, at: new Date(Date.parse("2026-11-10T08:00:00Z") + i * 86400000 * (i % 5 === 4 ? 2 : 1)).toISOString() }));
        setR({ found: true, email: "example@preview.local", owns: true, purchasedAt: "2026-11-09T10:00:00Z", windowOpens: "2026-12-10T10:00:00Z", windowCloses: "2027-01-08T10:00:00Z", inWindow: false, needed: 21, doneCount: 23, meets: true, fillCheckFrom: "2026-11-09", days });
        return;
      }
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-transparent px-4 py-3 text-[16px] text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:border-[#DDC98E] focus:outline-none";

  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-xl px-5 pb-20 pt-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">31 Touch Points · your guarantee</p>
        <h1 className="mt-2 font-display text-3xl font-light">Did they do the work?</h1>
        <p className="mt-2 text-[15px] text-[#a79f90]">At least 21 of 31 days, asked for between day 31 and day 60 after they bought. You see which days and when, never what they wrote.</p>

        <form onSubmit={find} className="mt-7 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
          <label className="block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">Their email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="the email they bought with" className={field} />
          </label>
          <button disabled={busy} className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] disabled:opacity-60">
            {busy ? "Looking…" : "Look them up"}
          </button>
          {err && <p className="mt-3 text-[15px] text-[#e8a08a]">{err}</p>}
        </form>

        {r && !r.found && <p className="mt-8 text-[16px] text-[#cfc8bb]">No app account for {r.email}. They may have bought with a different email.</p>}

        {r && r.found && (
          <section className="mt-8 space-y-4">
            {!r.owns && <p className="rounded-2xl border border-[#e8a08a]/50 p-4 text-[15px] text-[#e8a08a]">{r.email} has an account but no 31 Touch Points.</p>}

            <div className={`rounded-3xl border-2 p-6 text-center ${r.meets ? "border-[#5fae5a]" : "border-[#DDC98E]/50"}`}>
              <p className="font-display text-5xl font-light">{r.doneCount} <span className="text-[#a79f90]">of 31</span></p>
              <p className="mt-2 text-[16px]">{r.meets ? `Yes: ${r.doneCount} days done, ${r.needed} needed.` : `Not yet: ${r.doneCount} days done, ${r.needed} needed.`}</p>
            </div>

            <div className="rounded-2xl border border-[#DDC98E]/25 p-4 text-[15px] leading-relaxed text-[#cfc8bb]">
              <p>Bought: <span className="text-[#f1ece2]">{nice(r.purchasedAt)}</span></p>
              <p>Can ask from: <span className="text-[#f1ece2]">{nice(r.windowOpens)}</span> to <span className="text-[#f1ece2]">{nice(r.windowCloses)}</span></p>
              <p className={r.inWindow ? "text-[#5fae5a]" : "text-[#EEDE80]"}>{r.inWindow ? "Inside the window today." : "Outside the window today."}</p>
            </div>

            <div className="rounded-2xl border border-[#DDC98E]/25 p-4">
              <p className="text-[12px] uppercase tracking-[0.16em] text-[#DDC98E]">Day by day</p>
              <ul className="mt-3 grid grid-cols-1 gap-1 text-[15px] text-[#cfc8bb] sm:grid-cols-2">
                {(r.days || []).map((d) => (
                  <li key={d.day}><span className="inline-block w-16 text-[#DDC98E]">Day {d.day}</span>{nice(d.at)}</li>
                ))}
                {(r.days || []).length === 0 && <li>No days marked done.</li>}
              </ul>
              <p className="mt-3 text-[12px] text-[#8f877a]">From {nice(r.fillCheckFrom)} a day only counts once it is filled in (how it felt, and both boxes on giver and receiver days). Days before that counted on &ldquo;I did it&rdquo; alone.</p>
            </div>

            <p className="text-[14px] text-[#a79f90]">If it&rsquo;s a yes, refund them by hand in Stripe.</p>
          </section>
        )}
      </div>
    </main>
  );
}
