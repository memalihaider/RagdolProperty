import { } from 'react'
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type RawDBProperty = Property & {
  images?: string[] | null
  image_url?: string | null
  image?: string | null
  developers?: { name?: string } | null
  developer_id?: string | null
  developer?: string | null
  subtype?: string | null
  category?: string | null
  parking?: string | null
  property_age?: string | null
  completion?: string | null
  features?: string[] | string | null
  description?: string | null
}
type NormalizedProperty = Property & {
  image: string
  price: number
  priceLabel?: string
  area?: string | null
  city?: string | null
  location: string
  beds: number
  baths: number
  sqft: number
  type: string
  featured: boolean
  developer?: string | null
  description?: string | null
  category?: string | null
  parking?: string | null
  furnished?: boolean | null
  propertyAge?: string | null
  completion?: string | null
  subtype?: string | null
  features?: string[] | null
}
import PropertyCard, { PropertyCardProperty } from '@/components/PropertyCard'
import PropertyAgents from '@/components/PropertyAgents'
import {
  ViewColumnsIcon,
  QueueListIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

export async function generateMetadata({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const params = searchParams || {}
  const action = (params.action as string) || 'buy'
  const area = params.area as string | undefined
  const category = params.category as string | undefined
  const type = params.type as string | undefined
  const search = params.search as string | undefined

  // Build page title
  let title = ''
  if (category === 'luxe') title += 'Luxury '
  if (type) {
    const typeLabels: Record<string, string> = {
      apartment: 'Apartments',
      villa: 'Villas',
      townhouse: 'Townhouses',
      penthouse: 'Penthouses',
      studio: 'Studios',
      plot: 'Plots',
      commercial: 'Commercial Properties'
    }
    title += typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1) + 's'
  } else if (category === 'luxe') {
    title += 'Properties'
  } else {
    title += 'Properties'
  }
  title += action === 'rent' ? ' for Rent' : ' for Sale'
  title += area ? ` in ${area}` : ' in Dubai'

  // Description
  let desc = ''
  if (category === 'luxe') desc += 'Discover exclusive luxury '
  else desc += 'Find '
  desc += type ? type + ' properties' : 'properties'
  desc += action === 'rent' ? ' for rent' : ' for sale'
  desc += area ? ` in ${area}, Dubai` : ' in Dubai'
  desc += '. Browse our curated selection with detailed information and high-quality images.'

  return {
    title: `RAGDOL - ${title}${search ? ` - ${search}` : ''}`,
    description: desc,
  }
}

export default async function PropertiesPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const params = searchParams || {}
  const viewMode = (params.view as string) === 'list' ? 'list' : 'grid'
  const sortBy = (params.sortBy as string) || 'featured'
  const action = (params.action as string) || 'buy'
  const category = params.category as string | undefined
  const type = params.type as string | undefined
  const area = params.area as string | undefined
  const developer = params.developer as string | undefined
  const minPrice = params.minPrice as string | undefined
  const maxPrice = params.maxPrice as string | undefined
  const beds = params.beds as string | undefined
  const baths = params.baths as string | undefined
  const minSqft = params.minSqft as string | undefined
  const maxSqft = params.maxSqft as string | undefined
  const furnished = (params.furnished as string) === 'true'
  const parking = params.parking as string | undefined
  const propertyAge = params.propertyAge as string | undefined
  const completion = params.completion as string | undefined
  const features = params.features as string | undefined
  const subtype = params.subtype as string | undefined
  const page = parseInt((params.page as string) || '1', 10)
  const limit = parseInt((params.limit as string) || '20', 10)
  const search = (params.search as string) || undefined

  // Convert searchParams to simple string map for building query strings
  const buildQuery = (p: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    Object.entries(p).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return
      if (Array.isArray(v)) result[k] = v.join(',')
      else result[k] = String(v)
    })
    return result
  }

  // Generate dynamic title and description based on filters
  const getPageTitle = () => {
    let title = ''

    if (category === 'luxe') {
      title += 'Luxury '
    }

    if (type) {
      const typeLabels: Record<string, string> = {
        apartment: 'Apartments',
        villa: 'Villas',
        townhouse: 'Townhouses',
        penthouse: 'Penthouses',
        studio: 'Studios',
        plot: 'Plots',
        commercial: 'Commercial Properties'
      }
      title += typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1) + 's'
    } else if (category === 'luxe') {
      title += 'Properties'
    } else {
      title += 'Properties'
    }

    if (action === 'rent') {
      title += ' for Rent'
    } else {
      title += ' for Sale'
    }

    if (area) {
      title += ` in ${area}`
    } else {
      title += ' in Dubai'
    }

    return title
  }

  const getPageDescription = () => {
    let desc = ''

    if (category === 'luxe') {
      desc += 'Discover exclusive luxury '
    } else {
      desc += 'Find '
    }

    if (type) {
      const typeLabels: Record<string, string> = {
        apartment: 'apartments',
        villa: 'villas',
        townhouse: 'townhouses',
        penthouse: 'penthouses',
        studio: 'studios',
        plot: 'plots',
        commercial: 'commercial properties'
      }
      desc += typeLabels[type] || type + 's'
    } else {
      desc += 'properties'
    }

    if (action === 'rent') {
      desc += ' for rent'
    } else {
      desc += ' for sale'
    }

    if (area) {
      desc += ` in ${area}, Dubai`
    } else {
      desc += ' in Dubai'
    }

    desc += '. Browse our curated selection with detailed information and high-quality images.'

    return desc
  }

  // Page title and meta are generated via generateMetadata

  // Enhanced mock properties with more variety (fallback only)
  const mockProperties = [
    // Luxury Properties
    {
      id: 'lux-1',
      title: 'Emirates Hills Luxury Mansion',
      price: 55000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Emirates Hills, Dubai',
      beds: 7,
      baths: 9,
      sqft: 12000,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      developer: 'Emaar',
      area: 'Emirates Hills',
      features: ['private_pool', 'golf_course'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'lux-2',
      title: 'Palm Jumeirah Beachfront Estate',
      price: 42000000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      location: 'Palm Jumeirah, Dubai',
      beds: 6,
      baths: 7,
      sqft: 9500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      developer: 'Nakheel',
      area: 'Palm Jumeirah',
      features: ['beachfront', 'marina_view'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: 'lux-3',
      title: 'Dubai Marina Penthouse',
      price: 18500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4200,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      category: 'luxe',
      area: 'Dubai Marina',
      features: ['marina_view'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Regular Properties
    {
      id: '1',
      title: 'Luxury Penthouse in Downtown Dubai',
      price: 12500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 4,
      baths: 5,
      sqft: 4200,
      type: 'Penthouse',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    {
      id: '2',
      title: 'Modern Villa with Private Beach',
      price: 8900000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Palm Jumeirah, Dubai',
      beds: 5,
      baths: 6,
      sqft: 5500,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Palm Jumeirah',
      features: ['beachfront'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: '3',
      title: 'Contemporary Apartment Marina View',
      price: 3200000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 3,
      baths: 3,
      sqft: 2100,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Marina',
      features: ['marina_view'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: '4',
      title: 'Studio Apartment Downtown Perfect Investment',
      price: 950000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      location: 'Downtown Dubai, Dubai',
      beds: 0,
      baths: 1,
      sqft: 580,
      type: 'Studio',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Downtown Dubai',
      parking: 'no',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: '5',
      title: 'Spacious 2BR Apartment with Terrace',
      price: 2100000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      location: 'Jumeirah Beach Residence, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1350,
      type: 'Apartment',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah Beach Residence',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    {
      id: '6',
      title: 'Premium Luxury Townhouse',
      price: 6500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Emirates Hills, Dubai',
      beds: 4,
      baths: 4,
      sqft: 3800,
      type: 'Townhouse',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Emirates Hills',
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    // Rental Properties
    {
      id: 'rent-1',
      title: 'Furnished 2BR Marina View',
      price: 165000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Marina, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1400,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Marina',
      furnished: true,
      features: ['marina_view', 'furnished'],
      parking: 'yes',
      propertyAge: '1-5',
      completion: 'ready'
    },
    {
      id: 'rent-2',
      title: 'Luxury 3BR Villa with Pool',
      price: 450000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Dubai Hills Estate, Dubai',
      beds: 3,
      baths: 4,
      sqft: 3200,
      type: 'Villa',
      featured: true,
      currency: 'AED',
      status: 'rent',
      area: 'Dubai Hills Estate',
      furnished: true,
      features: ['private_pool', 'furnished'],
      parking: 'yes',
      propertyAge: 'new',
      completion: 'ready'
    },
    // Commercial Properties
    {
      id: 'comm-1',
      title: 'Prime Office Space Business Bay',
      price: 180000,
      priceLabel: 'yearly',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      location: 'Business Bay, Dubai',
      beds: undefined,
      baths: undefined,
      sqft: 1500,
      type: 'Commercial',
      featured: false,
      currency: 'AED',
      status: 'rent',
      area: 'Business Bay',
      subtype: 'office',
      parking: 'yes',
      propertyAge: '5-10',
      completion: 'ready'
    },
    // Plots
    {
      id: 'plot-1',
      title: 'Residential Plot Dubai Hills',
      price: 3500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      location: 'Dubai Hills Estate, Dubai',
      beds: undefined,
      baths: undefined,
      sqft: 5000,
      type: 'Plot',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Hills Estate',
      parking: 'no',
      propertyAge: 'new',
      completion: 'ready'
    },
    // Off-plan Properties
    {
      id: 'off-plan-1',
      title: 'Dubai Creek Harbour - Off Plan Apartments',
      price: 2800000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      location: 'Dubai Creek Harbour, Dubai',
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'Apartment',
      featured: true,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai Creek Harbour',
      developer: 'Emaar',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'off-plan'
    },
    {
      id: 'off-plan-2',
      title: 'Dubai South - Under Construction Villas',
      price: 5200000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      location: 'Dubai South, Dubai',
      beds: 4,
      baths: 5,
      sqft: 3500,
      type: 'Villa',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Dubai South',
      developer: 'DAMAC',
      parking: 'yes',
      propertyAge: 'new',
      completion: 'under-construction'
    },
    // Older Properties
    {
      id: 'old-1',
      title: 'Classic Jumeirah Villa - 15 Years Old',
      price: 8500000,
      priceLabel: 'total',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      location: 'Jumeirah, Dubai',
      beds: 5,
      baths: 4,
      sqft: 4800,
      type: 'Villa',
      featured: false,
      currency: 'AED',
      status: 'sale',
      area: 'Jumeirah',
      parking: 'yes',
      propertyAge: '10+',
      completion: 'ready'
    }
  ]

  // Server-side fetch properties
  const supabase = await createClient()
  const offset = (Math.max(page, 1) - 1) * limit

  // (properties will be filtered and sorted server-side; client-side additional filters handled below)

  // Prepare properties and pagination
  let properties: NormalizedProperty[] = []
  let rawProps: Property[] = mockProperties as unknown as Property[]
  let total = 0
  let totalPages = 1
  let fetchError: string | null = null

  // Build server-side query
  try {
    let query = supabase
      .from('properties')
      .select(`*, agents:agents(*, profiles:profiles(*)), developers:developers(*), projects:projects(*)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (action === 'buy') query = query.eq('status', 'sale')
    if (action === 'rent') query = query.eq('status', 'rent')
    if (type) query = query.eq('type', type)
    if (search && search.trim() !== '') {
      const s = search.replace(/%/g, '').replace(/,/g, ' ')
      // search across title, location, description and area
      query = query.or(`title.ilike.%${s}%,location.ilike.%${s}%,area.ilike.%${s}%,description.ilike.%${s}%`)
    }
    if (area) query = query.ilike('area', `%${area}%`)
    if (developer) query = query.eq('developer', developer)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (beds) query = query.eq('beds', parseInt(beds))

    // Sorting server-side
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'featured':
      default:
        query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    const { data: dbProps, error: dbError, count } = await query

    if (dbError) {
      console.error('Error fetching properties server-side:', dbError)
      fetchError = dbError.message || 'Error fetching properties'
    }

    rawProps = Array.isArray(dbProps) ? (dbProps as Property[]) : (mockProperties as unknown as Property[])

    // Normalize properties for UI
    properties = rawProps.map((p: RawDBProperty) => ({
      ...p,
      image: p.image || p.image_url || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'),
      price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
      area: p.area || p.location || p.neighborhood || p.district || null,
      city: p.city || 'Dubai',
      location: p.location || p.area || p.city || '',
      beds: p.beds ?? 0,
      baths: p.baths ?? 0,
      sqft: p.sqft ?? 0,
      type: p.type || p.subtype || '',
      developer: p.developer || (p.developers?.name ? p.developers.name : null) || p.developer_id || null,
      featured: Boolean(p.featured),
      category: p.category || null,
      parking: p.parking || null,
      propertyAge: p.property_age || null,
      completion: p.completion || null,
      subtype: p.subtype || null,
      description: p.description || null,
      features: Array.isArray(p.features) ? p.features : (typeof (p.features as unknown) === 'string' ? (p.features as unknown as string).split(',').map((f: string) => f.trim()) : null)
    })) as NormalizedProperty[];

    // Apply features filter server-side if provided
    const featuresList: string[] = Array.isArray(features)
      ? (features as string[])
      : (features ? (features as string).split(',').map(f => f.trim()).filter(Boolean) : [])
    if (featuresList.length > 0) { 
      properties = properties.filter((p: NormalizedProperty) => {
        if (!p.features || !Array.isArray(p.features)) return false
        return featuresList.every(f => (p.features || []).includes(f))
      })
    }

    total = typeof count === 'number' ? count : properties.length
    totalPages = Math.max(1, Math.ceil(total / limit)) 
  } catch (err) {
    console.error('Server-side properties fetch exception:', err)
  }

  // Now apply any remaining filters and sorting client-side (if still required)
  const actionStatus = action === 'buy' ? 'sale' : action === 'rent' ? 'rent' : undefined
  const filteredProperties = properties.filter(property => {
    if (search && search.trim() !== '') {
      const sLower = search.toLowerCase()
      const inTitle = property.title?.toLowerCase().includes(sLower)
      const inLocation = property.location?.toLowerCase().includes(sLower)
      const inArea = (property.area || '').toLowerCase().includes(sLower)
      const inDesc = (property.description || '').toLowerCase().includes(sLower)
      const inDeveloper = ((property.developer || '') as string).toLowerCase().includes(sLower)
      if (!(inTitle || inLocation || inArea || inDesc || inDeveloper)) return false
    }
    // Category filter (luxe)
    if (category === 'luxe' && property.category !== 'luxe') return false
    // Type filter
    if (type && property.type?.toLowerCase() !== type.toLowerCase()) return false
    // Area filter
    if (area && property.area !== area) return false
    // Developer filter
    if (developer && property.developer !== developer) return false
    // Beds filter
    if (beds && property.beds !== undefined && property.beds !== parseInt(beds)) return false
    // Baths filter
    if (baths && property.baths !== undefined && property.baths !== parseInt(baths)) return false
    // Size filters
    if (minSqft && property.sqft && property.sqft < parseInt(minSqft)) return false
    if (maxSqft && property.sqft && property.sqft > parseInt(maxSqft)) return false
    // Furnished filter
    if (furnished && !property.furnished) return false
    // Parking filter
    if (parking && property.parking !== parking) return false
    // Property age filter
    if (propertyAge && property.propertyAge !== propertyAge) return false
    // Completion status filter
    if (completion && property.completion !== completion) return false
    // Subtype filter (for commercial)
    if (subtype && property.subtype !== subtype) return false
    return true
  })

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.created_at || b.id).getTime() - new Date(a.created_at || a.id).getTime()
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-card to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {getPageDescription()}
            </p>

            {/* Property Stats */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                {total} Properties Found
              </span>
              {search && (
                <span className="px-4 py-2 bg-muted text-foreground rounded-full border border-border/20">
                  🔎 Searching for: &ldquo;{search}&rdquo;
                </span>
              )}
              {area && (
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  📍 {area}
                </span>
              )}
              {type && (
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  🏠 {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              )}
              {category === 'luxe' && (
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  ✨ Luxury Collection
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              </div>

              <form method="get" action="/properties" className="space-y-6 block">
                <input type="hidden" name="action" value={action} />
                <input type="hidden" name="view" value={viewMode} />
                <input type="hidden" name="sortBy" value={sortBy} />
                {/* Search input so users can submit search term along with filters */}
                <div>
                  <label className="sr-only">Search</label>
                  <input name="search" type="text" defaultValue={search || ''} placeholder="Search by keywords..." className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Type
                  </label>
                  <select name="type" defaultValue={type || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartments</option>
                    <option value="villa">Villas</option>
                    <option value="townhouse">Townhouses</option>
                    <option value="penthouse">Penthouses</option>
                    <option value="studio">Studios</option>
                    <option value="plot">Plots</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <select name="beds" defaultValue={beds || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price Range (AED)
                  </label>
                  <div className="space-y-2">
                    <input
                      name="minPrice"
                      type="number"
                      placeholder="Min Price"
                      defaultValue={minPrice || ''}
                      className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      name="maxPrice"
                      type="number"
                      placeholder="Max Price"
                      defaultValue={maxPrice || ''}
                      className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Furnished */}
                <div>
                  <label className="flex items-center">
                    <input name="furnished" type="checkbox" defaultChecked={furnished}
                      className="rounded border-border text-primary focus:ring-ring"
                    />
                    <span className="ml-2 text-sm text-foreground">Furnished Only</span>
                  </label>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bathrooms
                  </label>
                  <select name="baths" defaultValue={baths || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4 Bathrooms</option>
                    <option value="5">5+ Bathrooms</option>
                  </select>
                </div>

                {/* Property Size */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Size (Sqft)
                  </label>
                  <div className="space-y-2">
                    <input name="minSqft" type="number" placeholder="Min Sqft" defaultValue={minSqft || ''}
                      className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input name="maxSqft" type="number" placeholder="Max Sqft" defaultValue={maxSqft || ''}
                      className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Property Status */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Status
                  </label>
                  <select name="completion" defaultValue={completion || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Status</option>
                    <option value="ready">Ready to Move</option>
                    <option value="off-plan">Off-Plan</option>
                    <option value="under-construction">Under Construction</option>
                  </select>
                </div>

                {/* Property Age */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Age
                  </label>
                  <select name="propertyAge" defaultValue={propertyAge || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any Age</option>
                    <option value="new">New (0-1 year)</option>
                    <option value="1-5">1-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                {/* Parking */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parking
                  </label>
                  <select name="parking" defaultValue={parking || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Any</option>
                    <option value="yes">Has Parking</option>
                    <option value="no">No Parking</option>
                  </select>
                </div>

                {/* Location/Area */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <select name="area" defaultValue={area || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Areas</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                    <option value="Dubai Marina">Dubai Marina</option>
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Emirates Hills">Emirates Hills</option>
                    <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                    <option value="Jumeirah Beach Residence">Jumeirah Beach Residence</option>
                    <option value="Business Bay">Business Bay</option>
                  </select>
                </div>

                {/* Developer */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Developer
                  </label>
                  <select name="developer" defaultValue={developer || ''}
                    className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Developers</option>
                    <option value="Emaar">Emaar</option>
                    <option value="Nakheel">Nakheel</option>
                    <option value="DAMAC">DAMAC</option>
                    <option value="Dubai Properties">Dubai Properties</option>
                  </select>
                </div>

                {/* Features/Amenities */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Features & Amenities
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'private_pool', label: 'Private Pool' },
                      { value: 'marina_view', label: 'Marina View' },
                      { value: 'beachfront', label: 'Beachfront' },
                      { value: 'golf_course', label: 'Golf Course' },
                      { value: 'furnished', label: 'Furnished' }
                    ].map(feature => (
                      <label key={feature.value} className="flex items-center">
                        <input
                          name="features"
                          type="checkbox"
                          defaultChecked={features?.split(',').includes(feature.value) || false}
                          value={feature.value}
                          className="rounded border-border text-primary focus:ring-ring"
                        />
                        <span className="ml-2 text-sm text-foreground">{feature.label}</span>
                      </label>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {total} properties found
                </span>
              </div>

              <div className="flex items-center gap-4">
                <form method="get" action="/properties" className="flex items-center gap-2">
                  <input type="hidden" name="action" value={action} />
                  <input type="hidden" name="type" value={type || ''} />
                  <input type="hidden" name="area" value={area || ''} />
                  <input type="hidden" name="developer" value={developer || ''} />
                  <input type="hidden" name="minPrice" value={minPrice || ''} />
                  <input type="hidden" name="maxPrice" value={maxPrice || ''} />
                  <input type="hidden" name="beds" value={beds || ''} />
                  <select name="sortBy" defaultValue={sortBy} className="border border-border rounded-md px-3 py-2 text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <button type="submit" className="px-2 py-1 border rounded bg-white/80">Apply</button>
                </form>

                <div className="flex border border-border rounded-md">
                  <a href={`/properties?${new URLSearchParams({ ...buildQuery(params), view: 'grid' }).toString()}`} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    <ViewColumnsIcon className="h-5 w-5" />
                  </a>
                  <a href={`/properties?${new URLSearchParams({ ...buildQuery(params), view: 'list' }).toString()}`} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                    <QueueListIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            {filteredProperties.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {sortedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={((): PropertyCardProperty => ({
                      id: String(property.id),
                      title: property.title || 'Untitled property',
                      price: (property.price as number) ?? 0,
                      priceLabel: property.priceLabel || 'total',
                      image: (property.image as string) || 'https://via.placeholder.com/400x300?text=No+Image',
                      location: property.location || `${property.area || ''}${property.city ? ', ' + property.city : ''}`,
                      beds: (property.beds as number) ?? 0,
                      baths: (property.baths as number) ?? 0,
                      sqft: (property.sqft as number) ?? 0,
                      type: property.type || '',
                      featured: Boolean(property.featured),
                      currency: property.currency || 'AED',
                      status: property.status || 'sale',
                      area: property.area || undefined,
                      city: property.city || undefined,
                    }))()}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No properties found</h3>
                {fetchError && <p className="mt-1 text-sm text-red-500">{fetchError}</p>}
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center space-x-3">
              {page > 1 ? (
                <a
                  href={`/properties?${new URLSearchParams({ ...buildQuery(params), page: String(page - 1), limit: String(limit) }).toString()}`}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-50"
                >
                  Previous
                </a>
              ) : (
                <span className="px-3 py-1 border rounded text-muted-foreground">Previous</span>
              )}

              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>

              {page < totalPages ? (
                <a
                  href={`/properties?${new URLSearchParams({ ...buildQuery(params), page: String(page + 1), limit: String(limit) }).toString()}`}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-50"
                >
                  Next
                </a>
              ) : (
                <span className="px-3 py-1 border rounded text-muted-foreground">Next</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Agents Section */}
      <PropertyAgents />
    </div>
  )
}

// The page component above is the server-side `export default`.
