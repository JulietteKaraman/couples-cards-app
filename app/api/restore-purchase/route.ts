import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

function getDecksForProduct(product: string): string[] {
  if (product === "full-set") {
    return ["trust-repair", "couples", "friends"];
  }
  if (product === "all-three") {
    return ["couples", "friends", "touch-languages"];
  }
  if (product === "core-collection") {
    return ["couples", "friends"];
  }
  if (product === "full-core-set") {
    return ["couples", "friends", "touch-languages"];
  }
  if (product === "everything") {
    return ["couples", "friends", "touch-languages", "trust-repair"];
  }
  // Single deck
  const validDecks = ["couples", "friends", "touch-languages", "trust-repair"];
  if (validDecks.includes(product)) {
    return [product];
  }
  return [];
}

async function findUserCheckoutSession(userId: string, userEmail: string): Promise<{ sessionId: string; product: string } | null> {
  console.log("Searching for recent Stripe checkout sessions for:", userEmail);

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 50 });

    const paidSessions = sessions.data.filter(
      (s) => s.payment_status === "paid" && s.metadata?.user_id === userId
    );

    if (paidSessions.length > 0) {
      const session = paidSessions[0];
      const product = session.metadata?.product;
      if (product) {
        console.log("Found matching session:", session.id, "product:", product);
        return { sessionId: session.id, product };
      }
    }

    if (userEmail) {
      const emailSessions = sessions.data.filter(
        (s) => s.payment_status === "paid" && s.customer_email === userEmail.toLowerCase()
      );

      if (emailSessions.length > 0) {
        const session = emailSessions[0];
        const product = session.metadata?.product;
        if (product) {
          console.log("Found matching email session:", session.id, "product:", product);
          return { sessionId: session.id, product };
        }
      }
    }

    return null;
  } catch (err) {
    console.error("Error searching Stripe sessions:", err);
    return null;
  }
}

export async function POST(req: Request) {
  console.log("========== RESTORE PURCHASE START ==========");

  try {
    const { userId, checkoutSessionId, userEmail } = await req.json();

    if (!userId) {
      console.error("ERROR: Missing userId");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("Restoring purchase for user:", userId);
    console.log("Checkout session ID provided:", checkoutSessionId || "not provided");
    console.log("User email provided:", userEmail || "not provided");

    let sessionId = checkoutSessionId;
    let product = "full-set";

    if (!sessionId && userEmail) {
      const found = await findUserCheckoutSession(userId, userEmail);
      if (found) {
        sessionId = found.sessionId;
        product = found.product;
        console.log("Found session via search:", sessionId, "product:", product);
      }
    }

    if (!sessionId) {
      const { data: existingDecks } = await supabaseAdmin
        .from("user_decks")
        .select("stripe_checkout_session_id, deck_type")
        .eq("user_id", userId)
        .neq("stripe_checkout_session_id", "pending_purchase")
        .neq("stripe_checkout_session_id", "free_taster")
        .neq("stripe_checkout_session_id", "ivorey_promoted");

      if (existingDecks && existingDecks.length > 0) {
        console.log("User already has verified deck access:", existingDecks);
        return NextResponse.json({
          success: true,
          message: "Access already granted",
          data: { decks: existingDecks.map(d => d.deck_type) }
        });
      }

      return NextResponse.json(
        { error: "No checkout session found. If you just purchased, please try again in a few minutes." },
        { status: 400 }
      );
    }

    console.log("Retrieving checkout session from Stripe:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    console.log("Session status:", session.status);
    console.log("Session payment_status:", session.payment_status);

    if (session.payment_status !== 'paid') {
      console.error("ERROR: Payment not completed");
      return NextResponse.json(
        { error: "Payment not completed or failed" },
        { status: 400 }
      );
    }

    const sessionProduct = session.metadata?.product || product;
    const decksToGrant = getDecksForProduct(sessionProduct);

    if (decksToGrant.length === 0) {
      console.error("ERROR: Unknown product:", sessionProduct);
      return NextResponse.json(
        { error: "Unknown product type" },
        { status: 400 }
      );
    }

    console.log("Decks to grant:", decksToGrant, "from product:", sessionProduct);

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

    const now = new Date().toISOString();

    for (const deckType of decksToGrant) {
      const deckData = {
        user_id: userId,
        deck_type: deckType,
        purchased_at: now,
        stripe_checkout_session_id: sessionId,
        stripe_payment_intent_id: paymentIntentId || null,
      };

      const { error: upsertError } = await supabaseAdmin
        .from("user_decks")
        .upsert(deckData, { onConflict: "user_id,deck_type" });

      if (upsertError) {
        console.error(`Error granting ${deckType}:`, upsertError);
      } else {
        console.log(`Granted ${deckType} access for user ${userId}`);
      }
    }

    if (decksToGrant.includes("couples")) {
      await supabaseAdmin
        .from("entitlements")
        .upsert({
          user_id: userId,
          couples_access: true,
          purchased_at: now,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_checkout_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId || null,
          last_verified_at: now,
        })
        .select();
    }

    console.log("========== RESTORE PURCHASE SUCCESS ==========");

    return NextResponse.json({
      success: true,
      message: `Access restored for ${decksToGrant.join(", ")}`,
      data: { decks: decksToGrant }
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
