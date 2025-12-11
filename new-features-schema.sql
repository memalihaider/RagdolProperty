-- ============================================
-- NEW TABLES FOR CUSTOMER QUESTIONS AND PROPERTY VALUATIONS
-- ============================================
-- Run this in Supabase SQL Editor to create new tables
-- This is separate from the main schema to avoid conflicts

-- ============================================
-- CUSTOMER QUESTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS customer_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  admin_response TEXT,
  admin_response_at TIMESTAMP WITH TIME ZONE,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for customer_questions
ALTER TABLE customer_questions ENABLE ROW LEVEL SECURITY;

-- Customers can view their own questions
CREATE POLICY "Users can view own questions" ON customer_questions
  FOR SELECT USING (auth.uid() = user_id);

-- Customers can create their own questions
CREATE POLICY "Users can create questions" ON customer_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all questions
CREATE POLICY "Admins can view all questions" ON customer_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update questions (for responses)
CREATE POLICY "Admins can update questions" ON customer_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- PROPERTY VALUATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS property_valuations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  size_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  year_built INTEGER,
  condition TEXT,
  additional_features TEXT,
  urgency TEXT,
  contact_method TEXT DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'completed', 'cancelled')),
  estimated_value DECIMAL(12,2),
  valuation_notes TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for property_valuations
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;

-- Customers can view their own valuations
CREATE POLICY "Users can view own valuations" ON property_valuations
  FOR SELECT USING (auth.uid() = user_id);

-- Customers can create their own valuations
CREATE POLICY "Users can create valuations" ON property_valuations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all valuations
CREATE POLICY "Admins can view all valuations" ON property_valuations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update valuations
CREATE POLICY "Admins can update valuations" ON property_valuations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_customer_questions_user_id ON customer_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_questions_status ON customer_questions(status);
CREATE INDEX IF NOT EXISTS idx_customer_questions_category ON customer_questions(category);
CREATE INDEX IF NOT EXISTS idx_customer_questions_created_at ON customer_questions(created_at);

CREATE INDEX IF NOT EXISTS idx_property_valuations_user_id ON property_valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_property_valuations_status ON property_valuations(status);
CREATE INDEX IF NOT EXISTS idx_property_valuations_location ON property_valuations(location);
CREATE INDEX IF NOT EXISTS idx_property_valuations_created_at ON property_valuations(created_at);

-- ============================================
-- UPDATE TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_questions_updated_at
  BEFORE UPDATE ON customer_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_valuations_updated_at
  BEFORE UPDATE ON property_valuations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();