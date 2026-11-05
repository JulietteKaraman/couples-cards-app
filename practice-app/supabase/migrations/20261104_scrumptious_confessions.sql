-- Scrumptious Confessions membership (specs/scrumptious-confessions-membership.md).
-- Run once in the Supabase SQL editor BEFORE the push. Safe to re-run.

-- 1. The deck type, written the same union-safe way as the earlier products.
DO $$
DECLARE
  allowed text;
BEGIN
  SELECT string_agg(quote_literal(t), ', ' ORDER BY t)
    INTO allowed
  FROM (
    SELECT DISTINCT deck_type AS t FROM user_decks
    UNION
    SELECT unnest(ARRAY['scrumptious-confessions'])
  ) s;

  EXECUTE 'ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check';
  EXECUTE 'ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check CHECK (deck_type IN (' || allowed || '))';
END $$;

-- 2. Anonymous counts. No user id, email or typed words, by design.
CREATE TABLE IF NOT EXISTS public.confession_counts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('landed', 'where', 'card_answered')),
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.confession_counts ENABLE ROW LEVEL SECURITY;

-- 3. What women choose to send her. member_email is empty when she ticks
-- "Send it without my name". No public policies: only the app's server reads or writes.
CREATE TABLE IF NOT EXISTS public.confession_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL,
  item_title text NOT NULL,
  body text NOT NULL,
  member_email text,
  emailed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.confession_messages ENABLE ROW LEVEL SECURITY;
