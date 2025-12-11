import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Enquiry = Database['public']['Tables']['enquiries']['Row']
type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update']

// GET /api/enquiries/[id] - Get a specific enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties:property_id(*),
        profiles:user_id(*),
        agents:agent_id(*, profiles:profiles(*)),
        assigned_agent:assigned_to(*, profiles:profiles(*)),
        enquiry_messages(*, sender:sender_id(*))
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
      }
      console.error('Error fetching enquiry:', error)
      return NextResponse.json({ error: 'Failed to fetch enquiry' }, { status: 500 })
    }

    return NextResponse.json({ enquiry })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/enquiries/[id] - Update a specific enquiry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params
    const body = await request.json()

    const updateData: EnquiryUpdate = {
      status: body.status,
      priority: body.priority,
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
      last_contacted: body.last_contacted,
      contact_count: body.contact_count,
      notes: body.notes,
      tags: body.tags,
      updated_at: new Date().toISOString()
    }

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        properties:property_id(*),
        profiles:user_id(*),
        agents:agent_id(*, profiles:profiles(*)),
        assigned_agent:assigned_to(*, profiles:profiles(*))
      `)
      .single()

    if (error) {
      console.error('Error updating enquiry:', error)
      return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
    }

    return NextResponse.json({ enquiry })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/enquiries/[id] - Delete a specific enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceRoleClient()
    const { id } = await params

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting enquiry:', error)
      return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}