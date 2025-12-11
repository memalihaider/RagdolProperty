-- Enable real-time replication for tables
-- This ensures that Supabase real-time works properly

-- Create publication for real-time (if it doesn't exist)
CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR ALL TABLES;

-- Enable replica identity for tables
ALTER TABLE properties REPLICA IDENTITY FULL;
ALTER TABLE enquiries REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;
ALTER TABLE users REPLICA IDENTITY FULL;