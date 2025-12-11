'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/lib/database.types'
import { formatPrice } from '@/lib/utils'
import { MapPinIcon, HomeIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline'

type Property = Database['public']['Tables']['properties']['Row']

interface ListingCardProps {
  property: Property
}

export default function ListingCard({ property }: ListingCardProps) {
  const mainImage = property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="card-custom overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
              {property.status === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price */}
          <div className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.currency || 'AED')}
          </div>

          {/* Title */}
          <h3 className="text-foreground font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          {(property.area || property.city) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">
                {property.area && property.city
                  ? `${property.area}, ${property.city}`
                  : property.area || property.city}
              </span>
            </div>
          )}

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
            {property.beds && (
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                <span>{property.beds} Beds</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center">
                <span className="mr-1">🚿</span>
                <span>{property.baths} Baths</span>
              </div>
            )}
            {property.sqft && (
              <div className="flex items-center">
                <Square3Stack3DIcon className="h-4 w-4 mr-1" />
                <span>{property.sqft} sqft</span>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="text-xs text-muted-foreground capitalize">
            {property.type} • {property.property_status}
          </div>
        </div>
      </div>
    </Link>
  )
}
