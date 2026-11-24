import { createHash } from "crypto";

// (Retired 24 Nov 2026.) Was daily at 06:00 UTC: asked the app to remove group members whose
// Scrumptious Confessions access has ended (specs/telegram-gatekeeper.md R4).
export default async () => {
  const raw = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!raw) return new Response("no secret", { status: 500 });
  const secret = createHash("sha256").update(raw).digest("hex");
  const res = await fetch("https://app.feelfullyyou.com/api/telegram/sweep", {
    method: "POST",
    headers: { "x-sweep-secret": secret },
  });
  const body = await res.text();
  console.log("telegram sweep:", res.status, body);
  return new Response(body, { status: res.status });
};

// 24 Nov 2026 (Juliette): "telegram off". There is no Telegram group any more, so this no longer runs.
// To bring it back, put the schedule line back: export const config = { schedule: "0 6 * * *" };
