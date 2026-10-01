"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";
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

// Matches the real doc's reflection pages: a blush bordered box with an
// italic prompt, not a plain white card. Juliette, 11 Aug 2026: "compare it
// page by page to the google doc/pdf".
function JournalRow({
  promptKey,
  label,
  userId,
  initialValue,
  ready,
}: {
  promptKey: string;
  label: string;
  userId: string | undefined;
  initialValue: string;
  ready: boolean;
}) {
  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Seeded from the ONE fetch the page does, rather than fetching per box.
  useEffect(() => {
    if (!ready) return;
    setValue(initialValue);
    setInitial(initialValue);
  }, [ready, initialValue]);

  async function handleSave() {
    setError(null);
    // Spec E6: do not lose what they typed if the session has gone. Block
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
        {dirty && !saved && !error && (
          <span className="text-sm text-ffy-brown/70">Not saved yet.</span>
        )}
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </div>
  );
}

function JournalPageContent() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  // ONE fetch for the whole page, 1 Oct 2026. Every prompt box used to call
  // getJournalEntries itself, so opening this page fired seven identical
  // queries for the same rows and the boxes filled in at different moments.
  useEffect(() => {
    if (!user) return;
    getJournalEntries(user.id, DECK_TYPE).then((rows) => {
      setAnswers(rows);
      setReady(true);
    });
  }, [user]);

  // The same prev/next courtesy every reading page has. Juliette, 12 Aug
  // 2026: "there is no button to get to the next practice". That was fixed
  // on the tracker at the time and missed here.
  const entries = communicationRebootKit.entries;
  const journalIndex = entries.findIndex(
    (e) => e.slug.includes("journal") || e.slug.includes("reflection")
  );
  const nextEntry =
    journalIndex !== -1 && journalIndex + 1 < entries.length
      ? entries[journalIndex + 1]
      : entries[entries.length - 1];

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
            <JournalRow
              key={p.key}
              promptKey={p.key}
              label={p.label}
              userId={user?.id}
              initialValue={answers[p.key] ?? ""}
              ready={ready || !user}
            />
          ))}
        </div>
      </div>

      {nextEntry && (
        <div className="mx-auto mt-4 flex max-w-xl items-center justify-end border-t border-ffy-border px-6 py-6 text-sm">
          <Link
            href={`/practice/communication-reboot-kit/${nextEntry.slug}`}
            className="text-ffy-gold-deep hover:underline"
          >
            Continue to {nextEntry.title} →
          </Link>
        </div>
      )}
    </main>
  );
}
