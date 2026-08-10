// Maps each collection this app can show to the user_decks.deck_type value
// that grants it. Adding a new product later means adding one line here,
// not new sign-in/session code.
export const COLLECTION_DECK_TYPES: Record<string, string> = {
  "ten-touch-rituals": "ten-touch-rituals",
  "the-unspoken-distance": "unspoken-distance",
  "when-she-goes-quiet": "when-she-goes-quiet",
  "between-touches": "between-touches",
  "members-app": "members-app",
};

// Maps a real Stripe price ID to the deck_type it grants, so resolve-purchase
// and the Stripe webhook can both match against real purchases across every
// product this app sells, not just one hardcoded price (the-unspoken-distance
// spec R4/R5). Add one line here per new product's live price ID.
export const PRICE_ID_TO_DECK_TYPE: Record<string, string> = {
  price_1Tlpu0CCw18geY15b8J3jlBW: "ten-touch-rituals", // 10 Touch Rituals, £7
  price_1TzO4DCCw18geY15u7X9j7iw: "unspoken-distance", // The Unspoken Distance, £77 (old price, real buyers 31 Jul-1 Aug 2026)
  price_1TnxAqCCw18geY153w22a2Ye: "unspoken-distance", // The Unspoken Distance, £97 (current, back from £77 1 Aug 2026 — now includes free Couples Cards)
  price_1U2uFbCCw18geY156WA0jb05: "members-app", // Members App, £77/month recurring — created 10 Aug 2026, spec R10
};

// Deck types that are RECURRING subscriptions rather than one-time
// purchases. resolve-purchase only ever grants these a real expires_at
// (see grantEntitlement) — everything else stays the permanent, one-time
// grant the app has always used. Members App spec R13/E1/E2: on
// cancellation or a failed renewal, access continues for 48 hours past
// the current period end, not indefinitely, which is what a bare
// "purchase found → grant forever" match would otherwise do.
export const SUBSCRIPTION_DECK_TYPES: string[] = ["members-app"];
export const SUBSCRIPTION_GRACE_PERIOD_HOURS = 48;

// Free collections: granted automatically the moment someone logs into the
// app, no Stripe purchase, no price ever shown (Juliette, 1 Aug 2026 — a
// price only makes an edit necessary later if it changes; these guides
// don't have a price to begin with). See app/api/ensure-free-access and
// AuthProvider, which call it right after establishing a session.
export const FREE_DECK_TYPES: string[] = ["when-she-goes-quiet", "between-touches"];

// Where the "Get access" CTA on a locked (not-yet-owned) library tile sends
// someone — the collection's real marketing sales page, never an in-app
// checkout. Only paid collections need an entry here; free collections are
// always unlocked (see FREE_DECK_TYPES) so they never render a locked tile.
export const PURCHASE_URLS: Record<string, string> = {
  "ten-touch-rituals": "https://feelfullyyou.com/10-touch-rituals",
  "the-unspoken-distance": "https://feelfullyyou.com/the-unspoken-distance",
  // This page doesn't exist yet — same as every other product here, the
  // checkout lives on a real marketing sales page, not inside the app.
  // Stripe side (Product prod_V30FzZV1Wv39XG, Price price_1U2uFbCCw18geY156WA0jb05,
  // £77/month, live) is ready; this URL needs the actual page built and a
  // checkout button wired to that price before it's real.
  "members-app": "https://feelfullyyou.com/members-app",
};

export function deckTypesForApp(): string[] {
  return Object.values(COLLECTION_DECK_TYPES);
}

export function collectionSlugForDeckType(deckType: string): string | null {
  const entry = Object.entries(COLLECTION_DECK_TYPES).find(
    ([, dt]) => dt === deckType
  );
  return entry ? entry[0] : null;
}
