import { NextResponse } from "next/server";
import { telegramSecret } from "@/lib/telegram/secret";
import { nightlyCheck } from "@/lib/confessions-access";
import { giftEndingNudges } from "@/lib/confessions-gift-ending";

// Once a night (netlify/functions/confessions-nightly.mts): every live Scrumptious Confessions subscription in
// Stripe is checked against the app and put right. The summary shows at the top of /admin/confessions.
export async function POST(req: Request) {
  const secret = telegramSecret();
  if (!secret || req.headers.get("x-sweep-secret") !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const check = await nightlyCheck();
    const giftEnding = await giftEndingNudges().catch((e) => ({ error: (e as Error).message }));
    return NextResponse.json({ ...check, giftEnding });
  } catch (e) {
    console.error("confessions nightly:", (e as Error).message);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
