-- ============================================
-- COMPLETE RAGDOL REAL ESTATE DATABASE SCHEMA
-- ============================================
-- This schema includes all tables needed for the RAGDOL platform
-- Includes 30+ properties with comprehensive filtering data
-- Generated: December 8, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================
-- DROP EXISTING TABLES (for clean reset)
-- ============================================

DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS enquiry_activities CASCADE;
DROP TABLE IF EXISTS enquiry_messages CASCADE;
DROP TABLE IF EXISTS property_views CASCADE;
DROP TABLE IF EXISTS saved_properties CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS viewings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS dashboard_metrics CASCADE;
DROP TABLE IF EXISTS market_data CASCADE;
DROP TABLE IF EXISTS seo_backlinks CASCADE;
DROP TABLE IF EXISTS seo_keywords CASCADE;
DROP TABLE IF EXISTS seo_pages CASCADE;
DROP TABLE IF EXISTS system_health CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS notification_templates CASCADE;
DROP TABLE IF EXISTS admin_audit CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- CORE USER MANAGEMENT TABLES
-- ============================================

-- Users Table (for demo/development - in production this would be Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT,
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (linked to users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT CHECK (role IN ('customer', 'agent', 'admin', 'developer')) DEFAULT 'customer',
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Credentials Table (for hardcoded admin accounts)
CREATE TABLE admin_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents Table (linked to profiles)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Real Estate Agent',
    office TEXT,
    license_no TEXT,
    brokerage TEXT DEFAULT 'Luxury Properties Dubai',
    bio TEXT,
    areas TEXT[],
    location TEXT DEFAULT 'Dubai, UAE',
    whatsapp TEXT,
    telegram TEXT,
    linkedin_url TEXT,
    instagram_handle TEXT,
    website_url TEXT,
    social JSONB DEFAULT '{}',
    specializations TEXT[] DEFAULT ARRAY['Residential Properties'],
    profile_image TEXT, -- Main profile image URL
    profile_images TEXT[], -- Array of additional profile images
    approved BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 25,
    total_sales INTEGER DEFAULT 15,
    commission_rate DECIMAL(5,2) DEFAULT 2.5,
    languages TEXT[] DEFAULT ARRAY['English', 'Arabic'],
    experience_years INTEGER DEFAULT 5,
    certifications TEXT[] DEFAULT ARRAY['RERA Certified'],
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developers Table
CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    founded_year INTEGER,
    total_projects INTEGER DEFAULT 5,
    active_projects INTEGER DEFAULT 3,
    social_links JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROPERTY MANAGEMENT TABLES
-- ============================================

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    status TEXT CHECK (status IN ('off-plan', 'in-progress', 'completed', 'cancelled')) DEFAULT 'completed',
    launch_date DATE,
    completion_date DATE,
    handover_date DATE,
    amenities TEXT[],
    facilities TEXT[],
    city TEXT DEFAULT 'Dubai',
    area TEXT,
    district TEXT,
    address TEXT,
    coords JSONB,
    hero_image_url TEXT,
    images TEXT[],
    video_url TEXT,
    brochure_url TEXT,
    description TEXT,
    payment_plan TEXT,
    payment_terms JSONB,
    starting_price DECIMAL(15,2),
    min_price DECIMAL(15,2),
    max_price DECIMAL(15,2),
    currency TEXT DEFAULT 'AED',
    total_units INTEGER,
    available_units INTEGER,
    sold_units INTEGER DEFAULT 0,
    property_types TEXT[],
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    short_description TEXT,
    type TEXT CHECK (type IN ('apartment', 'villa', 'townhouse', 'plot', 'commercial', 'penthouse', 'studio', 'duplex')) DEFAULT 'apartment',
    status TEXT CHECK (status IN ('sale', 'rent')) DEFAULT 'sale',
    property_status TEXT CHECK (property_status IN ('ready', 'off-plan', 'under-construction', 'reserved', 'sold', 'rented')) DEFAULT 'ready',
    price DECIMAL(15,2) NOT NULL,
    original_price DECIMAL(15,2),
    currency TEXT DEFAULT 'AED',
    price_per_sqft DECIMAL(10,2),
    beds INTEGER,
    baths INTEGER,
    sqft INTEGER,
    plot_size INTEGER,
    built_up_area INTEGER,
    parking_spaces INTEGER DEFAULT 0,
    floor_number INTEGER,
    total_floors INTEGER,
    year_built INTEGER,
    furnishing TEXT CHECK (furnishing IN ('furnished', 'unfurnished', 'semi-furnished')),
    images TEXT[],
    image_url TEXT, -- For backward compatibility with existing code
    floorplans TEXT[],
    virtual_tour_url TEXT,
    video_url TEXT,
    features TEXT[],
    amenities TEXT[],
    address TEXT,
    city TEXT DEFAULT 'Dubai',
    area TEXT,
    district TEXT,
    location TEXT, -- Combined location field for easier querying
    coords JSONB,
    neighborhood TEXT,
    landmark TEXT,
    published BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    premium BOOLEAN DEFAULT false,
    urgent BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    meta_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENQUIRY & COMMUNICATION TABLES
-- ============================================

-- Inquiries Table (used by agent portal)
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'replied', 'closed')) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    agent_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiries Table (main enquiry system)
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    source TEXT CHECK (source IN ('website', 'agent', 'phone', 'sell_form', 'social', 'referral')) DEFAULT 'website',
    status TEXT CHECK (status IN ('new', 'contacted', 'interested', 'viewing', 'offer', 'negotiating', 'closed', 'converted', 'lost')) DEFAULT 'new',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    assigned_to UUID REFERENCES agents(id),
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    timeline TEXT,
    financing_needed BOOLEAN DEFAULT false,
    financing_amount DECIMAL(15,2),
    nationality TEXT,
    residency_status TEXT,
    occupation TEXT,
    employer TEXT,
    monthly_income DECIMAL(15,2),
    down_payment DECIMAL(15,2),
    mortgage_preferred BOOLEAN DEFAULT false,
    property_requirements JSONB DEFAULT '{}',
    follow_up_date TIMESTAMP WITH TIME ZONE,
    last_contacted TIMESTAMP WITH TIME ZONE,
    contact_count INTEGER DEFAULT 0,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiry Activities Table
CREATE TABLE enquiry_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    activity_type TEXT CHECK (activity_type IN ('call', 'email', 'meeting', 'viewing', 'offer', 'note', 'status_change')) NOT NULL,
    description TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiry Messages Table
CREATE TABLE enquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_type TEXT CHECK (sender_type IN ('customer', 'agent', 'admin')) NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('text', 'email', 'call_log')) DEFAULT 'text',
    attachments TEXT[],
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER INTERACTION TABLES
-- ============================================

-- Property Views Table
CREATE TABLE property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER,
    source TEXT
);

-- Saved Properties Table
CREATE TABLE saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Saved Searches Table
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    notification_enabled BOOLEAN DEFAULT true,
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications Table (for property purchase/rental applications)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    application_type TEXT CHECK (application_type IN ('purchase', 'rental', 'mortgage', 'investment')) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled', 'completed')) DEFAULT 'draft',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    
    -- Personal Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    nationality TEXT,
    residency_status TEXT CHECK (residency_status IN ('citizen', 'resident', 'tourist', 'investor')),
    
    -- Financial Information
    occupation TEXT,
    employer TEXT,
    monthly_income DECIMAL(15,2),
    annual_income DECIMAL(15,2),
    down_payment DECIMAL(15,2),
    financing_needed BOOLEAN DEFAULT false,
    financing_amount DECIMAL(15,2),
    mortgage_preferred BOOLEAN DEFAULT false,
    bank_name TEXT,
    credit_score INTEGER,
    
    -- Property Requirements
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    timeline TEXT CHECK (timeline IN ('immediately', '1-3_months', '3-6_months', '6-12_months', 'flexible')),
    property_requirements JSONB DEFAULT '{}',
    
    -- Application Details
    cover_letter TEXT,
    additional_documents TEXT[],
    special_requests TEXT,
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'in_person')) DEFAULT 'email',
    
    -- Processing Information
    assigned_agent_id UUID REFERENCES agents(id),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    completion_date TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    last_updated_by UUID REFERENCES profiles(id),
    notes TEXT,
    internal_notes TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    contact_count INTEGER DEFAULT 0,
    last_contacted TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Activities Table
CREATE TABLE application_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    activity_type TEXT CHECK (activity_type IN ('created', 'submitted', 'reviewed', 'approved', 'rejected', 'updated', 'document_uploaded', 'meeting_scheduled', 'note_added', 'status_changed')) NOT NULL,
    description TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Viewings Table
