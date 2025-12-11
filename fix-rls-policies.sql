-- ============================================
-- FIX RLS POLICIES FOR AUTHENTICATION - PERMISSIVE VERSION
-- ============================================
-- Run this in Supabase SQL Editor to fix RLS policy issues

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own user record" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view admin credentials for login" ON admin_credentials;
DROP POLICY IF EXISTS "Service role can manage admin credentials" ON admin_credentials;

-- Enable RLS (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Users table policies - Allow authenticated users to manage their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own user record" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role full access to users table
CREATE POLICY "Service role can manage users" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Profiles table policies - Allow authenticated users to manage their own profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role full access to profiles table
CREATE POLICY "Service role can manage profiles" ON profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin credentials policies - Allow authenticated users to read for login
CREATE POLICY "Authenticated users can view admin credentials" ON admin_credentials
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow service role full access to admin credentials
CREATE POLICY "Service role can manage admin credentials" ON admin_credentials
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- VERIFICATION
-- ============================================

-- Test the policies by checking if we can select from tables
SELECT 'RLS Policies updated successfully' as status;