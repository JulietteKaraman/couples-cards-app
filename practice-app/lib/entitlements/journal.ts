import { supabaseBrowser } from "@/lib/supabase/client";

// Spec R7: the doc's 4 fixed reflection prompts plus one open "additional
// reflections" space. Keys are stable strings, not the prompt text itself,
// so the copy can be edited later without orphaning saved answers.
export const JOURNAL_PROMPTS: { key: string; label: string }[] = [
  { key: "surprised", label: "What surprised you" },
  { key: "felt-good-or-hard", label: "What felt good (or hard)" },
  { key: "want-to-remember", label: "What you want to remember" },
  { key: "what-changed", label: "What changed, even subtly" },
  { key: "additional", label: "Additional reflections" },
];

export async function getJournalEntries(
  userId: string,
  deckType: string
): Promise<Record<string, string>> {
  const { data, error } = await supabaseBrowser
    .from("practice_journal_entries")
    .select("prompt_key, answer")
    .eq("user_id", userId)
    .eq("deck_type", deckType);

  if (error) {
    console.error("Error loading journal entries:", error);
    return {};
  }
  const out: Record<string, string> = {};
  for (const row of data ?? []) {
    out[row.prompt_key as string] = (row.answer as string) ?? "";
  }
  return out;
}

export async function saveJournalEntry(
  userId: string,
  deckType: string,
  promptKey: string,
  answer: string
): Promise<boolean> {
  const { error } = await supabaseBrowser.from("practice_journal_entries").upsert(
    {
      user_id: userId,
      deck_type: deckType,
      prompt_key: promptKey,
      answer,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,deck_type,prompt_key" }
  );
  if (error) {
    console.error("Error saving journal entry:", error);
    return false;
  }
  return true;
}
