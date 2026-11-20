import { NextResponse } from "next/server";
import { CONFESSION_POEMS as LAUNCH_POEMS } from "@/lib/content/confession-poems";
import { PEEK_DAYS, addDays, memberWeeks, shiftAll } from "@/lib/confessions-clock";

// A page of poems each Wednesday for Scrumptious Confessions members. Juliette, 19 Nov 2026: "I can add a
// poem each week to the membership instead of putting the whole book in." Same lock as the confessions:
// signed in, holding scrumptious-confessions (including the free fortnight), checked here on the server.
// Poems, their dates and their audio paths never reach anyone who has not opened them.
const SLUG = "scrumptious-confessions";
const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

export async function GET(req: Request) {
  // Local preview only (never true on the live site): there is no database here, so show the poems as the owner sees them.
  const preview = process.env.NODE_ENV === "development";
  let admin = false;
  let weeks = 0;
  if (!preview) {
    const { canSee, isAdmin, userFromRequest } = await import("@/lib/drops-server");
    const user = await userFromRequest(req);
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (!(await canSee(user.id, user.email, SLUG))) return NextResponse.json({ error: "Not on your account" }, { status: 403 });
    admin = isAdmin(user.email);
    // Each member's own clock (lib/confessions-clock.ts): poem one in their own first week.
    if (!admin) weeks = memberWeeks(user);
  }
  const CONFESSION_POEMS = shiftAll(LAUNCH_POEMS, weeks);

  let today = todayUK();
  // Owner preview, the same as the confessions: Juliette sees the next Wednesday's poems early.
  if (preview || admin) {
    const next = CONFESSION_POEMS.map((p) => p.publish_on).filter((d) => d > today).sort()[0];
    if (next) today = next;
  }
  today = addDays(today, PEEK_DAYS); // up to two days ahead (Juliette 20 Nov 2026)
  const list = CONFESSION_POEMS.filter((p) => p.publish_on <= today)
    .sort((a, b) => b.publish_on.localeCompare(a.publish_on));
  // Charlene's videos live in the private "drops" store: each opened one gets a play link that lasts 2 hours.
  // No file there yet (not uploaded) means no link, and the poem plays its audio instead.
  const videoUrl = async (path?: string): Promise<string | null> => {
    if (!path || preview) return null;
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    const { DROPS_BUCKET } = await import("@/lib/drops-server");
    const { data } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUrl(path, 60 * 60 * 2);
    return data?.signedUrl ?? null;
  };
  const opened = await Promise.all(
    list.map(async ({ id, publish_on, title, chapter, stanzas, audio, video }) => ({ id, publish_on, title, chapter, stanzas, audio, video: await videoUrl(video) }))
  );
  const next = CONFESSION_POEMS.map((p) => p.publish_on).filter((d) => d > today).sort()[0] ?? null;
  return NextResponse.json({ today, poems: opened, next });
}