CREATE TABLE viewings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    notes TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATION SYSTEM
-- ============================================

-- Notification Templates Table
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('email', 'sms', 'push', 'in_app')) NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('property_match', 'price_change', 'new_listing', 'enquiry', 'reminder', 'system')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SOCIAL & CONTENT TABLES
-- ============================================

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    images TEXT[],
    tags TEXT[],
    category TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Likes Table
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- ============================================
-- ANALYTICS & METRICS TABLES
-- ============================================

-- Analytics Events Table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard Metrics Table
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    metric_value JSONB NOT NULL,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_type, date_recorded)
);

-- Market Data Table
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    property_type TEXT NOT NULL,
    metric_type TEXT CHECK (metric_type IN ('price_per_sqft', 'rental_yield', 'days_on_market', 'price_trend')) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    data_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SEO TABLES
-- ============================================

-- SEO Keywords Table
CREATE TABLE seo_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL UNIQUE,
    search_volume INTEGER,
    competition DECIMAL(3,2),
    cpc DECIMAL(8,2),
    trend TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Pages Table
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    meta_description TEXT,
    h1_tags TEXT[],
    word_count INTEGER,
    internal_links INTEGER DEFAULT 0,
    external_links INTEGER DEFAULT 0,
    images_count INTEGER DEFAULT 0,
    last_crawled TIMESTAMP WITH TIME ZONE,
    seo_score INTEGER,
    issues TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Backlinks Table
CREATE TABLE seo_backlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    anchor_text TEXT,
    link_type TEXT CHECK (link_type IN ('dofollow', 'nofollow', 'sponsored', 'ugc')) DEFAULT 'dofollow',
    domain_authority INTEGER,
    first_seen TIMESTAMP WITH TIME ZONE,
    last_seen TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('active', 'lost', 'broken')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SYSTEM TABLES
-- ============================================

-- System Settings Table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Logs Table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')) NOT NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    user_id UUID REFERENCES profiles(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Health Table
CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('healthy', 'degraded', 'unhealthy', 'down')) NOT NULL,
    response_time INTEGER,
    uptime_percentage DECIMAL(5,2),
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Audit Table
CREATE TABLE admin_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Properties indexes
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_beds ON properties(beds);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_published ON properties(published);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Enquiries indexes
CREATE INDEX idx_enquiries_property_id ON enquiries(property_id);
CREATE INDEX idx_enquiries_user_id ON enquiries(user_id);
CREATE INDEX idx_enquiries_agent_id ON enquiries(agent_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at);

-- Inquiries indexes
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);

-- Other important indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_agents_approved ON agents(approved);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample users first
INSERT INTO users (id, email, encrypted_password, email_confirmed_at) VALUES
('36d8ca43-20ce-4aae-9c04-0ebabe90a2c3', 'john.smith@example.com', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', NOW()),
('47e9db54-31df-4bbf-9d15-1fcacf91b3d4', 'sarah.ahmed@example.com', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', NOW()),
('58fac765-42ef-4ccf-9e26-2fdbeaf92c4e', 'admin@ragdol.ae', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', NOW());

-- Insert sample profiles
INSERT INTO profiles (id, full_name, role, phone, email_verified, created_at) VALUES
('36d8ca43-20ce-4aae-9c04-0ebabe90a2c3', 'John Smith', 'customer', '+971501234567', true, NOW()),
('47e9db54-31df-4bbf-9d15-1fcacf91b3d4', 'Sarah Ahmed', 'agent', '+971507654321', true, NOW()),
('58fac765-42ef-4ccf-9e26-2fdbeaf92c4e', 'Admin User', 'admin', '+971509876543', true, NOW());

-- Insert hardcoded admin credentials
INSERT INTO admin_credentials (email, password_hash, role, is_active) VALUES
('admin@ragdol.ae', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true),
('superadmin@ragdol.ae', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true),
('manager@ragdol.ae', '$2b$10$8K3.5wJ8X9Y2Z4A6B8C0E2F4G6H8I0J2K4L6M8N0O2P4Q6R8S0T2', 'admin', true);

-- Insert sample agents
INSERT INTO agents (user_id, office, license_no, bio, areas, whatsapp, rating, review_count, total_sales, experience_years, verified) VALUES
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Dubai Marina Office', 'RERA-12345', 'Experienced real estate agent specializing in luxury properties', ARRAY['Dubai Marina', 'Jumeirah', 'Palm Jumeirah'], '+971507654321', 4.8, 45, 28, 8, true);

-- Insert sample developers
INSERT INTO developers (name, website, description, contact_email, total_projects, active_projects, verified) VALUES
('Emaar Properties', 'https://www.emaar.com', 'Leading real estate developer in Dubai', 'info@emaar.com', 50, 12, true),
('DAMAC Properties', 'https://www.damacproperties.com', 'Luxury lifestyle and real estate developer', 'info@damacproperties.com', 35, 8, true),
('Nakheel Properties', 'https://www.nakheel.com', 'Master developer of Dubai properties', 'info@nakheel.com', 40, 15, true);

-- Insert sample projects
INSERT INTO projects (developer_id, name, slug, status, city, area, amenities, starting_price, total_units, available_units, published) VALUES
((SELECT id FROM developers WHERE name = 'Emaar Properties'), 'Dubai Marina Mall', 'dubai-marina-mall', 'completed', 'Dubai', 'Dubai Marina', ARRAY['Shopping Mall', 'Beach Access', 'Marina'], 2000000, 500, 50, true),
((SELECT id FROM developers WHERE name = 'DAMAC Properties'), 'Akoya Oxygen', 'akoya-oxygen', 'completed', 'Dubai', 'Dubai Marina', ARRAY['Swimming Pool', 'Gym', 'Beach Access'], 1500000, 300, 25, true),
((SELECT id FROM developers WHERE name = 'Nakheel Properties'), 'Palm Jumeirah', 'palm-jumeirah', 'completed', 'Dubai', 'Palm Jumeirah', ARRAY['Private Beach', 'Marina', 'Golf Course'], 5000000, 1000, 100, true);

-- Insert 30+ sample properties with comprehensive filtering data
INSERT INTO properties (project_id, agent_id, title, type, status, property_status, price, beds, baths, sqft, area, address, features, amenities, images, published, featured, verified, views_count) VALUES
-- Dubai Marina Apartments (6 properties)
((SELECT id FROM projects WHERE name = 'Dubai Marina Mall'), (SELECT id FROM agents WHERE user_id = (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4')), 'Luxury 2BR Marina View Apartment', 'apartment', 'sale', 'ready', 3200000, 2, 2, 1200, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Marina View', 'Balcony', 'Built-in Wardrobes'], ARRAY['Swimming Pool', 'Gym', 'Parking'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, true, true, 150),
((SELECT id FROM projects WHERE name = 'Dubai Marina Mall'), (SELECT id FROM agents WHERE user_id = (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4')), 'Spacious 3BR with City View', 'apartment', 'sale', 'ready', 4500000, 3, 3, 1600, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['City View', 'Maid Room', 'Study'], ARRAY['Concierge', 'Security', 'Kids Play Area'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], true, false, true, 89),
((SELECT id FROM projects WHERE name = 'Akoya Oxygen'), (SELECT id FROM agents WHERE user_id = (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4')), 'Modern 1BR Studio Apartment', 'studio', 'rent', 'ready', 85000, 1, 1, 600, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Fully Furnished', 'Kitchen Appliances'], ARRAY['Gym', 'Pool', 'Beach Access'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, true, 67),
((SELECT id FROM projects WHERE name = 'Akoya Oxygen'), (SELECT id FROM agents WHERE user_id = (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4')), 'Premium 3BR Penthouse', 'penthouse', 'sale', 'ready', 8500000, 3, 4, 2800, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Private Terrace', 'Jacuzzi', 'Wine Cellar'], ARRAY['Private Elevator', 'Concierge', 'Valet Parking'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], true, true, true, 203),
((SELECT id FROM projects WHERE name = 'Dubai Marina Mall'), (SELECT id FROM agents WHERE user_id = (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4')), 'Cozy 2BR for Investment', 'apartment', 'rent', 'ready', 120000, 2, 2, 1100, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Investment Property', 'High ROI'], ARRAY['Maintenance', 'Security'], ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'], true, false, true, 45),
((SELECT id FROM projects WHERE name = 'Akoya Oxygen'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Family 4BR Apartment', 'apartment', 'sale', 'ready', 6200000, 4, 4, 2200, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Family Friendly', 'Spacious', 'Modern Design'], ARRAY['Kids Pool', 'Playground', 'School Bus'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true, false, true, 112),

-- Jumeirah Villas (6 properties)
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Luxury 5BR Villa with Garden', 'villa', 'sale', 'ready', 15000000, 5, 6, 5500, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Private Garden', 'Swimming Pool', 'Maid Room'], ARRAY['Beach Access', 'Marina', 'Security'], ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], true, true, true, 178),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Modern 4BR Townhouse', 'townhouse', 'sale', 'ready', 7500000, 4, 4, 3200, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Townhouse', 'Private Parking', 'Rooftop Terrace'], ARRAY['Community Pool', 'Gym', 'Garden'], ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'], true, false, true, 134),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Beachfront 6BR Mansion', 'villa', 'rent', 'ready', 500000, 6, 7, 8000, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Beachfront', 'Private Beach', 'Home Cinema'], ARRAY['Butler Service', 'Chef', 'Housekeeping'], ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'], true, true, true, 267),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Compact 3BR Villa', 'villa', 'sale', 'ready', 5200000, 3, 3, 2800, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Compact Design', 'Low Maintenance', 'Modern'], ARRAY['Security', 'Parking', 'Garden'], ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], true, false, true, 89),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Investment 4BR Property', 'villa', 'rent', 'ready', 280000, 4, 4, 3500, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Investment Opportunity', 'High Demand Area'], ARRAY['Maintenance Included', 'Security'], ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'], true, false, true, 156),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Luxury 7BR Estate', 'villa', 'sale', 'ready', 25000000, 7, 8, 10000, 'Jumeirah', 'Jumeirah, Dubai', ARRAY['Estate', 'Private Cinema', 'Wine Cellar'], ARRAY['Staff Quarters', 'Garage', 'Garden'], ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'], true, true, true, 312),

-- Business Bay Commercial (4 properties)
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Premium Office Space', 'commercial', 'rent', 'ready', 250000, NULL, NULL, 2000, 'Business Bay', 'Business Bay, Dubai', ARRAY['Corner Office', 'Meeting Rooms', 'Reception'], ARRAY['Parking', 'Security', 'Elevator'], ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], true, false, true, 78),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Retail Shop in Mall', 'commercial', 'sale', 'ready', 8000000, NULL, NULL, 800, 'Business Bay', 'Business Bay, Dubai', ARRAY['High Foot Traffic', 'Mall Location'], ARRAY['Security', 'Cleaning', 'Maintenance'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], true, false, true, 145),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Warehouse Space', 'commercial', 'rent', 'ready', 150000, NULL, NULL, 5000, 'Business Bay', 'Business Bay, Dubai', ARRAY['Loading Dock', 'Storage', 'Office Space'], ARRAY['Security', 'Parking', 'Power Backup'], ARRAY['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'], true, false, true, 67),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Co-working Office', 'commercial', 'rent', 'ready', 35000, NULL, NULL, 300, 'Business Bay', 'Business Bay, Dubai', ARRAY['Furnished', 'High Speed Internet', 'Meeting Rooms'], ARRAY['Reception', 'Coffee', 'Cleaning'], ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], true, false, true, 98),

-- Dubai Silicon Oasis (4 properties)
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Tech Company Office', 'commercial', 'rent', 'ready', 180000, NULL, NULL, 1500, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Tech Park', 'Fiber Internet', 'Parking'], ARRAY['Security', 'Cafeteria', 'Gym'], ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'], true, false, true, 123),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Modern 2BR Apartment', 'apartment', 'sale', 'ready', 1800000, 2, 2, 1000, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Near Metro', 'Tech Hub', 'Modern Design'], ARRAY['Pool', 'Gym', 'Security'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 87),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), '3BR Family Home', 'villa', 'sale', 'ready', 3500000, 3, 3, 2000, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Family Friendly', 'Garden', 'Quiet Area'], ARRAY['School Bus', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800'], true, false, true, 76),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Investment Plot', 'plot', 'sale', 'ready', 5000000, NULL, NULL, 5000, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Development Plot', 'High Growth Area'], ARRAY['Utilities Available', 'Road Access'], ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], true, false, true, 54),

-- Al Barsha (4 properties)
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Executive 3BR Apartment', 'apartment', 'rent', 'ready', 140000, 3, 3, 1500, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Executive Living', 'Balcony', 'Built-in Kitchen'], ARRAY['Concierge', 'Pool', 'Gym'], ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], true, false, true, 109),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Student Studio', 'studio', 'rent', 'ready', 45000, 1, 1, 400, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Near University', 'Furnished', 'Utilities Included'], ARRAY['Laundry', 'Study Areas', 'Cafeteria'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, true, 67),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Family 4BR Villa', 'villa', 'sale', 'ready', 4800000, 4, 4, 3000, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Family Home', 'Garden', 'Maid Room'], ARRAY['School Nearby', 'Shopping', 'Hospital'], ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], true, false, true, 134),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Luxury Penthouse', 'penthouse', 'sale', 'ready', 7200000, 3, 4, 2500, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Panoramic Views', 'Private Elevator', 'Rooftop Access'], ARRAY['Concierge', 'Spa', 'Valet Parking'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], true, true, true, 187),

