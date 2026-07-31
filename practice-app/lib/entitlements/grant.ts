import { supabaseAdmin } from "@/lib/supabase/admin";

// Get-or-create a REAL Supabase Auth user for this email (no password,
// email pre-confirmed) and grant the given deck_type against it.
//
// This is a deliberate simplification of the cards app's pattern (which
// creates a placeholder row in a separate `users` table, then reconciles
// it to a real auth identity later). Using the Admin API to create the
// real auth user up front means there is nothing to reconcile: the same
// email later requesting a magic link logs into this exact account,
// which already has the entitlement. Same outcome (spec R5, "resolves
// itself the first time they show up"), simpler mechanism.
export async function grantEntitlement(
  email: string,
  deckType: string,
  stripeCheckoutSessionId: string
) {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
  let userId = existing?.users.find((u) => u.email === normalizedEmail)?.id;

  if (!userId) {
    const { data: created, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
      });
    if (createError || !created?.user) {
      throw new Error(
        `grantEntitlement: could not create user for ${normalizedEmail}: ${createError?.message}`
      );
    }
    userId = created.user.id;
  }

  const { error: grantError } = await supabaseAdmin
    .from("user_decks")
    .upsert(
      {
        user_id: userId,
        deck_type: deckType,
        purchased_at: new Date().toISOString(),
        stripe_checkout_session_id: stripeCheckoutSessionId,
      },
      { onConflict: "user_id,deck_type" }
    );

  if (grantError) {
    throw new Error(
      `grantEntitlement: could not grant ${deckType} to ${normalizedEmail}: ${grantError.message}`
    );
  }

  return userId;
}
