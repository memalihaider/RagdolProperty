'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

function ProjectsPageContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const developer = searchParams.get('developer')

  // Mock projects data (would come from database)
  const mockProjects = [
    {
      id: '1',
      name: 'Emaar Beachfront',
      developer: 'Emaar Properties',
      status: 'in-progress',
      launchDate: '2023-01-15',
      completionDate: '2026-12-31',
      city: 'Dubai',
      area: 'Jumeirah Beach Residence',
      startingPrice: 2500000,
      currency: 'AED',
      totalUnits: 500,
      availableUnits: 120,
      propertyTypes: ['Apartment', 'Penthouse'],
      heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      description: 'Luxury beachfront development with world-class amenities',
      featured: true
    },
    {
      id: '2',
      name: 'DAMAC Hills',
      developer: 'DAMAC Properties',
      status: 'completed',
      launchDate: '2020-06-01',
      completionDate: '2024-03-15',
      city: 'Dubai',
      area: 'Dubai Hills Estate',
      startingPrice: 3500000,
      currency: 'AED',
      totalUnits: 800,
      availableUnits: 45,
      propertyTypes: ['Villa', 'Townhouse'],
      heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      description: 'Premium villas and townhouses in Dubai Hills Estate',
      featured: true
    },
    {
      id: '3',
      name: 'Palm Jumeirah Residences',
      developer: 'Nakheel Properties',
      status: 'in-progress',
      launchDate: '2022-09-01',
      completionDate: '2027-06-30',
      city: 'Dubai',
      area: 'Palm Jumeirah',
      startingPrice: 5000000,
      currency: 'AED',
      totalUnits: 300,
      availableUnits: 85,
      propertyTypes: ['Apartment', 'Penthouse', 'Villa'],
      heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      description: 'Exclusive residences on the iconic Palm Jumeirah',
      featured: true
    }
  ]

  // Filter projects based on URL parameters
  const filteredProjects = mockProjects.filter(project => {
    if (status && project.status !== status) return false
    if (developer && project.developer !== developer) return false
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500" />
      case 'off-plan':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ready'
      case 'in-progress':
        return 'Under Construction'
      case 'off-plan':
        return 'Off-Plan'
      default:
        return status
    }
  }

  const getPageTitle = () => {
    let title = 'Real Estate Projects'

    if (developer) {
      title = `${developer} Projects`
    }

    if (status) {
      const statusLabels: Record<string, string> = {
        'off-plan': 'Off-Plan Projects',
        'in-progress': 'Projects Under Construction',
        'completed': 'Completed Projects'
      }
      title = statusLabels[status] || title
    }

    title += ' in Dubai'
    return title
  }

  const getPageDescription = () => {
    let desc = 'Discover '

    if (developer) {
      desc += `${developer} `
    }

    desc += 'real estate development projects in Dubai. '

    if (status) {
      const statusDesc: Record<string, string> = {
        'off-plan': 'Explore upcoming off-plan developments with investment opportunities.',
        'in-progress': 'Browse projects currently under construction.',
        'completed': 'View completed developments ready for occupancy.'
      }
      desc += statusDesc[status]
    } else {
      desc += 'Browse off-plan, under construction, and completed projects from leading developers.'
    }

    return desc
  }

  // Update page title and meta description
  useEffect(() => {
    document.title = getPageTitle() + ' | RAGDOL Real Estate'

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', getPageDescription())
    }
  }, [status, developer])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {getPageDescription()}
            </p>

            {/* Project Stats */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                {filteredProjects.length} Projects Found
              </span>
              {developer && (
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  🏗️ {developer}
                </span>
              )}
              {status && (
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  📅 {getStatusText(status)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Project Image */}
                <div className="relative h-64">
                  <img
                    src={project.heroImage}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {getStatusIcon(project.status)}
                    {getStatusText(project.status)}
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.developer}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{project.area}, {project.city}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Property Types */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.propertyTypes.map((type) => (
                      <span key={type} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Starting from</span>
                      <div className="font-bold text-green-600">
                        {project.currency} {project.startingPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Available Units</span>
                      <div className="font-bold text-gray-900">
                        {project.availableUnits} / {project.totalUnits}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Completion: {new Date(project.completionDate).getFullYear()}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
                    View Project Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  )
}