-- Downtown Dubai (6 properties)
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Burj Khalifa View Apartment', 'apartment', 'sale', 'ready', 12000000, 3, 4, 2000, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Burj Khalifa View', 'Premium Location', 'High Floor'], ARRAY['Burj Khalifa Access', 'Mall', 'Metro'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true, true, true, 298),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Opera District 2BR', 'apartment', 'rent', 'ready', 160000, 2, 2, 1100, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Near Dubai Opera', 'Cultural District'], ARRAY['Shopping', 'Dining', 'Entertainment'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 145),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Dubai Mall Retail Space', 'commercial', 'rent', 'ready', 500000, NULL, NULL, 500, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Dubai Mall Location', 'High Traffic'], ARRAY['Security', 'Cleaning', 'Utilities'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], true, true, true, 203),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Executive 4BR Residence', 'apartment', 'sale', 'ready', 9500000, 4, 5, 3200, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Executive Living', 'Premium Finishes', 'Smart Home'], ARRAY['Concierge', 'Spa', 'Fine Dining'], ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'], true, true, true, 176),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Investment Property', 'apartment', 'rent', 'ready', 130000, 2, 2, 1000, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Prime Investment', 'Tourist Area', 'High ROI'], ARRAY['Management Company', 'Cleaning'], ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'], true, false, true, 98),
(NULL, (SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Sky View Penthouse', 'penthouse', 'sale', 'ready', 18000000, 4, 5, 4000, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['360 Degree Views', 'Private Pool', 'Helipad'], ARRAY['Butler Service', 'Chef', 'House Manager'], ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'], true, true, true, 345);

-- Insert 9 more agents (total 10 agents)
INSERT INTO agents (user_id, office, license_no, bio, areas, whatsapp, rating, review_count, total_sales, experience_years, verified) VALUES
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Dubai Hills Office', 'RERA-23456', 'Specialist in luxury villas and high-end properties', ARRAY['Dubai Hills', 'Emirates Hills', 'Dubai Festival City'], '+971501234568', 4.9, 67, 42, 12, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Jumeirah Beach Office', 'RERA-34567', 'Expert in beachfront properties and marina living', ARRAY['Jumeirah Beach Residence', 'Dubai Marina', 'Palm Jumeirah'], '+971501234569', 4.7, 89, 31, 10, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Business Bay Office', 'RERA-45678', 'Commercial and residential specialist in Business Bay', ARRAY['Business Bay', 'World Trade Center', 'Al Maryah Island'], '+971501234570', 4.6, 54, 28, 9, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Downtown Dubai Office', 'RERA-56789', 'Luxury property expert in Dubai''s prime locations', ARRAY['Downtown Dubai', 'Business Bay', 'Dubai Marina'], '+971501234571', 4.8, 73, 39, 11, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Dubai Silicon Oasis Office', 'RERA-67890', 'Technology and innovation district specialist', ARRAY['Dubai Silicon Oasis', 'Dubai Internet City', 'Dubai Media City'], '+971501234572', 4.5, 41, 22, 7, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Al Barsha Office', 'RERA-78901', 'Family and residential property specialist', ARRAY['Al Barsha', 'Tecom', 'Dubai Festival City'], '+971501234573', 4.4, 38, 19, 6, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Dubai South Office', 'RERA-89012', 'Dubai South and Expo 2020 area specialist', ARRAY['Dubai South', 'Expo City', 'Dubai World Central'], '+971501234574', 4.3, 29, 16, 5, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Deira Office', 'RERA-90123', 'Traditional and commercial property expert', ARRAY['Deira', 'Al Rigga', 'Al Muraqqabat'], '+971501234575', 4.2, 25, 13, 4, true),
((SELECT id FROM agents WHERE user_id = '47e9db54-31df-4bbf-9d15-1fcacf91b3d4'), 'Sharjah Office', 'RERA-01234', 'Cross-border property specialist', ARRAY['Sharjah', 'Ajman', 'Fujairah'], '+971501234576', 4.1, 18, 9, 3, true);

