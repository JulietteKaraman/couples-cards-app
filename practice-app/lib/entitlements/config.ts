// Maps each collection this app can show to the user_decks.deck_type value
// that grants it. Adding a new product later means adding one line here,
// not new sign-in/session code.
export const COLLECTION_DECK_TYPES: Record<string, string> = {
  "ten-touch-rituals": "ten-touch-rituals",
  "the-unspoken-distance": "unspoken-distance",
  "when-she-goes-quiet": "when-she-goes-quiet",
  "between-touches": "between-touches",
};

// Maps a real Stripe price ID to the deck_type it grants, so resolve-purchase
// and the Stripe webhook can both match against real purchases across every
// product this app sells, not just one hardcoded price (the-unspoken-distance
// spec R4/R5). Add one line here per new product's live price ID.
export const PRICE_ID_TO_DECK_TYPE: Record<string, string> = {
  price_1Tlpu0CCw18geY15b8J3jlBW: "ten-touch-rituals", // 10 Touch Rituals, £7
  price_1TzO4DCCw18geY15u7X9j7iw: "unspoken-distance", // The Unspoken Distance, £77 (old price, real buyers 31 Jul-1 Aug 2026)
  price_1TnxAqCCw18geY153w22a2Ye: "unspoken-distance", // The Unspoken Distance, £97 (current, back from £77 1 Aug 2026 — now includes free Couples Cards)
};

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
