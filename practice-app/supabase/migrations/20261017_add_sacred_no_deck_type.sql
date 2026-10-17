-- Add the 'sacred-no' deck type so The Sacred No (£17) can grant access in the
-- app, from the Stripe webhook and from the admin "give access by hand" screen.
-- specs/sacred-no-in-app.md R7. Must be run in production BEFORE launch.
--
-- Written the same union-safe way as 20261005_add_31_touch_points_deck_type.sql:
-- user_decks is ONE shared table written by the cards app and the practice app,
-- so the constraint is rebuilt from live data unioned with every name either
-- app knows about, never from one folder's hard-coded list. It cannot drop a
-- deck type that is in use, and it is safe to re-run.

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
      'visibility-challenge', 'members-app', '31-touch-points', 'sacred-no'
    ])
  ) s;

  EXECUTE 'ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check';
  EXECUTE 'ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check CHECK (deck_type IN (' || allowed || '))';
END $$;

-- D4 check, run after: every previously allowed type still present, plus sacred-no.
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'user_decks_deck_type_check';
