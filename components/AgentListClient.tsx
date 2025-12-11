"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/outline'

type Agent = {
  id: string
  profile_image?: string | null
  profile?: {
    full_name?: string | null
    avatar_url?: string | null
  }
  profile_id?: string | null
  title?: string | null
  experience_years?: number | null
  properties?: number | null
  rating?: number | null
  review_count?: number | null
  specializations?: string[] | null
}

export default function AgentListClient({ agents }: { agents: Agent[] }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = agents.filter((agent) => {
    const name = agent.profile?.full_name || agent.title || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || (agent.specializations || []).some((s) => s.toLowerCase().includes(filter.toLowerCase()))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="w-full">
      <section className="section-padding bg-card border-b border-border">
        <div className="container-custom">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Search agents by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex flex-wrap gap-3">
              {['all', 'Luxury', 'Commercial', 'Residential', 'Investment', 'New Developments'].map(
                (spec) => (
                  <button
                    key={spec}
                    onClick={() => setFilter(spec)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      filter === spec
                        ? 'bg-primary text-background'
                        : 'bg-background border border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {spec === 'all' ? 'All Agents' : spec}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              {filtered.length} {filtered.length === 1 ? 'Agent' : 'Agents'} Found
            </h2>
            <p className="text-muted-foreground">Top rated professionals ready to assist you</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((agent) => (
                <div key={agent.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <div className="relative overflow-hidden h-48 bg-muted">
                    <Image
                      src={agent.profile?.avatar_url || agent.profile_image || '/api/placeholder/120/120'}
                      alt={agent.profile?.full_name || agent.title || 'Agent'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {agent.profile?.full_name || agent.title || 'Agent'}
                      </h3>
                      <p className="text-sm text-muted-foreground">{agent.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i}>
                            {i < Math.floor((agent.rating || 0)) ? (
                              <StarSolid className="w-4 h-4 text-primary" />
                            ) : (
                              <StarIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{agent.rating ?? '—'}</span>
                      <span className="text-sm text-muted-foreground">({agent.review_count ?? '0'})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-border">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{agent.properties ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Properties</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{agent.experience_years ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all">
                        <svg className="w-4 h-4" />
                        Call Agent
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:border-primary transition-all">
                        Message
                      </button>
                      <Link href={`/agents/${agent.id}`} className="btn-primary w-full mt-2 inline-block text-center">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No agents found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
