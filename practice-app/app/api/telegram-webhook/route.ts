import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Scrumptious Confessions: the Telegram bot that copies every text message in
// Juliette's group into her questions bank (11 Nov 2026, Juliette: "The
// questions are the gold"). No name, username or Telegram id is ever stored:
// only the words, the group's title and the time.
//
// Telegram calls this address for each new message once Juliette presses
// "Connect Telegram" on /admin/confessions. The secret header proves the call
// came from Telegram. Only the group named in TELEGRAM_GROUP_TITLE is kept.
const MAX = 4000;

type TgMessage = {
  text?: string;
  caption?: string;
  chat?: { type?: string; title?: string };
  from?: { is_bot?: boolean };
};

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let update: { message?: TgMessage };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const m = update.message;
  const words = (m?.text || m?.caption || "").trim();
  const chatTitle = m?.chat?.title || "";
  const wanted = (process.env.TELEGRAM_GROUP_TITLE || "Scrumptious Confessions").trim();
  const isGroup = m?.chat?.type === "group" || m?.chat?.type === "supergroup";
  // Voice notes, photos without words, bots and other chats are skipped.
  if (!m || !words || !isGroup || chatTitle !== wanted || m.from?.is_bot) return NextResponse.json({ ok: true });

  await supabaseAdmin.from("confession_messages").insert({
    item_id: "telegram",
    item_title: `From the Telegram group`,
    body: words.slice(0, MAX),
    member_email: null,
    kind: words.includes("?") ? "question" : "telegram",
    source: "telegram",
  });
  // Always answer 200 so Telegram doesn't keep resending.
  return NextResponse.json({ ok: true });
}
