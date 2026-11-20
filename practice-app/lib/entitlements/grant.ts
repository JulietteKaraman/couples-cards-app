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
  knownUserId?: string,
  expiresAt?: string | null
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

  // expiresAt is only ever passed for a subscription deck_type (Members
  // App spec R13). Omitting it (undefined) leaves expires_at untouched on
  // an upsert conflict, which matters for the one-time-purchase callers of
  // this function that never pass it — they must keep granting permanent
  // access exactly as before.
  const row: Record<string, unknown> = {
    user_id: userId,
    deck_type: deckType,
    purchased_at: new Date().toISOString(),
    stripe_checkout_session_id: stripeCheckoutSessionId,
  };
  if (expiresAt !== undefined) row.expires_at = expiresAt;

  // Subscriptions: keep the ORIGINAL join date while the membership runs
  // unbroken, so monthly unlocks count from the first payment (16 Nov 2026,
  // Scrumptious Confessions). Only a member whose access had already ended
  // starts again from today.
  if (expiresAt !== undefined) {
    const { data: existing } = await supabaseAdmin
      .from("user_decks")
      .select("purchased_at, expires_at, stripe_checkout_session_id")
      .eq("user_id", userId)
      .eq("deck_type", deckType)
      .maybeSingle();
    const stillMember = existing && (!existing.expires_at || new Date(existing.expires_at) > new Date());
    // Free fortnight days never count towards paid months: the first real
    // payment after a free claim starts the clock.
    // The 7-day trial ("trial-") counts the same way: paid months start at the first real payment.
    const wasFree = /^(free|trial)-/.test(existing?.stripe_checkout_session_id || "");
    if (stillMember && existing.purchased_at && !wasFree) row.purchased_at = existing.purchased_at;
  }

  // Scrumptious Confessions: read whether this person is already a live member BEFORE the upsert,
  // so their own clock (lib/confessions-clock.ts) can be started below.
  let confessionsLive = false;
  if (deckType === "scrumptious-confessions") {
    const { data: before } = await supabaseAdmin
      .from("user_decks")
      .select("expires_at")
      .eq("user_id", userId)
      .eq("deck_type", deckType)
      .maybeSingle();
    confessionsLive = !!before && (!before.expires_at || new Date(before.expires_at) > new Date());
  }

  const { error: grantError } = await supabaseAdmin
    .from("user_decks")
    .upsert(row, { onConflict: "user_id,deck_type" });

  if (!grantError && deckType === "scrumptious-confessions") {
    await startConfessionsClock(userId, confessionsLive).catch((e) =>
      console.error("startConfessionsClock", e instanceof Error ? e.message : e)
    );
  }

  if (grantError) {
    throw new Error(
      `grantEntitlement: could not grant ${deckType} to ${normalizedEmail}: ${grantError.message}`
    );
  }

  return userId;
}

// Juliette 20 Nov 2026: every member starts at week one of Scrumptious Confessions, from the week they
// join, never in the middle of what the launch group has had. Written once: a live member keeps their
// start (the trial's £0 invoice, then the first payment, change nothing). Someone whose access had ended
// starts again at week one. The How to Feel Like a Woman women stay with the launch group.
async function startConfessionsClock(userId: string, alreadyLive: boolean) {
  const { START_KEY } = await import("@/lib/confessions-clock");
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user) return;
  const meta = (data.user.app_metadata || {}) as Record<string, unknown>;
  if (alreadyLive && meta[START_KEY]) return;
  if (!meta[START_KEY]) {
    const { HTFLAW_FREE_CONFESSIONS } = await import("@/lib/entitlements/config");
    const { data: htflaw } = await supabaseAdmin
      .from("user_decks").select("deck_type").eq("user_id", userId).eq("deck_type", HTFLAW_FREE_CONFESSIONS.ownerDeck).limit(1);
    if ((htflaw || []).length) return;
    if (alreadyLive) return; // joined before this clock existed: the launch group
  }
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
  await supabaseAdmin.auth.admin.updateUserById(userId, { app_metadata: { ...meta, [START_KEY]: today } });
}
