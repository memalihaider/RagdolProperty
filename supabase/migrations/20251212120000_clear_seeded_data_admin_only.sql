-- Clear all seeded mock data
-- Admin portal is now the authoritative data source
-- NO MORE auto-seeding of test data

-- Delete all properties (seeded data)
DELETE FROM properties;

-- Delete all agents (seeded data)  
DELETE FROM agents;

-- Disable RLS to allow admin operations
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
