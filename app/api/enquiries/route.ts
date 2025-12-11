import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Enquiry = Database['public']['Tables']['enquiries']['Row']
type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert']
type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update']

// GET /api/enquiries - Get all enquiries with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const agent_id = searchParams.get('agent_id')
    const property_id = searchParams.get('property_id')
    const search = searchParams.get('search')

    let query = supabase
      .from('enquiries')
      .select(`
        *,
        properties:property_id(*),
        profiles:user_id(*),
        agents:agent_id(*, profiles:profiles(*)),
        assigned_agent:assigned_to(*, profiles:profiles(*))
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (property_id) {
      query = query.eq('property_id', property_id)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
    }

    const { data: enquiries, error, count } = await query

    if (error) {
      console.error('Error fetching enquiries:', error)
      return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
    }

    return NextResponse.json({
      enquiries: enquiries || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/enquiries - Create a new enquiry
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const body = await request.json()

    const enquiryData: EnquiryInsert = {
      property_id: body.property_id,
      user_id: body.user_id,
      agent_id: body.agent_id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      source: body.source || 'website',
      status: body.status || 'new',
      priority: body.priority || 'medium',
      assigned_to: body.assigned_to,
      budget_min: body.budget_min,
      budget_max: body.budget_max,
      timeline: body.timeline,
      financing_needed: body.financing_needed,
      financing_amount: body.financing_amount,
      nationality: body.nationality,
      residency_status: body.residency_status,
      occupation: body.occupation,
      employer: body.employer,
      monthly_income: body.monthly_income,
      down_payment: body.down_payment,
      mortgage_preferred: body.mortgage_preferred,
      property_requirements: body.property_requirements,
      follow_up_date: body.follow_up_date,
      notes: body.notes,
      tags: body.tags
    }

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .insert(enquiryData)
      .select(`
        *,
        properties:property_id(*),
        profiles:user_id(*),
        agents:agent_id(*, profiles:profiles(*)),
        assigned_agent:assigned_to(*, profiles:profiles(*))
      `)
      .single()

    if (error) {
      console.error('Error creating enquiry:', error)
      return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 })
    }

    return NextResponse.json({ enquiry }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}