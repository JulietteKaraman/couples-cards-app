"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// What Juliette learns from Scrumptious Confessions: the questions bank (every
// question, confession and answer from the app and the Telegram group, no names),
// plus totals (specs/scrumptious-confessions-membership.md R12, R16, R17).
type Item = { id: string; title: string; type: string; publish_on: string };
type Message = { id: string; item_title: string; body: string; kind: string; source: string; answered: boolean; created_at: string };
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

const KIND: Record<string, string> = { question: "Question", confession: "Confession", telegram: "Group post", love_next: "Love next", card: "Card answer" };
const FILTERS = [
  { id: "open", label: "Not answered" },
  { id: "question", label: "Questions" },
  { id: "confession", label: "Confessions" },
  { id: "telegram", label: "From Telegram" },
  { id: "all", label: "Everything" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];
const keep = (f: FilterId, m: Message) =>
  f === "all" ? true : f === "open" ? !m.answered : f === "telegram" ? m.source === "telegram" : m.kind === f;

async function authed(url: string, init?: RequestInit) {
  const { data: s } = await supabaseBrowser.auth.getSession();
  return fetch(url, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session?.access_token}` } });
}

function Inner() {
  const { user } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const allowed = (user?.email || "").toLowerCase() === ADMIN_EMAIL;
  const [filter, setFilter] = useState<FilterId>("open");
  const [note, setNote] = useState("");

  const toggle = async (m: Message) => {
    const answered = !m.answered;
    setData((d) => d && { ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, answered } : x)) });
    const res = await authed("/api/admin/confessions", { method: "PATCH", body: JSON.stringify({ id: m.id, answered }) }).catch(() => null);
    if (!res?.ok) { setNote("That didn't save. Try again."); setData((d) => d && { ...d, messages: d.messages.map((x) => (x.id === m.id ? { ...x, answered: !answered } : x)) }); }
  };
  const copyOpen = async () => {
    const qs = (data?.messages || []).filter((m) => !m.answered && (m.kind === "question" || m.kind === "telegram"));
    const text = qs.map((m) => `- ${m.body.replace(/\s+/g, " ").trim()}`).join("\n");
    try { await navigator.clipboard.writeText(text); setNote(`Copied ${qs.length}. Paste them into Notion.`); } catch { setNote("Couldn't copy on this device."); }
  };
  const connect = async () => {
    setNote("Connecting…");
    const res = await authed("/api/admin/telegram-connect", { method: "POST" }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setNote(res?.ok ? "Telegram is connected. New posts in the group will land here." : json.error || "Couldn't connect. Try again.");
  };

  useEffect(() => {
    if (!allowed) return;
    (async () => {
      try {
        const res = await authed("/api/admin/confessions");
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
            <h2 className="mt-8 font-display text-2xl font-light">Questions bank</h2>
            <p className="mt-1 text-[14px] text-[#a79f90]">From the app and the Telegram group. No names, ever.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const n = data.messages.filter((m) => keep(f.id, m)).length;
                return (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`min-h-[40px] rounded-full border px-3 text-[13px] ${filter === f.id ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]"}`}>
                    {f.label} {n}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={copyOpen} className="min-h-[44px] rounded-full border border-[#DDC98E] text-[14px] text-[#DDC98E]">Copy unanswered questions</button>
              <button type="button" onClick={connect} className="min-h-[44px] rounded-full border border-[#DDC98E]/50 text-[14px] text-[#f1ece2]">Connect Telegram</button>
            </div>
            {note && <p className="mt-2 text-[14px] text-[#EEDE80]">{note}</p>}
            {data.messages.filter((m) => keep(filter, m)).length === 0 && <p className="mt-3 text-[#a79f90]">Nothing here yet.</p>}
            <div className="mt-3 space-y-3">
              {data.messages.filter((m) => keep(filter, m)).map((m) => (
                <div key={m.id} className={`rounded-2xl border p-4 ${m.answered ? "border-[#DDC98E]/15 opacity-60" : "border-[#DDC98E]/30"}`}>
                  <p className="text-[12px] text-[#a79f90]">{new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {KIND[m.kind] ?? m.kind} · {m.source === "telegram" ? "Telegram" : "App"}{m.kind === "love_next" || m.kind === "card" ? ` · ${m.item_title}` : ""}</p>
                  <p className="mt-2 whitespace-pre-wrap text-[16px]">{m.body}</p>
                  <button type="button" onClick={() => toggle(m)} className="mt-2 inline-flex min-h-[40px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">
                    {m.answered ? "Answered ✓ (undo)" : "Mark answered"}
                  </button>
                </div>
              ))}
            </div>
            <h2 className="mt-10 font-display text-2xl font-light">Touch Base</h2>
            <p className="mt-2 text-[14px] text-[#cfc8bb]"><span className="text-[#DDC98E]">Days done, all members: </span>{data.totals.touchbase?.touchbase_done?.yes ?? 0}</p>
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
