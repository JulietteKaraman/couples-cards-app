import { supabaseBrowser } from "@/lib/supabase/client";

export type CompletedRow = { slug: string; at: number | null };

/**
 * Completed entries WITH the moment each was marked, so a drip can be timed
 * off the real last advance rather than off this device's localStorage.
 * Added 30 Sep 2026: the 31 Touch Points gate was trusting localStorage only,
 * which meant a second device, a cleared browser, or progress rows made before
 * the gate existed all opened the whole month at once.
 * If the timestamp column is not there, this degrades to nulls and the caller
 * falls back to its local clock rather than failing.
 */
export async function getCompletedWithTimes(
  userId: string,
  deckType: string
): Promise<CompletedRow[]> {
  for (const col of ["completed_at", "created_at", "updated_at"]) {
    const { data, error } = await supabaseBrowser
      .from("practice_progress")
      .select(`entry_slug, ${col}`)
      .eq("user_id", userId)
      .eq("deck_type", deckType);
    if (!error && data) {
      return (data as unknown[]).map((r) => {
        const row = r as Record<string, unknown>;
        const raw = row[col];
        const t = typeof raw === "string" ? Date.parse(raw) : NaN;
        return { slug: row.entry_slug as string, at: Number.isNaN(t) ? null : t };
      });
    }
  }
  const slugs = await getCompletedSlugs(userId, deckType);
  return slugs.map((slug) => ({ slug, at: null }));
}

export async function getCompletedSlugs(
  userId: string,
  deckType: string
): Promise<string[]> {
  const { data, error } = await supabaseBrowser
    .from("practice_progress")
    .select("entry_slug")
    .eq("user_id", userId)
    .eq("deck_type", deckType);

  if (error) {
    console.error("Error loading progress:", error);
    return [];
  }
  return (data ?? []).map((row) => row.entry_slug as string);
}

export async function markComplete(
  userId: string,
  deckType: string,
  entrySlug: string
) {
  const { error } = await supabaseBrowser.from("practice_progress").upsert(
    { user_id: userId, deck_type: deckType, entry_slug: entrySlug },
    { onConflict: "user_id,deck_type,entry_slug" }
  );
  if (error) console.error("Error marking complete:", error);
}
