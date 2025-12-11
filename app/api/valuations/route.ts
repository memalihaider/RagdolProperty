import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

// GET /api/valuations - Get all property valuations
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    let query = supabase
      .from('property_valuations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/valuations - Create a new property valuation request
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const body = await request.json()

    const {
      property_type,
      location,
      bedrooms,
      bathrooms,
      size_sqm,
      name,
      email,
      phone,
      message
    } = body

    // Validate required fields
    if (!property_type || !location || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: property_type, location, name, email, phone' },
        { status: 400 }
      )
    }

    const valuationData = {
      property_type,
      location,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      size_sqm: size_sqm || null,
      contact_method: 'website',
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('property_valuations')
      .insert([valuationData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send confirmation emails asynchronously
    if (email) {
      try {
        const { sendValuationConfirmation, sendAdminNotification } = await import('@/lib/email')
        
        // Send customer confirmation
        await sendValuationConfirmation(
          email,
          name,
          property_type,
          location
        )

        // Send admin notification
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@ragdol.com'
        await sendAdminNotification(adminEmail, 'valuation', {
          name,
          email,
          phone,
          propertyType: property_type,
          location
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ valuation: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