-- Insert additional developers (total 6 developers)
INSERT INTO developers (name, website, description, contact_email, total_projects, active_projects, verified) VALUES
('Azizi Developments', 'https://www.azizi.com', 'Premium residential and commercial developments', 'info@azizi.com', 25, 6, true),
('Ellington Properties', 'https://www.ellingtonproperties.com', 'Luxury lifestyle and hospitality developments', 'info@ellingtonproperties.com', 18, 4, true),
('Meraas Holding', 'https://www.meraas.com', 'Leading developer of iconic Dubai landmarks', 'info@meraas.com', 22, 7, true);

-- Insert additional projects (total 8 projects)
INSERT INTO projects (developer_id, name, slug, status, city, area, amenities, starting_price, total_units, available_units, published) VALUES
((SELECT id FROM developers WHERE name = 'Azizi Developments'), 'Azizi Mina Seyahi', 'azizi-mina-seyahi', 'completed', 'Dubai', 'Dubai Marina', ARRAY['Marina View', 'Beach Club', 'Retail'], 2500000, 400, 45, true),
((SELECT id FROM developers WHERE name = 'Ellington Properties'), 'Ellington Beach House', 'ellington-beach-house', 'completed', 'Dubai', 'Jumeirah Beach Residence', ARRAY['Beachfront', 'Infinity Pool', 'Spa'], 3500000, 200, 15, true),
((SELECT id FROM developers WHERE name = 'Meraas Holding'), 'Address Dubai Marina', 'address-dubai-marina', 'completed', 'Dubai', 'Dubai Marina', ARRAY['Marina Promenade', 'Shopping', 'Dining'], 1800000, 600, 78, true),
((SELECT id FROM developers WHERE name = 'Emaar Properties'), 'Emaar Beachfront', 'emaar-beachfront', 'completed', 'Dubai', 'Dubai Marina', ARRAY['Private Beach', 'Waterfront', 'Golf'], 4200000, 350, 28, true),
((SELECT id FROM developers WHERE name = 'DAMAC Properties'), 'Trinity Towers', 'trinity-towers', 'completed', 'Dubai', 'Business Bay', ARRAY['Business District', 'Metro Access', 'Retail'], 2200000, 450, 67, true);

-- Insert additional 20+ properties (total 50+ properties)
INSERT INTO properties (project_id, agent_id, title, type, status, property_status, price, beds, baths, sqft, area, address, features, amenities, images, published, featured, verified, views_count) VALUES
-- Additional Dubai Marina properties
((SELECT id FROM projects WHERE name = 'Azizi Mina Seyahi'), (SELECT id FROM agents LIMIT 1 OFFSET 1), 'Elegant 3BR with Marina Views', 'apartment', 'sale', 'ready', 3800000, 3, 3, 1400, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Marina Views', 'Spacious Living', 'Modern Kitchen'], ARRAY['Pool', 'Gym', 'Beach Access'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 145),
((SELECT id FROM projects WHERE name = 'Address Dubai Marina'), (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Stylish 2BR Apartment', 'apartment', 'rent', 'ready', 95000, 2, 2, 950, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Fully Furnished', 'City Views'], ARRAY['Concierge', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], true, false, true, 98),
((SELECT id FROM projects WHERE name = 'Emaar Beachfront'), (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Beachfront 4BR Villa', 'villa', 'sale', 'ready', 12500000, 4, 5, 4200, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Beachfront', 'Private Garden', 'Maid Room'], ARRAY['Beach Club', 'Marina', 'Security'], ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], true, true, true, 234),

-- Additional Jumeirah properties
((SELECT id FROM projects WHERE name = 'Ellington Beach House'), (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Beach House 3BR Apartment', 'apartment', 'sale', 'ready', 5500000, 3, 3, 1800, 'Jumeirah Beach Residence', 'Jumeirah Beach Residence, Dubai', ARRAY['Beachfront', 'Infinity Pool', 'Spa Access'], ARRAY['Beach Club', 'Fine Dining', 'Concierge'], ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'], true, true, true, 187),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Exclusive 5BR Palm Villa', 'villa', 'rent', 'ready', 350000, 5, 6, 6500, 'Palm Jumeirah', 'Palm Jumeirah, Dubai', ARRAY['Palm Location', 'Private Beach', 'Boat Dock'], ARRAY['Butler Service', 'Housekeeping', 'Security'], ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'], true, true, true, 298),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents LIMIT 1 OFFSET 6), 'Tranquil 4BR Garden Villa', 'villa', 'sale', 'ready', 7200000, 4, 4, 3800, 'Palm Jumeirah', 'Palm Jumeirah, Dubai', ARRAY['Garden Villa', 'Peaceful Location', 'Modern Design'], ARRAY['Community Pool', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], true, false, true, 156),

-- Additional Business Bay properties
((SELECT id FROM projects WHERE name = 'Trinity Towers'), (SELECT id FROM agents LIMIT 1 OFFSET 7), 'Executive 2BR in Trinity', 'apartment', 'rent', 'ready', 120000, 2, 2, 1100, 'Business Bay', 'Business Bay, Dubai', ARRAY['Business District', 'Metro Access', 'Retail'], ARRAY['Concierge', 'Gym', 'Pool'], ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], true, false, true, 134),
((SELECT id FROM projects WHERE name = 'Trinity Towers'), (SELECT id FROM agents LIMIT 1 OFFSET 8), 'Premium 3BR Residence', 'apartment', 'sale', 'ready', 4200000, 3, 3, 1600, 'Business Bay', 'Business Bay, Dubai', ARRAY['Corner Unit', 'City Views', 'Premium Finishes'], ARRAY['Valet Parking', 'Spa', 'Fine Dining'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], true, true, true, 203),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 9), 'Modern Office Space', 'commercial', 'rent', 'ready', 220000, NULL, NULL, 1800, 'Business Bay', 'Business Bay, Dubai', ARRAY['Modern Office', 'Meeting Rooms', 'Reception'], ARRAY['Parking', 'Security', 'Elevator'], ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], true, false, true, 87),

-- Additional Dubai Silicon Oasis properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 1), 'Tech Hub 1BR Apartment', 'apartment', 'rent', 'ready', 65000, 1, 1, 650, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Near Tech Companies', 'Modern Design'], ARRAY['Gym', 'Pool', 'Cafeteria'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 76),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Executive 3BR Villa', 'villa', 'sale', 'ready', 2800000, 3, 3, 2200, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Executive Living', 'Garden', 'Quiet Area'], ARRAY['Security', 'Parking', 'School Bus'], ARRAY['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800'], true, false, true, 109),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Commercial Warehouse', 'commercial', 'rent', 'ready', 120000, NULL, NULL, 3000, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Warehouse Space', 'Loading Dock', 'Storage'], ARRAY['Security', 'Power Backup', 'Parking'], ARRAY['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'], true, false, true, 67),

-- Additional Al Barsha properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Family 5BR Villa', 'villa', 'sale', 'ready', 5500000, 5, 5, 4000, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Family Home', 'Large Garden', 'Maid Room'], ARRAY['School Nearby', 'Shopping Mall', 'Hospital'], ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], true, false, true, 145),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Student Accommodation', 'apartment', 'rent', 'ready', 38000, 1, 1, 350, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Near University', 'Furnished', 'Utilities Included'], ARRAY['Laundry', 'Study Areas', 'WiFi'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, true, 98),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 6), 'Retail Space', 'commercial', 'rent', 'ready', 180000, NULL, NULL, 600, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['High Street Location', 'Good Visibility'], ARRAY['Security', 'Cleaning', 'Utilities'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], true, false, true, 123),

-- Additional Downtown Dubai properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 7), 'Iconic Burj View 2BR', 'apartment', 'sale', 'ready', 8500000, 2, 3, 1500, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Burj Khalifa View', 'Iconic Location', 'Premium'], ARRAY['Burj Khalifa Access', 'Mall', 'Metro'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true, true, true, 267),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 8), 'Cultural District 3BR', 'apartment', 'rent', 'ready', 135000, 3, 3, 1400, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Near Dubai Opera', 'Cultural Hub'], ARRAY['Shopping', 'Dining', 'Entertainment'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 156),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 9), 'Boutique Hotel Space', 'commercial', 'sale', 'ready', 15000000, NULL, NULL, 2000, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Tourist Area', 'High Foot Traffic'], ARRAY['Security', 'Cleaning', 'Utilities'], ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'], true, true, true, 187),

