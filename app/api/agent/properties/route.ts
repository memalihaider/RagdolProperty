'use server'

import { NextRequest, NextResponse } from 'next/server'
import { mockProperties } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const status = searchParams.get('status')

  // For demo purposes, return all properties as if they belong to the current agent
  let agentProperties = mockProperties

  if (status) {
    agentProperties = agentProperties.filter(p =>
      status === 'published' ? p.published : !p.published
    )
  }

  const paginatedProperties = agentProperties.slice(offset, offset + limit)

  return NextResponse.json({
    properties: paginatedProperties,
    total: agentProperties.length,
    limit,
    offset
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({
    id: `prop-${Date.now()}`,
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ data: {}, message: 'Mock updated' })
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Mock deleted' })
}
