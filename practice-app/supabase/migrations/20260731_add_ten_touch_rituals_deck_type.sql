-- Add the 'ten-touch-rituals' deck type to the SAME user_decks table the
-- cards app already uses, following the exact pattern already used for
-- 'one-touch' and 'repair-kit' (see couples-cards-app/supabase/migrations/
-- 20260729_add_one_touch_deck_type.sql and 20260729_add_repair_kit_deck_type.sql).
-- This is the ONE table entitlements live in across both apps — do not
-- create a second entitlements table.
--
-- Run this in the Supabase SQL editor (same project the cards app uses)
-- before the first real grant.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals'));
