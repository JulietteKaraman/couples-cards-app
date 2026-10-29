-- How to Feel Like a Woman in the app (specs/how-to-feel-like-a-woman-app.md).
-- Run once in the Supabase SQL editor BEFORE the push. Safe to re-run.

-- 1. The deck type, written the same union-safe way as the Sacred No migration.
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
      'how-to-feel-like-a-woman'
    ])
  ) s;

  EXECUTE 'ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check';
  EXECUTE 'ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check CHECK (deck_type IN (' || allowed || '))';
END $$;

-- 2. Drops: the cards and Scrumptious Confessions Juliette adds herself.
-- No public policies: only the app's server (service role) reads or writes,
-- after checking who is asking.
CREATE TABLE IF NOT EXISTS public.app_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('card', 'confession')),
  title text,
  body text,
  audio_path text,
  publish_on date NOT NULL,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_drops ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS app_drops_collection_date ON public.app_drops (collection, publish_on);

-- 3. Private storage for her voice notes (signed links only, never public).
INSERT INTO storage.buckets (id, name, public)
VALUES ('drops', 'drops', false)
ON CONFLICT (id) DO NOTHING;

-- 4. The first card, her words.
INSERT INTO public.app_drops (collection, kind, body, publish_on)
SELECT 'how-to-feel-like-a-woman', 'card', 'Tell me what pleasure means to you', DATE '2026-10-29'
WHERE NOT EXISTS (
  SELECT 1 FROM public.app_drops
  WHERE collection = 'how-to-feel-like-a-woman' AND body = 'Tell me what pleasure means to you'
);

-- 5. Anonymous daily counts for How to Feel Like a Woman (her feeling data).
-- htflaw_solo / htflaw_lab = one "I did it" a day, on her own or in Practice Lab.
-- feel = very little / a bit / a whole range. Still no user, email, IP or text.
ALTER TABLE public.anon_counts DROP CONSTRAINT IF EXISTS anon_counts_event_check;
ALTER TABLE public.anon_counts ADD CONSTRAINT anon_counts_event_check
  CHECK (event IN ('taster_open','taster_done','taster_feel','taster_buy_click','day_done','day_feel','htflaw_solo','htflaw_lab'));
ALTER TABLE public.anon_counts DROP CONSTRAINT IF EXISTS anon_counts_feel_check;
ALTER TABLE public.anon_counts ADD CONSTRAINT anon_counts_feel_check
  CHECK (feel IN ('laughed','close','awkward','flat','little','bit','range'));
