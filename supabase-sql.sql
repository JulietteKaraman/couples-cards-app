-- Just run this part if users table already exists

-- Create ivorey_submissions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS ivorey_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT,
  form_id TEXT NOT NULL,
  product_intent TEXT,
  source TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE ivorey_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they cause issues and recreate
DROP POLICY IF EXISTS "Allow insert on ivorey_submissions" ON ivorey_submissions;
DROP POLICY IF EXISTS "Allow select on ivorey_submissions" ON ivorey_submissions;

-- Create policies
CREATE POLICY "Allow insert on ivorey_submissions" ON ivorey_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on ivorey_submissions" ON ivorey_submissions FOR SELECT USING (true);
