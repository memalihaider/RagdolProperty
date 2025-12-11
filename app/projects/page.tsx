'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

function ProjectsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get('status')
  const developer = searchParams.get('developer')

  // Modal state
  const [inquiryModal, setInquiryModal] = useState<{
    isOpen: boolean
    project: any | null
  }>({
    isOpen: false,
    project: null
  })

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectInterest: ''
  })

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
        return 'Unknown'
    }
  }

  // Handle view details navigation
  const handleViewDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // Handle inquiry modal
  const handleInquiry = (project: any) => {
    setInquiryModal({
      isOpen: true,
      project
    })
    setInquiryForm({
      ...inquiryForm,
      projectInterest: project.name
    })
  }

  // Handle form submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the inquiry to your backend
    // For now, we'll just show a success message
    alert(`Thank you for your inquiry about ${inquiryForm.projectInterest}! We'll get back to you soon.`)

    // Reset form and close modal
    setInquiryForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      projectInterest: ''
    })
    setInquiryModal({ isOpen: false, project: null })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }))
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
      {/* Hero Section - Enhanced Design */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                {getPageTitle().replace(' | RAGDOL Real Estate', '')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {getPageDescription()}
              </p>
            </div>

            {/* Project Stats */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <span className="px-6 py-3 bg-primary/10 text-primary rounded-full border border-primary/20 font-semibold text-sm">
                🏗️ {filteredProjects.length} Projects Found
              </span>
              {developer && (
                <span className="px-6 py-3 bg-primary/10 text-primary rounded-full border border-primary/20 font-semibold text-sm">
                  🏢 {developer}
                </span>
              )}
              {status && (
                <span className="px-6 py-3 bg-primary/10 text-primary rounded-full border border-primary/20 font-semibold text-sm">
                  📅 {getStatusText(status)}
                </span>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <a
                href="/projects?status=off-plan"
                className={`group px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  status === 'off-plan'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <ClockIcon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                Off-Plan
              </a>
              <a
                href="/projects?status=in-progress"
                className={`group px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  status === 'in-progress'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                }`}
              >
                <WrenchScrewdriverIcon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                Under Construction
              </a>
              <a
                href="/projects?status=completed"
                className={`group px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  status === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <CheckCircleIcon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                Completed
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid - Enhanced Design */}
      <section className="py-20 bg-card/50">
        <div className="container-custom">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-border/50">
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.heroImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {getStatusIcon(project.status)}
                      <span className="text-foreground">{getStatusText(project.status)}</span>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        ✨ Featured
                      </div>
                    )}

                    {/* Overlay Content */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(project.id)}
                          className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleInquiry(project)}
                          className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        by {project.developer}
                      </p>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{project.area}, {project.city}</span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Property Types */}
                    <div className="flex flex-wrap gap-2">
                      {project.propertyTypes.map((type) => (
                        <span key={type} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium border border-primary/20">
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Starting Price</span>
                        <div className="font-bold text-primary text-lg">
                          {project.currency} {project.startingPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Available Units</span>
                        <div className="font-bold text-foreground text-lg">
                          {project.availableUnits}/{project.totalUnits}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                        <span>Completion: {new Date(project.completionDate).getFullYear()}</span>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded-full">
                        {Math.round(((new Date(project.completionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)))} years left
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                <BuildingOfficeIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">No projects found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or browse all available projects to find your perfect development.
                </p>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                View All Projects
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal */}
      {inquiryModal.isOpen && inquiryModal.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">Inquire About Project</h3>
                <p className="text-sm text-muted-foreground mt-1">{inquiryModal.project.name}</p>
              </div>
              <button
                onClick={() => setInquiryModal({ isOpen: false, project: null })}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={inquiryForm.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={inquiryForm.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={inquiryForm.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="projectInterest" className="block text-sm font-medium text-foreground mb-2">
                    Project of Interest
                  </label>
                  <input
                    type="text"
                    id="projectInterest"
                    name="projectInterest"
                    value={inquiryForm.projectInterest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground"
                    placeholder="Project name"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={inquiryForm.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground resize-none"
                    placeholder="Tell us about your requirements and preferred contact method..."
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setInquiryModal({ isOpen: false, project: null })}
                    className="flex-1 px-4 py-3 border border-border rounded-lg font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
