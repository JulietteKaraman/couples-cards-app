"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyPaymentStatus } from "@/lib/stripe/verify-payment";
import type { EntitlementsRow } from "@/lib/supabase/admin";

export interface AccessVerificationResult {
  profile: EntitlementsRow | null;
  hasAccess: boolean;
}

export async function verifyUserAccess(userId: string): Promise<AccessVerificationResult> {
  // Get user's entitlement record
  const { data: entitlement, error } = await supabaseAdmin
    .from("entitlements")
    .select("*")
    .eq("user_id", userId)
    .single();
    
  if (error || !entitlement) {
    console.log("No entitlement record found for user:", userId);
    return { profile: null, hasAccess: false };
  }
  
  // If no payment intent ID, trust the webhook's decision
  // The checkout.session.completed event only fires for successful payments
  // If couples_access was set to true by the webhook, honor it
  if (!entitlement.stripe_payment_intent_id) {
    console.log(`No payment intent ID for user ${userId}, using stored couples_access:`, entitlement.couples_access);
    
    // If access was granted by webhook, trust it and return
    if (entitlement.couples_access) {
      console.log(`Granting access based on webhook approval for user ${userId}`);
      return { 
        profile: entitlement, 
        hasAccess: true 
      };
    }
    
    // If access is false but we have a checkout session ID, try to verify via session
    if (entitlement.stripe_checkout_session_id && !entitlement.couples_access) {
      console.log(`Attempting session-based verification for user ${userId}`);
      try {
        const { verifyCheckoutSession } = await import("@/lib/stripe/verify-payment");
        const sessionVerification = await verifyCheckoutSession(entitlement.stripe_checkout_session_id);
        
        if (sessionVerification.isValid) {
          // Update the record with the payment intent ID if found
          const updateData: any = {
            couples_access: true,
            last_verified_at: new Date().toISOString(),
          };
          
          if (sessionVerification.paymentIntentId) {
            updateData.stripe_payment_intent_id = sessionVerification.paymentIntentId;
          }
          
          await supabaseAdmin
            .from("entitlements")
            .update(updateData)
            .eq("user_id", userId);
          
          console.log(`Session verification successful, granting access to user ${userId}`);
          return {
            profile: { ...entitlement, couples_access: true, stripe_payment_intent_id: sessionVerification.paymentIntentId || null },
            hasAccess: true
          };
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      }
    }
    
    return { 
      profile: entitlement, 
      hasAccess: entitlement.couples_access 
    };
  }
  
  // Verify with Stripe
  const verification = await verifyPaymentStatus(entitlement.stripe_payment_intent_id);
  
  // Update database with verification result
  const { error: updateError } = await supabaseAdmin
    .from("entitlements")
    .update({
      couples_access: verification.isValid,
      last_verified_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
    
  if (updateError) {
    console.error("Error updating entitlement:", updateError);
  }
  
  // Return updated profile
  const updatedEntitlement: EntitlementsRow = {
    ...entitlement,
    couples_access: verification.isValid,
    last_verified_at: new Date().toISOString(),
  };
    
  return { 
    profile: updatedEntitlement, 
    hasAccess: verification.isValid 
  };
}
