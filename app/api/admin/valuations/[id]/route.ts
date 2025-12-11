'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: valuationId } = await params
    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { error } = await supabase
      .from('property_valuations')
      .update({ status: body.status })
      .eq('id', valuationId)

    if (error) {
      console.error('Error updating valuation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
