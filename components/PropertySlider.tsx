'use client'

import { useState } from 'react'
import PropertyCard from './PropertyCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  price: number
  priceLabel: string
  image: string
  location: string
  beds: number
  baths: number
  sqft: number
  type: string
  featured: boolean
}

interface PropertySliderProps {
  title: string
  properties: Property[]
  showCount?: number
}

export default function PropertySlider({ title, properties, showCount = 3 }: PropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + showCount >= properties.length ? 0 : prevIndex + showCount
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - showCount < 0 ? Math.max(0, properties.length - showCount) : prevIndex - showCount
    )
  }

  const visibleProperties = properties.slice(currentIndex, currentIndex + showCount)

  return (
    <div className="container-custom">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + showCount >= properties.length}
            className="p-2 rounded-full border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}