import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// Bridge between the "10 Touch Rituals" Stripe checkout and the trip-wire
// thank-you page. Stripe's success_url can carry {CHECKOUT_SESSION_ID} but
// not the email itself, so this route looks the email up server-side (same
// Stripe client the checkout route already uses) and forwards it as a plain
// query param the static thank-you page can read with no API calls of its
// own. From there trip-wire.html points "Open the app" straight at
// /login?email=..., which auto-sends the magic link — the buyer never has
// to type their email a second time.
//
// Falls back to the plain thank-you page (today's behaviour) if the session
// can't be read for any reason — never blocks delivery of the guide.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  let email: string | null = null;
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email ?? session.customer_email ?? null;
    } catch (error: any) {
      console.error("rituals-success: failed to retrieve session", error.message);
    }
  }

  const url = email
    ? `https://feelfullyyou.com/trip-wire?email=${encodeURIComponent(email)}`
    : "https://feelfullyyou.com/trip-wire";

  return NextResponse.redirect(url);
}
