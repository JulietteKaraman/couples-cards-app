"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";

// JULIETTE'S DROP PAGE (specs/how-to-feel-like-a-woman-app.md R10).
// Add a card or a Scrumptious Confession, pick the day, save. It appears in
// the women's app on that day. No deploy, no Claude needed.

type Drop = {
  id: string; kind: "card" | "confession"; title: string | null; body: string | null;
  audio: string | null; publish_on: string; hidden: boolean;
};

const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
const nice = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

async function call(method: "GET" | "POST", body?: unknown) {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session expired. Refresh and sign in again.");
  const res = await fetch("/api/admin/drops", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Something went wrong");
  return json;
}

export default function DropsPage() {
  // Local preview only, same rule as CollectionGate: never true live.
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_OPEN === "1") return <Drops />;
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
  return <Drops />;
}

function Drops() {
  const [kind, setKind] = useState<"card" | "confession">("card");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [day, setDay] = useState(todayUK());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);

  const load = useCallback(async () => {
    try { setDrops((await call("GET")).drops); } catch (e) { if (process.env.NODE_ENV !== "development") setErr((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null); setErr(null);
    try {
      let audio_path: string | undefined;
      if (kind === "confession") {
        if (!file) throw new Error("Choose your voice note first.");
        const up = await call("POST", { action: "upload-url", filename: file.name });
        const { error } = await supabaseBrowser.storage.from("drops").uploadToSignedUrl(up.path, up.token, file, { contentType: file.type || "audio/mp4" });
        if (error) throw new Error("The voice note didn't upload: " + error.message);
        audio_path = up.path;
      }
      await call("POST", { action: "create", collection: "how-to-feel-like-a-woman", kind, title, body, audio_path, publish_on: day });
      setMsg(day <= todayUK() ? "Saved. It's in their app now." : `Saved. It appears on ${nice(day)}.`);
      setTitle(""); setBody(""); setFile(null);
      load();
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(d: Drop) {
    try { await call("POST", { action: "hide", id: d.id, hidden: !d.hidden }); load(); } catch (e) { setErr((e as Error).message); }
  }

  const field = "mt-2 w-full rounded-2xl border border-[#DDC98E]/40 bg-transparent px-4 py-3 text-[16px] text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:border-[#DDC98E] focus:outline-none";

  return (
    <main className="min-h-screen bg-[#070707] text-[#f1ece2] [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-xl px-5 pb-20 pt-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDC98E]">How to Feel Like a Woman · your drops</p>
        <h1 className="mt-2 font-display text-3xl font-light">Drop something in</h1>
        <p className="mt-2 text-[15px] text-[#a79f90]">It shows in their app on the day you pick.</p>

        <form onSubmit={save} className="mt-7 rounded-3xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.35)] p-5">
          <div className="grid grid-cols-2 gap-2">
            {(["card", "confession"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setKind(k)}
                className={`min-h-[48px] rounded-full border text-[15px] ${kind === k ? "border-[#DDC98E] bg-[#DDC98E] text-[#070707]" : "border-[#DDC98E]/40 text-[#f1ece2]/80"}`}>
                {k === "card" ? "A card" : "A Scrumptious Confession"}
              </button>
            ))}
          </div>

          {kind === "card" ? (
            <label className="mt-5 block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">The card&rsquo;s words
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Tell me what pleasure means to you" className={field} />
            </label>
          ) : (
            <>
              <label className="mt-5 block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">Its name
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What you'd call this one" className={field} />
              </label>
              <label className="mt-5 block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">Your voice note
                <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-[15px] text-[#f1ece2] file:mr-3 file:rounded-full file:border-0 file:bg-[#DDC98E] file:px-4 file:py-2 file:text-[#070707]" />
              </label>
              <label className="mt-5 block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">A line under it (optional)
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} className={field} />
              </label>
            </>
          )}

          <label className="mt-5 block text-[13px] uppercase tracking-[0.14em] text-[#DDC98E]">Which day
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} className={field + " [color-scheme:dark]"} />
          </label>

          <button disabled={busy} className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#DDC98E] font-display text-[16px] font-medium text-[#070707] disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
          {msg && <p className="mt-3 text-[15px] text-[#EEDE80]">{msg}</p>}
          {err && <p className="mt-3 text-[15px] text-[#e8a08a]">{err}</p>}
        </form>

        <h2 className="mt-12 font-display text-xl font-light">Everything so far</h2>
        <ul className="mt-4 space-y-3">
          {drops.length === 0 && <li className="text-[#a79f90]">Nothing yet.</li>}
          {drops.map((d) => (
            <li key={d.id} className={`rounded-2xl border border-[#DDC98E]/25 p-4 ${d.hidden ? "opacity-45" : ""}`}>
              <div className="flex items-center justify-between gap-3 text-[12px] uppercase tracking-[0.14em] text-[#DDC98E]">
                <span>{d.kind === "card" ? "Card" : "Confession"} · {nice(d.publish_on)}{d.publish_on > todayUK() ? " · waiting" : ""}</span>
                <button type="button" onClick={() => toggle(d)} className="rounded-full border border-[#DDC98E]/40 px-3 py-1 normal-case tracking-normal text-[#f1ece2]/80">
                  {d.hidden ? "Show it" : "Hide it"}
                </button>
              </div>
              {d.title && <p className="mt-2 font-display text-[17px]">{d.title}</p>}
              {d.body && <p className="mt-1 text-[15px] text-[#cfc8bb]">{d.body}</p>}
              {d.audio && <audio src={d.audio} controls className="mt-3 w-full" />}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
