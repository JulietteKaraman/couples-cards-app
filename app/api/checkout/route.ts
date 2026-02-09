import { NextResponse } from "next/server";
import Stripe from "stripe";
import { withRetry } from "@/lib/utils/retry";
import { SITE_URL, STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  console.log("========== CHECKOUT START ==========");
  console.log("Timestamp:", new Date().toISOString());
  
  try {
    const { userId, email, idempotencyKey, product } = await req.json();

    console.log("Checkout request received:");
    console.log("  userId:", userId);
    console.log("  email:", email);
    console.log("  product:", product);
    console.log("  idempotencyKey present:", !!idempotencyKey);

    if (!userId || !email) {
      console.error("ERROR: Missing user information");
      return NextResponse.json(
        { error: "Missing user information" },
        { status: 400 }
      );
    }

    if (!idempotencyKey) {
      console.error("ERROR: Missing idempotency key");
      return NextResponse.json(
        { error: "Missing idempotency key" },
        { status: 400 }
      );
    }

    // Validate product type
    const validProducts = ["couples", "friends", "bundle"];
    const productType = product || "couples";
    
    if (!validProducts.includes(productType)) {
      console.error("ERROR: Invalid product type:", productType);
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    // Get the appropriate price ID
    let priceId: string;
    switch (productType) {
      case "couples":
        priceId = process.env.STRIPE_COUPLES_PRICE_ID!;
        break;
      case "friends":
        priceId = process.env.STRIPE_FRIENDS_PRICE_ID!;
        break;
      case "bundle":
        priceId = process.env.STRIPE_BUNDLE_PRICE_ID!;
        break;
      default:
        priceId = process.env.STRIPE_COUPLES_PRICE_ID!;
    }

    if (!priceId) {
      console.error("ERROR: Price ID not configured for product:", productType);
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    console.log("Creating Stripe checkout session for product:", productType);
    console.log("Using price ID:", priceId);
    
    const session = await withRetry(
      () => stripe.checkout.sessions.create(
        {
          mode: "payment",
          allow_promotion_codes: true,
          customer_email: email,
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${SITE_URL}/app?success=true`,
          cancel_url: `${SITE_URL}/app/unlock?canceled=true`,
          metadata: {
            product: productType,
            user_id: userId,
          },
        },
        { idempotencyKey }
      ),
      3
    );

    console.log("Checkout session created successfully:");
    console.log("  Session ID:", session.id);
    console.log("  Session URL present:", !!session.url);
    console.log("  Metadata:", session.metadata);

    if (!session.url) {
      console.error("ERROR: No session URL returned from Stripe");
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    console.log("========== CHECKOUT END (SUCCESS) ==========");
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("========== CHECKOUT ERROR ==========");
    console.error("Error creating checkout:", error.message);
    console.error("Error stack:", error.stack);
    console.log("========== CHECKOUT END (ERROR) ==========");
    return NextResponse.json(
      { error: "Unable to initialize checkout. Please try again." },
      { status: 500 }
    );
  }
}
