import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import AgentListClient from '@/components/AgentListClient'
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'

type AgentRow = Database['public']['Tables']['agents']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type AgentWithProfile = AgentRow & { profiles?: ProfileRow | null }

async function getAgents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('agents')
    .select('*, profiles:profiles(*)')
    .order('rating', { ascending: false })
    .limit(100)

  return (data as AgentWithProfile[]) || []
}

export default async function AgentsPage() {
  const agents = await getAgents()
  return (
    <div className="w-full">
      <AgentListClient agents={agents.map((a) => ({
        id: a.id,
        profile_image: a.profile_image,
        profile: a.profiles ? { full_name: a.profiles.full_name, avatar_url: a.profiles.avatar_url } : undefined,
        title: a.title || undefined,
        experience_years: a.experience_years || undefined,
        properties: a.total_sales || undefined,
        rating: a.rating || undefined,
        review_count: a.review_count || undefined,
        specializations: a.specializations || undefined,
      }))} />
    </div>
  )
}
