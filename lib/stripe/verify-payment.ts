import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/environment";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export interface PaymentVerificationResult {
  isValid: boolean;
  status: 'paid' | 'refunded' | 'disputed' | 'failed' | 'unknown';
  amountRefunded?: number;
}

export interface CheckoutSessionVerificationResult {
  isValid: boolean;
  status: string;
  paymentIntentId?: string;
  paymentStatus: string;
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

export async function verifyCheckoutSession(sessionId: string): Promise<CheckoutSessionVerificationResult> {
  try {
    // Retrieve the checkout session with payment intent expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

    // Check if payment was successful
    const isPaid = session.payment_status === 'paid';
    
    return {
      isValid: isPaid,
      status: session.status || 'unknown',
      paymentIntentId: paymentIntentId,
      paymentStatus: session.payment_status
    };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { 
      isValid: false, 
      status: 'error',
      paymentStatus: 'unknown'
    };
  }
}
