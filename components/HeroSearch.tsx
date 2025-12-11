"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type Props = {
  initialValue?: string
}

export default function HeroSearch({ initialValue = '' }: Props) {
  const [term, setTerm] = useState(initialValue)
  const router = useRouter()

  const runSearch = (action?: 'buy' | 'rent') => {
    const trimmed = (term || '').trim()
    const params = new URLSearchParams()
    if (action) params.set('action', action)
    if (trimmed) params.set('search', trimmed)
    const query = params.toString()
    const url = query ? `/properties?${query}` : '/properties'
    router.push(url)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location, project, or developer..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  runSearch()
                }
              }}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => runSearch('buy')}
            className="btn-primary whitespace-nowrap"
          >
            Buy
          </button>
          <button
            onClick={() => runSearch('rent')}
            className="btn-outline whitespace-nowrap"
          >
            Rent
          </button>
        </div>
      </div>
    </div>
  )
}
