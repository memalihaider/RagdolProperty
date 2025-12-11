'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
  status: string
  property_status: string
  featured: boolean
}

export default function PropertyImageGallery({
  images,
  title,
  status,
  property_status,
  featured
}: PropertyImageGalleryProps) {
  // Filter out invalid images and ensure we have valid sources - be very defensive
  const validImages = Array.isArray(images)
    ? images.filter(img => typeof img === 'string' && img.trim() !== '')
    : []

  // If no valid images, use a placeholder
  const displayImages = validImages.length > 0 ? validImages : ['https://via.placeholder.com/800x500?text=No+Image']

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const selectedImage = displayImages[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="card-custom overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/10] md:aspect-[16/9] relative overflow-hidden bg-muted">
          <Image
            src={selectedImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

                {/* Image Navigation */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}        {/* Property Status Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded-full">
            {status === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {featured && (
            <span className="px-3 py-1 text-sm font-semibold bg-accent text-accent-foreground rounded-full">
              Featured
            </span>
          )}
          <span className="px-3 py-1 text-sm font-semibold bg-secondary text-secondary-foreground rounded-full">
            {property_status?.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Image Count */}
        {displayImages.length > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full flex items-center gap-1">
            <PhotoIcon className="w-4 h-4" />
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Gallery Thumbnails */}
      {displayImages.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}