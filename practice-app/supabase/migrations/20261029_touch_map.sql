-- The Touch Map, version 1 (specs/touch-map.md in APP builds, 29 Oct 2026).
-- Run once in the Supabase SQL editor BEFORE the push. Safe to re-run.

-- 1. The deck type 'touch-map', written the same union-safe way as before.
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
      'visibility-challenge', 'members-app', '31-touch-points', 'sacred-no',
      'how-to-feel-like-a-woman', 'touch-map'
    ])
  ) s;

  EXECUTE 'ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check';
  EXECUTE 'ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check CHECK (deck_type IN (' || allowed || '))';
END $$;

-- 2. Anonymous counts for the Touch Map. Same rule as 31 Touch Points:
-- what she taps on her body is never stored, only that something happened.
ALTER TABLE public.anon_counts DROP CONSTRAINT IF EXISTS anon_counts_event_check;
ALTER TABLE public.anon_counts ADD CONSTRAINT anon_counts_event_check
  CHECK (event IN ('taster_open','taster_done','taster_feel','taster_buy_click','day_done','day_feel','htflaw_solo','htflaw_lab',
                   'tm_taster_open','tm_taster_done','tm_taster_buy_click','tm_day_done','tm_vip_click'));
