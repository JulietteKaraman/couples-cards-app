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
      // Without this, a buyer who pays via Link (one-tap, no card form) checks
      // out as a guest with no Customer record attached to the payment. The
      // charge itself is fine and the webhook still tags them off
      // customer_details.email, but the payment then doesn't show up under
      // their name anywhere in Stripe, and any revenue view built off
      // Customers undercounts them. Found 8 Aug 2026 on Andrea Froli's £97.
      customer_creation: "always",
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      line_items: [{ price: TOUCH_RITUALS_PRICE_ID, quantity: 1 }],
      // stripe-webhook.js identifies a purchase ONLY from metadata.price_id.
      // Without this the buyer falls through to the "purchased" fallback tag
      // with no product tag and no welcome sequence. Found 8 Aug 2026.
      metadata: { price_id: TOUCH_RITUALS_PRICE_ID },
      // Routes through rituals-success (same app, same Stripe client) so the
      // email just typed at checkout can be looked up server-side and handed
      // to the thank-you page — see that route for why. Without this, buyers
      // were typing their email a second time at app.feelfullyyou.com/login,
      // which read as a broken duplicate "sign up again" step (flagged by
      // Juliette 1 Aug 2026).
      success_url:
        "https://couplecards.netlify.app/api/rituals-success?session_id={CHECKOUT_SESSION_ID}",
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
