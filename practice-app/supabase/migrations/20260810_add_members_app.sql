-- Members App spec (specs/members-app.md), R10-R13, R2-R3.
--
-- 1. New deck_type 'members-app' added to the existing CHECK constraint,
--    same pattern as every other product (see the other migrations in
--    this folder).
-- 2. user_decks gains expires_at: NULL means what it always has (a
--    permanent, one-time grant, unchanged for every existing row/product).
--    A non-null value is a real expiry moment — this is the "entitlement
--    that can expire" the spec's Constraints section calls out as new,
--    everything else in the app keeps working exactly as before since it
--    never sets this column.
-- 3. New table member_state_checkins for the Touch State check-in (R2/R3):
--    one row per check-in, so a member's movement between states over
--    time is a real, queryable history, not just a "current state" field.
--
-- Run this in the Supabase SQL editor (same project the cards app uses).

ALTER TABLE user_decks DROP CONSTRAINT IF EXISTS user_decks_deck_type_check;
ALTER TABLE user_decks ADD CONSTRAINT user_decks_deck_type_check
  CHECK (deck_type IN ('trust-repair', 'couples', 'friends', 'touch-languages', 'one-touch', 'repair-kit', 'ten-touch-rituals', 'unspoken-distance', 'when-she-goes-quiet', 'between-touches', 'members-app'));

ALTER TABLE user_decks ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

CREATE TABLE IF NOT EXISTS member_state_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state VARCHAR(20) NOT NULL CHECK (state IN ('braced', 'withheld', 'performing', 'present', 'melted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_state_checkins_user
  ON member_state_checkins(user_id, created_at DESC);

ALTER TABLE member_state_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins" ON member_state_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log own check-ins" ON member_state_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No policy needed for any admin screen: it would read via supabaseAdmin
-- (the service role key), which bypasses RLS entirely by default.
