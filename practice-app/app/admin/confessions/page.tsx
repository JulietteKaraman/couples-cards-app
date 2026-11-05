"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// What Juliette learns from Scrumptious Confessions: totals with no names,
// and the answers women chose to send her (specs/scrumptious-confessions-membership.md R12).
type Item = { id: string; title: string; type: string; publish_on: string };
type Message = { id: string; item_title: string; body: string; member_email: string | null; emailed: boolean; created_at: string };
type Data = { items: Item[]; totals: Record<string, Record<string, Record<string, number>>>; messages: Message[] };

const LABELS: Record<string, string> = {
  ick: "Ick", nothing: "Nothing", nice: "Nice", mmm: "Mmm", goosebumps: "Goosebumps", "toes-curl": "Toes curl",
  chest: "Chest", belly: "Belly", genitals: "Genitals", elsewhere: "Somewhere else", nowhere: "Nowhere yet",
};

function Line({ name, values }: { name: string; values?: Record<string, number> }) {
  if (!values) return null;
  return (
    <p className="mt-2 text-[14px] text-[#cfc8bb]">
      <span className="text-[#DDC98E]">{name}: </span>
      {Object.entries(values).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${LABELS[k] ?? k} ${n}`).join(" · ")}
    </p>
  );
}

function Inner() {
  const { user } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const allowed = (user?.email || "").toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!allowed) return;
    (async () => {
      try {
        const { data: s } = await supabaseBrowser.auth.getSession();
        const res = await fetch("/api/admin/confessions", { headers: { Authorization: `Bearer ${s.session?.access_token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load");
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load");
      }
    })();
  }, [allowed]);

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream">
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <a href="/admin" className="mb-5 inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[rgba(221,201,142,0.55)] px-4 text-sm text-[#DDC98E]">← Admin</a>
        <h1 className="font-display text-3xl font-light">Scrumptious Confessions</h1>
        {!allowed && <p className="mt-4 text-[#cfc8bb]">This page is only for Juliette.</p>}
        {error && <p className="mt-4 text-[#cfc8bb]">{error}</p>}
        {data && (
          <>
            <h2 className="mt-8 font-display text-2xl font-light">What they told you</h2>
            {data.messages.length === 0 && <p className="mt-3 text-[#a79f90]">Nothing sent yet.</p>}
            <div className="mt-3 space-y-3">
              {data.messages.map((m) => (
                <div key={m.id} className="rounded-2xl border border-[#DDC98E]/30 p-4">
                  <p className="text-[12px] text-[#a79f90]">{new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {m.member_email ?? "Without her name"} · {m.item_title}</p>
                  <p className="mt-2 whitespace-pre-wrap text-[16px]">{m.body}</p>
                </div>
              ))}
            </div>
            <h2 className="mt-10 font-display text-2xl font-light">The totals, no names</h2>
            <div className="mt-3 space-y-3">
              {data.items.map((i) => {
                const t = data.totals[i.id] || {};
                return (
                  <div key={i.id} className="rounded-2xl border border-[#DDC98E]/30 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#a79f90]">{i.type} · {i.publish_on}</p>
                    <p className="mt-1 font-display text-[19px] font-light">{i.title}</p>
                    <Line name="Landed" values={t.landed} />
                    <Line name="Felt in" values={t.where} />
                    {t.card_answered && <p className="mt-2 text-[14px] text-[#cfc8bb]"><span className="text-[#DDC98E]">Answered: </span>{t.card_answered.yes}</p>}
                    {!Object.keys(t).length && <p className="mt-2 text-[14px] text-[#a79f90]">No answers yet.</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function AdminConfessionsPage() {
  return <ProtectedRoute><Inner /></ProtectedRoute>;
}
