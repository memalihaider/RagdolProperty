'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPinIcon, BuildingOfficeIcon, HomeIcon, CurrencyDollarIcon, MagnifyingGlassIcon, ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline'

const dubaiAreas = [
  {
    name: 'Dubai Marina',
    description: 'Modern waterfront living with luxury apartments and yachts',
    avgPrice: 'AED 2.5M - 15M',
    highlights: ['Waterfront views', 'Marina lifestyle', 'Modern architecture'],
    image: '/api/placeholder/400/300',
    properties: 1250,
    rating: 4.8
  },
  {
    name: 'Palm Jumeirah',
    description: 'Iconic palm-shaped island with exclusive beachfront properties',
    avgPrice: 'AED 5M - 50M+',
    highlights: ['Beachfront', 'Exclusive location', 'Premium amenities'],
    image: '/api/placeholder/400/300',
    properties: 890,
    rating: 4.9
  },
  {
    name: 'Dubai Hills Estate',
    description: 'Master-planned community with villas and townhouses',
    avgPrice: 'AED 3M - 25M',
    highlights: ['Family-friendly', 'Golf course', 'Nature views'],
    image: '/api/placeholder/400/300',
    properties: 2100,
    rating: 4.7
  },
  {
    name: 'Jumeirah Village Circle',
    description: 'Affordable luxury living with excellent connectivity',
    avgPrice: 'AED 800K - 5M',
    highlights: ['Affordable luxury', 'Metro access', 'Community focus'],
    image: '/api/placeholder/400/300',
    properties: 3200,
    rating: 4.6
  },
  {
    name: 'Dubai Silicon Oasis',
    description: 'Tech hub with modern apartments and villas',
    avgPrice: 'AED 1.2M - 8M',
    highlights: ['Tech community', 'Business park', 'Modern living'],
    image: '/api/placeholder/400/300',
    properties: 1500,
    rating: 4.5
  },
  {
    name: 'Arabian Ranches',
    description: 'Equestrian community with luxury villas and equestrian facilities',
    avgPrice: 'AED 4M - 30M',
    highlights: ['Equestrian lifestyle', 'Spacious villas', 'Private community'],
    image: '/api/placeholder/400/300',
    properties: 980,
    rating: 4.8
  }
]

const areaCategories = [
  {
    title: 'Luxury Waterfront',
    icon: BuildingOfficeIcon,
    areas: ['Dubai Marina', 'Palm Jumeirah', 'Jumeirah Beach Residence'],
    description: 'Premium properties with stunning sea views and marina access'
  },
  {
    name: 'Family Communities',
    icon: HomeIcon,
    areas: ['Dubai Hills Estate', 'Arabian Ranches', 'Dubai Festival City'],
    description: 'Spacious villas and townhouses perfect for families'
  },
  {
    name: 'Affordable Luxury',
    icon: CurrencyDollarIcon,
    areas: ['Jumeirah Village Circle', 'Dubai Silicon Oasis', 'Dubai South'],
    description: 'Quality properties at competitive price points'
  }
]

export default function AreaGuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredAreas = dubaiAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || area.name.toLowerCase().includes(selectedCategory.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dubai Area <span className="text-[#d4af37]">Guides</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Discover the perfect neighborhood in Dubai. Explore detailed guides for every area,
              from luxury waterfront properties to family-friendly communities.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#141414] rounded-lg border border-[#333333] p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a3a3a3]" />
                <input
                  type="text"
                  placeholder="Search Dubai areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Marina">Waterfront</option>
                <option value="Palm">Palm Areas</option>
                <option value="Hills">Hill Communities</option>
                <option value="Village">Village Areas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Area Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {areaCategories.map((category, index) => (
            <div key={index} className="bg-[#141414] rounded-lg border border-[#333333] p-6 hover:border-[#d4af37] transition-colors">
              <category.icon className="h-12 w-12 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-bold mb-3">{category.title}</h3>
              <p className="text-[#a3a3a3] mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.areas.map((area, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <MapPinIcon className="h-4 w-4 text-[#d4af37] mr-2" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAreas.map((area, index) => (
            <div key={index} className="bg-[#141414] rounded-lg border border-[#333333] overflow-hidden hover:border-[#d4af37] transition-colors">
              <div className="h-48 bg-[#262626] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPinIcon className="h-16 w-16 text-[#d4af37]" />
                </div>
                <div className="absolute top-4 right-4 bg-[#d4af37] text-[#1a1a1a] px-2 py-1 rounded text-sm font-semibold">
                  {area.rating} ★
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{area.name}</h3>
                <p className="text-[#a3a3a3] mb-4">{area.description}</p>

                <div className="mb-4">
                  <div className="text-[#d4af37] font-semibold">{area.avgPrice}</div>
                  <div className="text-[#a3a3a3] text-sm">Average Property Price</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-[#a3a3a3] mb-2">Key Highlights:</div>
                  <div className="flex flex-wrap gap-2">
                    {area.highlights.map((highlight, idx) => (
                      <span key={idx} className="bg-[#262626] text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[#a3a3a3] mb-4">
                  <span>{area.properties} properties available</span>
                </div>

                <Link
                  href={`/properties?location=${encodeURIComponent(area.name)}`}
                  className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  Explore Properties
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAreas.length === 0 && (
          <div className="text-center py-12">
            <MapPinIcon className="h-16 w-16 text-[#a3a3a3] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No areas found</h3>
            <p className="text-[#a3a3a3]">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

const featuredGuides = [
  {
    title: 'Ultimate Dubai Property Investment Guide 2025',
    description: 'Everything investors need to know about Dubai\'s property market in 2025.',
    category: 'Investment',
    readTime: '15 min read',
    difficulty: 'Advanced',
    featured: true
  },
  {
    title: 'First-Time Buyer\'s Complete Handbook',
    description: 'From choosing your property to moving in - a complete guide for new buyers.',
    category: 'Buying',
    readTime: '12 min read',
    difficulty: 'Beginner',
    featured: true
  }
]