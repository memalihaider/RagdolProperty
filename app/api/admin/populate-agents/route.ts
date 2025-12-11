import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Missing config' }, { status: 500 })
    }

    // Execute direct SQL via Supabase RPC or REST
    const agents = [
      {
        title: 'Senior Real Estate Consultant',
        office: 'Downtown Dubai Office',
        license_no: 'RERA-AG-12345',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Expert in luxury properties with 15+ years of experience.',
        areas: ['Downtown Dubai', 'Dubai Marina'],
        location: 'Dubai, UAE',
        whatsapp: '+971501234567',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        rating: 4.8,
        review_count: 245,
        experience_years: 15,
        approved: true,
        verified: true,
      },
      {
        title: 'Real Estate Specialist',
        office: 'Marina Mall Office',
        license_no: 'RERA-AG-12346',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Passionate about matching clients with their dream homes.',
        areas: ['Dubai Marina', 'Emirates Hills'],
        location: 'Dubai, UAE',
        whatsapp: '+971509876543',
        profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        rating: 4.9,
        review_count: 312,
        experience_years: 12,
        approved: true,
        verified: true,
      },
      {
        title: 'Property Investment Advisor',
        office: 'Business Bay Office',
        license_no: 'RERA-AG-12347',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Specializes in investment properties and off-plan developments.',
        areas: ['Business Bay', 'Dubai South'],
        location: 'Dubai, UAE',
        whatsapp: '+971505555555',
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        rating: 4.7,
        review_count: 189,
        experience_years: 10,
        approved: true,
        verified: true,
      },
      {
        title: 'Luxury Villa Specialist',
        office: 'Emirates Hills Office',
        license_no: 'RERA-AG-12348',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Dedicated to finding perfect luxury villas.',
        areas: ['Emirates Hills', 'Arabian Ranches'],
        location: 'Dubai, UAE',
        whatsapp: '+971504444444',
        profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        rating: 4.9,
        review_count: 278,
        experience_years: 14,
        approved: true,
        verified: true,
      },
      {
        title: 'Commercial Properties Expert',
        office: 'Downtown Office',
        license_no: 'RERA-AG-12349',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Expert in commercial real estate and business opportunities.',
        areas: ['Business Bay', 'Downtown Dubai'],
        location: 'Dubai, UAE',
        whatsapp: '+971503333333',
        profile_image: 'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400',
        rating: 4.6,
        review_count: 156,
        experience_years: 9,
        approved: true,
        verified: true,
      },
    ]

    // Post each agent
    const results = []
    for (const agent of agents) {
      const response = await fetch(`${url}/rest/v1/agents`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(agent),
      })

      const data = await response.json()
      results.push({ agent: agent.title, status: response.status, data })
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
