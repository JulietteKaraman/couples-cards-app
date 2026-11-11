import { createHash } from "crypto";

// Telegram only accepts A-Z a-z 0-9 _ - in a webhook secret, so whatever
// password Juliette typed into Netlify is turned into a safe one here.
// The connect button and the webhook both use this, so they always match.
export function telegramSecret(): string | null {
  const raw = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!raw) return null;
  return createHash("sha256").update(raw).digest("hex");
}
