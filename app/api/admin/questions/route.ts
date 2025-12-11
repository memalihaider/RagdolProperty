'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = getServiceRoleClient() as any

    const { data, error, count } = await supabase
      .from('customer_questions')
      .select(`
        id, subject, message, category, status, created_at,
        profiles:user_id (full_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      // Table might not exist, return empty
      return NextResponse.json({
        questions: [],
        total: 0,
        limit,
        offset
      })
    }

    return NextResponse.json({
      questions: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      questions: [],
      total: 0,
      limit: 50,
      offset: 0
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const questionId = searchParams.get('id')
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { error } = await supabase
      .from('customer_questions')
      .update({ status: body.status })
      .eq('id', questionId)

    if (error) {
      console.error('Error updating question:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
