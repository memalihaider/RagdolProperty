import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'
// import { Metadata } from 'next' // unused

type Agent = Database['public']['Tables']['agents']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type AgentWithProfile = Agent & { profiles?: Profile | null }

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  try {
    const { data } = await supabase.from('agents').select('*, profiles:profiles(*)').eq('id', params.id).limit(1).single()
    const profile: Profile | null = (data as unknown as AgentWithProfile)?.profiles || null
    const title = profile?.full_name || 'Agent Profile'
    return {
      title: `RAGDOL - ${title}`,
      description: `Profile page for ${title}`,
    }
  } catch {
    return {
      title: 'RAGDOL - Agent',
    }
  }
}

export default async function AgentDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const agentId = params.id

  // Fetch agent and profile
  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('*, profiles:profiles(*)')
    .eq('id', agentId)
    .limit(1)
    .maybeSingle()

  if (agentError) console.error('Error fetching agent:', agentError)

  const agent: AgentWithProfile | null = (agentData as unknown as AgentWithProfile) || null
  const profile: Profile | null = agent?.profiles || null

  // Fetch properties for this agent (count)
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('agent_id', agentId)

  const propertiesCount = Array.isArray(properties) ? properties.length : 0

  if (!agent && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Agent not found</h2>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find that agent.</p>
          <div className="mt-4">
            <Link href="/agents" className="btn-outline">Back to agents</Link>
          </div>
        </div>
      </div>
    )
  }

  const name = profile?.full_name || 'Agent'
  const title = agent?.title || 'Real Estate Agent'
  const image = agent?.profile_image || profile?.avatar_url || '/api/placeholder/200/200'

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 flex gap-6 items-center">
          <Image src={image} alt={name} width={112} height={112} className="w-28 h-28 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{title}</p>
            <div className="mt-4 flex gap-3">
              <a href={`tel:${profile?.phone || ''}`} className="btn-primary">Call Agent</a>
              <Link href="/agents" className="ml-2 text-sm text-muted-foreground">Back to list</Link>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm text-muted-foreground">Properties</h4>
              <div className="text-lg font-bold">{propertiesCount}</div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-muted-foreground">Experience</h4>
              <div className="text-lg font-bold">{agent?.experience_years ?? 'N/A'}</div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-muted-foreground">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {((agent?.specializations ?? []) as string[]).map((s: string, idx: number) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-muted-foreground mt-2">{agent?.bio || profile?.bio || 'No biography available.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
