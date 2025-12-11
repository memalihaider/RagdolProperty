import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Optional guard: if INTERNAL_API_KEY is set, require it on the request header
    const internalKey = process.env.INTERNAL_API_KEY
    if (internalKey) {
      const headerKey = req.headers.get('x-internal-api-key')
      if (!headerKey || headerKey !== internalKey) {
        console.error('Unauthorized get-profile request; missing/invalid internal key')
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { id } = await params
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })

    const svc = getServiceRoleClient()
    const { data, error } = await svc.from('profiles').select('*').eq('id', id).single()
    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }
    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (err) {
    console.error('Error in get-profile route:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
