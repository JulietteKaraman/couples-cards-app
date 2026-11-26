import { NextResponse } from "next/server";
import { isAdmin, userFromRequest } from "@/lib/drops-server";
import { tg } from "@/lib/telegram/bot";
import { telegramSecret } from "@/lib/telegram/secret";
import { ownerChatId, ownerCode } from "@/lib/telegram/owner";

// Juliette only: is her Thursday reminder connected, and the one-tap link to connect it.
// Also makes sure Telegram still sends private messages to the app (the webhook), so the link works.
export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  const code = ownerCode();
  const secret = telegramSecret();
  if (!code || !secret) return NextResponse.json({ error: "The bot isn't set up on Netlify." }, { status: 400 });
  const me = await tg<{ username?: string }>("getMe", {});
  if (!me.ok || !me.result?.username) return NextResponse.json({ error: me.description || "Couldn't reach the bot." }, { status: 502 });
  const hook = await tg<{ url?: string }>("getWebhookInfo", {});
  if (hook.ok && hook.result?.url !== "https://app.feelfullyyou.com/api/telegram-webhook") {
    await tg("setWebhook", { url: "https://app.feelfullyyou.com/api/telegram-webhook", secret_token: secret, allowed_updates: ["message", "chat_member", "channel_post"] });
  }
  return NextResponse.json({ connected: !!(await ownerChatId()), link: `https://t.me/${me.result.username}?start=${code}` });
}
