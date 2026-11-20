import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { MEMBERSHIP_UNLOCKS, membershipMonth, PRODUCT_ID_TO_DECK_TYPE } from "@/lib/entitlements/config";

// Scrumptious Confessions access, kept honest (Juliette 20 Nov 2026: "how do we make sure this all gets checked so
// that I'm not being emailed at 5:00 in the morning: I don't have access anymore").
//
// 1. KEEP: every programme that opened in a month they PAID for is theirs to keep, even after they stop.
//    keepOpened() writes those programmes onto the account as permanent grants (no end date), like a purchase.
// 2. GRACE: a failed payment keeps access for 7 days while Stripe retries the card.
// 3. HEAL: syncFromStripe() reads Stripe (the source of truth) and puts the app right for one email.
//    Used by the nightly check and by the "Can't get in?" button.

export const SLUG = "scrumptious-confessions";
export const GRACE_DAYS = 7;
const CONFESSIONS_PRODUCTS = Object.entries(PRODUCT_ID_TO_DECK_TYPE).filter(([, d]) => d === SLUG).map(([p]) => p);
const KEEP_MARKER = "confessions-kept";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key, { apiVersion: "2026-02-25.clover" }) : null;
}

const graceEnd = (periodEndSeconds: number) => new Date((periodEndSeconds + GRACE_DAYS * 86400) * 1000).toISOString();

/** Permanent grants for every programme opened in the months this member has paid for. Never touches a deck
 *  they already hold (a real purchase keeps its own record). Returns the decks newly kept. */
export async function keepOpened(userId: string, paidSince: string): Promise<string[]> {
  const month = membershipMonth(paidSince);
  const decks = MEMBERSHIP_UNLOCKS.filter((u) => u.deck && u.month <= month).map((u) => u.deck as string);
  if (!decks.length) return [];
  const { data: have } = await supabaseAdmin.from("user_decks").select("deck_type").eq("user_id", userId).in("deck_type", decks);
  const held = new Set((have || []).map((r: { deck_type: string }) => r.deck_type));
  const add = decks.filter((d) => !held.has(d));
  if (!add.length) return [];
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin.from("user_decks").insert(
    add.map((deck_type) => ({ user_id: userId, deck_type, purchased_at: now, stripe_checkout_session_id: `${KEEP_MARKER}-m${month}` }))
  );
  if (error) throw new Error(`keepOpened: ${error.message}`);
  return add;
}

type SyncResult = { email: string; status: string; fixed: boolean; kept: string[]; note?: string };

/** Is this subscription Scrumptious Confessions? */
function isConfessions(sub: Stripe.Subscription) {
  return sub.items.data.some((i) => {
    const p = i.price?.product;
    const id = typeof p === "string" ? p : p?.id;
    return !!id && CONFESSIONS_PRODUCTS.includes(id);
  });
}

