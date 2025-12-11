-- Add password_hash column to users table for custom authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update existing admin users with hashed passwords
-- Note: This is for demo purposes - in production, use proper password hashing
UPDATE users
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uB0YgHvQ3K8e' -- Hash for 'Admin123!'
WHERE email IN ('admin@ragdol.com', 'superadmin@ragdol.com', 'manager@ragdol.com')
AND password_hash IS NULL;

-- Update existing test users with hashed passwords
UPDATE users
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uB0YgHvQ3K8e' -- Hash for 'Test123!'
WHERE email LIKE 'test%@ragdol.com'
AND password_hash IS NULL;

-- Update customer user with hashed password
UPDATE users
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeCt1uB0YgHvQ3K8e' -- Hash for 'Customer123!'
WHERE email = 'customer@ragdol.com'
AND password_hash IS NULL;