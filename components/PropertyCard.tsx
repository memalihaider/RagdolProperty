'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon, HomeIcon, Square3Stack3DIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export interface PropertyCardProperty {
  id: string
  title: string
  price: number
  priceLabel?: string
  image: string
  location?: string
  beds?: number
  baths?: number
  sqft?: number
  type?: string
  featured?: boolean
  currency?: string
  status?: string
  area?: string
  city?: string
}

export interface PropertyCardProps {
  property: PropertyCardProperty
  isSaved?: boolean
  onSaveToggle?: (id: string) => void
}

export default function PropertyCard({ property, isSaved = false, onSaveToggle }: PropertyCardProps) {
  // Ensure we have a valid image source - be very defensive
  const getValidImageSrc = (image: any): string => {
    // If it's a valid string and not empty, use it
    if (typeof image === 'string' && image.trim() !== '') {
      return image
    }
    // If it's an array, take the first valid string
    if (Array.isArray(image)) {
      const firstValid = image.find(img => typeof img === 'string' && img.trim() !== '')
      if (firstValid) return firstValid
    }
    // Fallback
    return 'https://via.placeholder.com/400x300?text=No+Image'
  }

  const imageSrc = getValidImageSrc(property.image)

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="card-custom overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
              {property.status === 'sale' ? 'For Sale' : property.status === 'rent' ? 'For Rent' : property.priceLabel === 'total' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">
                Featured
              </span>
            )}
          </div>

          {/* Save Button */}
          {onSaveToggle && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onSaveToggle(property.id)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              {isSaved ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price */}
          <div className="text-xl font-bold text-primary">
            {property.currency || 'AED'} {property.price.toLocaleString()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{property.location || `${property.area}, ${property.city}`}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              <span>{property.beds || 0} bed{property.beds !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square3Stack3DIcon className="h-4 w-4" />
              <span>{property.baths || 0} bath{property.baths !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{property.sqft?.toLocaleString() || 0} sqft</span>
            </div>
          </div>

          {/* Type */}
          <div className="text-sm font-medium text-primary capitalize">
            {property.type || 'Property'}
          </div>
        </div>
      </div>
    </Link>
  )
}