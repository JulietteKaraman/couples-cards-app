import { supabaseBrowser } from "@/lib/supabase/client";

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
