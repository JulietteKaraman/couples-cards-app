import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  if (!userId || !email) {
    return new NextResponse("Missing user", { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true, // ✅ lets you use Stripe promo codes at checkout
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_COUPLES_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/unlock?canceled=true`,
    metadata: {
      product: "couples",
      user_id: userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
