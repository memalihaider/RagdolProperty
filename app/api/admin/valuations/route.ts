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
      .from('property_valuations')
      .select(`
        id, property_type, location, status, created_at,
        profiles:user_id (full_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      // Table might not exist, return empty
      return NextResponse.json({
        valuations: [],
        total: 0,
        limit,
        offset
      })
    }

    return NextResponse.json({
      valuations: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      valuations: [],
      total: 0,
      limit: 50,
      offset: 0
    })
  }
}
