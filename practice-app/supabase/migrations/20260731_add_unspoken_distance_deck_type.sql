-- Add the 'unspoken-distance' deck type to the SAME user_decks table the
-- cards app and practice-app already use, following the exact pattern used
-- for 'ten-touch-rituals', 'one-touch', and 'repair-kit'
-- (see 20260731_add_ten_touch_rituals_deck_type.sql).
--
-- Run this in the Supabase SQL editor (same project the cards app uses)
-- before the first real grant for The Unspoken Distance.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals', 'unspoken-distance'));
