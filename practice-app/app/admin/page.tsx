"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { COLLECTION_DECK_TYPES } from "@/lib/entitlements/config";

type Buyer = {
  user_id: string;
  email: string;
  deck_type: string;
  purchased_at: string;
  expires_at: string | null;
  changeable: boolean;
  status?: string;
  completed_count: number;
};

// 23 Nov 2026: her own test addresses stay out of the list unless she switches them on.
const isTest = (email: string) => /^juliette(\+[^@]*)?@feelfullyyou\.com$/i.test(email) || /^jckaraman@(me|aol)\.com$/i.test(email);
const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

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
  "how-to-feel-like-a-woman": "How to Feel Like a Woman",
  "scrumptious-confessions": "Scrumptious Confessions",
};

const DECK_TYPES = Object.values(COLLECTION_DECK_TYPES);

function GrantAccess({ onGranted }: { onGranted: () => void }) {
  const [email, setEmail] = useState("");
  const [deckType, setDeckType] = useState("31-touch-points");
  // 20 Nov 2026: a free month (e.g. Juliette's Scrumptious Stroking ladies) ends on its own after 30 days.
  const [length, setLength] = useState<"forever" | "month" | "week" | "three" | "date">("forever");
  const [until, setUntil] = useState("");
  const [open, setOpen] = useState(false);
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
        body: JSON.stringify({ email, deckType, length, until }),
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
      setResult(`${json.email} is in. They now have: ${holds}.${json.kit === "member emails on" ? " Member emails are on." : json.kit && json.kit !== "skipped" ? ` Kit did not take it (${json.kit}): add the Member tag by hand.` : ""}`);
      setEmail("");
      onGranted();
    } catch {
      setError("That didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-ffy-border bg-white/60 p-6">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <h2 className="font-display text-lg font-semibold text-ffy-teal">Give someone access</h2>
        <span className="text-sm text-ffy-gold-deep">{open ? "Close" : "Open"}</span>
      </button>
      {(open || result) && <>
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

        <label className="text-sm text-ffy-brown">
          For how long
          <select value={length} onChange={(e) => setLength(e.target.value as "forever" | "month" | "week" | "three" | "date")} className="mt-1 w-full rounded-xl border border-ffy-border bg-white px-3 py-2 text-ffy-teal">
            <option value="forever">Forever</option>
            <option value="three">Three months free</option>
            <option value="month">One month free</option>
            <option value="week">One week free</option>
            <option value="date">Until a date I pick</option>
          </select>
        </label>
        {length === "date" && (
          <label className="text-sm text-ffy-brown">
            Ends on
            <input type="date" required value={until} onChange={(e) => setUntil(e.target.value)} className="mt-1 w-full rounded-xl border border-ffy-border bg-white px-3 py-2 text-ffy-teal" />
          </label>
        )}

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
      </>}
    </section>
  );
}

type Filter = "all" | "confessions" | "given" | "trial" | "paying" | "ended";
const FILTERS: { id: Filter; label: string; test: (b: Buyer) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "confessions", label: "Confessions", test: (b) => b.deck_type === "scrumptious-confessions" },
  { id: "given", label: "Given by you", test: (b) => b.status === "Given by you" || b.status === "Free" },
  { id: "trial", label: "Free week", test: (b) => b.status === "Free week" },
  { id: "paying", label: "Paying", test: (b) => b.status === "Paying" },
  { id: "ended", label: "Ended", test: (b) => b.status === "Ended" },
];

function holdLabel(b: Buyer) {
  if (b.status === "Ended") return b.expires_at ? `Ended ${fmt(b.expires_at)}` : "Ended";
  if (b.status === "Paying") return "Paying";
  if (b.status === "Free week") return b.expires_at ? `Free week, ends ${fmt(b.expires_at)}` : "Free week";
  const who = b.status === "Given by you" ? "Given by you" : "Free";
  return b.expires_at ? `${who}, ends ${fmt(b.expires_at)}` : `${who}, forever`;
}

