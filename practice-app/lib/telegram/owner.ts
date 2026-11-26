import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { tg } from "@/lib/telegram/bot";

// Juliette's own Thursday reminder on Telegram (26 Nov 2026: "Telegram message").
// She taps a private link once (t.me/<bot>?start=<code>); the bot then knows her chat. The code comes from the
// webhook secret, so only someone who can open /admin/confessions can get it. Her chat id lives in
// telegram_group row id 2 (row 1 is the old members channel), so no database change is needed.
const OWNER_ROW = 2;

export function ownerCode(): string | null {
  const raw = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!raw) return null;
  return createHash("sha256").update(`${raw}:owner`).digest("hex").slice(0, 24);
}

export async function ownerChatId(): Promise<number | null> {
  const { data } = await supabaseAdmin.from("telegram_group").select("chat_id").eq("id", OWNER_ROW).maybeSingle();
  return data?.chat_id ? Number(data.chat_id) : null;
}

export async function saveOwner(chatId: number) {
  await supabaseAdmin.from("telegram_group").upsert({ id: OWNER_ROW, chat_id: chatId, updated_at: new Date().toISOString() });
}

export async function tellOwner(text: string) {
  const chat = await ownerChatId();
  if (!chat) return { ok: false, description: "Telegram reminder not connected yet" };
  return tg("sendMessage", { chat_id: chat, text, disable_web_page_preview: true });
}
