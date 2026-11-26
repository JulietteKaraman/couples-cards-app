import { NextResponse } from "next/server";
import { ownerChatId, ownerCode, saveOwner } from "@/lib/telegram/owner";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { telegramSecret } from "@/lib/telegram/secret";
import { rememberChatId, groupChatId, tg, GROUP_SLUG } from "@/lib/telegram/bot";
import { canSee } from "@/lib/drops-server";

// Scrumptious Confessions on Telegram, v2 FULL ANONYMITY (specs/telegram-gatekeeper.md R8-R15,
// Juliette 17 Nov 2026: "Build full anonymity").
// - The space is a private CHANNEL: subscribers can't see each other.
// - Members post by messaging the bot privately; the bot posts their words into the channel
//   with no name and saves them to the questions bank with no name. Text only.
// - Joins through personal links are recorded (who they are in the app), never what they write.
// Telegram calls this address once Juliette presses "Connect Telegram" on /admin/confessions.
const MAX = 3500;

type TgUser = { id?: number; is_bot?: boolean };
type TgChat = { id?: number; type?: string; title?: string };
type TgMessage = {
  text?: string;
  caption?: string;
  chat?: TgChat;
  from?: TgUser;
};
type TgChatMember = {
  chat?: TgChat;
  new_chat_member?: { status?: string; user?: TgUser };
  invite_link?: { invite_link?: string };
};

const wantedTitle = () => (process.env.TELEGRAM_GROUP_TITLE || "Scrumptious Confessions").trim();
const isOurChannel = (c?: TgChat) => !!c?.id && c.type === "channel" && c.title === wantedTitle();

export async function POST(req: Request) {
  const secret = telegramSecret();
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let update: { message?: TgMessage; channel_post?: TgMessage; chat_member?: TgChatMember };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    // R14: the bot learns the channel from any post in it (Juliette posts once after connecting).
    if (update.channel_post && isOurChannel(update.channel_post.chat)) {
      await rememberChatId(update.channel_post.chat!.id!);
    } else if (update.chat_member) {
      await onChatMember(update.chat_member);
    } else if (update.message?.chat?.type === "private") {
      await onPrivateMessage(update.message);
    }
  } catch (e) {
    console.error("telegram-webhook error:", e instanceof Error ? e.message : e);
  }
  // Always 200 so Telegram doesn't keep resending.
  return NextResponse.json({ ok: true });
}

// R3/R13: a join through a personal link ties that Telegram account to the app account.
async function onChatMember(cm: TgChatMember) {
  if (!isOurChannel(cm.chat)) return;
  await rememberChatId(cm.chat!.id!);
  const u = cm.new_chat_member?.user;
  const status = cm.new_chat_member?.status;
  if (!u?.id || u.is_bot) return;
  if (status === "member" && cm.invite_link?.invite_link) {
    await supabaseAdmin
      .from("telegram_members")
      .update({ telegram_user_id: u.id, joined_at: new Date().toISOString(), left_at: null })
      .eq("invite_link", cm.invite_link.invite_link);
  } else if (status === "left") {
    await supabaseAdmin
      .from("telegram_members")
      .update({ left_at: new Date().toISOString() })
      .eq("telegram_user_id", u.id)
      .is("removed_at", null)
      .is("left_at", null);
  }
}

async function reply(chatId: number, text: string) {
  await tg("sendMessage", { chat_id: chatId, text });
}

// R9-R11: the relay. The sender's id is only used to check membership, never stored with the words.
async function onPrivateMessage(m: TgMessage) {
  const from = m.from?.id;
  const dm = m.chat?.id;
  if (!from || !dm || m.from?.is_bot) return;

  // Juliette connecting her Thursday reminder (26 Nov 2026): /start <owner code> from the link on /admin/confessions.
  const code = ownerCode();
  const said = (m.text || "").trim();
  if (code && said === `/start ${code}`) {
    await saveOwner(dm);
    await reply(dm, "Done. Every Thursday morning I'll send you the questions waiting for your answers in Scrumptious Confessions.");
    return;
  }
  if (dm === (await ownerChatId())) {
    await reply(dm, "This chat is for your Thursday reminders. Answer the questions at https://app.feelfullyyou.com/admin/confessions");
    return;
  }

  const { data: rows } = await supabaseAdmin
    .from("telegram_members")
    .select("user_id")
    .eq("telegram_user_id", from)
    .is("removed_at", null)
    .is("left_at", null)
    .limit(1);
  const member = rows?.[0]?.user_id as string | undefined;
  if (!member || !(await canSee(member, undefined, GROUP_SLUG))) {
    await reply(dm, "This is the private door into Scrumptious Confessions. Join the channel from the app first (Mondays tab, \"Join our channel\"), then message me here and I'll post it for you, with no name on it.");
    return;
  }

  const text = (m.text || "").trim();
  if (text === "/start") {
    await reply(dm, "Welcome. Anything you send me here, I post into Scrumptious Confessions with no name on it. Nobody can see who you are, not even the other members. Text only, so your voice stays yours.");
    return;
  }
  if (!text) {
    await reply(dm, "Text only, please. A voice or a photo could give you away, and this space is anonymous. Type it, and I'll post it with no name.");
    return;
  }

  const channel = await groupChatId();
  if (!channel) {
    await reply(dm, "The channel isn't connected yet. Try again in a little while.");
    return;
  }
  const isQuestion = text.includes("?");
  const posted = await tg("sendMessage", { chat_id: channel, text: `${isQuestion ? "A question" : "A confession"}, no name:\n\n${text.slice(0, MAX)}` });
  if (!posted.ok) {
    console.error("telegram relay failed:", posted.description);
    await reply(dm, "That didn't post. Try again in a minute.");
    return;
  }
  await supabaseAdmin.from("confession_messages").insert({
    item_id: "telegram",
    item_title: "From the Telegram channel",
    body: text.slice(0, MAX),
    member_email: null,
    kind: isQuestion ? "question" : "telegram",
    source: "telegram",
  });
  await reply(dm, "Posted, with no name on it.");
}
