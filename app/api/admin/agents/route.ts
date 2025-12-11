'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const approved = searchParams.get('approved')

    const supabase = getServiceRoleClient() as any
    
    let query = supabase
      .from('agents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (approved === 'true') {
      query = query.eq('approved', true)
    } else if (approved === 'false') {
      query = query.eq('approved', false)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      agents: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = getServiceRoleClient() as any

    const { data, error } = await supabase
      .from('agents')
      .insert([{
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
        specializations: body.specializations || ['Residential Properties'],
        profile_image: body.profile_image,
        approved: body.approved || false,
        rating: body.rating || 4.5,
        review_count: body.review_count || 0,
        total_sales: body.total_sales || 0,
        commission_rate: body.commission_rate || 2.5,
        languages: body.languages || ['English', 'Arabic'],
        experience_years: body.experience_years || 5,
        certifications: body.certifications || ['RERA Certified'],
        verified: body.verified || false
      }])
      .select()

    if (error) {
      console.error('Error creating agent:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data?.[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
