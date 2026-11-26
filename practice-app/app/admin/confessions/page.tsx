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
type Wall = Record<string, { metoo: number; hidden: boolean; answer: string | null }>;
type Data = { items: Item[]; totals: Record<string, Record<string, Record<string, number>>>; messages: Message[]; wall?: Wall; shared?: Record<string, string>; nightly?: { body: string; created_at: string } | null };

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
  { id: "all", label: "Everything" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];
const keep = (f: FilterId, m: Message) =>
  f === "all" ? true : f === "open" ? !m.answered && m.source !== "telegram" : m.kind === f;

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
  // The questions wall (20 Nov 2026): answer, hide or show, edit the wording.
  const act = async (id: string, body: Record<string, unknown>, done: string) => {
    const res = await authed("/api/admin/confessions", { method: "PATCH", body: JSON.stringify({ id, ...body }) }).catch(() => null);
    if (!res?.ok) { setNote("That didn't save. Try again."); return false; }
    setNote(done);
    const fresh = await authed("/api/admin/confessions").then((r) => r.json()).catch(() => null);
    if (fresh?.messages) setData(fresh);
    return true;
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
            {/* The nightly Stripe check (20 Nov 2026): who was let back in, what was saved to keep. */}
            {data.nightly && (
              <div className="mt-6 rounded-2xl border border-[#DDC98E]/40 p-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-[#a79f90]">Last night&rsquo;s membership check · {new Date(data.nightly.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                <p className="mt-1 text-[15px] text-[#cfc8bb]">{data.nightly.body}</p>
              </div>
            )}
            <ThursdayReminder />
            <h2 className="mt-8 font-display text-2xl font-light">Questions bank</h2>
            <p className="mt-1 text-[14px] text-[#a79f90]">From the app. No names, ever. Questions go on every member&rsquo;s wall the moment they&rsquo;re sent. Answer them here on Thursday, most Me too first.</p>
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
            <div className="mt-3">
              <button type="button" onClick={copyOpen} className="min-h-[44px] w-full rounded-full border border-[#DDC98E] text-[14px] text-[#DDC98E]">Copy unanswered questions</button>
            </div>
            {note && <p className="mt-2 text-[14px] text-[#EEDE80]">{note}</p>}
            {data.messages.filter((m) => keep(filter, m)).length === 0 && <p className="mt-3 text-[#a79f90]">Nothing here yet.</p>}
            <div className="mt-3 space-y-3">
              {data.messages.filter((m) => keep(filter, m)).sort((a, b) => (data.wall?.[b.id]?.metoo || 0) - (data.wall?.[a.id]?.metoo || 0)).map((m) => (
                <div key={m.id} className={`rounded-2xl border p-4 ${m.answered ? "border-[#DDC98E]/15 opacity-60" : "border-[#DDC98E]/30"}`}>
                  <p className="text-[12px] text-[#a79f90]">{new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {KIND[m.kind] ?? m.kind} · {m.source === "telegram" ? "Telegram" : "App"}{m.kind === "love_next" || m.kind === "card" ? ` · ${m.item_title}` : ""}</p>
                  <p className="mt-2 whitespace-pre-wrap text-[16px]">{m.body}</p>
                  {m.kind === "question" && m.source === "app" && data.wall?.[m.id] ? (
                    <WallControls m={m} w={data.wall[m.id]} act={act} />
                  ) : m.kind === "confession" ? (
                    <ShareControls m={m} shared={data.shared?.[m.id] ?? null} act={act} />
                  ) : (
                  <button type="button" onClick={() => toggle(m)} className="mt-2 inline-flex min-h-[40px] items-center text-[14px] text-[#DDC98E] underline underline-offset-4">
                    {m.answered ? "Answered ✓ (undo)" : "Mark answered"}
                  </button>
                  )}
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

/* Thursday reminder on Telegram (26 Nov 2026): one tap to connect, then every Thursday morning the bot sends her
   the questions waiting for her answers. */
function ThursdayReminder() {
  const [st, setSt] = useState<{ connected?: boolean; link?: string; error?: string } | null>(null);
  useEffect(() => {
    authed("/api/admin/telegram-owner").then((r) => r.json()).then(setSt).catch(() => setSt({ error: "Couldn't check Telegram." }));
  }, []);
  if (!st) return null;
  return (
    <div className="mt-6 rounded-2xl border border-[#DDC98E]/40 p-4" data-testid="thursday-reminder">
      <p className="text-[12px] uppercase tracking-[0.16em] text-[#a79f90]">Thursday reminder</p>
      {st.error ? <p className="mt-1 text-[15px] text-[#cfc8bb]">{st.error}</p>
        : st.connected ? <p className="mt-1 text-[15px] text-[#cfc8bb]">On. Every Thursday morning Telegram sends you the questions waiting for your answers.</p>
        : <>
            <p className="mt-1 text-[15px] text-[#cfc8bb]">Get the week&rsquo;s questions on Telegram every Thursday morning. Tap once, then press Start in Telegram.</p>
            {st.link && <a href={st.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-[#DDC98E] px-5 text-[14px] font-medium text-[#070707]">Connect my Telegram</a>}
          </>}
    </div>
  );
}

/* "You confessed" (20 Nov 2026): Juliette picks a confession, softens the wording, and shares it with no name. */
function ShareControls({ m, shared, act }: { m: Message; shared: string | null; act: (id: string, body: Record<string, unknown>, done: string) => Promise<boolean> }) {
  const [text, setText] = useState(shared ?? m.body);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = async (body: Record<string, unknown>, done: string) => { setBusy(true); await act(m.id, body, done); setBusy(false); setOpen(false); };
  return (
    <div className="mt-3 space-y-2">
      {shared && <p className="text-[13px] text-[#EEDE80]">Shared in &ldquo;You confessed&rdquo; with no name</p>}
      {open ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-2xl border border-[#EEDE80]/50 bg-transparent p-3 text-[15px]" />
          <p className="text-[12px] text-[#a79f90]">Soften anything that could tell who wrote it. Members see exactly these words, with no name.</p>
          <button type="button" disabled={busy || !text.trim()} onClick={() => run({ action: "share", body: text }, "Shared in You confessed.")} className="min-h-[40px] rounded-full bg-[#EEDE80] px-4 text-[14px] font-medium text-[#070707]">{shared ? "Update" : "Share with no name"}</button>
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setOpen(true)} className="min-h-[40px] rounded-full border border-[#EEDE80]/60 px-4 text-[14px] text-[#EEDE80]">{shared ? "Edit what's shared" : "Share anonymously"}</button>
          {shared && <button type="button" disabled={busy} onClick={() => run({ action: "unshare" }, "Taken down.")} className="min-h-[40px] rounded-full border border-[#DDC98E]/30 px-4 text-[13px] text-[#a79f90]">Take it down</button>}
        </div>
      )}
    </div>
  );
}

function WallControls({ m, w, act }: { m: Message; w: { metoo: number; hidden: boolean; answer: string | null }; act: (id: string, body: Record<string, unknown>, done: string) => Promise<boolean> }) {
  const [answer, setAnswer] = useState(w.answer || "");
  const [wording, setWording] = useState(m.body);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = async (body: Record<string, unknown>, done: string) => { setBusy(true); await act(m.id, body, done); setBusy(false); };
  return (
    <div className="mt-3 space-y-3">
      <p className="text-[13px] text-[#DDC98E]">Me too · {w.metoo}{w.hidden ? " · Hidden from the wall" : " · On the wall"}</p>
      {editing ? (
        <div className="space-y-2">
          <textarea value={wording} onChange={(e) => setWording(e.target.value)} rows={3} className="w-full rounded-2xl border border-[#DDC98E]/40 bg-transparent p-3 text-[15px]" />
          <button type="button" disabled={busy} onClick={async () => { await run({ action: "edit", body: wording }, "Wording saved."); setEditing(false); }} className="min-h-[40px] rounded-full border border-[#DDC98E] px-4 text-[14px] text-[#DDC98E]">Save wording</button>
        </div>
      ) : null}
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Your answer. Members see it under the question on Thursday, then it stays in the library." className="w-full rounded-2xl border border-[#DDC98E]/40 bg-transparent p-3 text-[15px]" />
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy || !answer.trim()} onClick={() => run({ action: "answer", answer }, "Answer published. Members can see it now.")} className="min-h-[40px] rounded-full bg-[#DDC98E] px-4 text-[14px] font-medium text-[#070707] disabled:opacity-40">{w.answer ? "Update answer" : "Publish answer"}</button>
        <button type="button" disabled={busy} onClick={() => setEditing((v) => !v)} className="min-h-[40px] rounded-full border border-[#DDC98E]/50 px-4 text-[14px]">Edit wording</button>
        <button type="button" disabled={busy} onClick={() => run({ action: w.hidden ? "show" : "hide" }, w.hidden ? "Back on the wall." : "Hidden from the wall.")} className="min-h-[40px] rounded-full border border-[#DDC98E]/50 px-4 text-[14px]">{w.hidden ? "Show on the wall" : "Hide"}</button>
        {w.answer && <button type="button" disabled={busy} onClick={() => { setAnswer(""); run({ action: "answer", answer: "" }, "Answer taken down."); }} className="min-h-[40px] rounded-full border border-[#DDC98E]/30 px-4 text-[13px] text-[#a79f90]">Take answer down</button>}
      </div>
    </div>
  );
}

export default function AdminConfessionsPage() {
  return <ProtectedRoute><Inner /></ProtectedRoute>;
}
