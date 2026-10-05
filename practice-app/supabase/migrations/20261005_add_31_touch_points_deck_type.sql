-- Add the '31-touch-points' deck type so 31 Touch Points can grant access the
-- same way every other product does.
--
-- WHY THIS EXISTS: 31 Touch Points went live in the app on 30 Sep 2026, but
-- '31-touch-points' was never added to the user_decks_deck_type_check
-- constraint. The database therefore refused every grant for it, from the
-- Stripe webhook and from the admin "give access by hand" screen alike. Caught
-- 5 Oct 2026 when a buyer (one person, two email addresses) could not open the
-- app. Run against production in the Supabase SQL editor the same day; this
-- file is the record of that change, written after the fact.
--
-- HOW IT IS WRITTEN, and why not as a plain hard-coded list: the 13 Sep 2026
-- migration (20260913_add_visibility_challenge_deck_type.sql, cards-app folder)
-- rebuilt this constraint from one app's migration history and silently dropped
-- 'members-app', which lives in THIS folder. user_decks is one shared
-- entitlements table written by both apps, so a hard-coded list is only ever as
-- complete as whoever last wrote it. This block instead reads the deck types
-- already present in live data, unions them with every name either app knows
-- about, and rebuilds the constraint from that. It cannot drop a product that
-- is in use, and it is safe to re-run.

DO $$
DECLARE
  allowed text;
BEGIN
  SELECT string_agg(quote_literal(t), ', ' ORDER BY t)
    INTO allowed
  FROM (
    SELECT DISTINCT deck_type AS t FROM user_decks
    UNION
    SELECT unnest(ARRAY[
      'trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch',
      'repair-kit', 'ten-touch-rituals', 'unspoken-distance',
      'when-she-goes-quiet', 'between-touches', 'communication-reboot-kit',
      'visibility-challenge', 'members-app', '31-touch-points'
    ])
  ) s;

  EXECUTE 'ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check';
  EXECUTE 'ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check CHECK (deck_type IN (' || allowed || '))';
END $$;
