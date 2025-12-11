'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    
    const supabase = getServiceRoleClient() as any

    if (action === 'clear-all') {
      // Clear all agents - fetch all and delete by IDs
      const { data: allAgents, error: fetchAgentError } = await supabase
        .from('agents')
        .select('id')

      if (allAgents && allAgents.length > 0) {
        const agentIds = allAgents.map((a: any) => a.id)
        const { error: agentError } = await supabase
          .from('agents')
          .delete()
          .in('id', agentIds)

        if (agentError) {
          console.error('Error clearing agents:', agentError)
        } else {
          console.log(`✅ Cleared ${agentIds.length} agents`)
        }
      }

      // Clear all properties
      const { data: allProperties, error: fetchPropError } = await supabase
        .from('properties')
        .select('id')

      if (allProperties && allProperties.length > 0) {
        const propIds = allProperties.map((p: any) => p.id)
        const { error: propError } = await supabase
          .from('properties')
          .delete()
          .in('id', propIds)

        if (propError) {
          console.error('Error clearing properties:', propError)
        } else {
          console.log(`✅ Cleared ${propIds.length} properties`)
        }
      }

      return NextResponse.json(
        { success: true, message: 'All mock data cleared.' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (action === 'get-counts') {
      // Get fresh counts from database
      const { data: agentData } = await supabase
        .from('agents')
        .select('id', { count: 'exact', head: true })
        .limit(1)

      const { data: propData } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .limit(1)

      // Get actual counts by fetching all
      const { data: allAgents } = await supabase
        .from('agents')
        .select('id')

      const { data: allProperties } = await supabase
        .from('properties')
        .select('id')

      return NextResponse.json(
        {
          agents: allAgents?.length || 0,
          properties: allProperties?.length || 0
        },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
