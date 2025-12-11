-- Fix profiles table foreign key to reference auth.users instead of users table

-- First, drop all existing profiles that don't have corresponding auth users
-- This is a cleanup step for existing invalid data
DELETE FROM profiles
WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- Drop the existing foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add the correct foreign key constraint to auth.users
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure the profiles table has the correct structure
ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT 'customer',
  ALTER COLUMN role DROP NOT NULL; -- Make it nullable initially

-- Add any missing columns if needed
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Now make role NOT NULL after ensuring all records have a value
UPDATE profiles SET role = 'customer' WHERE role IS NULL;
ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;

-- Update updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();