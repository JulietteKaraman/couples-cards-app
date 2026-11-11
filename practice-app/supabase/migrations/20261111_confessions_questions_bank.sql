-- Scrumptious Confessions questions bank (11 Nov 2026). Run once in the Supabase
-- SQL editor BEFORE the push. Safe to re-run.

-- What each saved message is, where it came from, and whether Juliette has answered it.
ALTER TABLE public.confession_messages ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'love_next';
ALTER TABLE public.confession_messages ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'app';
ALTER TABLE public.confession_messages ADD COLUMN IF NOT EXISTS answered boolean NOT NULL DEFAULT false;

-- Touch Base days are counted too, with no name.
ALTER TABLE public.confession_counts DROP CONSTRAINT IF EXISTS confession_counts_kind_check;
ALTER TABLE public.confession_counts ADD CONSTRAINT confession_counts_kind_check
  CHECK (kind IN ('landed', 'where', 'card_answered', 'touchbase_done'));
