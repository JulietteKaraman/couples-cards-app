import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DROP_COLLECTIONS, DROPS_BUCKET, canSee, todayUK, userFromRequest } from "@/lib/drops-server";

// GET /api/drops?c=how-to-feel-like-a-woman
// What a signed-in owner sees: every drop dated today or earlier (UK), newest
// first, voice notes as signed links that expire after 2 hours (R11), plus
// the date and kind of the NEXT drop with its content held back (R9).
export async function GET(req: Request) {
  const collection = new URL(req.url).searchParams.get("c") || "";
  if (!DROP_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await canSee(user.id, user.email, collection))) {
    return NextResponse.json({ error: "Not on your account" }, { status: 403 });
  }

  const today = todayUK();
  const { data: rows, error } = await supabaseAdmin
    .from("app_drops")
    .select("id, kind, title, body, audio_path, publish_on")
    .eq("collection", collection)
    .eq("hidden", false)
    .lte("publish_on", today)
    .order("publish_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load" }, { status: 500 });

  const drops = await Promise.all(
    (rows || []).map(async (r) => {
      let audio: string | null = null;
      if (r.audio_path) {
        const { data } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUrl(r.audio_path, 60 * 60 * 2);
        audio = data?.signedUrl ?? null;
      }
      return { id: r.id, kind: r.kind, title: r.title, body: r.body, audio, publish_on: r.publish_on };
    })
  );

  const { data: next } = await supabaseAdmin
    .from("app_drops")
    .select("kind, publish_on")
    .eq("collection", collection)
    .eq("hidden", false)
    .gt("publish_on", today)
    .order("publish_on", { ascending: true })
    .limit(1);

  return NextResponse.json({ today, drops, next: next?.[0] ?? null });
}
