import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

// GET /api/questions - Get all customer questions
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let query = supabase
      .from('customer_questions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

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

// POST /api/questions - Create a new customer question
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient()
    const body = await request.json()

    const {
      name,
      email,
      phone,
      subject,
      message,
      category
    } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      )
    }

    const questionData = {
      subject,
      message,
      category: category || 'general',
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('customer_questions')
      .insert([questionData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send confirmation emails asynchronously
    if (email) {
      try {
        const { sendQuestionConfirmation, sendAdminNotification } = await import('@/lib/email')
        
        // Send customer confirmation
        await sendQuestionConfirmation(
          email,
          name,
          subject
        )

        // Send admin notification
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@ragdol.com'
        await sendAdminNotification(adminEmail, 'question', {
          name,
          email,
          phone,
          subject,
          message
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ question: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
