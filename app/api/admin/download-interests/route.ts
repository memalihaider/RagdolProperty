import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('download_interests')
      .select(`
        *,
        properties (
          id,
          title,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching download interests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch download interests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      download_interests: data || []
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('download_interests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating download interest:', error)
      return NextResponse.json(
        { error: 'Failed to update download interest' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}