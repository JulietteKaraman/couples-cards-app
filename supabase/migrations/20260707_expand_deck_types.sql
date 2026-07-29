-- 2026-07-07: The original user_decks constraint only allowed ('couples','friends'),
-- but the app now also grants 'trust-repair' and 'touch-languages'. Paid checkouts
-- for those decks (and the "complete the set" flow, which starts with trust-repair)
-- were failing the webhook with a 500: user_decks_deck_type_check violation, so decks
-- were never granted. Widen the constraint to every deck type the app actually inserts.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;

ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages'));
