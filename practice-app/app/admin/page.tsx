"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { COLLECTION_DECK_TYPES } from "@/lib/entitlements/config";

type Buyer = {
  email: string;
  deck_type: string;
  purchased_at: string;
  completed_count: number;
};

// Friendly names for the dropdown. Keyed on deck_type so it stays in step
// with COLLECTION_DECK_TYPES — anything without a label here still shows,
// using its raw deck_type, rather than quietly vanishing from the list.
const PRODUCT_LABELS: Record<string, string> = {
  "31-touch-points": "31 Touch Points",
  "ten-touch-rituals": "10 Touch Rituals",
  "unspoken-distance": "The Unspoken Distance",
  "when-she-goes-quiet": "When She Goes Quiet",
  "between-touches": "Between Touches",
  "communication-reboot-kit": "Communication Reboot Kit",
  "members-app": "Members App",
};

const DECK_TYPES = Object.values(COLLECTION_DECK_TYPES);

function GrantAccess({ onGranted }: { onGranted: () => void }) {
  const [email, setEmail] = useState("");
  const [deckType, setDeckType] = useState("31-touch-points");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function grant(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    setError(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Your session expired. Refresh the page and sign in again.");
        return;
      }
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, deckType }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "That didn't go through.");
        return;
      }
      // Say what they hold NOW, read back from the database, not just
      // "done" — the whole reason this screen exists is that a grant once
      // claimed success and silently hadn't happened.
      const holds = (json.decks as { deck_type: string }[])
        .map((d) => PRODUCT_LABELS[d.deck_type] ?? d.deck_type)
        .join(", ");
      setResult(`${json.email} is in. They now have: ${holds}.`);
      setEmail("");
      onGranted();
    } catch {
      setError("That didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-12 rounded-2xl border border-ffy-border bg-white/60 p-6">
      <h2 className="font-display text-lg font-semibold text-ffy-teal">
        Give someone access
      </h2>
      <p className="mt-1 text-sm text-ffy-brown">
        For comped places, retreat guests, and anyone whose purchase didn&rsquo;t
        come through. They don&rsquo;t need an account first. Access waits for
        them, and their first sign-in link takes them straight in.
      </p>

      <form onSubmit={grant} className="mt-5 flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-[16rem] text-sm text-ffy-brown">
          Their email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="mt-1 w-full rounded-xl border border-ffy-border bg-white px-3 py-2 text-ffy-teal"
          />
        </label>

        <label className="min-w-[14rem] text-sm text-ffy-brown">
          Product
          <select
            value={deckType}
            onChange={(e) => setDeckType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ffy-border bg-white px-3 py-2 text-ffy-teal"
          >
            {DECK_TYPES.map((dt) => (
              <option key={dt} value={dt}>
                {PRODUCT_LABELS[dt] ?? dt}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-ffy-teal px-5 py-2.5 font-display text-sm font-medium text-ffy-cream disabled:opacity-50"
        >
          {busy ? "Granting…" : "Give access"}
        </button>
      </form>

      {result && <p className="mt-4 text-sm text-ffy-teal">{result}</p>}
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
    </section>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [buyers, setBuyers] = useState<Buyer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const loadBuyers = useCallback(async () => {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch("/api/admin/buyers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError("Could not load buyers.");
      return;
    }
    const json = await res.json();
    setBuyers(json.buyers);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadBuyers();
  }, [isAdmin, loadBuyers]);

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ffy-cream px-6 text-center">
        <p className="text-ffy-brown">This screen isn&rsquo;t available on this account.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ffy-cream px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ffy-teal">
          Buyers &amp; progress
        </h1>
        <p className="mt-1 mb-10 text-sm text-ffy-brown">
          Everyone with real account access in this app, and how far they&rsquo;ve gotten.
        </p>

        <GrantAccess onGranted={loadBuyers} />

        {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

        {!buyers && !error && (
          <p className="mt-6 text-sm text-ffy-brown">Loading…</p>
        )}

        {buyers && buyers.length === 0 && (
          <p className="mt-6 text-sm text-ffy-brown">No real buyers yet.</p>
        )}

        {buyers && buyers.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ffy-border text-xs uppercase tracking-wide text-ffy-gold-deep">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Purchased</th>
                  <th className="px-4 py-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((b, i) => (
                  <tr key={i} className="border-b border-ffy-border last:border-0">
                    <td className="px-4 py-3">{b.email}</td>
                    <td className="px-4 py-3">
                      {PRODUCT_LABELS[b.deck_type] ?? b.deck_type}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(b.purchased_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{b.completed_count} entries done</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
