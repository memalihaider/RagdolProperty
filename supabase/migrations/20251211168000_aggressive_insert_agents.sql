-- Migration file preserved for reference but data insertion DISABLED
-- The admin portal is now the single source of truth for data

-- RLS remains disabled to allow admin operations
-- ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- Data insertion has been disabled - use admin portal instead
-- DELETE FROM agents WHERE approved = true;
-- INSERT INTO agents (...) VALUES (...);

-- ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
