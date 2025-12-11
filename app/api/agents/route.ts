import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const sortBy = searchParams.get('sortBy') || 'rating'

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('approved', true)
      .order(sortBy === 'rating' ? 'rating' : 'created_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
