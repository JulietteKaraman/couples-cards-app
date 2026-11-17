import { supabaseAdmin } from "@/lib/supabase/admin";

// Server-only helpers for the Telegram gatekeeper (specs/telegram-gatekeeper.md).

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<{ ok: boolean; result?: T; description?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN is not set on Netlify" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as { ok: boolean; result?: T; description?: string };
  } catch {
    return { ok: false, description: "Couldn't reach Telegram" };
  }
}

/** The group's chat id: TELEGRAM_CHAT_ID on Netlify, else the one the bot picked up from the group (R6). */
export async function groupChatId(): Promise<number | null> {
  const env = Number(process.env.TELEGRAM_CHAT_ID);
  if (env) return env;
  const { data } = await supabaseAdmin.from("telegram_group").select("chat_id").eq("id", 1).maybeSingle();
  return data?.chat_id ? Number(data.chat_id) : null;
}

export async function rememberChatId(chatId: number) {
  const { data: prev } = await supabaseAdmin.from("telegram_group").select("chat_id").eq("id", 1).maybeSingle();
  await supabaseAdmin.from("telegram_group").upsert({ id: 1, chat_id: chatId, updated_at: new Date().toISOString() });
  // R14 (17 Nov 2026): moving to a new chat (the group became a channel) retires every old
  // link, so each member is handed a fresh one for the new place on their next app visit.
  if (prev?.chat_id && Number(prev.chat_id) !== chatId) {
    await supabaseAdmin.from("telegram_members").update({ removed_at: new Date().toISOString() }).is("removed_at", null);
  }
}

export const GROUP_SLUG = "scrumptious-confessions";

const NO_RIGHTS = {
  can_manage_chat: false, can_delete_messages: false, can_manage_video_chats: false,
  can_restrict_members: false, can_promote_members: false, can_change_info: false,
  can_invite_users: false, can_post_stories: false, can_edit_stories: false,
  can_delete_stories: false, can_pin_messages: false, can_manage_topics: false,
};

/** Make a member anonymous: an admin whose ONLY setting is "Remain Anonymous"
 *  (exactly what Juliette did by hand). Needs the bot's "Add New Admins" right. */
export async function makeAnonymous(chatId: number, userId: number) {
  return tg("promoteChatMember", { chat_id: chatId, user_id: userId, is_anonymous: true, ...NO_RIGHTS });
}

/** Undo that, so the member can be removed. */
export async function undoAnonymous(chatId: number, userId: number) {
  return tg("promoteChatMember", { chat_id: chatId, user_id: userId, is_anonymous: false, ...NO_RIGHTS });
}
