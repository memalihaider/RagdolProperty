-- ============================================
-- Seed Agents and Assign to Properties
-- ============================================

-- Insert sample approved agents into agents table
INSERT INTO agents (
  id,
  title,
  office,
  license_no,
  brokerage,
  bio,
  areas,
  location,
  whatsapp,
  telegram,
  profile_image,
  rating,
  review_count,
  experience_years,
  approved,
  verified,
  published,
  created_at,
  updated_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Senior Real Estate Consultant',
  'Downtown Dubai Office',
  'RERA-AG-12345',
  'Luxury Properties Dubai',
  'Expert in luxury properties with 15+ years of experience. Specializing in villas and penthouses in Dubai Marina and Downtown Dubai.',
  ARRAY['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah'],
  'Dubai, UAE',
  '+971501234567',
  '@ahmed_realtor',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  4.8,
  245,
  15,
  true,
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Real Estate Specialist',
  'Marina Mall Office',
  'RERA-AG-12346',
  'Luxury Properties Dubai',
  'Passionate about matching clients with their dream homes. Expertise in residential and commercial properties across Dubai.',
  ARRAY['Dubai Marina', 'Emirates Hills', 'Business Bay'],
  'Dubai, UAE',
  '+971509876543',
  '@fatima_properties',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  4.9,
  312,
  12,
  true,
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Property Investment Advisor',
  'Business Bay Office',
  'RERA-AG-12347',
  'Luxury Properties Dubai',
  'Specializes in investment properties and off-plan developments. Fluent in English, Arabic, and Mandarin.',
  ARRAY['Business Bay', 'Dubai Creek Harbour', 'Dubai South'],
  'Dubai, UAE',
  '+971505555555',
  '@mark_investor',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  4.7,
  189,
  10,
  true,
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Luxury Villa Specialist',
  'Emirates Hills Office',
  'RERA-AG-12348',
  'Luxury Properties Dubai',
  'Dedicated to finding perfect luxury villas for discerning clients. Multi-property portfolio expertise.',
  ARRAY['Emirates Hills', 'Arabian Ranches', 'Jumeirah'],
  'Dubai, UAE',
  '+971504444444',
  '@sara_villas',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  4.9,
  278,
  14,
  true,
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'Commercial Properties Expert',
  'Downtown Office',
  'RERA-AG-12349',
  'Luxury Properties Dubai',
  'Expert in commercial real estate, retail spaces, and business opportunities throughout Dubai.',
  ARRAY['Business Bay', 'Downtown Dubai', 'JBR'],
  'Dubai, UAE',
  '+971503333333',
  '@james_commercial',
  'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400&q=80',
  4.6,
  156,
  9,
  true,
  true,
  true,
  NOW(),
  NOW()
);

-- Update properties to assign agents (assign different agents to different properties)
-- Assign agent 1 to first batch of properties
UPDATE properties 
SET agent_id = '550e8400-e29b-41d4-a716-446655440001'::uuid,
    updated_at = NOW()
WHERE title LIKE '%Iconic Tower%' 
   OR title LIKE '%Executive 4BR%'
   OR title LIKE '%Burj Khalifa%'
   OR title LIKE '%Iconic Burj View%'
   OR title LIKE '%Downtown%'
LIMIT 10;

-- Assign agent 2 to marina/beachfront properties
UPDATE properties 
SET agent_id = '550e8400-e29b-41d4-a716-446655440002'::uuid,
    updated_at = NOW()
WHERE title LIKE '%Marina%' 
   OR title LIKE '%Beachfront%'
   OR title LIKE '%Marina View%'
   OR title LIKE '%Bay View%'
LIMIT 10;

-- Assign agent 3 to villas and large properties
UPDATE properties 
SET agent_id = '550e8400-e29b-41d4-a716-446655440003'::uuid,
    updated_at = NOW()
WHERE type = 'villa' 
   AND agent_id IS NULL
LIMIT 10;

-- Assign agent 4 to luxury penthouses
UPDATE properties 
SET agent_id = '550e8400-e29b-41d4-a716-446655440004'::uuid,
    updated_at = NOW()
WHERE type = 'penthouse' 
   AND agent_id IS NULL
LIMIT 5;

-- Assign agent 5 to commercial and remaining properties
UPDATE properties 
SET agent_id = '550e8400-e29b-41d4-a716-446655440005'::uuid,
    updated_at = NOW()
WHERE (type = 'commercial' OR agent_id IS NULL)
LIMIT 10;

-- Create users for these agents
INSERT INTO users (
  id,
  email,
  created_at,
  updated_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'ahmed@luxuryproperties.ae',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'fatima@luxuryproperties.ae',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'mark@luxuryproperties.ae',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'sara@luxuryproperties.ae',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'james@luxuryproperties.ae',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create profiles for these agents
INSERT INTO profiles (
  id,
  full_name,
  role,
  phone,
  avatar_url,
  email_verified,
  created_at,
  updated_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Ahmed Al Mansouri',
  'agent',
  '+971501234567',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Fatima Al Zahra',
  'agent',
  '+971509876543',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Mark Johnson',
  'agent',
  '+971505555555',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Sara Williams',
  'agent',
  '+971504444444',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'James Smith',
  'agent',
  '+971503333333',
  'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400&q=80',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Link users to agents in agents table (if user_id column exists)
UPDATE agents 
SET user_id = id
WHERE user_id IS NULL
  AND id IN (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    '550e8400-e29b-41d4-a716-446655440005'::uuid
  );
