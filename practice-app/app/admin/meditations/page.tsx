"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { MEDITATIONS } from "@/lib/content/meditations";

type PoemRow = { id: string; uploaded: boolean };

// JULIETTE'S MEDITATION UPLOAD (specs/living-library.md). One time: choose every file in the
// "meditations-for-app" folder at once. Each file goes to the private store under its own name,
// and opens in the app on its day. Uploading again replaces a file; nothing else changes.

async function call(method: "GET" | "POST", body?: unknown) {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session expired. Refresh and sign in again.");
  const res = await fetch("/api/admin/meditations", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Something went wrong");
  return json;
}

export default function MeditationsAdminPage() {
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
  return <Upload />;
}

function Upload() {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set());
  const [poems, setPoems] = useState<PoemRow[]>([]);
  const [pLog, setPLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);
  // Big files can arrive in pieces named "<file>.part<i>of<n>" (19 Nov 2026: Claude uploads through the browser,
  // which takes under 10 MB at a time). Pieces wait here until all n are in, then join back into the exact file.
  const pieces = useRef<Map<string, Map<number, File>>>(new Map());
  const [waiting, setWaiting] = useState<string[]>([]);
  function assemble(files: FileList | null): File[] {
    const ready: File[] = [];
    for (const file of Array.from(files || [])) {
      const m = file.name.match(/^(.*)\.part(\d+)of(\d+)$/);
      if (!m) { ready.push(file); continue; }
      const [, base, i, n] = m;
      const got = pieces.current.get(base) || new Map<number, File>();
      got.set(Number(i), file);
      pieces.current.set(base, got);
      if (got.size === Number(n)) {
        const parts = Array.from({ length: Number(n) }, (_, k) => got.get(k + 1)!);
        ready.push(new File(parts, base, { type: base.endsWith(".mp4") ? "video/mp4" : "audio/mp4" }));
        pieces.current.delete(base);
      }
    }
    setWaiting(Array.from(pieces.current.entries()).map(([b, g]) => `${b}: ${g.size} pieces in`));
    return ready;
  }

  const load = useCallback(async () => {
    try { const j = await call("GET"); setUploaded(new Set(j.uploaded as string[])); setPoems((j.poems || []) as PoemRow[]); } catch (e) { setErr((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function send(files: File[]) {
    if (!files.length) return;
    setBusy(true); setErr(null);
    const known = new Set(MEDITATIONS.map((m) => m.slug));
    for (const file of Array.from(files)) {
      const slug = file.name.replace(/\.[^.]+$/, "");
      if (!known.has(slug)) { setLog((l) => [...l, `Skipped ${file.name} (not on the list)`]); continue; }
      try {
        const up = await call("POST", { action: "upload-url", slug });
        const { error } = await supabaseBrowser.storage.from("drops").uploadToSignedUrl(up.path, up.token, file, { contentType: "audio/mp4", upsert: true });
        if (error) throw new Error(error.message);
        setLog((l) => [...l, `✓ ${file.name}`]);
        setUploaded((u) => new Set(u).add(slug));
      } catch (e) {
        setLog((l) => [...l, `✗ ${file.name}: ${(e as Error).message}`]);
      }
    }
    setBusy(false);
    load();
  }

  async function sendPoems(files: File[]) {
    if (!files.length) return;
    setBusy(true); setErr(null);
    const known = new Set(poems.map((p) => p.id));
    for (const file of Array.from(files)) {
      const slug = file.name.replace(/\.[^.]+$/, "");
      if (!known.has(slug)) { setPLog((l) => [...l, `Skipped ${file.name} (not on the list)`]); continue; }
      try {
        const up = await call("POST", { action: "upload-url", slug, kind: "poem" });
        const { error } = await supabaseBrowser.storage.from("drops").uploadToSignedUrl(up.path, up.token, file, { contentType: "video/mp4", upsert: true });
        if (error) throw new Error(error.message);
        setPLog((l) => [...l, `\u2713 ${file.name}`]);
      } catch (e) {
        setPLog((l) => [...l, `\u2717 ${file.name}: ${(e as Error).message}`]);
      }
    }
    setBusy(false);
    load();
  }

  const done = MEDITATIONS.filter((m) => uploaded.has(m.slug)).length;
  return (
    <main className="min-h-screen bg-[#070707] px-5 py-10 text-[#f1ece2]">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-[30px] font-light">Your meditations</h1>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">Choose every file in the <b>meditations-for-app</b> folder at once. They go to the private store, and each one opens in the app on its day.</p>
        <label className="mt-6 flex min-h-[56px] cursor-pointer items-center justify-center rounded-full bg-[#DDC98E] font-display text-[17px] font-medium text-[#070707]">
          {busy ? "Uploading…" : "Choose the files"}
          <input data-testid="med-input" type="file" multiple className="hidden" onChange={(e) => { send(assemble(e.target.files)); e.target.value = ""; }} />
        </label>
        <p className="mt-4 text-[16px] text-[#DDC98E]">{done} of {MEDITATIONS.length} uploaded</p>
        {err && <p className="mt-2 text-[14px] text-[#EEDE80]">{err}</p>}
        <ul className="mt-4 space-y-1 text-[14px] text-[#cfc8bb]">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
        {waiting.length > 0 && <ul className="mt-4 space-y-1 text-[13px] text-[#8f877a]" data-testid="waiting">{waiting.map((w) => <li key={w}>{w}</li>)}</ul>}
        <h2 className="mt-12 font-display text-[26px] font-light">Poem videos</h2>
        <p className="mt-2 text-[15px] text-[#cfc8bb]">Choose every file in the <b>poem-videos-for-app</b> folder at once. Each one plays on its poem&rsquo;s Wednesday.</p>
        <label className="mt-4 flex min-h-[56px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#DDC98E] font-display text-[17px] font-medium text-[#DDC98E]">
          {busy ? "Uploading\u2026" : "Choose the poem videos"}
          <input data-testid="poem-input" type="file" multiple className="hidden" onChange={(e) => { sendPoems(assemble(e.target.files)); e.target.value = ""; }} />
        </label>
        <p className="mt-4 text-[16px] text-[#DDC98E]">{poems.filter((p) => p.uploaded).length} of {poems.length} poem videos uploaded</p>
        <ul className="mt-2 space-y-1 text-[14px] text-[#cfc8bb]">{pLog.map((l, i) => <li key={i}>{l}</li>)}</ul>
        <h2 className="mt-12 font-display text-[26px] font-light">Meditations</h2>
        <ul className="mt-4 space-y-1 text-[14px]">
          {MEDITATIONS.map((m) => (
            <li key={m.slug} className="flex justify-between gap-3 border-b border-[#DDC98E]/15 py-2">
              <span>{uploaded.has(m.slug) ? "✓" : "·"} {m.title}</span>
              <span className="shrink-0 text-[#8f877a]">{new Date(m.publish_on + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
