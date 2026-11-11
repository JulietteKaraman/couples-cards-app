import { NextResponse } from "next/server";
import { isAdmin, userFromRequest } from "@/lib/drops-server";

// Juliette's "Connect Telegram" button. Tells Telegram to send her group's
// messages to /api/telegram-webhook. Uses the bot key she put on Netlify;
// the key itself never leaves the server.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) {
    return NextResponse.json({ error: "The bot isn't set up on Netlify yet: TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET are needed." }, { status: 400 });
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: "https://app.feelfullyyou.com/api/telegram-webhook",
        secret_token: secret,
        allowed_updates: ["message"],
      }),
    });
    const json = (await res.json()) as { ok?: boolean; description?: string };
    if (!json.ok) return NextResponse.json({ error: json.description || "Telegram said no" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Telegram. Try again." }, { status: 502 });
  }
}
