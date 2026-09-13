-- Add the 'visibility-challenge' deck type so The Visibility Challenge (free,
-- 21-day, one prompt per day) can grant access the same way every other deck
-- does. Without this, any user_decks insert with deck_type='visibility-challenge'
-- fails the user_decks_deck_type_check constraint.
--
-- RUN 1 (13 Sep 2026) FAILED IN PRODUCTION: this file originally listed only
-- ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch',
-- 'repair-kit', 'visibility-challenge'), reconstructed from the couples-cards-app
-- migrations folder alone. That list was incomplete — user_decks is the ONE
-- shared entitlements table across BOTH this app and practice-app (see that
-- app's own migrations folder), and real rows already existed for
-- 'ten-touch-rituals', 'unspoken-distance', 'when-she-goes-quiet' and
-- 'communication-reboot-kit', granted through practice-app. Dropping and
-- recreating the constraint without them failed with a real 23514 violation
-- against live data. Verified the true list directly with
-- `SELECT DISTINCT deck_type FROM user_decks ORDER BY deck_type;` before
-- writing the corrected version below. Lesson: when a shared table has more
-- than one app writing to it, query the live data, don't reconstruct the
-- constraint from one app's migration history alone.
--
-- Run this in the Supabase SQL editor before the feature goes live.

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals', 'unspoken-distance', 'when-she-goes-quiet', 'between-touches', 'communication-reboot-kit', 'visibility-challenge'));
