'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params
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
