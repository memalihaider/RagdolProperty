-- Disable RLS for admin operations
-- This allows the service role and authenticated users to perform CRUD operations

ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_valuations DISABLE ROW LEVEL SECURITY;
