-- Migration to remove agent portal functionality
-- This script drops the agents table and cleans up related foreign key references

-- First, drop foreign key constraints that reference the agents table
ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS enquiries_agent_id_fkey;
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_assigned_agent_id_fkey;

-- Remove agent_id columns from related tables
ALTER TABLE enquiries DROP COLUMN IF EXISTS agent_id;
ALTER TABLE applications DROP COLUMN IF EXISTS assigned_agent_id;

-- Drop the agents table
DROP TABLE IF EXISTS agents;

-- Update any profiles with role 'agent' to 'customer'
UPDATE profiles SET role = 'customer' WHERE role = 'agent';

-- Clean up any RLS policies that reference agents (if they exist)
-- Note: You may need to manually review and remove agent-specific RLS policies in Supabase dashboard

COMMIT;