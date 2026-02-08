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
  
  // If no payment intent ID, can't verify with Stripe
  if (!entitlement.stripe_payment_intent_id) {
    // Check if couples_access is already granted (backward compatibility)
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
