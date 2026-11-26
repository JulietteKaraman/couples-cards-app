import { createHash } from "crypto";

// Every Thursday 07:00 UTC (07:00 in UK winter, 08:00 in summer): Juliette's Telegram reminder with the
// questions waiting for her answers (26 Nov 2026).
export default async () => {
  const raw = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!raw) return new Response("no secret", { status: 500 });
  const secret = createHash("sha256").update(raw).digest("hex");
  const res = await fetch("https://app.feelfullyyou.com/api/confessions/thursday", { method: "POST", headers: { "x-sweep-secret": secret } });
  const body = await res.text();
  console.log("confessions thursday:", res.status, body);
  return new Response(body, { status: res.status });
};

export const config = { schedule: "0 7 * * 4" };