-- Additional Dubai Hills properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 1), 'Luxury Hills 4BR Villa', 'villa', 'sale', 'ready', 9500000, 4, 5, 4500, 'Dubai Hills', 'Dubai Hills, Dubai', ARRAY['Hills Location', 'Mountain Views', 'Private Pool'], ARRAY['Clubhouse', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'], true, true, true, 203),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Townhouse in Dubai Hills', 'townhouse', 'sale', 'ready', 4200000, 3, 3, 2800, 'Dubai Hills', 'Dubai Hills, Dubai', ARRAY['Townhouse', 'Garden', 'Modern Design'], ARRAY['Community Facilities', 'Security'], ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'], true, false, true, 134),

-- Additional Dubai South properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Expo City 2BR Apartment', 'apartment', 'rent', 'ready', 75000, 2, 2, 900, 'Dubai South', 'Dubai South, Dubai', ARRAY['Near Expo City', 'Modern Amenities'], ARRAY['Pool', 'Gym', 'Retail'], ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'], true, false, true, 87),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Industrial Plot', 'plot', 'sale', 'ready', 8000000, NULL, NULL, 10000, 'Dubai South', 'Dubai South, Dubai', ARRAY['Industrial Zone', 'Development Potential'], ARRAY['Utilities Available', 'Road Access'], ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], true, false, true, 67),

-- Additional Deira properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Traditional 3BR Apartment', 'apartment', 'rent', 'ready', 55000, 3, 2, 1200, 'Deira', 'Deira, Dubai', ARRAY['Traditional Area', 'Affordable', 'Central Location'], ARRAY['Parking', 'Security'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], true, false, true, 76),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 6), 'Commercial Building', 'commercial', 'sale', 'ready', 25000000, NULL, NULL, 5000, 'Deira', 'Deira, Dubai', ARRAY['Commercial Building', 'Multiple Tenants', 'Good Income'], ARRAY['Security', 'Maintenance', 'Parking'], ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], true, false, true, 109);

-- Insert sample news posts/articles
INSERT INTO posts (author_id, title, content, excerpt, featured_image, images, tags, category, status, published_at, seo_title, seo_description, seo_keywords, views_count, likes_count, comments_count) VALUES
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Dubai Real Estate Market Shows Strong Q4 Growth', 'The Dubai real estate market continues to demonstrate resilience and growth in the fourth quarter, with luxury properties seeing particularly strong demand. According to recent market analysis, the average property prices have increased by 8% compared to last year, driven by both local and international investors.

Key highlights from the quarter include:
- Luxury villa prices up 12% in Dubai Hills
- Dubai Marina apartments showing 15% rental yield growth
- Business Bay commercial spaces at 95% occupancy rates

The market momentum is expected to continue into 2024, with several major developments scheduled for completion.', 'Dubai real estate market analysis showing 8% price growth in Q4 2023', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'], ARRAY['market-analysis', 'dubai-real-estate', 'q4-2023'], 'Market News', 'published', NOW() - INTERVAL '2 days', 'Dubai Real Estate Market Q4 2023 Analysis', 'Comprehensive analysis of Dubai real estate market performance in Q4 2023', ARRAY['Dubai real estate', 'market analysis', 'property prices', '2023'], 245, 12, 8),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Top 10 Dubai Neighborhoods for Investment in 2024', 'As Dubai continues to attract global investors, certain neighborhoods stand out for their investment potential and growth prospects. Our comprehensive analysis identifies the top 10 areas that offer the best combination of capital appreciation, rental yields, and development potential.

1. Dubai Marina - Premium waterfront living
2. Dubai Hills Estate - Luxury villa market
3. Business Bay - Commercial and residential hub
4. Palm Jumeirah - Iconic island development
5. Jumeirah Beach Residence - Beachfront lifestyle
6. Dubai Silicon Oasis - Technology district
7. Al Barsha - Family-friendly community
8. Downtown Dubai - Prime central location
9. Dubai South - Emerging business district
10. Dubai Festival City - Entertainment and retail hub

Each of these areas offers unique investment opportunities with strong growth potential.', 'Comprehensive guide to the top 10 Dubai neighborhoods for real estate investment in 2024', 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800', ARRAY['https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800'], ARRAY['investment-guide', 'dubai-neighborhoods', '2024-trends'], 'Investment Guide', 'published', NOW() - INTERVAL '5 days', 'Top Dubai Investment Neighborhoods 2024', 'Discover the best Dubai areas for real estate investment with growth potential', ARRAY['Dubai investment', 'neighborhoods', 'real estate', '2024'], 387, 23, 15),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Sustainable Real Estate: Dubai''s Green Building Revolution', 'Dubai is leading the Middle East in sustainable real estate development, with green building initiatives transforming the city''s skyline. From LEED-certified towers to eco-friendly villa communities, sustainability is no longer optional but essential.

Major developments incorporating green technologies:
- Solar-powered residential complexes
- Rainwater harvesting systems
- Energy-efficient HVAC systems
- Green roof installations
- Smart building automation

These initiatives not only reduce environmental impact but also offer long-term cost savings for property owners and higher property values in the premium sustainable market segment.', 'Dubai''s commitment to sustainable real estate development and green building initiatives', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', ARRAY['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'], ARRAY['sustainable-real-estate', 'green-building', 'dubai-sustainability'], 'Sustainability', 'published', NOW() - INTERVAL '7 days', 'Dubai Green Building Revolution', 'Exploring sustainable real estate developments and green initiatives in Dubai', ARRAY['sustainable real estate', 'green building', 'Dubai', 'eco-friendly'], 198, 18, 12),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Luxury Property Market: Trends and Predictions for 2024', 'The luxury property market in Dubai continues to evolve, with discerning buyers seeking unique experiences and exceptional quality. Key trends shaping the luxury segment include personalized services, smart home technology, and experiential living spaces.

Current luxury market highlights:
- Average luxury property price: AED 10M+
- Smart home integration in 85% of new luxury developments
- Personalized concierge services becoming standard
- Experiential spaces (private cinemas, wine rooms, wellness centers)
- Sustainable luxury gaining prominence

The luxury market shows no signs of slowing down, with international buyers driving demand for ultra-luxury properties.', 'Analysis of luxury property market trends and predictions for Dubai in 2024', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'], ARRAY['luxury-properties', 'market-trends', '2024-predictions'], 'Luxury Market', 'published', NOW() - INTERVAL '10 days', 'Dubai Luxury Property Trends 2024', 'Latest trends and predictions for Dubai''s luxury real estate market', ARRAY['luxury real estate', 'Dubai market', 'property trends', '2024'], 312, 27, 19),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Commercial Real Estate: Dubai''s Office Market Recovery', 'Dubai''s commercial real estate sector is experiencing a robust recovery, with office spaces in prime locations achieving record occupancy rates. The return to office trend, combined with Dubai''s business-friendly environment, is driving demand for quality commercial space.

Office market recovery indicators:
- Grade A office occupancy at 92%
- Average rental rates up 15% YoY
- Flexible workspace solutions gaining popularity
- Tech-enabled office buildings in high demand
- Business Bay emerging as preferred CBD location

