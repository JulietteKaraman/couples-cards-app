import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  console.log("========== WEBHOOK START ==========");
  console.log("Timestamp:", new Date().toISOString());
  
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  console.log("Stripe-Signature present:", !!sig);

  if (!sig) {
    console.error("ERROR: Missing stripe-signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook signature verified successfully");
    console.log("Event type:", event.type);
    console.log("Event ID:", event.id);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("Processing checkout.session.completed");
    console.log("Session ID:", session.id);
    console.log("Session metadata:", session.metadata);
    console.log("Product:", session.metadata?.product);
    console.log("User ID:", session.metadata?.user_id);

    const product = session.metadata?.product;
    const userId = session.metadata?.user_id;

    if (product === "couples" && userId) {
      console.log("Conditions met - processing entitlement for user:", userId);
      
      try {
        // Retrieve the full session with payment_intent expanded
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['payment_intent']
        });

        const paymentIntentId = typeof fullSession.payment_intent === 'string'
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id;

        console.log("Payment Intent ID:", paymentIntentId);

        const entitlementData = {
          user_id: userId,
          couples_access: true,
          purchased_at: new Date().toISOString(),
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId || null,
          last_verified_at: new Date().toISOString(),
        };

        console.log("Upserting entitlement:", entitlementData);

        const { data, error } = await supabaseAdmin
          .from("entitlements")
          .upsert(entitlementData)
          .select();

        if (error) {
          console.error("DATABASE ERROR:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          console.error("Error details:", error.details);
          console.log("========== WEBHOOK END (DB ERROR) ==========");
          return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }

        console.log("Entitlement upserted successfully:", data);
      } catch (dbError: any) {
        console.error("UNEXPECTED ERROR during entitlement creation:", dbError);
        console.error("Error stack:", dbError.stack);
        console.log("========== WEBHOOK END (UNEXPECTED ERROR) ==========");
        return new NextResponse("Entitlement creation failed", { status: 500 });
      }
    } else {
      console.log("Skipping - conditions not met:");
      console.log("  product === 'couples':", product === "couples");
      console.log("  userId exists:", !!userId);
    }
  } else {
    console.log("Ignoring event type:", event.type);
  }

  console.log("========== WEBHOOK END ==========");
  return NextResponse.json({ received: true });
}
