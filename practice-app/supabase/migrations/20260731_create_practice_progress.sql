-- New table: practice_progress. The existing Repair Kit journey mode
-- (couples-cards-app/app/app/[deck]/journey) only tracks progress in
-- localStorage, which is invisible to Juliette. Spec R7/R8 need progress
-- visible both to the buyer AND to Juliette in the admin screen, so a
-- real server-side table is required here — there is no existing table
-- to reuse for this piece specifically (entitlement reuses user_decks;
-- progress does not have an existing equivalent).
--
-- Run this in the Supabase SQL editor (same project the cards app uses).

CREATE TABLE IF NOT EXISTS practice_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_type VARCHAR(50) NOT NULL,
  entry_slug VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deck_type, entry_slug)
);

CREATE INDEX IF NOT EXISTS idx_practice_progress_user_deck
  ON practice_progress(user_id, deck_type);

ALTER TABLE practice_progress ENABLE ROW LEVEL SECURITY;

-- Buyers can see and mark their own progress.
CREATE POLICY "Users can view own progress" ON practice_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own progress" ON practice_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own progress" ON practice_progress
  FOR DELETE USING (auth.uid() = user_id);

-- No policy needed for the admin screen: it reads via supabaseAdmin
-- (the service role key), which bypasses RLS entirely by default.
