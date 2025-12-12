-- ============================================
-- ADD CATEGORIES TABLE AND PROPERTY RELATIONSHIPS
-- ============================================
-- This migration adds categories support to the RAGDOL platform

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to properties table
ALTER TABLE properties ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_properties_category_id ON properties(category_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Residential', 'residential', 'Houses, apartments, and residential properties', 'home', '#10B981', 1),
('Commercial', 'commercial', 'Office spaces, retail, and commercial properties', 'building', '#F59E0B', 2),
('Land', 'land', 'Plots and land for development', 'map', '#8B5CF6', 3),
('Industrial', 'industrial', 'Warehouses and industrial properties', 'cog', '#6B7280', 4);

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );