import { createHash } from "crypto";

// Daily at 06:00 UTC: asks the app to remove group members whose
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

export const config = { schedule: "0 6 * * *" };
