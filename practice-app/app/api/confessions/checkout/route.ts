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

// 21 Nov 2026 (Juliette, yes): FIRST50 = first paid month free, for her groups and testimonial-givers
// (feelfullyyou.com/first50). 100% off for 1 month from sign-up, which always covers the first
// payment after the 7 free days. Capped at 50, so it can never run past the first-50 price.
const FIRST50_COUPON = "confessions-first-month-free";
async function first50Coupon(stripe: Stripe, price: string): Promise<string | null> {
  try {
    const c = await stripe.coupons.retrieve(FIRST50_COUPON);
    return c.valid ? c.id : null;
  } catch {
    const p = await stripe.prices.retrieve(price);
    const product = typeof p.product === "string" ? p.product : p.product.id;
    const c = await stripe.coupons.create({
      id: FIRST50_COUPON,
      name: "First month free (FIRST50)",
      percent_off: 100,
      duration: "repeating",
      duration_in_months: 1,
      max_redemptions: 50,
      applies_to: { products: [product] },
    });
    return c.id;
  }
}

export async function GET(req: Request) {
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
    // 21 Nov 2026: the "Build your first week" flow already has their email, so Stripe fills it in.
    const email = (new URL(req.url).searchParams.get("email") || "").trim();
    const code = (new URL(req.url).searchParams.get("code") || "").trim().toUpperCase();
    const coupon = code === "FIRST50" ? await first50Coupon(stripe, priceCache).catch(() => null) : null;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { customer_email: email } : {}),
      line_items: [{ price: priceCache, quantity: 1 }],
      ...(coupon ? { discounts: [{ coupon }] } : {}),
      payment_method_collection: "always",
      // The site's webhook sends the welcome email by payment link; this names the one it stands for.
      metadata: { payment_link: PAYMENT_LINK, ...(coupon ? { code: "FIRST50" } : {}) },
      subscription_data: { trial_end: trialEnd, metadata: { payment_link: PAYMENT_LINK, ...(coupon ? { code: "FIRST50" } : {}) } },
      // Stripe counts free days from today ("10 days free"); this says plainly when the week starts.
      custom_text: {
        submit: {
          message: coupon
            ? "Nothing is charged today. Your 7 free days come first, then your first month is free too. Your first £111 comes about five weeks from today. Stop before then and you pay nothing."
            : now < FIRST_CHARGE - 7 * 24 * 60 * 60
            ? "Nothing is charged today. Doors open Monday 23 November and your 7 free days start then, with Juliette's first confession. Your first £111 is on Monday 30 November. Stop before then and you pay nothing."
            : "Nothing is charged today. Your 7 free days start now. Stop before your first payment and you pay nothing.",
        },
      },
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
