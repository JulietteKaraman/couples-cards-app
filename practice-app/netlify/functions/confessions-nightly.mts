import { createHash } from "crypto";

// Every night at 02:30 UTC: make the app match Stripe for every Scrumptious Confessions member, so nobody who is
// paying wakes up locked out (Juliette 20 Nov 2026). Uses the same shared secret as the old Telegram sweep.
export default async () => {
  const raw = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!raw) return new Response("no secret", { status: 500 });
  const secret = createHash("sha256").update(raw).digest("hex");
  const res = await fetch("https://app.feelfullyyou.com/api/confessions/nightly", { method: "POST", headers: { "x-sweep-secret": secret } });
  const body = await res.text();
  console.log("confessions nightly:", res.status, body);
  return new Response(body, { status: res.status });
};

export const config = { schedule: "30 2 * * *" };
