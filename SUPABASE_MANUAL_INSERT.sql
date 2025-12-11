-- ============================================================================
-- PASTE THIS INTO YOUR SUPABASE DASHBOARD SQL EDITOR
-- Go to: https://app.supabase.com → Select your project → SQL Editor → New Query
-- Then paste and run this entire script
-- ============================================================================

-- STEP 1: Disable RLS temporarily (so we can insert without restrictions)
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- STEP 2: Clear any old test data
DELETE FROM agents WHERE approved = true;

-- STEP 3: Insert the 5 approved agents
INSERT INTO agents (title, brokerage, experience_years, rating, review_count, profile_image, whatsapp, approved)
VALUES
  ('Senior Real Estate Specialist', 'Premium Realty Group', 12, 4.8, 287, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', '+971234567890', true),
  ('Luxury Property Consultant', 'Elite Estates Dubai', 10, 4.7, 243, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', '+971234567891', true),
  ('Investment Property Expert', 'Global Property Solutions', 15, 4.9, 312, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', '+971234567892', true),
  ('Dubai Marina Specialist', 'Marina Realty Partners', 9, 4.6, 198, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', '+971234567893', true),
  ('Villa & Residential Expert', 'Desert Oasis Properties', 14, 4.8, 267, 'https://images.unsplash.com/photo-1517070213202-1e1ceb69effa?w=400&h=400&fit=crop', '+971234567894', true);

-- STEP 4: Re-enable RLS  
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- STEP 5: Verify the agents were inserted (you should see 5 rows)
SELECT COUNT(*) as agent_count FROM agents WHERE approved = true;
SELECT id, title, brokerage, rating FROM agents WHERE approved = true LIMIT 5;
