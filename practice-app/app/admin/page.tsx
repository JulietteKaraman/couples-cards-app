"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

type Buyer = {
  email: string;
  deck_type: string;
  purchased_at: string;
  completed_count: number;
};

function AdminContent() {
  const { user } = useAuth();
  const [buyers, setBuyers] = useState<Buyer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
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
    });
  }, [isAdmin]);

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
        <p className="mt-1 text-sm text-ffy-brown">
          Everyone with real account access in this app, and how far they&rsquo;ve gotten.
        </p>

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
                    <td className="px-4 py-3">{b.deck_type}</td>
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
