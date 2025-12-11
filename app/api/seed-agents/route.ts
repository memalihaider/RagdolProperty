import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    // Insert agents directly via Supabase REST API with service role
    const agents = [
      {
        title: 'Senior Real Estate Consultant',
        office: 'Downtown Dubai Office',
        license_no: 'RERA-AG-12345',
        brokerage: 'Luxury Properties Dubai',
        bio: 'Expert in luxury properties with 15+ years of experience. Specializing in villas and penthouses.',
        areas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah'],
        location: 'Dubai, UAE',
        whatsapp: '+971501234567',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
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
        bio: 'Passionate about matching clients with their dream homes. Expertise in residential and commercial properties.',
        areas: ['Dubai Marina', 'Emirates Hills', 'Business Bay'],
        location: 'Dubai, UAE',
        whatsapp: '+971509876543',
        profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
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
        bio: 'Specializes in investment properties and off-plan developments. Fluent in English, Arabic, and Mandarin.',
        areas: ['Business Bay', 'Dubai Creek Harbour', 'Dubai South'],
        location: 'Dubai, UAE',
        whatsapp: '+971505555555',
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
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
        bio: 'Dedicated to finding perfect luxury villas for discerning clients. Multi-property portfolio expertise.',
        areas: ['Emirates Hills', 'Arabian Ranches', 'Jumeirah'],
        location: 'Dubai, UAE',
        whatsapp: '+971504444444',
        profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
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
        bio: 'Expert in commercial real estate, retail spaces, and business opportunities throughout Dubai.',
        areas: ['Business Bay', 'Downtown Dubai', 'JBR'],
        location: 'Dubai, UAE',
        whatsapp: '+971503333333',
        profile_image: 'https://images.unsplash.com/photo-1500636136919-5a2f53fcf973?w=400&q=80',
        rating: 4.6,
        review_count: 156,
        experience_years: 9,
        approved: true,
        verified: true,
      },
    ]

    // Insert agents via REST API
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/agents`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(agents),
    })

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text()
      console.error('Insert error:', errorText)
      return NextResponse.json(
        { error: 'Failed to insert agents', details: errorText },
        { status: insertResponse.status }
      )
    }

    const insertedAgents = await insertResponse.json()

    // Get all agent IDs
    const agentIds = insertedAgents.map((a: any) => a.id)

    // Assign agents to properties
    if (agentIds.length > 0) {
      // Update properties with agents based on type
      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/properties?agent_id=is.null`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agent_id: agentIds[0] }),
        }
      )

      if (!updateResponse.ok) {
        console.warn('Could not assign agents to properties')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded agents',
      agents_inserted: insertedAgents?.length || 0,
      agents: insertedAgents,
    })
  } catch (error: any) {
    console.error('Error seeding agents:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
