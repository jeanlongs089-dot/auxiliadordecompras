-- Create profiles table for extra user info
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles are insertable by owner" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner" ON profiles
  FOR UPDATE USING (auth.uid() = id);

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
