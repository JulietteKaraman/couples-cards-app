import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const TOUCH_RITUALS_PRICE_ID = "price_1Tlpu0CCw18geY15b8J3jlBW";

// Guest checkout for the £7 "10 Touch Rituals" guide, no account required.
// A `promo` query param auto-applies a live Stripe promotion code server-side
// (Checkout Sessions honour product-restricted coupons correctly; Stripe's
// hosted Payment Link "Apply" widget does not, which is why this route
// exists instead of reusing the old buy.stripe.com link for discounted access).
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const promo = searchParams.get("promo");

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (promo) {
      const codes = await stripe.promotionCodes.list({
        code: promo.trim(),
        active: true,
        limit: 1,
      });
      if (codes.data.length > 0) {
        discounts = [{ promotion_code: codes.data[0].id }];
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      line_items: [{ price: TOUCH_RITUALS_PRICE_ID, quantity: 1 }],
      success_url: "https://feelfullyyou.com/trip-wire",
      cancel_url: "https://feelfullyyou.com/",
    });

    if (!session.url) {
      return NextResponse.redirect("https://feelfullyyou.com/trip");
    }

    return NextResponse.redirect(session.url);
  } catch (error: any) {
    console.error("Touch Rituals checkout error:", error.message);
    return NextResponse.redirect("https://feelfullyyou.com/trip");
  }
}
