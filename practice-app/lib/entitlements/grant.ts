import { supabaseAdmin } from "@/lib/supabase/admin";

// listUsers() only returns ONE PAGE by default (perPage defaults to 50).
// With more than a page of real accounts, an existing user who isn't on
// that first page silently reads as "not found" — grantEntitlement would
// then try to createUser for an email that already exists, which errors,
// and the entitlement never gets granted. Found 1 Aug 2026: Juliette's
// own account didn't get the free-guide auto-grant for exactly this
// reason. Paginate through every page instead of trusting the default.
async function findUserByEmail(normalizedEmail: string) {
  let page = 1;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`findUserByEmail: ${error.message}`);
    const match = data.users.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (match) return match.id;
    if (data.users.length < 200) return undefined; // last page, not found
    page++;
  }
}

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
//
// knownUserId: pass this when the caller already has a real, authenticated
// session's user id (e.g. ensure-free-access granting to whoever is
// currently signed in) — skips the email lookup entirely, so there's no
// dependency on listUsers() finding the right page at all.
export async function grantEntitlement(
  email: string,
  deckType: string,
  stripeCheckoutSessionId: string,
  knownUserId?: string
) {
  const normalizedEmail = email.toLowerCase().trim();

  let userId = knownUserId ?? (await findUserByEmail(normalizedEmail));

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
