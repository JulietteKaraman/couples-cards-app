-- Add the 'repair-kit' deck type so buyers can be granted the Romantic
-- Relationship Repair Kit deck (sequential journey, unlocked by code repair2026).
-- Run this in the Supabase SQL editor before the first unlock.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit'));
