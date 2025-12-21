'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface AgentProperty {
  id: string
  title: string
  price: number
  currency: string
  images: string[]
  beds: number
  baths: number
  sqft: number
  area: string
  type: string
  published: boolean
  created_at: string
}

export default function AgentProperties() {
  const [properties, setProperties] = useState<AgentProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchProperties()
  }, [filter])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const query = filter === 'all' ? '' : `?status=${filter}`
      const res = await fetch(`/api/agent/properties${query}`)
      const data = await res.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/agent/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: true })
      })

      if (res.ok) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error publishing property:', error)
    }
  }

  const handleUnpublish = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/agent/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: false })
      })

      if (res.ok) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error unpublishing property:', error)
    }
  }

  const getImageSrc = (images: string[]) => {
    if (!images || images.length === 0) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
    }
    return images[0]
  }

  const filteredProperties = properties.filter((prop) => {
    if (filter === 'published') return prop.published
    if (filter === 'draft') return !prop.published
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <ArrowPathIcon className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <BuildingOfficeIcon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Property Management</span>
            </div>
            <h1 className="text-4xl font-serif text-secondary">
              Your <span className="text-primary italic">Listings</span>
            </h1>
            <p className="text-slate-500 mt-2">Manage, publish, and track your property portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-secondary">{properties.length}</div>
              <div className="text-sm text-slate-400">Total Listings</div>
            </div>
            <Link
              href="/agent/properties/new"
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/20"
            >
              <PlusIcon className="h-5 w-5" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
        {(['all', 'published', 'draft'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              filter === status
                ? 'bg-secondary text-white shadow-md'
                : 'text-slate-400 hover:text-secondary hover:bg-slate-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-sm opacity-75">
              ({properties.filter(p => status === 'all' || (status === 'published' ? p.published : !p.published)).length})
            </span>
          </button>
        ))}
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No properties yet</p>
          <Link
            href="/admin/dashboard"
            className="text-primary hover:underline font-medium"
          >
            Create your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={getImageSrc(property.images)}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {property.published && (
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                      <CheckCircleIcon className="h-4 w-4" />
                      Published
                    </span>
                  )}
                  {!property.published && (
                    <span className="bg-amber-600 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      Draft
                    </span>
                  )}
                </div>
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Link
                    href={`/properties/${property.id}`}
                    target="_blank"
                    className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-secondary transition-all"
                  >
                    <EyeIcon className="h-6 w-6" />
                  </Link>
                  <button className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-secondary transition-all">
                    <PencilIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mb-3">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.area}
                    </p>
                  </div>
                </div>

                <div className="text-3xl font-serif text-secondary mb-4">
                  {property.currency} {property.price.toLocaleString()}
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <div className="text-lg font-bold text-secondary">{property.beds}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Beds</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <div className="text-lg font-bold text-secondary">{property.baths}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Baths</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <div className="text-lg font-bold text-secondary">{property.sqft.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest">Sqft</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => property.published ? handleUnpublish(property.id) : handlePublish(property.id)}
                    className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all ${
                      property.published
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {property.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/agent/properties/${property.id}/edit`}
                    className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
