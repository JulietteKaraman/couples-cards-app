-- Add 'when-she-goes-quiet' and 'between-touches' to the SAME user_decks
-- CHECK constraint every other deck_type has had to be added to (see
-- 20260731_add_unspoken_distance_deck_type.sql and the others in this
-- folder). Missed when the free-guide auto-grant was built 1 Aug 2026 —
-- every grant attempt for these two was silently failing at the database
-- level with a check-constraint violation, which is why free guides
-- never actually unlocked for anyone, including Juliette's own account.
--
-- Run this in the Supabase SQL editor (same project the cards app uses)
-- immediately — this is the actual fix, nothing else deploys or changes.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals', 'unspoken-distance', 'when-she-goes-quiet', 'between-touches'));
