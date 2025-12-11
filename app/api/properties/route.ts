import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

// GET /api/properties - Get all properties with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const area = searchParams.get('area')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const beds = searchParams.get('beds')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')

    let query = supabase
      .from('properties')
      .select(`
        *,
        agents:agents(*, profiles:profiles(*)),
        developers:developers(*),
        projects:projects(*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (area) {
      query = query.ilike('area', `%${area}%`)
    }

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }

    if (minPrice) {
      query = query.gte('price', parseInt(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice))
    }

    if (beds) {
      query = query.eq('beds', parseInt(beds))
    }

    if (featured !== null) {
      query = query.eq('featured', featured === 'true')
    }

    if (published !== null) {
      query = query.eq('published', published === 'true')
    }

    const { data: properties, error, count } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }

    return NextResponse.json({
      properties: properties || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const body = await request.json()

    const {
      project_id,
      developer_id,
      agent_id,
      title,
      slug,
      description,
      short_description,
      type,
      status = 'sale',
      property_status = 'ready',
      price,
      original_price,
      currency = 'AED',
      price_per_sqft,
      beds,
      baths,
      sqft,
      plot_size,
      built_up_area,
      parking_spaces,
      floor_number,
      total_floors,
      year_built,
      furnishing,
      images,
      image_url,
      floorplans,
      virtual_tour_url,
      video_url,
      features,
      amenities,
      address,
      city = 'Dubai',
      area,
      district,
      location,
      coords,
      neighborhood,
      landmark,
      published = true,
      featured = false,
      premium = false,
      urgent = false,
      verified = true,
      views_count = 0,
      favorites_count = 0,
      inquiries_count = 0,
      seo_title,
      seo_description,
      seo_keywords,
      meta_data
    } = body

    // Validate required fields
    if (!title || !price || !agent_id) {
      return NextResponse.json({
        error: 'title, price, and agent_id are required'
      }, { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const propertyData: PropertyInsert = {
      project_id,
      developer_id,
      agent_id,
      title,
      slug: finalSlug,
      description,
      short_description,
      type,
      status,
      property_status,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      currency,
      price_per_sqft: price_per_sqft ? parseFloat(price_per_sqft) : null,
      beds: beds ? parseInt(beds) : null,
      baths: baths ? parseInt(baths) : null,
      sqft: sqft ? parseInt(sqft) : null,
      plot_size: plot_size ? parseInt(plot_size) : null,
      built_up_area: built_up_area ? parseInt(built_up_area) : null,
      parking_spaces: parking_spaces ? parseInt(parking_spaces) : null,
      floor_number: floor_number ? parseInt(floor_number) : null,
      total_floors: total_floors ? parseInt(total_floors) : null,
      year_built: year_built ? parseInt(year_built) : null,
      furnishing,
      images,
      image_url,
      floorplans,
      virtual_tour_url,
      video_url,
      features,
      amenities,
      address,
      city,
      area,
      district,
      location,
      coords,
      neighborhood,
      landmark,
      published,
      featured,
      premium,
      urgent,
      verified,
      views_count,
      favorites_count,
      inquiries_count,
      seo_title,
      seo_description,
      seo_keywords,
      meta_data
    }

    const { data: property, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select(`
        *,
        agents:agents(*, profiles:profiles(*)),
        developers:developers(*),
        projects:projects(*)
      `)
      .single()

    if (error) {
      console.error('Error creating property:', error)
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
    }

    return NextResponse.json({ property }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}