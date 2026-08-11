import { supabaseBrowser } from "@/lib/supabase/client";

// Spec R6: a 31-day, twice-daily (AM/PM) practice tracker. Day number (1-31)
// rather than a calendar date, matching the source doc's own "Day 1 am/pm
// ... Day 31" framing, not tied to which actual calendar date someone logs
// it on (spec E2: a skipped day carries no penalty, so there is nothing to
// calculate from a real date either).
export type TrackerPeriod = "AM" | "PM";

export type TrackerEntry = {
  dayNumber: number;
  period: TrackerPeriod;
  beforeRating: number | null;
  afterRating: number | null;
};

export async function getTrackerEntries(
  userId: string,
  deckType: string
): Promise<TrackerEntry[]> {
  const { data, error } = await supabaseBrowser
    .from("practice_tracker_entries")
    .select("day_number, period, before_rating, after_rating")
    .eq("user_id", userId)
    .eq("deck_type", deckType);

  if (error) {
    console.error("Error loading tracker entries:", error);
    return [];
  }
  return (data ?? []).map((row) => ({
    dayNumber: row.day_number as number,
    period: row.period as TrackerPeriod,
    beforeRating: (row.before_rating as number | null) ?? null,
    afterRating: (row.after_rating as number | null) ?? null,
  }));
}

export async function saveTrackerEntry(
  userId: string,
  deckType: string,
  dayNumber: number,
  period: TrackerPeriod,
  beforeRating: number | null,
  afterRating: number | null
): Promise<boolean> {
  const { error } = await supabaseBrowser.from("practice_tracker_entries").upsert(
    {
      user_id: userId,
      deck_type: deckType,
      day_number: dayNumber,
      period,
      before_rating: beforeRating,
      after_rating: afterRating,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,deck_type,day_number,period" }
  );
  if (error) {
    console.error("Error saving tracker entry:", error);
    return false;
  }
  return true;
}
