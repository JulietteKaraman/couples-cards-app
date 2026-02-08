import { NextResponse } from "next/server";
import Stripe from "stripe";
import { withRetry } from "@/lib/utils/retry";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { userId, email, idempotencyKey } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing user information" },
        { status: 400 }
      );
    }

    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "Missing idempotency key" },
        { status: 400 }
      );
    }

    const session = await withRetry(
      () => stripe.checkout.sessions.create(
        {
          mode: "payment",
          allow_promotion_codes: true,
          customer_email: email,
          line_items: [{ price: process.env.STRIPE_COUPLES_PRICE_ID!, quantity: 1 }],
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/unlock?canceled=true`,
          metadata: {
            product: "couples",
            user_id: userId,
          },
        },
        { idempotencyKey }
      ),
      3
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Unable to initialize checkout. Please try again." },
      { status: 500 }
    );
  }
}
