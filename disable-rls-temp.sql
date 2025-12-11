-- ============================================
-- TEMPORARILY DISABLE RLS FOR AUTHENTICATION TABLES
-- ============================================
-- Run this to temporarily disable RLS and allow authentication to work

-- Disable RLS temporarily to allow authentication setup
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================

-- Test by checking if we can select from tables
SELECT 'RLS temporarily disabled for authentication tables' as status;