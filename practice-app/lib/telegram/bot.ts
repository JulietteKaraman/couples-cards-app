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
  await supabaseAdmin.from("telegram_group").upsert({ id: 1, chat_id: chatId, updated_at: new Date().toISOString() });
}

export const GROUP_SLUG = "scrumptious-confessions";
