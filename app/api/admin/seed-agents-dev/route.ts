import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    // This endpoint is NOT secure and should only be used for development/seeding
    // Do NOT use this in production
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const agents = [
      {
        title: 'Senior Real Estate Specialist',
        brokerage: 'Premium Realty Group',
        experience_years: 12,
        rating: 4.8,
        review_count: 287,
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        whatsapp: '+971234567890',
        approved: true,
      },
      {
        title: 'Luxury Property Consultant',
        brokerage: 'Elite Estates Dubai',
        experience_years: 10,
        rating: 4.7,
        review_count: 243,
        profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        whatsapp: '+971234567891',
        approved: true,
      },
      {
        title: 'Investment Property Expert',
        brokerage: 'Global Property Solutions',
        experience_years: 15,
        rating: 4.9,
        review_count: 312,
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        whatsapp: '+971234567892',
        approved: true,
      },
      {
        title: 'Dubai Marina Specialist',
        brokerage: 'Marina Realty Partners',
        experience_years: 9,
        rating: 4.6,
        review_count: 198,
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        whatsapp: '+971234567893',
        approved: true,
      },
      {
        title: 'Villa & Residential Expert',
        brokerage: 'Desert Oasis Properties',
        experience_years: 14,
        rating: 4.8,
        review_count: 267,
        profile_image: 'https://images.unsplash.com/photo-1517070213202-1e1ceb69effa?w=400&h=400&fit=crop',
        whatsapp: '+971234567894',
        approved: true,
      }
    ];

    const { data, error } = await supabase
      .from('agents')
      .insert(agents)
      .select();

    if (error) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: `Inserted ${data?.length || 0} agents`,
      agents: data
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
