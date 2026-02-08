import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const product = session.metadata?.product;
    const userId = session.metadata?.user_id;

    if (product === "couples" && userId) {
      await supabaseAdmin.from("entitlements").upsert({
        user_id: userId,
        couples_access: true,
        purchased_at: new Date().toISOString(),
        stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
        stripe_checkout_session_id: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