The commercial sector''s recovery reflects Dubai''s position as a global business hub and investment destination.', 'Dubai commercial real estate market recovery and office space demand analysis', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], ARRAY['commercial-real-estate', 'office-market', 'dubai-recovery'], 'Commercial', 'published', NOW() - INTERVAL '12 days', 'Dubai Office Market Recovery', 'Analysis of Dubai''s commercial real estate recovery and office market trends', ARRAY['commercial real estate', 'office market', 'Dubai', 'occupancy rates'], 176, 14, 9);
INSERT INTO inquiries (property_id, agent_id, client_name, client_email, client_phone, message, status, priority) VALUES
((SELECT id FROM properties WHERE title LIKE '%Luxury 2BR Marina View%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Ahmed Hassan', 'ahmed.hassan@email.com', '+971501234567', 'I am interested in this property. Can you provide more details about the payment plan?', 'pending', 'high'),
((SELECT id FROM properties WHERE title LIKE '%Modern 4BR Townhouse%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Fatima Khan', 'fatima.khan@email.com', '+971507654321', 'Is this property still available? I would like to schedule a viewing.', 'replied', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Burj Khalifa View%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Omar Rashid', 'omar.rashid@email.com', '+971509876543', 'What is the expected appreciation rate for this property?', 'pending', 'low'),
((SELECT id FROM properties WHERE title LIKE '%Premium Office Space%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Sarah Ahmed', 'sarah.ahmed@email.com', '+971502468135', 'Can you send me the floor plan and 3D tour for this office?', 'replied', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Family 4BR Villa%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Mohammed Ali', 'mohammed.ali@email.com', '+971508642975', 'I am looking for a similar property but with 5 bedrooms. Do you have any recommendations?', 'pending', 'high'),
((SELECT id FROM properties WHERE title LIKE '%Executive 3BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Layla Mohamed', 'layla.mohamed@email.com', '+971503579246', 'Is parking included in the rent?', 'pending', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Beachfront 6BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Khalid Saeed', 'khalid.saeed@email.com', '+971501357924', 'What is the minimum rental period for this villa?', 'replied', 'high'),
((SELECT id FROM properties WHERE title LIKE '%Student Studio%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Noor Al-Mansoori', 'noor.almansoori@email.com', '+971507951357', 'Are utilities included in the rent?', 'pending', 'low');

-- Update some inquiries with replies
UPDATE inquiries SET agent_reply = 'Yes, the property is still available. I can arrange a viewing for you tomorrow at 2 PM. Please let me know if this time works for you.', status = 'replied', replied_at = NOW() WHERE client_name = 'Fatima Khan';
UPDATE inquiries SET agent_reply = 'The office space includes 2 parking spaces. I will send you the floor plans and virtual tour shortly.', status = 'replied', replied_at = NOW() WHERE client_name = 'Sarah Ahmed';
UPDATE inquiries SET agent_reply = 'The minimum rental period is 6 months for this beachfront villa. We can discuss flexible terms.', status = 'replied', replied_at = NOW() WHERE client_name = 'Khalid Saeed';

-- ============================================
-- REAL-TIME TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update property view counts
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties SET views_count = views_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_property_views_trigger AFTER INSERT ON property_views FOR EACH ROW EXECUTE FUNCTION increment_property_views();

-- Function to update property inquiry counts
CREATE OR REPLACE FUNCTION increment_property_inquiries()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties SET inquiries_count = inquiries_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_property_inquiries_trigger AFTER INSERT ON enquiries FOR EACH ROW EXECUTE FUNCTION increment_property_inquiries();

-- ============================================
-- ADDITIONAL DEMO DATA - PROPERTIES AND INQUIRIES
-- ============================================

-- Additional properties to reach 50+ total
INSERT INTO properties (project_id, agent_id, title, type, status, property_status, price, beds, baths, sqft, area, address, features, amenities, images, published, featured, verified, views_count) VALUES
-- More Dubai Marina properties
((SELECT id FROM projects WHERE name = 'Dubai Marina Mall'), (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Marina Living 1BR Studio', 'studio', 'rent', 'ready', 70000, 1, 1, 550, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Marina View', 'Compact Design'], ARRAY['Pool', 'Gym', 'Security'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, true, 67),
((SELECT id FROM projects WHERE name = 'Akoya Oxygen'), (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Waterfront 2BR Apartment', 'apartment', 'sale', 'ready', 2900000, 2, 2, 1150, 'Dubai Marina', 'Dubai Marina, Dubai', ARRAY['Waterfront', 'Balcony', 'Modern'], ARRAY['Beach Access', 'Marina', 'Concierge'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 89),

-- More Jumeirah properties
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Palm View 3BR Townhouse', 'townhouse', 'sale', 'ready', 6800000, 3, 4, 3200, 'Palm Jumeirah', 'Palm Jumeirah, Dubai', ARRAY['Palm View', 'Townhouse', 'Private Garden'], ARRAY['Beach Club', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'], true, false, true, 123),
((SELECT id FROM projects WHERE name = 'Palm Jumeirah'), (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Beachfront 6BR Estate', 'villa', 'sale', 'ready', 18500000, 6, 7, 7500, 'Palm Jumeirah', 'Palm Jumeirah, Dubai', ARRAY['Beachfront', 'Estate', 'Private Beach'], ARRAY['Butler Service', 'Chef', 'House Manager'], ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'], true, true, true, 245),

-- More Business Bay properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 6), 'Business Tower Office', 'commercial', 'rent', 'ready', 300000, NULL, NULL, 2500, 'Business Bay', 'Business Bay, Dubai', ARRAY['Business Tower', 'Executive Office', 'Meeting Rooms'], ARRAY['Concierge', 'Parking', 'Security'], ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], true, false, true, 156),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 7), 'Bay View 4BR Apartment', 'apartment', 'sale', 'ready', 5800000, 4, 4, 2100, 'Business Bay', 'Business Bay, Dubai', ARRAY['Bay View', 'Spacious', 'Premium Location'], ARRAY['Pool', 'Gym', 'Retail Access'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true, true, true, 198),

-- More Dubai Silicon Oasis properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 8), 'Tech Park 2BR Apartment', 'apartment', 'rent', 'ready', 78000, 2, 2, 850, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Tech Park', 'Modern Amenities'], ARRAY['Gym', 'Cafeteria', 'Security'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 87),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 9), 'Innovation District Villa', 'villa', 'sale', 'ready', 3200000, 3, 3, 2400, 'Dubai Silicon Oasis', 'Dubai Silicon Oasis, Dubai', ARRAY['Innovation District', 'Garden', 'Modern'], ARRAY['Security', 'Parking', 'Community Facilities'], ARRAY['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800'], true, false, true, 134),

-- More Al Barsha properties
(NULL, (SELECT id FROM agents LIMIT 1), 'Barsha Heights 3BR', 'apartment', 'rent', 'ready', 110000, 3, 3, 1300, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Heights Location', 'City Views'], ARRAY['Pool', 'Gym', 'Shopping'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], true, false, true, 145),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Family Compound Villa', 'villa', 'sale', 'ready', 8800000, 5, 6, 5500, 'Al Barsha', 'Al Barsha, Dubai', ARRAY['Compound Villa', 'Large Family', 'Garden'], ARRAY['Security', 'Maid Quarters', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], true, true, true, 203),

-- More Downtown Dubai properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Opera District Loft', 'apartment', 'rent', 'ready', 180000, 2, 2, 1200, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Loft Style', 'Cultural District'], ARRAY['Dining', 'Entertainment', 'Metro'], ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'], true, false, true, 167),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Iconic Tower 3BR', 'apartment', 'sale', 'ready', 14500000, 3, 4, 2200, 'Downtown Dubai', 'Downtown Dubai, Dubai', ARRAY['Iconic Building', 'Premium Views'], ARRAY['Concierge', 'Spa', 'Fine Dining'], ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'], true, true, true, 278),

-- More Dubai Hills properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Hills Estate 5BR Villa', 'villa', 'sale', 'ready', 11200000, 5, 6, 5200, 'Dubai Hills', 'Dubai Hills, Dubai', ARRAY['Estate Living', 'Mountain Views', 'Private Pool'], ARRAY['Clubhouse', 'Tennis', 'Security'], ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'], true, true, true, 234),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 6), 'Hills Townhouse', 'townhouse', 'sale', 'ready', 3800000, 3, 3, 2600, 'Dubai Hills', 'Dubai Hills, Dubai', ARRAY['Townhouse', 'Garden', 'Community'], ARRAY['Pool', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'], true, false, true, 156),

-- More Dubai South properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 7), 'South District 1BR', 'apartment', 'rent', 'ready', 55000, 1, 1, 650, 'Dubai South', 'Dubai South, Dubai', ARRAY['Affordable', 'Modern Amenities'], ARRAY['Pool', 'Gym', 'Retail'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], true, false, true, 98),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 8), 'Expo City Office', 'commercial', 'rent', 'ready', 200000, NULL, NULL, 1500, 'Dubai South', 'Dubai South, Dubai', ARRAY['Expo Location', 'Modern Office'], ARRAY['Parking', 'Security', 'Cafeteria'], ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'], true, false, true, 123),

-- More Deira properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 9), 'Traditional 2BR', 'apartment', 'rent', 'ready', 48000, 2, 2, 1000, 'Deira', 'Deira, Dubai', ARRAY['Traditional Area', 'Central Location'], ARRAY['Parking', 'Security'], ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], true, false, true, 87),
(NULL, (SELECT id FROM agents LIMIT 1), 'Heritage Building Office', 'commercial', 'sale', 'ready', 8500000, NULL, NULL, 1200, 'Deira', 'Deira, Dubai', ARRAY['Heritage Building', 'Character'], ARRAY['Security', 'Maintenance'], ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], true, false, true, 145),

