// Maps each collection this app can show to the user_decks.deck_type value
// that grants it. Adding a new product later means adding one line here,
// not new sign-in/session code.
export const COLLECTION_DECK_TYPES: Record<string, string> = {
  "ten-touch-rituals": "ten-touch-rituals",
  "the-unspoken-distance": "unspoken-distance",
};

// Maps a real Stripe price ID to the deck_type it grants, so resolve-purchase
// and the Stripe webhook can both match against real purchases across every
// product this app sells, not just one hardcoded price (the-unspoken-distance
// spec R4/R5). Add one line here per new product's live price ID.
export const PRICE_ID_TO_DECK_TYPE: Record<string, string> = {
  price_1Tlpu0CCw18geY15b8J3jlBW: "ten-touch-rituals", // 10 Touch Rituals, £7
  price_1TzO4DCCw18geY15u7X9j7iw: "unspoken-distance", // The Unspoken Distance, £77 (current)
  price_1TnxAqCCw18geY153w22a2Ye: "unspoken-distance", // The Unspoken Distance, £97 (old price, real buyers before 31 Jul 2026)
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
