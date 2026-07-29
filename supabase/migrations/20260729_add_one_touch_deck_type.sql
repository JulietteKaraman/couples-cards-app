-- Add the 'one-touch' deck type so course members can be granted the One Touch deck.
-- Without this, any user_decks insert with deck_type='one-touch' fails the
-- user_decks_deck_type_check constraint (the same failure that broke Trust & Repair
-- and Touch Languages in July 2026). Run this in the Supabase SQL editor.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch'));
