import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  console.log("========== RESTORE PURCHASE START ==========");
  
  try {
    const { userId, checkoutSessionId } = await req.json();

    if (!userId) {
      console.error("ERROR: Missing userId");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("Restoring purchase for user:", userId);
    console.log("Checkout session ID provided:", checkoutSessionId || "not provided");

    // Get current entitlement
    const { data: entitlement, error: fetchError } = await supabaseAdmin
      .from("entitlements")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching entitlement:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch entitlement" },
        { status: 500 }
      );
    }

    let sessionId = checkoutSessionId;
    
    // If no session ID provided, try to get it from existing record
    if (!sessionId && entitlement?.stripe_checkout_session_id) {
      sessionId = entitlement.stripe_checkout_session_id;
      console.log("Using stored checkout session ID:", sessionId);
    }

    if (!sessionId) {
      console.error("ERROR: No checkout session ID available");
      return NextResponse.json(
        { error: "No checkout session ID found. Please provide it or ensure it exists in the database." },
        { status: 400 }
      );
    }

    // Retrieve checkout session from Stripe
    console.log("Retrieving checkout session from Stripe...");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    console.log("Session status:", session.status);
    console.log("Payment status:", session.payment_status);

    if (session.payment_status !== 'paid') {
      console.error("ERROR: Payment not completed");
      return NextResponse.json(
        { error: "Payment not completed or failed", status: session.payment_status },
        { status: 400 }
      );
    }

    // Extract payment intent ID
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

    console.log("Payment intent ID:", paymentIntentId || "not found");

    // Update entitlement with verified access
    const updateData = {
      couples_access: true,
      stripe_checkout_session_id: sessionId,
      stripe_payment_intent_id: paymentIntentId || null,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
      last_verified_at: new Date().toISOString(),
    };

    console.log("Updating entitlement with:", updateData);

    const { data, error: updateError } = await supabaseAdmin
      .from("entitlements")
      .update(updateData)
      .eq("user_id", userId)
      .select();

    if (updateError) {
      console.error("ERROR updating entitlement:", updateError);
      return NextResponse.json(
        { error: "Failed to update entitlement", details: updateError.message },
        { status: 500 }
      );
    }

    console.log("========== RESTORE PURCHASE SUCCESS ==========");
    
    return NextResponse.json({
      success: true,
      message: "Purchase restored successfully",
      data: {
        couples_access: true,
        payment_intent_id: paymentIntentId,
        checkout_session_id: sessionId
      }
    });

  } catch (error: any) {
    console.error("========== RESTORE PURCHASE ERROR ==========");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}