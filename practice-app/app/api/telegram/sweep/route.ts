import { NextResponse } from "next/server";
import { canSee } from "@/lib/drops-server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { telegramSecret } from "@/lib/telegram/secret";
import { GROUP_SLUG, groupChatId, makeAnonymous, tg, undoAnonymous } from "@/lib/telegram/bot";

// R4: once a day (netlify/functions/telegram-sweep.mts), remove every recorded
// group member whose Scrumptious Confessions access has ended. Ban then unban
// straight away = removed, not banned, so paying again lets them back in.
// R5: only people who joined through a personal link are ever in this table.
export async function POST(req: Request) {
  const secret = telegramSecret();
  if (!secret || req.headers.get("x-sweep-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const chatId = await groupChatId();
  if (!chatId) return NextResponse.json({ ok: false, error: "no chat id" });

  const { data: rows } = await supabaseAdmin
    .from("telegram_members")
    .select("id, user_id, telegram_user_id")
    .not("telegram_user_id", "is", null)
    .is("removed_at", null)
    .is("left_at", null);

  const removed: number[] = [];
  const failed: string[] = [];
  const access = new Map<string, boolean>();
  for (const r of rows || []) {
    if (!access.has(r.user_id)) access.set(r.user_id, await canSee(r.user_id, undefined, GROUP_SLUG));
    if (access.get(r.user_id)) {
      // Still a member: make sure they're anonymous (idempotent).
      await makeAnonymous(chatId, r.telegram_user_id);
      continue;
    }
    // Members are anonymous admins (made by the bot), and admins can't be removed, so undo that first.
    await undoAnonymous(chatId, r.telegram_user_id);
    const ban = await tg("banChatMember", { chat_id: chatId, user_id: r.telegram_user_id, revoke_messages: false });
    if (!ban.ok) { failed.push(ban.description || "ban failed"); continue; }
    await tg("unbanChatMember", { chat_id: chatId, user_id: r.telegram_user_id, only_if_banned: true });
    await supabaseAdmin.from("telegram_members").update({ removed_at: new Date().toISOString() }).eq("id", r.id);
    removed.push(r.id);
  }
  return NextResponse.json({ ok: true, checked: rows?.length ?? 0, removed: removed.length, failed });
}
