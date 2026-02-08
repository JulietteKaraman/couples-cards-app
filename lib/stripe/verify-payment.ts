import Stripe from "stripe";
import { STRIPE_TEST_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

export interface PaymentVerificationResult {
  isValid: boolean;
  status: 'paid' | 'refunded' | 'disputed' | 'failed' | 'unknown';
  amountRefunded?: number;
}

export async function verifyPaymentStatus(paymentIntentId: string): Promise<PaymentVerificationResult> {
  try {
    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check payment intent status first
    if (paymentIntent.status !== 'succeeded') {
      return { isValid: false, status: 'failed' };
    }

    // Get the latest charge from the payment intent
    const latestChargeId = paymentIntent.latest_charge;
    if (!latestChargeId || typeof latestChargeId !== 'string') {
      return { isValid: false, status: 'unknown' };
    }

    // Retrieve the charge to check for refunds and disputes
    const charge = await stripe.charges.retrieve(latestChargeId);

    // Check for disputes
    if (charge.disputed) {
      return { isValid: false, status: 'disputed' };
    }

    // Check if charge was refunded (full or partial)
    if (charge.refunded || charge.amount_refunded > 0) {
      return {
        isValid: false,
        status: 'refunded',
        amountRefunded: charge.amount_refunded
      };
    }

    return { isValid: true, status: 'paid' };
  } catch (error) {
    console.error("Error verifying payment status:", error);
    return { isValid: false, status: 'unknown' };
  }
}
