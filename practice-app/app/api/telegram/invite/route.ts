import { NextResponse } from "next/server";
import { canSee, userFromRequest } from "@/lib/drops-server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { GROUP_SLUG, groupChatId, makeAnonymous, tg } from "@/lib/telegram/bot";

// R1: a member's OWN one-use invite link to the Telegram group. Only someone
// with Scrumptious Confessions access gets one. Their latest link is handed back
// rather than making a new one each visit; once used it can't let anyone else in
// (member_limit 1), and for them it simply opens the group.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await canSee(user.id, user.email ?? undefined, GROUP_SLUG))) {
    return NextResponse.json({ error: "Not on your account" }, { status: 403 });
  }

  const { data: open } = await supabaseAdmin
    .from("telegram_members")
    .select("invite_link, telegram_user_id")
    .eq("user_id", user.id)
    .is("removed_at", null)
    .is("left_at", null)
    .order("created_at", { ascending: false })
    .limit(1);
  if (open && open[0]?.invite_link) {
    // Already in the group: make sure they're anonymous (self-heals a join that
    // happened before the bot had the right to do it, 17 Nov 2026).
    const tgId = open[0].telegram_user_id as number | null;
    if (tgId) {
      const chat = await groupChatId();
      if (chat) {
        const anon = await makeAnonymous(chat, tgId);
        if (!anon.ok) console.error("telegram: re-anonymise failed:", anon.description);
      }
    }
    return NextResponse.json({ link: open[0].invite_link });
  }

  const chatId = await groupChatId();
  if (!chatId) return NextResponse.json({ error: "The group isn't connected yet" }, { status: 503 });

  const made = await tg<{ invite_link: string }>("createChatInviteLink", {
    chat_id: chatId,
    member_limit: 1,
    name: `member ${user.id.slice(0, 8)}`,
  });
  if (!made.ok || !made.result?.invite_link) {
    console.error("telegram invite error:", made.description);
    return NextResponse.json({ error: "Couldn't make your link. Try again in a minute." }, { status: 502 });
  }
  await supabaseAdmin.from("telegram_members").insert({ user_id: user.id, invite_link: made.result.invite_link });
  return NextResponse.json({ link: made.result.invite_link });
}
