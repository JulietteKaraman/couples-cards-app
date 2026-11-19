import { NextResponse } from "next/server";
import Stripe from "stripe";

// GET /api/confessions/checkout: the "Start my 7 days free" button (Juliette, 19 Nov 2026:
// "they put their card in now; nothing is charged, and nothing opens, until Monday").
// Same £111 price as her payment link (read from the link itself, so it can never drift).
// The free week never starts before doors open: the trial ends 7 days from now, or at the
// end of the first free week (Mon 30 Nov 2026, 00:00 UK), whichever is later.
const PAYMENT_LINK = "plink_1UcVo0CCw18geY15ifq2MyD0";
const FIRST_CHARGE = Date.UTC(2026, 10, 30, 0, 0, 0) / 1000; // Mon 30 Nov 2026 00:00 UK (GMT)
const SALES = "https://feelfullyyou.com/scrumptious-confessions-membership";
const APP = "https://app.feelfullyyou.com/practice/scrumptious-confessions";

let priceCache: string | null = null;

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.redirect(SALES, 303);
  const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  try {
    if (!priceCache) {
      const items = await stripe.paymentLinks.listLineItems(PAYMENT_LINK, { limit: 1 });
      priceCache = items.data[0]?.price?.id ?? null;
    }
    if (!priceCache) throw new Error("no price on the payment link");
    const now = Math.floor(Date.now() / 1000);
    const trialEnd = Math.max(now + 7 * 24 * 60 * 60 + 60 * 60, FIRST_CHARGE);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceCache, quantity: 1 }],
      payment_method_collection: "always",
      // The site's webhook sends the welcome email by payment link; this names the one it stands for.
      metadata: { payment_link: PAYMENT_LINK },
      subscription_data: { trial_end: trialEnd, metadata: { payment_link: PAYMENT_LINK } },
      success_url: `${APP}?joined=1`,
      cancel_url: SALES,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("confessions checkout:", (e as Error).message);
    // Never strand her buyer: fall back to the payment link itself.
    return NextResponse.redirect("https://buy.stripe.com/cNi8wOfSzfpucm11Yx0co2z", 303);
  }
}