// Change how long someone keeps what Juliette gave them (23 Nov 2026).
function ChangeAccess({ b, onDone }: { b: Buyer; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [length, setLength] = useState("month");
  const [until, setUntil] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  if (!b.changeable) {
    return b.status === "Paying" || b.status === "Free week"
      ? <span className="text-xs text-ffy-brown/70">managed in Stripe</span>
      : null;
  }
  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` },
        body: JSON.stringify({ userId: b.user_id, deckType: b.deck_type, length, until }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg(j.error || "That didn't go through."); return; }
      setOpen(false);
      onDone();
    } catch { setMsg("That didn't go through."); } finally { setBusy(false); }
  }
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="text-xs text-ffy-gold-deep underline underline-offset-2">Change</button>;
  return (
    <span className="mt-2 flex flex-wrap items-center gap-2">
      <select value={length} onChange={(e) => setLength(e.target.value)} className="rounded-lg border border-ffy-border bg-white px-2 py-1 text-xs text-ffy-teal">
        <option value="forever">Forever</option>
        <option value="three">Three months from today</option>
        <option value="month">One month from today</option>
        <option value="week">One week from today</option>
        <option value="date">Until a date I pick</option>
        <option value="end">End it now</option>
      </select>
      {length === "date" && <input type="date" value={until} onChange={(e) => setUntil(e.target.value)} className="rounded-lg border border-ffy-border bg-white px-2 py-1 text-xs text-ffy-teal" />}
      <button type="button" disabled={busy || (length === "date" && !until)} onClick={save} className="rounded-full bg-ffy-teal px-3 py-1 text-xs text-ffy-cream disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-ffy-brown underline">Cancel</button>
      {msg && <span className="w-full text-xs text-red-700">{msg}</span>}
    </span>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [buyers, setBuyers] = useState<Buyer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showTests, setShowTests] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const loadBuyers = useCallback(async () => {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch("/api/admin/buyers", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { setError("Could not load the list. Refresh the page to try again."); return; }
    const json = await res.json();
    setBuyers(json.buyers);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the list once she is signed in
    loadBuyers();
  }, [isAdmin, loadBuyers]);

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ffy-cream px-6 text-center">
        <p className="text-ffy-brown">This screen isn&rsquo;t available on this account.</p>
      </main>
    );
  }

  const real = (buyers ?? []).filter((b) => showTests || !isTest(b.email));
  const q = query.trim().toLowerCase();
  const active = FILTERS.find((f) => f.id === filter)!;
  const rows = real.filter((b) => active.test(b) && (!q || b.email.toLowerCase().includes(q)));
  const people = new Map<string, Buyer[]>();
  for (const b of rows) people.set(b.email, [...(people.get(b.email) ?? []), b]);
  const sorted = Array.from(people.entries()).sort((x, y) => x[0].localeCompare(y[0]));
  const count = (f: (typeof FILTERS)[number]) => new Set(real.filter(f.test).map((b) => b.email)).size;
  const conf = real.filter((b) => b.deck_type === "scrumptious-confessions" && b.status !== "Ended");
  const confPaying = conf.filter((b) => b.status === "Paying" || b.status === "Free week").length;
  const confGiven = conf.length - confPaying;

  return (
    <main className="min-h-screen bg-ffy-cream px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ffy-teal">Your people</h1>
        <p className="mt-1 mb-8 text-sm text-ffy-brown">
          Everyone with access in the app.
          {buyers && <> Confessions right now: <b>{confPaying}</b> paying or on their free week, <b>{confGiven}</b> given by you.</>}
        </p>

        <GrantAccess onGranted={loadBuyers} />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a name or email"
          className="w-full rounded-full border border-ffy-border bg-white px-5 py-3 text-ffy-teal"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-1.5 text-sm ${filter === f.id ? "border-ffy-teal bg-ffy-teal text-ffy-cream" : "border-ffy-border bg-white text-ffy-teal"}`}>
              {f.label}{buyers ? ` ${count(f)}` : ""}
            </button>
          ))}
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-xs text-ffy-brown">
          <input type="checkbox" checked={showTests} onChange={(e) => setShowTests(e.target.checked)} />
          Show my test accounts
        </label>

        {error && <p className="mt-6 text-sm text-red-700">{error}</p>}
        {!buyers && !error && <p className="mt-6 text-sm text-ffy-brown">Loading…</p>}
        {buyers && sorted.length === 0 && <p className="mt-6 text-sm text-ffy-brown">{q ? `No one matches “${query}”.` : "No one here yet."}</p>}

        {sorted.length > 0 && (
          <ul className="mt-6 divide-y divide-ffy-border overflow-hidden rounded-2xl border border-ffy-border bg-white/60">
            {sorted.map(([email, items]) => (
              <li key={email} className="px-5 py-4">
                <p className="font-medium text-ffy-teal">{email}</p>
                <ul className="mt-2 space-y-2">
                  {items.sort((x, y) => (PRODUCT_LABELS[x.deck_type] ?? x.deck_type).localeCompare(PRODUCT_LABELS[y.deck_type] ?? y.deck_type)).map((b) => (
                    <li key={b.deck_type} className="text-sm text-ffy-brown">
                      <span className="font-medium text-ffy-teal">{PRODUCT_LABELS[b.deck_type] ?? b.deck_type}</span>
                      {" · "}
                      <span className={b.status === "Ended" ? "text-ffy-brown/60" : ""}>{holdLabel(b)}</span>
                      {" · "}
                      <span className="text-ffy-brown/70">since {fmt(b.purchased_at)}{b.completed_count ? `, ${b.completed_count} done` : ""}</span>
                      {" "}
                      <ChangeAccess b={b} onDone={loadBuyers} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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
