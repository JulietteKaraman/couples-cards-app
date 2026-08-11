"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getTrackerEntries,
  saveTrackerEntry,
  TrackerEntry,
  TrackerPeriod,
} from "@/lib/entitlements/tracker";

const DECK_TYPE = "communication-reboot-kit";
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function entryFor(entries: TrackerEntry[], day: number, period: TrackerPeriod) {
  return entries.find((e) => e.dayNumber === day && e.period === period);
}

// Spec E5: this is the primary context for the tracker (a phone, twice a
// day), so the UI leads with a single "log this one" card rather than a
// 31-row table nobody could comfortably fill in one-handed. The history
// below is a compact, scrollable list, not a wide table.
export default function TrackerPage() {
  return (
    <CollectionGate collectionSlug={DECK_TYPE}>
      <TrackerPageContent />
    </CollectionGate>
  );
}

function TrackerPageContent() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(1);
  const [period, setPeriod] = useState<TrackerPeriod>("AM");
  const [before, setBefore] = useState<number | "">("");
  const [after, setAfter] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getTrackerEntries(user.id, DECK_TYPE).then((rows) => {
      setEntries(rows);
      setLoading(false);
    });
  }, [user]);

  // Loading an existing entry into the form when day/period changes, so
  // re-visiting a day you already logged shows what you wrote, not blanks.
  useEffect(() => {
    const existing = entryFor(entries, day, period);
    setBefore(existing?.beforeRating ?? "");
    setAfter(existing?.afterRating ?? "");
    setSaved(false);
  }, [day, period, entries]);

  async function handleSave() {
    setSaveError(null);
    // Spec E6: someone whose session has expired mid-fill should not
    // silently lose what they typed. Block the save with a clear message
    // and leave the form exactly as they left it.
    if (!user) {
      setSaveError("You're not signed in. Sign in again to save this, your answer is still here.");
      return;
    }
    setSaving(true);
    const ok = await saveTrackerEntry(
      user.id,
      DECK_TYPE,
      day,
      period,
      before === "" ? null : before,
      after === "" ? null : after
    );
    setSaving(false);
    if (!ok) {
      setSaveError("That didn't save. Try again in a moment.");
      return;
    }
    setSaved(true);
    setEntries((prev) => [
      ...prev.filter((e) => !(e.dayNumber === day && e.period === period)),
      { dayNumber: day, period, beforeRating: before === "" ? null : before, afterRating: after === "" ? null : after },
    ]);
  }

  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="mx-auto max-w-xl px-6 py-10">
        <Link
          href="/practice/communication-reboot-kit"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← The Communication Reboot Kit
        </Link>

        <h1 className="mt-6 font-display text-3xl font-semibold text-ffy-teal">Your 31-day tracker</h1>
        <p className="mt-2 text-sm text-ffy-brown">
          Twice a day, morning and afternoon or evening. Two minutes each. Rate how you feel before
          the Touch Base™ gesture, and again after.
        </p>

        <div className="mt-8 rounded-2xl border border-ffy-border bg-white/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs uppercase tracking-wide text-ffy-gold-deep">Day</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDay((d) => Math.max(1, d - 1))}
                className="h-9 w-9 rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep"
                aria-label="Previous day"
              >
                −
              </button>
              <span className="font-display text-lg text-ffy-black">Day {day} of 31</span>
              <button
                type="button"
                onClick={() => setDay((d) => Math.min(31, d + 1))}
                className="h-9 w-9 rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep"
                aria-label="Next day"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            {(["AM", "PM"] as TrackerPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-xl border px-4 py-2.5 font-display text-sm font-semibold transition ${
                  period === p
                    ? "border-ffy-gold bg-ffy-teal text-ffy-cream"
                    : "border-ffy-border bg-white text-ffy-brown"
                }`}
              >
                {p === "AM" ? "Morning" : "Afternoon / Evening"}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-ffy-gold-deep">Before, 1 to 10</label>
              <input
                type="number"
                min={1}
                max={10}
                value={before}
                onChange={(e) => setBefore(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ffy-border bg-white px-4 py-3 text-lg"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-ffy-gold-deep">After, 1 to 10</label>
              <input
                type="number"
                min={1}
                max={10}
                value={after}
                onChange={(e) => setAfter(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-ffy-border bg-white px-4 py-3 text-lg"
                inputMode="numeric"
              />
            </div>
          </div>

          {saveError && <p className="mt-3 text-sm text-red-700">{saveError}</p>}
          {saved && !saveError && <p className="mt-3 text-sm text-ffy-gold-deep">Saved.</p>}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 w-full rounded-full bg-ffy-gold px-5 py-3 font-display text-sm font-semibold text-ffy-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save this entry"}
          </button>
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">Your progress</p>
        {loading ? (
          <p className="mt-3 text-sm text-ffy-brown">Loading…</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DAYS.map((d) => {
              const am = entryFor(entries, d, "AM");
              const pm = entryFor(entries, d, "PM");
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                    d === day ? "border-ffy-gold bg-ffy-cream-2" : "border-ffy-border bg-white/60"
                  }`}
                >
                  <span className="font-medium text-ffy-black">Day {d}</span>
                  <span className="text-xs text-ffy-brown">
                    AM {am ? `${am.beforeRating ?? "–"}→${am.afterRating ?? "–"}` : "–"} · PM{" "}
                    {pm ? `${pm.beforeRating ?? "–"}→${pm.afterRating ?? "–"}` : "–"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
