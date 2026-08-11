-- Communication Reboot Kit (spec: specs/communication-reboot-kit.md).
-- Run this in the Supabase SQL editor (same project the cards app uses).

-- R2: register the new deck_type on the SAME user_decks table the cards
-- app and practice-app already share, same pattern as every prior addition
-- (see 20260731_add_unspoken_distance_deck_type.sql).
ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals', 'unspoken-distance', 'when-she-goes-quiet', 'between-touches', 'communication-reboot-kit'));

-- R6: the 31-day, twice-daily (AM/PM) practice tracker. day_number (1-31)
-- rather than a calendar date, matching the source doc's own "Day 1 am/pm
-- ... Day 31" framing (see lib/entitlements/tracker.ts).
CREATE TABLE IF NOT EXISTS practice_tracker_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_type VARCHAR(50) NOT NULL,
  day_number SMALLINT NOT NULL CHECK (day_number BETWEEN 1 AND 31),
  period VARCHAR(2) NOT NULL CHECK (period IN ('AM', 'PM')),
  before_rating SMALLINT CHECK (before_rating BETWEEN 1 AND 10),
  after_rating SMALLINT CHECK (after_rating BETWEEN 1 AND 10),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deck_type, day_number, period)
);

CREATE INDEX IF NOT EXISTS idx_practice_tracker_user_deck
  ON practice_tracker_entries(user_id, deck_type);

ALTER TABLE practice_tracker_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tracker entries" ON practice_tracker_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracker entries" ON practice_tracker_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracker entries" ON practice_tracker_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- R7: the reflection journal. prompt_key is a stable identifier (see
-- lib/entitlements/journal.ts JOURNAL_PROMPTS), never the prompt text
-- itself, so copy can change later without orphaning saved answers.
CREATE TABLE IF NOT EXISTS practice_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_type VARCHAR(50) NOT NULL,
  prompt_key VARCHAR(100) NOT NULL,
  answer TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deck_type, prompt_key)
);

CREATE INDEX IF NOT EXISTS idx_practice_journal_user_deck
  ON practice_journal_entries(user_id, deck_type);

ALTER TABLE practice_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries" ON practice_journal_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON practice_journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON practice_journal_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