-- More Sharjah properties
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Sharjah Marina 3BR', 'apartment', 'sale', 'ready', 1800000, 3, 3, 1400, 'Sharjah', 'Sharjah, UAE', ARRAY['Marina View', 'Family Friendly'], ARRAY['Pool', 'Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], true, false, true, 134),
(NULL, (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Sharjah Commercial Space', 'commercial', 'rent', 'ready', 90000, NULL, NULL, 800, 'Sharjah', 'Sharjah, UAE', ARRAY['Commercial Area', 'Good Location'], ARRAY['Security', 'Parking'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], true, false, true, 98);

-- Insert additional inquiries for agent portal
INSERT INTO inquiries (property_id, agent_id, client_name, client_email, client_phone, message, status, priority) VALUES
((SELECT id FROM properties WHERE title LIKE '%Elegant 3BR with Marina Views%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 1), 'Maria Gonzalez', 'maria.gonzalez@email.com', '+971501234577', 'I am interested in this property. Can you tell me more about the building amenities?', 'pending', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Beachfront 4BR Villa%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 2), 'Robert Chen', 'robert.chen@email.com', '+971501234578', 'Is this property available for viewing this weekend?', 'replied', 'high'),
((SELECT id FROM properties WHERE title LIKE '%Beach House 3BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 3), 'Emma Wilson', 'emma.wilson@email.com', '+971501234579', 'What is the maintenance fee for this apartment?', 'pending', 'low'),
((SELECT id FROM properties WHERE title LIKE '%Exclusive 5BR Palm Villa%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 4), 'Ahmed Al-Rashid', 'ahmed.alrashid@email.com', '+971501234580', 'Can you provide the floor plan for this villa?', 'replied', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Executive 2BR in Trinity%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 5), 'Sophie Laurent', 'sophie.laurent@email.com', '+971501234581', 'Is parking included in the rent?', 'pending', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Tech Hub 1BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 6), 'David Kim', 'david.kim@email.com', '+971501234582', 'Are pets allowed in this building?', 'replied', 'low'),
((SELECT id FROM properties WHERE title LIKE '%Luxury Hills 4BR Villa%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 7), 'Isabella Rossi', 'isabella.rossi@email.com', '+971501234583', 'What schools are nearby this property?', 'pending', 'high'),
((SELECT id FROM properties WHERE title LIKE '%Expo City 2BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 8), 'Mohammed Al-Zahra', 'mohammed.alzahra@email.com', '+971501234584', 'Can I schedule a virtual tour?', 'replied', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Traditional 3BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1 OFFSET 9), 'Lisa Thompson', 'lisa.thompson@email.com', '+971501234585', 'Is this area safe for families?', 'pending', 'normal'),
((SELECT id FROM properties WHERE title LIKE '%Iconic Burj View 2BR%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'James Mitchell', 'james.mitchell@email.com', '+971501234586', 'What is the expected appreciation for this property?', 'pending', 'high');

-- Update some additional inquiries with replies
UPDATE inquiries SET agent_reply = 'Yes, the property is available for viewing. I can arrange a time for you this Saturday at 11 AM.', status = 'replied', replied_at = NOW() WHERE client_name = 'Robert Chen';
UPDATE inquiries SET agent_reply = 'The floor plans are available. I will send them to you shortly along with additional property details.', status = 'replied', replied_at = NOW() WHERE client_name = 'Ahmed Al-Rashid';
UPDATE inquiries SET agent_reply = 'Yes, covered parking is included in the rental price for this apartment.', status = 'replied', replied_at = NOW() WHERE client_name = 'Sophie Laurent';
UPDATE inquiries SET agent_reply = 'Yes, small pets are allowed with approval from building management and additional deposit.', status = 'replied', replied_at = NOW() WHERE client_name = 'David Kim';
UPDATE inquiries SET agent_reply = 'Several excellent schools are within 5-10 minutes drive including Dubai International School and Dubai American Academy.', status = 'replied', replied_at = NOW() WHERE client_name = 'Isabella Rossi';
UPDATE inquiries SET agent_reply = 'Yes, I can arrange a virtual tour for you. Please let me know your preferred time.', status = 'replied', replied_at = NOW() WHERE client_name = 'Mohammed Al-Zahra';

-- Insert sample enquiries (customer inquiries)
INSERT INTO enquiries (user_id, property_id, agent_id, name, email, phone, message, status, priority) VALUES
((SELECT id FROM profiles WHERE full_name = 'John Smith'), (SELECT id FROM properties WHERE title LIKE '%Luxury 2BR Marina View%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'John Smith', 'john.smith@email.com', '+971501234567', 'I would like to inquire about availability and pricing for this property.', 'new', 'medium'),
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), (SELECT id FROM properties WHERE title LIKE '%Modern 4BR Townhouse%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Sarah Ahmed', 'sarah.ahmed@email.com', '+971507654321', 'Can you provide more details about the neighborhood and nearby amenities?', 'contacted', 'high'),
((SELECT id FROM profiles WHERE full_name = 'Mohammed Ali'), (SELECT id FROM properties WHERE title LIKE '%Burj Khalifa View%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Mohammed Ali', 'mohammed.ali@email.com', '+971509876543', 'I am interested in scheduling a viewing for this property.', 'interested', 'high');

-- Insert sample property views
INSERT INTO property_views (property_id, user_id, session_id, viewed_at, source) VALUES
((SELECT id FROM properties WHERE title LIKE '%Luxury 2BR Marina View%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'John Smith'), 'session_123', NOW(), 'website'),
((SELECT id FROM properties WHERE title LIKE '%Modern 4BR Townhouse%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'session_456', NOW() - INTERVAL '1 hour', 'mobile_app'),
((SELECT id FROM properties WHERE title LIKE '%Burj Khalifa View%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'Mohammed Ali'), 'session_789', NOW() - INTERVAL '2 hours', 'website');

-- Insert sample saved properties
INSERT INTO saved_properties (user_id, property_id, created_at, notes) VALUES
((SELECT id FROM profiles WHERE full_name = 'John Smith'), (SELECT id FROM properties WHERE title LIKE '%Luxury 2BR Marina View%' LIMIT 1), NOW(), 'Perfect for investment'),
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), (SELECT id FROM properties WHERE title LIKE '%Modern 4BR Townhouse%' LIMIT 1), NOW() - INTERVAL '1 day', 'Family home option');

-- Insert sample saved searches
INSERT INTO saved_searches (user_id, name, filters, created_at, last_run) VALUES
((SELECT id FROM profiles WHERE full_name = 'John Smith'), 'Marina Apartments', '{"area": "Dubai Marina", "type": "apartment", "price_max": 5000000}', NOW(), NOW()),
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Family Villas', '{"type": "villa", "beds_min": 4, "area": "Jumeirah"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- Insert sample viewings
INSERT INTO viewings (property_id, enquiry_id, agent_id, scheduled_date, status, notes) VALUES
((SELECT id FROM properties WHERE title LIKE '%Luxury 2BR Marina View%' LIMIT 1), (SELECT id FROM enquiries LIMIT 1), (SELECT id FROM agents LIMIT 1), NOW() + INTERVAL '3 days', 'scheduled', 'Morning viewing preferred'),
((SELECT id FROM properties WHERE title LIKE '%Modern 4BR Townhouse%' LIMIT 1), (SELECT id FROM enquiries LIMIT 1 OFFSET 1), (SELECT id FROM agents LIMIT 1), NOW() + INTERVAL '5 days', 'confirmed', 'Family will attend');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data, read_at) VALUES
((SELECT id FROM profiles WHERE full_name = 'John Smith'), 'price_change', 'Property Price Reduced', 'The price for Luxury 2BR Marina View Apartment has been reduced by 5%.', '{"property_id": "123", "old_price": 3200000, "new_price": 3040000}', NULL),
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'enquiry', 'Agent Response', 'Your inquiry about Modern 4BR Townhouse has been answered.', '{"inquiry_id": "456", "property_id": "789"}', NOW() - INTERVAL '1 hour');

-- Insert sample post likes
INSERT INTO post_likes (post_id, user_id) VALUES
((SELECT id FROM posts WHERE title LIKE '%Dubai Real Estate Market%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'John Smith')),
((SELECT id FROM posts WHERE title LIKE '%Top 10 Dubai Neighborhoods%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed')),
((SELECT id FROM posts WHERE title LIKE '%Sustainable Real Estate%' LIMIT 1), (SELECT id FROM profiles WHERE full_name = 'Mohammed Ali'));

-- Insert sample enquiry activities
INSERT INTO enquiry_activities (enquiry_id, agent_id, activity_type, description, metadata) VALUES
((SELECT id FROM enquiries LIMIT 1), (SELECT id FROM agents LIMIT 1), 'note', 'Viewed property details', '{"property_id": "123"}'),
((SELECT id FROM enquiries LIMIT 1), (SELECT id FROM agents LIMIT 1), 'call', 'Called client', '{"duration": "15 minutes"}');

-- Insert sample enquiry messages
INSERT INTO enquiry_messages (enquiry_id, sender_id, sender_type, message, message_type, created_at) VALUES
((SELECT id FROM enquiries LIMIT 1), '47e9db54-31df-4bbf-9d15-1fcacf91b3d4', 'agent', 'Hello! I would be happy to provide more details. The property is currently available.', 'text', NOW() - INTERVAL '1 hour');

-- ============================================
-- ADDITIONAL ENQUIRIES AND DEMO CONTENT
-- ============================================

-- Insert sample enquiries (note: there are two enquiry tables - enquiries and enquiries - this is for the second one)
INSERT INTO enquiries (user_id, property_id, agent_id, name, email, phone, message, status, priority) VALUES
((SELECT id FROM profiles WHERE full_name = 'John Smith'), (SELECT id FROM properties WHERE title LIKE '%Spacious 3BR with City View%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'John Smith', 'john.smith@email.com', '+971501234567', 'Is this property still available? I would like to schedule a viewing.', 'new', 'high'),
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), (SELECT id FROM properties WHERE title LIKE '%Premium 3BR Penthouse%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'Sarah Ahmed', 'sarah.ahmed@email.com', '+971507654321', 'Can you send me the floor plans and specifications?', 'contacted', 'medium');

-- Insert sample enquiry activities for the second enquiries table
INSERT INTO enquiry_activities (enquiry_id, agent_id, activity_type, description, metadata) VALUES
((SELECT id FROM enquiries WHERE message LIKE '%Is this property still available%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'note', 'Submitted property inquiry', '{"property_id": "456"}'),
((SELECT id FROM enquiries WHERE message LIKE '%Can you send me the floor plans%' LIMIT 1), (SELECT id FROM agents LIMIT 1), 'note', 'Requested floor plans', '{"property_id": "789"}');

-- Insert sample enquiry messages for the second enquiries table
INSERT INTO enquiry_messages (enquiry_id, sender_id, sender_type, message, message_type, created_at) VALUES
((SELECT id FROM enquiries WHERE message LIKE '%Is this property still available%' LIMIT 1), '47e9db54-31df-4bbf-9d15-1fcacf91b3d4', 'agent', 'Yes, the property is still available. I can arrange a viewing for tomorrow morning.', 'text', NOW() - INTERVAL '2 hours');

-- ============================================
-- SAMPLE NEWS POSTS AND DEMO CONTENT
-- ============================================

-- Insert additional news posts
INSERT INTO posts (author_id, title, content, excerpt, featured_image, images, tags, category, status, published_at, seo_title, seo_description, seo_keywords, views_count, likes_count, comments_count) VALUES
((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Dubai Property Market Analysis: Investment Trends 2024', 'A comprehensive analysis of Dubai''s property market reveals strong investment potential across various segments. The market has shown resilience despite global economic challenges, with key areas demonstrating consistent growth and high rental yields.

Investment hotspots identified:
- Dubai Silicon Oasis: 12% annual growth
- Dubai South: Emerging business district with Expo City influence
- Dubai Hills Estate: Premium residential development
- Business Bay: Commercial and mixed-use opportunities

The analysis covers rental yields, capital appreciation potential, and risk factors for each area.', 'Comprehensive Dubai property market analysis revealing strong investment opportunities and growth areas for 2024', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'], ARRAY['market-analysis', 'investment-trends', '2024-analysis'], 'Market Analysis', 'published', NOW() - INTERVAL '3 days', 'Dubai Property Investment Trends 2024', 'Detailed analysis of Dubai property market trends and investment opportunities', ARRAY['Dubai property', 'investment analysis', 'market trends', '2024'], 456, 34, 22),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Luxury Villas in Dubai: Price vs Value Analysis', 'Dubai''s luxury villa market offers exceptional value for discerning buyers. Our analysis compares pricing across different areas and villa types, revealing surprising insights about where true value lies.

Key findings:
- Dubai Hills Estate villas offer 15% better value than Palm Jumeirah
- Arabian Ranches provides excellent family-oriented luxury living
- Emirates Hills maintains premium positioning with strong appreciation

The report includes detailed price per square foot analysis, amenity comparisons, and future value projections.', 'Detailed analysis comparing luxury villa prices and value propositions across Dubai''s premium residential areas', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'], ARRAY['luxury-villas', 'price-analysis', 'value-comparison'], 'Luxury Market', 'published', NOW() - INTERVAL '6 days', 'Dubai Luxury Villas Price Analysis', 'Comprehensive comparison of luxury villa pricing and value across Dubai', ARRAY['luxury villas', 'Dubai pricing', 'property value', 'real estate analysis'], 387, 28, 19),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Commercial Real Estate: Dubai''s Emerging Business Districts', 'Dubai''s commercial real estate landscape is evolving rapidly with new business districts offering modern office spaces and mixed-use developments. Our comprehensive guide covers the key areas driving commercial growth.

Emerging districts covered:
- Dubai South: Home to Dubai World Expo 2020 legacy
- Dubai Investment Park: Logistics and industrial hub
- Dubai Airport Free Zone: Aviation and logistics focused
- Dubai Media City: Creative and media industries

Each district offers unique advantages for businesses considering relocation or expansion in Dubai.', 'Guide to Dubai''s emerging commercial districts and their unique business advantages', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], ARRAY['commercial-real-estate', 'business-districts', 'dubai-commercial'], 'Commercial', 'published', NOW() - INTERVAL '9 days', 'Dubai Emerging Business Districts', 'Comprehensive guide to Dubai''s commercial real estate opportunities', ARRAY['commercial real estate', 'Dubai business districts', 'office spaces', 'commercial property'], 298, 21, 16),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Dubai Marina: Complete Neighborhood Guide 2024', 'Dubai Marina remains one of Dubai''s most sought-after residential and lifestyle destinations. This comprehensive guide covers everything from property types and pricing to lifestyle amenities and future developments.

Guide highlights:
- Residential options: From studios to penthouses
- Marina lifestyle: Yacht clubs, beach clubs, and water activities
- Dining and entertainment: Over 200 restaurants and bars
- Transportation: Metro access and marina transport
- Future developments: Major projects in planning stages

The guide includes detailed maps, price ranges, and expert recommendations for different buyer profiles.', 'Complete guide to Dubai Marina neighborhood including property options, lifestyle amenities, and future developments', 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800', ARRAY['https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800'], ARRAY['dubai-marina', 'neighborhood-guide', '2024-guide'], 'Neighborhood Guide', 'published', NOW() - INTERVAL '14 days', 'Dubai Marina Complete Guide 2024', 'Comprehensive neighborhood guide for Dubai Marina living and property investment', ARRAY['Dubai Marina', 'neighborhood guide', 'property guide', 'Dubai lifestyle'], 523, 41, 28),

((SELECT id FROM profiles WHERE full_name = 'Sarah Ahmed'), 'Off-Plan vs Ready Properties: Dubai Market Comparison', 'Understanding the differences between off-plan and ready properties is crucial for Dubai property investors. This analysis compares both options across various criteria to help buyers make informed decisions.

Comparison factors:
- Pricing and payment plans
- Delivery timelines and risks
- Quality control and finishing standards
- Capital appreciation potential
- Rental yield expectations
- Developer reputation and track record

The analysis includes case studies from recent Dubai developments and expert insights on market timing.', 'Detailed comparison between off-plan and ready properties in Dubai, including pricing, risks, and investment potential', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', ARRAY['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'], ARRAY['off-plan', 'ready-properties', 'market-comparison'], 'Investment Guide', 'published', NOW() - INTERVAL '18 days', 'Off-Plan vs Ready Properties Dubai', 'Comprehensive comparison of off-plan and ready properties in Dubai market', ARRAY['off-plan properties', 'ready properties', 'Dubai real estate', 'investment comparison'], 412, 31, 24);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Basic policies (simplified for demo)
CREATE POLICY "Public read access" ON properties FOR SELECT USING (published = true);
CREATE POLICY "Agent full access to their properties" ON properties FOR ALL USING (agent_id IN (SELECT user_id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Users can view their own enquiries" ON enquiries FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Agents can view enquiries for their properties" ON enquiries FOR SELECT USING (agent_id IN (SELECT user_id FROM agents WHERE user_id = auth.uid()));

-- ============================================
-- FINAL CLEANUP AND OPTIMIZATION
-- ============================================

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE profiles;
ANALYZE agents;
ANALYZE developers;
ANALYZE projects;
ANALYZE properties;
ANALYZE enquiries;
ANALYZE enquiries;
ANALYZE property_views;
ANALYZE saved_properties;

-- Enable real-time for tables
ALTER TABLE properties REPLICA IDENTITY FULL;
ALTER TABLE enquiries REPLICA IDENTITY FULL;
ALTER TABLE agents REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;