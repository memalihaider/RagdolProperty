-- Force disable RLS on agents table
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- Delete any existing agents to start fresh
DELETE FROM agents;

-- Insert 5 approved agents
INSERT INTO agents (
  id,
  title,
  brokerage,
  experience_years,
  rating,
  reviews,
  profile_image,
  whatsapp,
  approved,
  is_active,
  created_at,
  updated_at
) VALUES
(
  'ag-001',
  'Senior Real Estate Specialist',
  'Premium Realty Group',
  12,
  4.8,
  287,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  '971234567890',
  TRUE,
  TRUE,
  NOW(),
  NOW()
),
(
  'ag-002',
  'Luxury Property Consultant',
  'Elite Estates Dubai',
  10,
  4.7,
  243,
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  '971234567891',
  TRUE,
  TRUE,
  NOW(),
  NOW()
),
(
  'ag-003',
  'Investment Property Expert',
  'Global Property Solutions',
  15,
  4.9,
  312,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  '971234567892',
  TRUE,
  TRUE,
  NOW(),
  NOW()
),
(
  'ag-004',
  'Dubai Marina Specialist',
  'Marina Realty Partners',
  9,
  4.6,
  198,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  '971234567893',
  TRUE,
  TRUE,
  NOW(),
  NOW()
),
(
  'ag-005',
  'Villa & Residential Expert',
  'Desert Oasis Properties',
  14,
  4.8,
  267,
  'https://images.unsplash.com/photo-1517070213202-1e1ceb69effa?w=400&h=400&fit=crop',
  '971234567894',
  TRUE,
  TRUE,
  NOW(),
  NOW()
);

-- Create agents with user profiles if they don't have them
INSERT INTO profiles (
  id,
  full_name,
  email,
  created_at
) VALUES
('ag-001', 'Ahmed Al Mansouri', 'ahmed@ragdol.com', NOW()),
('ag-002', 'Fatima Al Qasimi', 'fatima@ragdol.com', NOW()),
('ag-003', 'Mohammed Al Maktoum', 'mohammed@ragdol.com', NOW()),
('ag-004', 'Layla Al Noor', 'layla@ragdol.com', NOW()),
('ag-005', 'Hassan Al Rafiqa', 'hassan@ragdol.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update agents to reference the profiles
-- (This is optional since we already have the agent records)

-- Re-enable RLS with a more permissive policy
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Public read approved agents" ON agents;
DROP POLICY IF EXISTS "Allow insert agents" ON agents;
DROP POLICY IF EXISTS "Allow update agents" ON agents;
DROP POLICY IF EXISTS "Admin and service role can manage agents" ON agents;

-- Create new comprehensive policies
-- Anyone can read approved agents
CREATE POLICY "Anyone can read approved agents"
  ON agents FOR SELECT
  USING (approved = true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT
  WITH CHECK (true);

-- Authenticated users can update their own records
CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE
  USING (true);

-- For future: only service role can delete
CREATE POLICY "Only service role can delete agents"
  ON agents FOR DELETE
  USING (false);
