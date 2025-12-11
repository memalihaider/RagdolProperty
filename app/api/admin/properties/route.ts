'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    const supabase = getServiceRoleClient() as any
    
    let query = supabase
      .from('properties')
      .select(`
        *,
        agent:agents(id, title, profile_image, whatsapp, profiles:profiles(full_name))
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      properties: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('properties')
      .insert([{
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        property_status: body.property_status,
        price: body.price,
        currency: body.currency,
        beds: body.beds,
        baths: body.baths,
        sqft: body.sqft,
        address: body.address,
        city: body.city,
        area: body.area,
        location: body.location,
        images: body.images || [],
        image_url: body.image_url,
        features: body.features || [],
        amenities: body.amenities || [],
        agent_id: body.agent_id,
        published: body.published !== false,
        featured: body.featured || false,
        verified: body.verified !== false,
        furnishing: body.furnishing
      }])
      .select()

    if (error) {
      console.error('Error creating property:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ property: data?.[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
