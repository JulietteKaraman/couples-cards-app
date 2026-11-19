import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DROPS_BUCKET, isAdmin, userFromRequest } from "@/lib/drops-server";
import { MEDITATIONS, meditationPath } from "@/lib/content/meditations";

// Juliette's one-time meditation upload (admin only, checked on the server against her session).
//   GET                               which meditations are already uploaded
//   POST {action:"upload-url", slug}  a one-time link to upload that meditation's file
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  const { data } = await supabaseAdmin.storage.from(DROPS_BUCKET).list("meditations", { limit: 1000 });
  const have = new Set((data || []).map((f) => f.name.replace(/\.m4a$/, "")));
  return NextResponse.json({ uploaded: MEDITATIONS.filter((m) => have.has(m.slug)).map((m) => m.slug), total: MEDITATIONS.length });
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
  if (!MEDITATIONS.some((m) => m.slug === slug)) return NextResponse.json({ error: "Not one of the meditations" }, { status: 400 });
  const { data, error } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUploadUrl(meditationPath(slug), { upsert: true });
  if (error || !data) return NextResponse.json({ error: error?.message || "No upload link" }, { status: 500 });
  return NextResponse.json({ path: data.path, token: data.token });
}
