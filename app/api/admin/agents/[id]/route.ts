'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('agents')
      .update({
        title: body.title,
        office: body.office,
        license_no: body.license_no,
        brokerage: body.brokerage,
        bio: body.bio,
        whatsapp: body.whatsapp,
        telegram: body.telegram,
        linkedin_url: body.linkedin_url,
        instagram_handle: body.instagram_handle,
        website_url: body.website_url,
        specializations: body.specializations,
        profile_image: body.profile_image,
        approved: body.approved,
        rating: body.rating,
        review_count: body.review_count,
        total_sales: body.total_sales,
        commission_rate: body.commission_rate,
        languages: body.languages,
        experience_years: body.experience_years,
        certifications: body.certifications,
        verified: body.verified,
        updated_at: new Date().toISOString()
      })
      .eq('id', agentId)
      .select()

    if (error) {
      console.error('Error updating agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data?.[0] })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const supabase = getServiceRoleClient() as any

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId)

    if (error) {
      console.error('Error deleting agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (error) {
      console.error('Error fetching agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
