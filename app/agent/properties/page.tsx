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
      return 'https://via.placeholder.com/400x300?text=No+Image'
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
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Properties</h1>
            <p className="text-muted-foreground">Manage and publish your properties</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            + Add Property
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        {(['all', 'published', 'draft'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === status
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                <Image
                  src={getImageSrc(property.images)}
                  alt={property.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {property.published && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      Published
                    </span>
                  )}
                  {!property.published && (
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <ExclamationCircleIcon className="h-3 w-3" />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-primary font-bold text-lg mb-3">
                  {property.currency} {property.price.toLocaleString()}
                </p>

                {/* Details */}
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                  <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{property.area}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/properties/${property.id}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Link>
                  <button
                    onClick={() => property.published ? handleUnpublish(property.id) : handlePublish(property.id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      property.published
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {property.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
