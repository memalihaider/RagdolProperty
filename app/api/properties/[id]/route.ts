import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

// GET /api/properties/[id] - Get a specific property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        agents:agents(*, profiles:profiles(*)),
        developers:developers(*),
        projects:projects(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }
      console.error('Error fetching property:', error)
      return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
    }

    // Increment view count (commented out - function may not exist)
    // await supabase.rpc('increment_property_views', { property_id: id })

    return NextResponse.json({ property })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/properties/[id] - Update a specific property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params
    const body = await request.json()

    const updateData: PropertyUpdate = {}

    // Only include fields that are provided
    const allowedFields = [
      'project_id', 'developer_id', 'agent_id', 'title', 'slug', 'description',
      'short_description', 'type', 'status', 'property_status', 'price',
      'original_price', 'currency', 'price_per_sqft', 'beds', 'baths', 'sqft',
      'plot_size', 'built_up_area', 'parking_spaces', 'floor_number', 'total_floors',
      'year_built', 'furnishing', 'images', 'image_url', 'floorplans',
      'virtual_tour_url', 'video_url', 'features', 'amenities', 'address',
      'city', 'area', 'district', 'location', 'coords', 'neighborhood',
      'landmark', 'published', 'featured', 'premium', 'urgent', 'verified',
      'seo_title', 'seo_description', 'seo_keywords', 'meta_data'
    ]

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        const typedKey = key as keyof PropertyUpdate
        if (key === 'price' || key === 'original_price' || key === 'price_per_sqft') {
          updateData[typedKey] = (body[key] ? parseFloat(body[key]) : undefined) as any
        } else if (['beds', 'baths', 'sqft', 'plot_size', 'built_up_area', 'parking_spaces', 'floor_number', 'total_floors', 'year_built', 'views_count', 'favorites_count', 'inquiries_count'].includes(key)) {
          updateData[typedKey] = (body[key] ? parseInt(body[key]) : undefined) as any
        } else if (['published', 'featured', 'premium', 'urgent', 'verified'].includes(key)) {
          updateData[typedKey] = Boolean(body[key]) as any
        } else {
          updateData[typedKey] = body[key] as any
        }
      }
    })

    const { data: property, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        agents:agents(*, profiles:profiles(*)),
        developers:developers(*),
        projects:projects(*)
      `)
      .single()

    if (error) {
      console.error('Error updating property:', error)
      return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
    }

    return NextResponse.json({ property })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/properties/[id] - Delete a specific property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Property deleted successfully' })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}