-- DROP ALL EXISTING POLICIES ON AGENTS
DO $$ 
DECLARE 
    rec RECORD; 
BEGIN 
    FOR rec IN (SELECT policyname FROM pg_policies WHERE tablename = 'agents') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON agents', rec.policyname);
    END LOOP;
END;
$$;

-- DISABLE RLS TEMPORARILY
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- DELETE existing test agents
DELETE FROM agents WHERE license_no LIKE 'RERA-AG%';

-- INSERT AGENTS
INSERT INTO agents (title, office, license_no, brokerage, bio, areas, location, whatsapp, profile_image, rating, review_count, experience_years, approved, verified)
VALUES 
  ('Senior Real Estate Consultant', 'Downtown Dubai Office', 'RERA-AG-12345', 'Luxury Properties Dubai', 'Expert in luxury properties with 15+ years of experience. Specializing in villas and penthouses.', ARRAY['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah'], 'Dubai, UAE', '+971501234567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 4.8, 245, 15, true, true),
  ('Real Estate Specialist', 'Marina Mall Office', 'RERA-AG-12346', 'Luxury Properties Dubai', 'Passionate about matching clients with their dream homes. Expertise in residential and commercial properties.', ARRAY['Dubai Marina', 'Emirates Hills', 'Business Bay'], 'Dubai, UAE', '+971509876543', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 4.9, 312, 12, true, true),
  ('Property Investment Advisor', 'Business Bay Office', 'RERA-AG-12347', 'Luxury Properties Dubai', 'Specializes in investment properties and off-plan developments. Fluent in English, Arabic, and Mandarin.', ARRAY['Business Bay', 'Dubai Creek Harbour', 'Dubai South'], 'Dubai, UAE', '+971505555555', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', 4.7, 189, 10, true, true),
  ('Luxury Villa Specialist', 'Emirates Hills Office', 'RERA-AG-12348', 'Luxury Properties Dubai', 'Dedicated to finding perfect luxury villas for discerning clients. Multi-property portfolio expertise.', ARRAY['Emirates Hills', 'Arabian Ranches', 'Jumeirah'], 'Dubai, UAE', '+971504444444', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', 4.9, 278, 14, true, true),
  ('Commercial Properties Expert', 'Downtown Office', 'RERA-AG-12349', 'Luxury Properties Dubai', 'Expert in commercial real estate, retail spaces, and business opportunities throughout Dubai.', ARRAY['Business Bay', 'Downtown Dubai', 'JBR'], 'Dubai, UAE', '+971503333333', 'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400&q=80', 4.6, 156, 9, true, true);

-- ASSIGN AGENTS TO PROPERTIES 
UPDATE properties
SET agent_id = (SELECT id FROM agents WHERE license_no = 'RERA-AG-12345' LIMIT 1),
    updated_at = NOW()
WHERE (title ILIKE '%Downtown%' OR title ILIKE '%Executive%' OR title ILIKE '%Iconic%')
  AND agent_id IS NULL
LIMIT 10;

UPDATE properties
SET agent_id = (SELECT id FROM agents WHERE license_no = 'RERA-AG-12346' LIMIT 1),
    updated_at = NOW()
WHERE (title ILIKE '%Marina%' OR title ILIKE '%Beachfront%')
  AND agent_id IS NULL
LIMIT 10;

UPDATE properties
SET agent_id = (SELECT id FROM agents WHERE license_no = 'RERA-AG-12347' LIMIT 1),
    updated_at = NOW()
WHERE type = 'villa'
  AND agent_id IS NULL
LIMIT 10;

UPDATE properties
SET agent_id = (SELECT id FROM agents WHERE license_no = 'RERA-AG-12348' LIMIT 1),
    updated_at = NOW()
WHERE type = 'penthouse'
  AND agent_id IS NULL
LIMIT 5;

UPDATE properties
SET agent_id = (SELECT id FROM agents WHERE license_no = 'RERA-AG-12349' LIMIT 1),
    updated_at = NOW()
WHERE agent_id IS NULL
LIMIT 10;

-- RE-ENABLE RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES
CREATE POLICY "Public read approved agents" ON agents
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Allow insert" ON agents
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update" ON agents
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
