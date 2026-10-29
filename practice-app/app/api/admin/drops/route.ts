import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DROP_COLLECTIONS, DROPS_BUCKET, isAdmin, userFromRequest } from "@/lib/drops-server";

// Juliette's drop page (specs/how-to-feel-like-a-woman-app.md R10).
// Admin only, checked here on the server against her own session.
//   GET                      everything, past and future, with play links
//   POST {action:"upload-url", filename}  a one-time link to upload a voice note
//   POST {action:"create", ...}           add a card or a confession
//   POST {action:"hide", id, hidden}      hide or show one (nothing is deleted)

async function admin(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return { err: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  if (!isAdmin(user.email)) return { err: NextResponse.json({ error: "Not authorised" }, { status: 403 }) };
  return { user };
}

export async function GET(req: Request) {
  const a = await admin(req);
  if (a.err) return a.err;
  const { data, error } = await supabaseAdmin
    .from("app_drops")
    .select("id, collection, kind, title, body, audio_path, publish_on, hidden, created_at")
    .order("publish_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const drops = await Promise.all(
    (data || []).map(async (r) => {
      let audio: string | null = null;
      if (r.audio_path) {
        const { data: s } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUrl(r.audio_path, 60 * 60);
        audio = s?.signedUrl ?? null;
      }
      return { ...r, audio };
    })
  );
  return NextResponse.json({ drops });
}

export async function POST(req: Request) {
  const a = await admin(req);
  if (a.err) return a.err;
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (b.action === "upload-url") {
    const name = String(b.filename || "voice-note").toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
    const path = `confessions/${Date.now()}-${name}`;
    const { data, error } = await supabaseAdmin.storage.from(DROPS_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: error?.message || "No upload link" }, { status: 500 });
    return NextResponse.json({ path: data.path, token: data.token });
  }

  if (b.action === "create") {
    const collection = String(b.collection || "how-to-feel-like-a-woman");
    const kind = String(b.kind || "");
    const title = String(b.title || "").trim() || null;
    const body = String(b.body || "").trim() || null;
    const audio_path = String(b.audio_path || "").trim() || null;
    const publish_on = String(b.publish_on || "");
    if (!DROP_COLLECTIONS.includes(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
    if (kind !== "card" && kind !== "confession") return NextResponse.json({ error: "Card or confession?" }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publish_on)) return NextResponse.json({ error: "Pick a day" }, { status: 400 });
    if (kind === "card" && !body) return NextResponse.json({ error: "A card needs its words" }, { status: 400 });
    if (kind === "confession" && !audio_path) return NextResponse.json({ error: "A confession needs its voice note" }, { status: 400 });
    const { error } = await supabaseAdmin.from("app_drops").insert({ collection, kind, title, body, audio_path, publish_on });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (b.action === "hide") {
    const { error } = await supabaseAdmin.from("app_drops").update({ hidden: !!b.hidden }).eq("id", String(b.id || ""));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
