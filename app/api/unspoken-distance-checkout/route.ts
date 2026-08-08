import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const UNSPOKEN_DISTANCE_PRICE_ID = "price_1TnxAqCCw18geY153w22a2Ye"; // £97 — the guide now includes the free Couples Cards, back to £97 (1 Aug 2026)

// Checkout for "The Unspoken Distance" (£97), no account required at
// checkout — matches the same pattern already used for
// touch-rituals-checkout, so the success_url can send buyers straight to
// a real thank-you page (feelfullyyou.com/thankyou-unspoken-distance)
// instead of Stripe's own default confirmation screen, per the-unspoken-
// distance spec R6.
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
      // Customers undercounts them. Found 8 Aug 2026 on Andrea Froli's £97,
      // the same payment that surfaced the metadata bug above.
      customer_creation: "always",
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      line_items: [{ price: UNSPOKEN_DISTANCE_PRICE_ID, quantity: 1 }],
      // stripe-webhook.js identifies a purchase ONLY from metadata.price_id.
      // Without this the buyer falls through to the "purchased" fallback tag
      // with no product tag and no welcome sequence, even though app access
      // still works (resolve-purchase reads line_items, not metadata).
      // Found 8 Aug 2026 after Andrea Froli paid £97 and got no welcome.
      metadata: { price_id: UNSPOKEN_DISTANCE_PRICE_ID },
      success_url: "https://feelfullyyou.com/thankyou-unspoken-distance",
      cancel_url: "https://feelfullyyou.com/the-unspoken-distance",
    });

    if (!session.url) {
      return NextResponse.redirect("https://feelfullyyou.com/the-unspoken-distance");
    }

    return NextResponse.redirect(session.url);
  } catch (error: any) {
    console.error("Unspoken Distance checkout error:", error.message);
    return NextResponse.redirect("https://feelfullyyou.com/the-unspoken-distance");
  }
}
