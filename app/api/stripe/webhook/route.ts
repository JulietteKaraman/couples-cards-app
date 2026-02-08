import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STRIPE_TEST_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/environment";

const stripe = new Stripe(STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const product = session.metadata?.product;
    const userId = session.metadata?.user_id;

    if (product === "couples" && userId) {
      // Retrieve the full session with payment_intent expanded
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['payment_intent']
      });

      const paymentIntentId = typeof fullSession.payment_intent === 'string'
        ? fullSession.payment_intent
        : fullSession.payment_intent?.id;

      await supabaseAdmin.from("entitlements").upsert({
        user_id: userId,
        couples_access: true,
        purchased_at: new Date().toISOString(),
        stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId || null,
        last_verified_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
