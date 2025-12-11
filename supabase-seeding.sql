-- ============================================
-- SUPABASE SEEDING SCRIPT FOR RAGDOL
-- ============================================
-- Run this in Supabase SQL Editor to seed test data
-- Make sure to run the complete_schema.sql first

-- ============================================
-- ADMIN CREDENTIALS SEEDING
-- ============================================

-- Clear existing admin credentials
DELETE FROM admin_credentials WHERE email LIKE '%@ragdol.com';

-- Insert updated admin credentials with correct email domains
INSERT INTO admin_credentials (email, password_hash, role, is_active) VALUES
('admin@ragdol.com', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true),
('superadmin@ragdol.com', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true),
('manager@ragdol.com', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true);

-- ============================================
-- TEST USER ACCOUNTS FOR CUSTOMER TESTING
-- ============================================

-- Clear existing test users (optional - remove this line if you want to keep existing data)
-- DELETE FROM users WHERE email LIKE 'test%@ragdol.com';
-- DELETE FROM profiles WHERE full_name LIKE 'Test%';

-- Insert test customer users (these will be created through the signup process)
-- Note: These are examples - actual users will be created through the app

-- Example test customer data (for reference):
-- Email: customer@ragdol.com, Password: Customer123!
-- Email: testuser1@ragdol.com, Password: Test123!
-- Email: testuser2@ragdol.com, Password: Test123!

-- ============================================
-- RLS (Row Level Security) POLICIES
-- ============================================
-- Fixed policies to avoid circular dependencies

-- Enable RLS on tables (run these if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own user record" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Profiles table policies (allow profile creation for authenticated users)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin credentials policies (check admin status without circular dependency)
CREATE POLICY "Authenticated users can view admin credentials for login" ON admin_credentials
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow service role to manage admin credentials
CREATE POLICY "Service role can manage admin credentials" ON admin_credentials
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if admin credentials were inserted correctly
SELECT email, role, is_active FROM admin_credentials WHERE email LIKE '%@ragdol.com';

-- Check if tables exist and have data
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'admin_credentials' as table_name, COUNT(*) as count FROM admin_credentials
UNION ALL
SELECT 'properties' as table_name, COUNT(*) as count FROM properties;

-- ============================================
-- MANUAL ADMIN USER CREATION (if needed)
-- ============================================
-- If the automatic admin creation fails, you can manually create admin users:

-- 1. First create the user in auth.users (this is done automatically by Supabase Auth)
-- 2. Then run these inserts:

-- INSERT INTO users (id, email, email_confirmed_at) VALUES
-- ('your-admin-user-id-here', 'admin@ragdol.com', NOW());

-- INSERT INTO profiles (id, full_name, role, email_verified) VALUES
-- ('your-admin-user-id-here', 'Admin User', 'admin', true);

-- Replace 'your-admin-user-id-here' with the actual UUID from auth.users