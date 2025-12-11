import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type EnquiryMessage = Database['public']['Tables']['enquiry_messages']['Row']
type EnquiryMessageInsert = Database['public']['Tables']['enquiry_messages']['Insert']

// GET /api/enquiry-messages - Get messages for an enquiry
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const { searchParams } = new URL(request.url)

    const enquiry_id = searchParams.get('enquiry_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!enquiry_id) {
      return NextResponse.json({ error: 'enquiry_id is required' }, { status: 400 })
    }

    const { data: messages, error } = await supabase
      .from('enquiry_messages')
      .select(`
        *,
        sender:sender_id(*)
      `)
      .eq('enquiry_id', enquiry_id)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/enquiry-messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const body = await request.json()

    const messageData: EnquiryMessageInsert = {
      enquiry_id: body.enquiry_id,
      sender_id: body.sender_id,
      sender_type: body.sender_type,
      message: body.message,
      message_type: body.message_type || 'text',
      attachments: body.attachments
    }

    const { data: message, error } = await supabase
      .from('enquiry_messages')
      .insert(messageData)
      .select(`
        *,
        sender:sender_id(*)
      `)
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    // Update enquiry last_contacted timestamp and increment contact_count
    const { data: currentEnquiry } = await supabase
      .from('enquiries')
      .select('contact_count')
      .eq('id', body.enquiry_id)
      .single()

    await supabase
      .from('enquiries')
      .update({
        last_contacted: new Date().toISOString(),
        contact_count: (currentEnquiry?.contact_count || 0) + 1
      })
      .eq('id', body.enquiry_id)

    return NextResponse.json({ message }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}