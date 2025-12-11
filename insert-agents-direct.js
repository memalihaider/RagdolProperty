const fs = require('fs');
const https = require('https');

// Read env
const env = require('dotenv').config({ path: '/Users/macbookpro/Desktop/ragdol/.env.local' }).parsed;

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('[Script] Supabase URL:', SUPABASE_URL);
console.log('[Script] Service Role Key (first 20 chars):', SERVICE_ROLE_KEY.substring(0, 20));

const agents = [
  {
    title: 'Senior Real Estate Specialist',
    brokerage: 'Premium Realty Group',
    experience_years: 12,
    rating: 4.8,
    review_count: 287,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    whatsapp: '971234567890',
    approved: true
  },
  {
    title: 'Luxury Property Consultant',
    brokerage: 'Elite Estates Dubai',
    experience_years: 10,
    rating: 4.7,
    review_count: 243,
    profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    whatsapp: '971234567891',
    approved: true
  },
  {
    title: 'Investment Property Expert',
    brokerage: 'Global Property Solutions',
    experience_years: 15,
    rating: 4.9,
    review_count: 312,
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    whatsapp: '971234567892',
    approved: true
  },
  {
    title: 'Dubai Marina Specialist',
    brokerage: 'Marina Realty Partners',
    experience_years: 9,
    rating: 4.6,
    review_count: 198,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    whatsapp: '971234567893',
    approved: true
  },
  {
    title: 'Villa & Residential Expert',
    brokerage: 'Desert Oasis Properties',
    experience_years: 14,
    rating: 4.8,
    review_count: 267,
    profile_image: 'https://images.unsplash.com/photo-1517070213202-1e1ceb69effa?w=400&h=400&fit=crop',
    whatsapp: '971234567894',
    approved: true
  }
];

async function insertAgents() {
  try {
    console.log('[Script] Attempting to insert agents using anon key...');
    
    // Try with anon key first
    const response = await fetch(`${SUPABASE_URL}/rest/v1/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(agents)
    });
    
    console.log('[Script] Response status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('[Script] ✅ Success! Inserted agents:', data.length);
      console.log('[Script] Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('[Script] ❌ Error:', data);
    }
  } catch (error) {
    console.error('[Script] Exception:', error.message);
  }
}

insertAgents();
