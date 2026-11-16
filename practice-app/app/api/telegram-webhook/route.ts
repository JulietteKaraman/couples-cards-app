import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { telegramSecret } from "@/lib/telegram/secret";
import { rememberChatId } from "@/lib/telegram/bot";

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
  chat?: { id?: number; type?: string; title?: string };
  from?: { is_bot?: boolean };
};

export async function POST(req: Request) {
  const secret = telegramSecret();
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let update: { message?: TgMessage; chat_member?: TgChatMember };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const wantedTitle = (process.env.TELEGRAM_GROUP_TITLE || "Scrumptious Confessions").trim();
  // Gatekeeper (specs/telegram-gatekeeper.md R3, R6): who joined with which personal link.
  if (update.chat_member) {
    await onChatMember(update.chat_member, wantedTitle);
    return NextResponse.json({ ok: true });
  }

  const m = update.message;
  if (m?.chat?.id && m.chat.title === wantedTitle) await rememberChatId(m.chat.id);
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

type TgChatMember = {
  chat?: { id?: number; title?: string };
  new_chat_member?: { status?: string; user?: { id?: number; is_bot?: boolean } };
  invite_link?: { invite_link?: string };
};

// R3: a join through a personal link ties that Telegram account to the app
// account that link was made for. Nothing about messages is stored here.
async function onChatMember(cm: TgChatMember, wantedTitle: string) {
  if (!cm.chat?.id || cm.chat.title !== wantedTitle) return;
  await rememberChatId(cm.chat.id);
  const tgUser = cm.new_chat_member?.user;
  const status = cm.new_chat_member?.status;
  if (!tgUser?.id || tgUser.is_bot) return;
  if (status === "member" && cm.invite_link?.invite_link) {
    await supabaseAdmin
      .from("telegram_members")
      .update({ telegram_user_id: tgUser.id, joined_at: new Date().toISOString(), left_at: null })
      .eq("invite_link", cm.invite_link.invite_link);
  } else if (status === "left") {
    await supabaseAdmin
      .from("telegram_members")
      .update({ left_at: new Date().toISOString() })
      .eq("telegram_user_id", tgUser.id)
      .is("removed_at", null)
      .is("left_at", null);
  }
}
