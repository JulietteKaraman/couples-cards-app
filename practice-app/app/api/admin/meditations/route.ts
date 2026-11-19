import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DROPS_BUCKET, isAdmin, userFromRequest } from "@/lib/drops-server";
import { MEDITATIONS, meditationPath } from "@/lib/content/meditations";
import { CONFESSION_POEMS } from "@/lib/content/confession-poems";

// Poem videos (19 Nov 2026) share this upload: kind "poem" puts <poem id>.mp4 at the poem's video path.
const POEM_VIDEOS = CONFESSION_POEMS.filter((p) => p.video).map((p) => ({ id: p.id, path: p.video! }));

// Juliette's one-time meditation upload (admin only, checked on the server against her session).
//   GET                               which meditations are already uploaded
//   POST {action:"upload-url", slug}  a one-time link to upload that meditation's file
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  const { data } = await supabaseAdmin.storage.from(DROPS_BUCKET).list("meditations", { limit: 1000 });
  const have = new Set((data || []).map((f) => f.name.replace(/\.m4a$/, "")));
  const { data: pv } = await supabaseAdmin.storage.from(DROPS_BUCKET).list("poems", { limit: 1000 });
  const havePoems = new Set((pv || []).map((f) => "poems/" + f.name));
  return NextResponse.json({
    uploaded: MEDITATIONS.filter((m) => have.has(m.slug)).map((m) => m.slug),
    total: MEDITATIONS.length,
    poems: POEM_VIDEOS.map((p) => ({ id: p.id, uploaded: havePoems.has(p.path) })),
  });
}

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (b.action !== "upload-url") return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const slug = String(b.slug || "");
  let path: string;
  if (b.kind === "poem") {
    const p = POEM_VIDEOS.find((x) => x.id === slug);
    if (!p) return NextResponse.json({ error: "Not one of the poem videos" }, { status: 400 });
    path = p.path;
  } else {
    if (!MEDITATIONS.some((m) => m.slug === slug)) return NextResponse.json({ error: "Not one of the meditations" }, { status: 400 });
    path = meditationPath(slug);
  }
  const { data, error } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUploadUrl(path, { upsert: true });
  if (error || !data) return NextResponse.json({ error: error?.message || "No upload link" }, { status: 500 });
  return NextResponse.json({ path: data.path, token: data.token });
}
