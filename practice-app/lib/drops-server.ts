import { supabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { COLLECTION_DECK_TYPES } from "@/lib/entitlements/config";

// Server-only helpers for the drops (cards + Scrumptious Confessions),
// specs/how-to-feel-like-a-woman-app.md R7, R10, R11. Same trust model as
// app/api/admin/grant: the caller's own Supabase session is checked here,
// on the server, never trusted from the page.

export const DROP_COLLECTIONS = ["how-to-feel-like-a-woman"];
export const DROPS_BUCKET = "drops";

/** Today's date in the UK, "2026-10-29". Drops open on their UK day. */
export function todayUK(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

export async function userFromRequest(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export function isAdmin(email?: string | null) {
  return (email || "").toLowerCase() === ADMIN_EMAIL;
}

/** Does this user own the collection? Admin always does. */
export async function canSee(userId: string, email: string | undefined, collection: string) {
  if (isAdmin(email)) return true;
  const deckType = COLLECTION_DECK_TYPES[collection];
  if (!deckType) return false;
  const { data } = await supabaseAdmin
    .from("user_decks")
    .select("deck_type, expires_at")
    .eq("user_id", userId)
    .eq("deck_type", deckType);
  return (data || []).some((r: { expires_at: string | null }) => !r.expires_at || new Date(r.expires_at) > new Date());
}
