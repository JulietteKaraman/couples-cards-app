import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canSee, userFromRequest } from "@/lib/drops-server";
import { memberWall } from "@/lib/confessions-wall";

// GET  the questions wall for members: open questions (no names), this week's answers, every answer.
// POST {action:"metoo", id}  one Me too on a question. No name is stored with it.
const SLUG = "scrumptious-confessions";

async function member(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return { err: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  if (!(await canSee(user.id, user.email, SLUG))) return { err: NextResponse.json({ error: "Not on your account" }, { status: 403 }) };
  return { user };
}

export async function GET(req: Request) {
  const m = await member(req);
  if (m.err) return m.err;
  try {
    return NextResponse.json(await memberWall());
  } catch {
    return NextResponse.json({ error: "Could not load" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const m = await member(req);
  if (m.err) return m.err;
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (b.action !== "metoo") return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const id = String(b.id || "");
  const { data: q } = await supabaseAdmin.from("confession_messages").select("id").eq("id", id).eq("kind", "question").maybeSingle();
  if (!q) return NextResponse.json({ error: "Unknown question" }, { status: 400 });
  const { error } = await supabaseAdmin
    .from("confession_messages")
    .insert({ item_id: id, item_title: "Me too", body: "+1", member_email: null, kind: "metoo", source: "app", answered: true });
  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
