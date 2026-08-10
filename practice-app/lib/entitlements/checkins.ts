import { supabaseBrowser } from "@/lib/supabase/client";

// Members App spec R2/R3: the book's own five Touch States, read live —
// not derived from any quiz answer (the book is explicit about this, see
// specs/members-app.md R2).
export type TouchState = "braced" | "withheld" | "performing" | "present" | "melted";

export type StateCheckin = {
  state: TouchState;
  createdAt: string;
};

export async function getRecentCheckins(userId: string, limit = 10): Promise<StateCheckin[]> {
  const { data, error } = await supabaseBrowser
    .from("member_state_checkins")
    .select("state, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error loading check-ins:", error);
    return [];
  }
  return (data ?? []).map((row) => ({
    state: row.state as TouchState,
    createdAt: row.created_at as string,
  }));
}

export async function logCheckin(userId: string, state: TouchState) {
  const { error } = await supabaseBrowser
    .from("member_state_checkins")
    .insert({ user_id: userId, state });
  if (error) console.error("Error logging check-in:", error);
}
