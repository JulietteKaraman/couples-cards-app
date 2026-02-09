-- Migration: Create user_decks table for multi-deck support
-- This replaces the single entitlements table with a per-deck access system

-- Create new user_decks table
CREATE TABLE IF NOT EXISTS user_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_type VARCHAR(50) NOT NULL CHECK (deck_type IN ('couples', 'friends')),
  purchased_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, deck_type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_decks_user_id ON user_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_decks_deck_type ON user_decks(deck_type);

-- Migrate existing data from entitlements table
-- This preserves existing couples purchases
INSERT INTO user_decks (user_id, deck_type, purchased_at, stripe_payment_intent_id, stripe_checkout_session_id)
SELECT 
  user_id,
  'couples' as deck_type,
  purchased_at,
  stripe_payment_intent_id,
  stripe_checkout_session_id
FROM entitlements
WHERE couples_access = true
ON CONFLICT (user_id, deck_type) DO NOTHING;

-- Add RLS policies
ALTER TABLE user_decks ENABLE ROW LEVEL SECURITY;

-- Users can view their own deck access
CREATE POLICY "Users can view own deck access" ON user_decks
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (via API)
CREATE POLICY "Service role can manage deck access" ON user_decks
  FOR ALL USING (false) WITH CHECK (false);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_user_decks_updated_at ON user_decks;
CREATE TRIGGER update_user_decks_updated_at
  BEFORE UPDATE ON user_decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Keep old entitlements table for backward compatibility
-- You can drop it later once you're confident the migration worked
-- DROP TABLE IF EXISTS entitlements;