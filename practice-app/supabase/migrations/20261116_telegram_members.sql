-- Scrumptious Confessions Telegram gatekeeper (16 Nov 2026, specs/telegram-gatekeeper.md).
-- Run once in the Supabase SQL editor BEFORE the push. Safe to re-run.

-- One row per personal invite link. telegram_user_id is filled in when someone joins with it.
CREATE TABLE IF NOT EXISTS public.telegram_members (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_link text NOT NULL UNIQUE,
  telegram_user_id bigint,
  joined_at timestamptz,
  left_at timestamptz,
  removed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS telegram_members_user_idx ON public.telegram_members (user_id);
CREATE INDEX IF NOT EXISTS telegram_members_tg_idx ON public.telegram_members (telegram_user_id);

-- The group's chat id, picked up by the bot from the group itself.
CREATE TABLE IF NOT EXISTS public.telegram_group (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  chat_id bigint NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Server only: no browser can read or write these.
ALTER TABLE public.telegram_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_group ENABLE ROW LEVEL SECURITY;
