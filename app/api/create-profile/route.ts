import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    // Optional guard: if INTERNAL_API_KEY is set, require it on the request header
    const internalKey = process.env.INTERNAL_API_KEY
    if (internalKey) {
      const headerKey = req.headers.get('x-internal-api-key')
      if (!headerKey || headerKey !== internalKey) {
        console.error('Unauthorized create-profile request; missing/invalid internal key')
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
      }
    }
    const body = await req.json()
    const serviceSupabase = getServiceRoleClient()

    const { data, error } = await serviceSupabase
      .from('profiles')
      .insert(body)
      .select()

    if (error) {
      console.error('Service profile creation error:', error)
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (err) {
    console.error('Unexpected error in create-profile route:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
