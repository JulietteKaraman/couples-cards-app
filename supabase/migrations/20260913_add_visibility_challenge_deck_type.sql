-- Add the 'visibility-challenge' deck type so The Visibility Challenge (free,
-- 21-day, one prompt per day) can grant access the same way every other deck
-- does. Without this, any user_decks insert with deck_type='visibility-challenge'
-- fails the user_decks_deck_type_check constraint (the same failure that broke
-- Trust & Repair, Touch Languages, One Touch and Repair Kit before their own
-- migrations). Run this in the Supabase SQL editor before the feature goes live.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'visibility-challenge'));
