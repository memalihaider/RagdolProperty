-- Enable real-time replication for all tables
-- This script enables real-time broadcasting for the database

-- Enable REPLICA IDENTITY FULL for all tables to support real-time
ALTER TABLE profiles REPLICA IDENTITY FULL;
ALTER TABLE properties REPLICA IDENTITY FULL;
ALTER TABLE enquiries REPLICA IDENTITY FULL;
ALTER TABLE agents REPLICA IDENTITY FULL;
ALTER TABLE customer_questions REPLICA IDENTITY FULL;
ALTER TABLE property_valuations REPLICA IDENTITY FULL;

-- Create or update publication for real-time
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- Grant necessary permissions for real-time
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;