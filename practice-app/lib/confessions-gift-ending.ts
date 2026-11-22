import { supabaseAdmin } from "@/lib/supabase/admin";

// Gifted Scrumptious Confessions access (the admin page's One week / One month / Three months free) ends by
// itself: the app reads expires_at on the user_decks row and stops showing it after that moment.
// This gives them the heads-up first (Juliette 22 Nov 2026: "how do they get nudged that their free time is
// over and that they need to put in a card?"). Run once a night by the nightly check: anyone whose gift ends
// 4 to 5 days from now goes into Kit's "Gift ending" sequence (email now, then one on their last day).
// "Forever" gifts have no expires_at, so they never get these.
const GIFT_ENDING_SEQUENCE = 2981861;

export async function giftEndingNudges() {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) return { nudged: 0, note: "no KIT_API_KEY" };
  const day = 86_400_000;
  const from = new Date(Date.now() + 4 * day).toISOString();
  const to = new Date(Date.now() + 5 * day).toISOString();
  const { data, error } = await supabaseAdmin
    .from("user_decks")
    .select("user_id, expires_at, stripe_checkout_session_id")
    .eq("deck_type", "scrumptious-confessions")
    .like("stripe_checkout_session_id", "admin-grant-%")
    .gt("expires_at", from)
    .lte("expires_at", to);
  if (error) throw new Error(`gift ending: ${error.message}`);
  const headers = { "X-Kit-Api-Key": apiKey, "Content-Type": "application/json", Accept: "application/json" };
  const nudged: string[] = [];
  for (const row of data || []) {
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
    const email = u?.user?.email?.toLowerCase();
    if (!email) continue;
    const res = await fetch(`https://api.kit.com/v4/sequences/${GIFT_ENDING_SEQUENCE}/subscribers`, {
      method: "POST", headers, body: JSON.stringify({ email_address: email }),
    });
    if (res.ok) nudged.push(email);
  }
  return { nudged: nudged.length };
}
