"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getJournalEntries, saveJournalEntry, JOURNAL_PROMPTS } from "@/lib/entitlements/journal";

const DECK_TYPE = "communication-reboot-kit";

export default function JournalPage() {
  return (
    <CollectionGate collectionSlug={DECK_TYPE}>
      <JournalPageContent />
    </CollectionGate>
  );
}

function JournalRow({
  promptKey,
  label,
  userId,
}: {
  promptKey: string;
  label: string;
  userId: string | undefined;
}) {
  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getJournalEntries(userId, DECK_TYPE).then((entries) => {
      const v = entries[promptKey] ?? "";
      setValue(v);
      setInitial(v);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleSave() {
    setError(null);
    // Spec E6: don't lose what they typed if the session has gone, block
    // the save with a clear message and leave the textarea exactly as is.
    if (!userId) {
      setError("You're not signed in. Sign in again to save this, your answer is still here.");
      return;
    }
    setSaving(true);
    const ok = await saveJournalEntry(userId, DECK_TYPE, promptKey, value);
    setSaving(false);
    if (!ok) {
      setError("That didn't save. Try again in a moment.");
      return;
    }
    setInitial(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const dirty = value !== initial;

  // Matches the real doc's reflection pages exactly: a blush-pink bordered
  // box with an italic prompt label, not a plain white card. Juliette, 11
  // Aug 2026: "compare it page by page to the google doc/pdf" — this is
  // that comparison, applied.
  return (
    <div className="rounded-lg border border-[#d9a8ac]/60 bg-[#f8f0ea] p-5 sm:p-6">
      <p className="font-display text-lg italic text-ffy-black">{label}</p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Write as much or as little as you want."
        className="mt-3 w-full rounded-md border border-[#d9a8ac]/50 bg-white/70 px-4 py-3 text-[1rem] leading-relaxed placeholder:text-ffy-brown/50"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          className="rounded-full bg-ffy-gold px-5 py-2.5 font-display text-sm font-semibold text-ffy-black disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && !error && <span className="text-sm text-ffy-gold-deep">Saved.</span>}
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </div>
  );
}

function JournalPageContent() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="mx-auto max-w-xl px-6 py-10">
        <Link
          href="/practice/communication-reboot-kit"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← The Communication Reboot Kit
        </Link>

        <h1 className="mt-6 font-display text-3xl font-semibold text-ffy-teal">Your reflection journal</h1>
        <p className="mt-2 text-sm text-ffy-brown">
          Slow down to notice what landed. Come back to this any time, each answer saves on its own.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {JOURNAL_PROMPTS.map((p) => (
            <JournalRow key={p.key} promptKey={p.key} label={p.label} userId={user?.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