/** Read Stripe for one subscription and make the app match it. */
export async function syncSubscription(stripe: Stripe, sub: Stripe.Subscription): Promise<SyncResult | null> {
  if (!isConfessions(sub)) return null;
  const cust = typeof sub.customer === "string" ? await stripe.customers.retrieve(sub.customer) : sub.customer;
  const email = (cust && !("deleted" in cust && cust.deleted) ? (cust as Stripe.Customer).email : null)?.toLowerCase().trim();
  if (!email) return { email: "(no email)", status: sub.status, fixed: false, kept: [], note: `subscription ${sub.id} has no customer email` };
  if (!["active", "trialing", "past_due"].includes(sub.status)) return { email, status: sub.status, fixed: false, kept: [] };

  // A failed payment (past_due) is not a paid month: the 7 days run from the start of the unpaid period.
  const item = sub.items.data[0];
  const periodEnd = sub.status === "trialing" && sub.trial_end ? sub.trial_end
    : sub.status === "past_due" ? (item?.current_period_start ?? 0)
    : (item?.current_period_end ?? sub.trial_end ?? 0);
  if (!periodEnd) return { email, status: sub.status, fixed: false, kept: [], note: "no period end" };
  const wantUntil = graceEnd(periodEnd);

  // What the app has now.
  const { data: row } = await supabaseAdmin
    .from("user_decks")
    .select("user_id, expires_at, purchased_at, stripe_checkout_session_id")
    .eq("deck_type", SLUG)
    .eq("user_id", await userIdFor(email))
    .maybeSingle();

  let fixed = false;
  const live = row && (!row.expires_at || new Date(row.expires_at) >= new Date(wantUntil));
  if (!live) {
    const marker = sub.status === "trialing" ? `trial-${sub.id}` : (row && !String(row.stripe_checkout_session_id || "").startsWith("trial-") ? row.stripe_checkout_session_id : sub.id);
    await grantEntitlement(email, SLUG, marker, undefined, wantUntil);
    fixed = true;
  }

  // Keep what opened in the months they paid for.
  let kept: string[] = [];
  if (sub.status !== "trialing") {
    const { data: fresh } = await supabaseAdmin.from("user_decks").select("user_id, purchased_at, stripe_checkout_session_id").eq("deck_type", SLUG).eq("user_id", await userIdFor(email)).maybeSingle();
    if (fresh?.purchased_at && !String(fresh.stripe_checkout_session_id || "").startsWith("trial-")) kept = await keepOpened(fresh.user_id, fresh.purchased_at);
  }
  return { email, status: sub.status, fixed, kept };
}

const idCache = new Map<string, string>();
async function userIdFor(email: string): Promise<string> {
  if (idCache.has(email)) return idCache.get(email)!;
  let page = 1;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    for (const u of data.users) if (u.email) idCache.set(u.email.toLowerCase(), u.id);
    if (idCache.has(email) || data.users.length < 200) break;
    page++;
  }
  return idCache.get(email) || "00000000-0000-0000-0000-000000000000";
}

/** The "Can't get in?" button: check Stripe for this email right now. */
export async function syncFromStripe(email: string): Promise<SyncResult[]> {
  const stripe = stripeClient();
  if (!stripe) return [];
  const out: SyncResult[] = [];
  const customers = await stripe.customers.list({ email: email.toLowerCase().trim(), limit: 10 });
  for (const c of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 20 });
    for (const s of subs.data) {
      const r = await syncSubscription(stripe, s);
      if (r) out.push(r);
    }
  }
  return out;
}

/** The nightly check: every live Confessions subscription in Stripe, made to match in the app. */
export async function nightlyCheck() {
  const stripe = stripeClient();
  if (!stripe) return { ok: false, error: "no Stripe key" };
  const results: SyncResult[] = [];
  for (const status of ["active", "trialing", "past_due"] as const) {
    let starting_after: string | undefined;
    for (;;) {
      const page = await stripe.subscriptions.list({ status, limit: 100, starting_after, expand: ["data.customer"] });
      for (const s of page.data) {
        try { const r = await syncSubscription(stripe, s); if (r) results.push(r); }
        catch (e) { results.push({ email: "?", status: s.status, fixed: false, kept: [], note: `${s.id}: ${(e as Error).message}` }); }
      }
      if (!page.has_more) break;
      starting_after = page.data[page.data.length - 1].id;
    }
  }
  const fixed = results.filter((r) => r.fixed);
  const kept = results.filter((r) => r.kept.length);
  const problems = results.filter((r) => r.note);
  const summary = `${results.length} members checked. ${fixed.length} let back in${fixed.length ? `: ${fixed.map((r) => r.email).join(", ")}` : ""}. ${kept.length} had programmes saved to keep.${problems.length ? ` Needs a look: ${problems.map((r) => `${r.email} (${r.note})`).join("; ")}` : ""}`;
  // Shown at the top of /admin/confessions.
  await supabaseAdmin.from("confession_messages").insert({ item_id: "nightly", item_title: "Nightly check", body: summary, member_email: null, kind: "system", source: "app", answered: true });
  return { ok: true, summary, checked: results.length, fixed: fixed.length };
}
