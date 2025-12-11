'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params
    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('properties')
      .update({
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
        images: body.images,
        image_url: body.image_url,
        features: body.features,
        amenities: body.amenities,
        agent_id: body.agent_id,
        published: body.published,
        featured: body.featured,
        verified: body.verified,
        furnishing: body.furnishing,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .select()

    if (error) {
      console.error('Error updating property:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ property: data?.[0] })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params
    const supabase = getServiceRoleClient() as any

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)

    if (error) {
      console.error('Error deleting property:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        agent:agents(id, title, profile_image, whatsapp, profiles:profiles(full_name))
      `)
      .eq('id', propertyId)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ property: data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
