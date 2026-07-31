// Maps each collection this app can show to the user_decks.deck_type value
// that grants it. Adding a new product later (e.g. The Unspoken Distance)
// means adding one line here, not new sign-in/session code (spec R4).
export const COLLECTION_DECK_TYPES: Record<string, string> = {
  "ten-touch-rituals": "ten-touch-rituals",
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
