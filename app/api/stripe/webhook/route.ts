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

    // "Complete the set" purchases happen on feelfullyyou.com payment links
    // (tripwire pages and follow-up emails), so they carry no user_id. Match
    // them by their Stripe price_id and unlock the full core set for the
    // account with the same email. Granting all three decks is idempotent, so
    // it is correct for both the £40/£45 (T&R owner) and £20/£25 (single-deck
    // owner) paths.
    const COMPLETION_PRICE_IDS = new Set([
      "price_1Tq7PiCCw18geY15kgJMkb6E", // £40 tripwire — T&R owners
      "price_1Tq7PpCCw18geY15ojeYpePd", // £20 tripwire — single-deck owners
      "price_1Tq7jRCCw18geY155S5mNiMG", // £45 email offer — T&R owners
      "price_1Tq7jUCCw18geY15Rgrwliu9", // £25 email offer — single-deck owners
    ]);

    if (!userId && session.metadata?.price_id && COMPLETION_PRICE_IDS.has(session.metadata.price_id)) {
      const buyerEmail = (session.customer_details?.email || session.customer_email || "").toLowerCase();
      console.log("Completion purchase detected for:", buyerEmail);

      if (!buyerEmail) {
        console.log("Completion purchase has no email - skipping");
        return NextResponse.json({ received: true });
      }

      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", buyerEmail)
        .single();

      if (!existingUser) {
        console.log("Completion purchase: no app account found for", buyerEmail, "- needs manual fulfilment via support@");
        return NextResponse.json({ received: true });
      }

      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
      for (const deckType of ["trust-repair", "couples", "friends"]) {
        const { error } = await supabaseAdmin
          .from("user_decks")
          .upsert({
            user_id: existingUser.id,
            deck_type: deckType,
            purchased_at: new Date().toISOString(),
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
          }, { onConflict: "user_id,deck_type" });

        if (error) {
          console.error(`Completion grant DATABASE ERROR for ${deckType}:`, error);
          return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }
      }

      console.log("Completion purchase: full core set unlocked for", buyerEmail);
      return NextResponse.json({ received: true });
    }

    if (!userId) {
      console.log("Skipping - no userId in metadata");
      return NextResponse.json({ received: true });
    }

    // Handle different product types
    const decksToGrant: string[] = [];
    
    if (product === "couples") {
      decksToGrant.push("couples");
    } else if (product === "friends") {
      decksToGrant.push("friends");
    } else if (product === "touch-languages") {
      decksToGrant.push("touch-languages");
    } else if (product === "trust-repair") {
      decksToGrant.push("trust-repair");
    } else if (product === "full-set") {
      decksToGrant.push("trust-repair", "couples", "friends");
    } else {
      console.log("Skipping - unknown product:", product);
      return NextResponse.json({ received: true });
    }

    console.log("Processing purchase for product:", product);
    console.log("Decks to grant:", decksToGrant);
    console.log("User ID:", userId);
    
    try {
      // First, try to get payment_intent from the event object directly
      let paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : (session.payment_intent as any)?.id;
      
      console.log("Payment Intent ID from session object:", paymentIntentId);

      // If not found, retrieve the full session with payment_intent expanded
      if (!paymentIntentId) {
        console.log("Payment intent not in session object, retrieving from Stripe...");
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['payment_intent']
        });

        paymentIntentId = typeof fullSession.payment_intent === 'string'
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id;

        console.log("Payment Intent ID from Stripe API:", paymentIntentId);
      }

      // If still not found, try payment_intent_data
      if (!paymentIntentId && (session as any).payment_intent_data?.id) {
        paymentIntentId = (session as any).payment_intent_data.id;
        console.log("Payment Intent ID from payment_intent_data:", paymentIntentId);
      }

      console.log("Payment intent ID status:", paymentIntentId ? "FOUND" : "MISSING - will grant access anyway");

      // Grant access to all relevant decks
      for (const deckType of decksToGrant) {
        const deckData = {
          user_id: userId,
          deck_type: deckType,
          purchased_at: new Date().toISOString(),
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId || null,
        };

        console.log(`Granting access to ${deckType} deck:`, deckData);

        const { data, error } = await supabaseAdmin
          .from("user_decks")
          .upsert(deckData, { onConflict: "user_id,deck_type" })
          .select();

        if (error) {
          console.error(`DATABASE ERROR for ${deckType}:`, error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          console.error("Error details:", error.details);
          console.log("========== WEBHOOK END (DB ERROR) ==========");
          return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }

        console.log(`Deck access granted for ${deckType}:`, data);
      }

      // Also update legacy entitlements table for backward compatibility
      if (decksToGrant.includes("couples")) {
        const entitlementData = {
          user_id: userId,
          couples_access: true,
          purchased_at: new Date().toISOString(),
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId || null,
          last_verified_at: new Date().toISOString(),
        };

        console.log("Updating legacy entitlements:", entitlementData);

        await supabaseAdmin
          .from("entitlements")
          .upsert(entitlementData)
          .select();
      }

      console.log("All deck access granted successfully");

      // Email-platform tagging for purchases happens in the feelfullyyou.com
      // Stripe webhook (matched by price_id / amount), so no sync is needed here.

    } catch (dbError: any) {
      console.error("UNEXPECTED ERROR during entitlement creation:", dbError);
      console.error("Error stack:", dbError.stack);
      console.log("========== WEBHOOK END (UNEXPECTED ERROR) ==========");
      return new NextResponse("Entitlement creation failed", { status: 500 });
    }
  } else {
    console.log("Ignoring event type:", event.type);
  }

  console.log("========== WEBHOOK END ==========");
  return NextResponse.json({ received: true });
}
