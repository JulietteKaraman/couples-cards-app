import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DROPS_BUCKET, isAdmin, todayUK, userFromRequest } from "@/lib/drops-server";
import { MEDITATIONS, meditationPath } from "@/lib/content/meditations";

// GET /api/meditations (specs/living-library.md, Juliette 19 Nov 2026: "a new meditation every Friday,
// three on day one"). Everyone sees the titles that have opened. Paying Confessions members (and the
// 7-day trial, which Stripe records as a paid £0 invoice) also get a play link that lasts 2 hours.
// The audio lives in the private "drops" bucket, never in public/.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  let today = todayUK();
  // Owner preview, like the confessions (Juliette 19 Nov 2026, to film the app): before the
  // first day she sees the first day's three. Members only ever see what has opened.
  if (user && isAdmin(user.email) && today < MEDITATIONS[0].publish_on) today = MEDITATIONS[0].publish_on;
  const opened = MEDITATIONS.filter((m) => m.publish_on <= today);
  const next = MEDITATIONS.find((m) => m.publish_on > today) || null;

  // member = paying; trial = in the 7 free days (Juliette 19 Nov: "a taste of everything"), who get
  // the three day-one meditations only.
  let member = false;
  let trial = false;
  if (user) {
    if (isAdmin(user.email)) member = true;
    else {
      const { data } = await supabaseAdmin
        .from("user_decks")
        .select("expires_at, stripe_checkout_session_id")
        .eq("user_id", user.id)
        .eq("deck_type", "scrumptious-confessions");
      for (const r of (data || []) as { expires_at: string | null; stripe_checkout_session_id: string | null }[]) {
        if (r.expires_at && new Date(r.expires_at) <= new Date()) continue;
        const sid = String(r.stripe_checkout_session_id || "");
        if (sid.startsWith("trial-")) trial = true;
        else if (!sid.startsWith("free-")) member = true;
      }
    }
  }
  const firstDay = MEDITATIONS[0]?.publish_on;

  const items = await Promise.all(
    opened.map(async (m) => {
      let audio: string | null = null;
      if (member || (trial && m.publish_on === firstDay)) {
        const { data } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUrl(meditationPath(m.slug), 60 * 60 * 2);
        audio = data?.signedUrl ?? null;
      }
      return { slug: m.slug, title: m.title, minutes: m.minutes, shelves: m.shelves, publish_on: m.publish_on, audio };
    })
  );
  // Newest first, so this Friday's sits at the top.
  items.sort((a, b) => (a.publish_on < b.publish_on ? 1 : a.publish_on > b.publish_on ? -1 : 0));
  return NextResponse.json({ member, trial, items, next: next ? { publish_on: next.publish_on } : null, total: MEDITATIONS.length });
}
