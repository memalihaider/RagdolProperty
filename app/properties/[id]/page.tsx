import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'
import PropertyImageGallery from '@/components/PropertyImageGallery'
import PropertySlider from '@/components/PropertySlider'
import PropertyAgents from '@/components/PropertyAgents'
import {
  MapPinIcon,
  HomeIcon,
  Square3Stack3DIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  PhotoIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

type Property = Database['public']['Tables']['properties']['Row'] & {
  agent?: Database['public']['Tables']['profiles']['Row'] & {
    agent_details?: Database['public']['Tables']['agents']['Row']
  }
  project?: Database['public']['Tables']['projects']['Row']
}

type RelatedProperty = Database['public']['Tables']['properties']['Row']

// Mock property data for development
const mockProperty = {
  id: '1',
  title: 'Luxury Penthouse in Downtown Dubai',
  location: 'Downtown Dubai, Dubai',
  slug: 'luxury-penthouse-downtown-dubai',
  description: `Experience unparalleled luxury living in this stunning penthouse located in the heart of Downtown Dubai. This exquisite residence offers breathtaking views of the iconic Burj Khalifa and Dubai Fountain, combining modern elegance with world-class amenities.

The penthouse features an open-concept living space with floor-to-ceiling windows that flood the interior with natural light. The gourmet kitchen is equipped with top-of-the-line appliances and premium finishes. The master suite includes a walk-in closet and a spa-like ensuite bathroom.

Residents enjoy access to exclusive building amenities including a rooftop pool, fitness center, concierge services, and valet parking. Located in Dubai's premier business and entertainment district, you're just steps away from fine dining, shopping, and cultural attractions.`,
  type: 'apartment',
  status: 'sale',
  property_status: 'ready',
  price: 12500000,
  currency: 'AED',
  beds: 4,
  baths: 5,
  sqft: 4200,
  images: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&q=80',
  ],
  floorplans: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  ],
  features: [
    'Swimming Pool',
    'Gym & Fitness Center',
    'Concierge Service',
    'Valet Parking',
    'Rooftop Terrace',
    'Floor-to-Ceiling Windows',
    'Premium Appliances',
    'Walk-in Closets',
    'Smart Home System',
    '24/7 Security',
    'Balcony',
    'Built-in Wardrobes',
  ],
  address: 'Downtown Dubai, Dubai',
  city: 'Dubai',
  area: 'Downtown Dubai',
  coords: { lat: 25.1972, lng: 55.2744 },
  published: true,
  featured: true,
  views_count: 1250,
  created_at: '2024-11-15T10:00:00Z',
  updated_at: '2024-12-01T15:30:00Z',
  agent_id: 'agent-1',
  project_id: null,
  developer_id: null,
  // Additional required fields from database schema
  amenities: ['Pool', 'Gym', 'Security', 'Parking'],
  built_up_area: 4200,
  district: 'Downtown Dubai',
  expires_at: null,
  furnished: false,
  listing_type: 'exclusive',
  parking_spaces: 2,
  plot_area: null,
  price_per_sqft: 2976,
  property_age: 2,
  reference_no: 'RD-2024-001',
  rent_frequency: null,
  seo_description: 'Luxury penthouse with Burj Khalifa views in Downtown Dubai',
  seo_keywords: ['penthouse', 'luxury', 'Downtown Dubai', 'Burj Khalifa'],
  seo_title: 'Luxury Penthouse Downtown Dubai | Premium Property',
  sold_at: null,
  video_url: 'https://example.com/property-video.mp4',
  virtual_tour_url: 'https://example.com/virtual-tour',
  year_built: 2022,
  // Additional missing fields
  favorites_count: 45,
  floor_number: 45,
  furnishing: 'furnished',
  image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  inquiries_count: 23,
  landmark: 'Burj Khalifa',
  last_viewed: '2024-12-01T15:30:00Z',
  meta_data: { 'property_type': 'luxury', 'view_type': 'city' },
  neighborhood: 'Business Bay',
  original_price: 13500000,
  plot_size: null,
  premium: true,
  short_description: 'Stunning penthouse with Burj Khalifa views',
  total_floors: 50,
  urgent: false,
  verified: true,
}

const mockAgent = {
  id: 'agent-1',
  full_name: 'Sarah Ahmed',
  role: 'agent',
  email: 'sarah.ahmed@ragdol.ae',
  phone: '+971 50 123 4567',
  avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-01T15:30:00Z',
  // Additional required profile fields
  bio: 'With over 8 years of experience in Dubai\'s luxury real estate market, I specialize in helping clients find their dream properties in the most prestigious locations.',
  email_verified: true,
  last_login: '2024-12-01T15:30:00Z',
  location: 'Dubai, UAE',
  login_count: 245,
  phone_verified: true,
  preferences: { 'notifications': true, 'language': 'en' },
  social_links: {
    linkedin: 'https://linkedin.com/in/sarah-ahmed',
    instagram: '@sarah_realestate_dubai'
  },
  agent_details: {
    id: 'agent-1',
    profile_id: 'user-1',
    office: 'Dubai Downtown Office',
    license_no: '123456789',
    bio: 'With over 8 years of experience in Dubai\'s luxury real estate market, I specialize in helping clients find their dream properties in the most prestigious locations. My deep knowledge of the market and commitment to personalized service have helped hundreds of families find their perfect home.',
    areas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Emirates Hills'],
    whatsapp: '+971501234567',
    social: {
      linkedin: 'https://linkedin.com/in/sarah-ahmed',
      instagram: '@sarah_realestate_dubai'
    },
    approved: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T15:30:00Z',
    // Additional required agent fields
    brokerage: 'RAGDOL Real Estate',
    certifications: ['RERA Certified', 'Luxury Property Specialist'],
    commission_rate: 2.5,
    experience_years: 8,
    languages: ['English', 'Arabic'],
    properties_sold: 156,
    rating: 4.8,
    reviews_count: 89,
    specializations: ['Luxury Properties', 'Investment Properties', 'Off-Plan'],
    total_sales: 450000000,
    website: 'https://sarah-ahmed.ragdol.ae'
  }
}

const mockRelatedProperties = [
  {
    id: '2',
    title: 'Modern Villa with Private Beach',
    price: 8900000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    location: 'Palm Jumeirah, Dubai',
    beds: 5,
    baths: 6,
    sqft: 5500,
    type: 'villa',
    status: 'sale',
    featured: true,
  },
  {
    id: '3',
    title: 'Contemporary Apartment Marina View',
    price: 3200000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    location: 'Dubai Marina, Dubai',
    beds: 3,
    baths: 3,
    sqft: 2100,
    type: 'apartment',
    status: 'sale',
    featured: false,
  },
  {
    id: '4',
    title: 'Premium Luxury Townhouse',
    price: 6500000,
    currency: 'AED',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    location: 'Emirates Hills, Dubai',
    beds: 4,
    baths: 4,
    sqft: 3800,
    type: 'townhouse',
    status: 'sale',
    featured: false,
  },
]

async function getProperty(id: string): Promise<Property | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        agent:profiles!agent_id(
          *,
          agent_details:agents(*)
        ),
        project:projects(*)
      `)
      .eq('id', id)
      .eq('published', true)
      .single()

    if (error) {
      // Return mock data for development
      return { ...mockProperty, agent: mockAgent } as unknown as Property
    }

    return data as unknown as Property
  } catch (err) {
    // Return mock data for development
    return { ...mockProperty, agent: mockAgent } as unknown as Property
  }
}

async function getRelatedProperties(currentPropertyId: string): Promise<RelatedProperty[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true)
      .neq('id', currentPropertyId)
      .limit(3)

    if (error) {
      // Return mock data for development
      return mockRelatedProperties as unknown as RelatedProperty[]
    }

    return data || []
  } catch (err) {
    // Return mock data for development
    return [
      {
        id: '2',
        title: 'Modern Villa with Private Beach',
        description: undefined,
        price: 8900000,
        currency: 'AED',
        location: 'Palm Jumeirah, Dubai',
        beds: 5,
        baths: 6,
        sqft: 5500,
        type: 'Villa',
        status: 'sale',
        featured: true,
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Contemporary Apartment Marina View',
        description: undefined,
        price: 3200000,
        currency: 'AED',
        location: 'Dubai Marina, Dubai',
        beds: 3,
        baths: 3,
        sqft: 2100,
        type: 'Apartment',
        status: 'sale',
        featured: true,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ] as unknown as RelatedProperty[]
  }
}

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const property = await getProperty(id)
  const relatedProperties = await getRelatedProperties(id)

  if (!property) {
    notFound()
  }

  const formatPrice = (price: number, currency: string = 'AED') => {
    return `${currency} ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-muted/50">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Property Header */}
      <section className="bg-gradient-to-r from-card to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/properties"
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-600 transition-colors w-fit group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Properties</span>
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-lg font-medium text-sm transition-colors">
                <ShareIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-lg font-medium text-sm transition-colors">
                <HeartIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery
              images={property.images || []}
              title={property.title}
              status={property.status || 'sale'}
              property_status={property.property_status || 'ready'}
              featured={property.featured || false}
            />

            {/* Property Details */}
            <div className="bg-black-800 border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-lg text-white">
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-3">{property.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 mb-2 sm:mb-0">
                      <MapPinIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <span className="text-base sm:text-lg font-medium text-white">{property.address}, {property.city}</span>
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">
                    {formatPrice(property.price, property.currency || 'AED')}
                  </div>
                  <div className="text-sm text-gray-300">
                    {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                      <HomeIcon className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-white">Beds</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.beds || 'N/A'}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                      <Square3Stack3DIcon className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-white">Baths</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.baths || 'N/A'}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                      <HomeIcon className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-white">Area</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.sqft?.toLocaleString() || 'N/A'}<span className="text-sm font-normal ml-1">sqft</span></div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                      <EyeIcon className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-white">Views</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{property.views_count?.toLocaleString() || 0}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-600 pt-6">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                    📝 Description
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-200 leading-relaxed text-base whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="border-t border-gray-600 pt-6">
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                      ✨ Features & Amenities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <CheckCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <span className="text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floor Plans */}
                {property.floorplans && property.floorplans.length > 0 && (
                  <div className="border-t border-gray-600 pt-6">
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                      <DocumentTextIcon className="w-6 h-6" />
                      Floor Plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.floorplans.map((floorplan, index) => (
                        <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-700 border border-gray-600 group cursor-pointer">
                          <Image
                            src={floorplan}
                            alt={`Floor plan ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Full Size
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Details */}
                <div className="border-t border-gray-600 pt-6">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                    📊 Property Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Property Type</span>
                        <span className="text-white font-semibold capitalize">{property.type}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Status</span>
                        <span className="text-white font-semibold capitalize">{property.property_status?.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Area</span>
                        <span className="text-white font-semibold">{property.area}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">City</span>
                        <span className="text-white font-semibold">{property.city}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Listed</span>
                        <span className="text-white font-semibold">{property.created_at ? formatDate(property.created_at) : 'Not available'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Updated</span>
                        <span className="text-white font-semibold">{property.updated_at ? formatDate(property.updated_at) : 'Not available'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <span className="text-gray-300 font-medium">Reference ID</span>
                        <span className="text-white font-semibold font-mono text-sm">{property.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
            {/* Agent Card */}
            {property.agent && (
              <div className="bg-black-800 border border-gray-700 rounded-2xl p-6 shadow-lg min-h-[400px]">
                <div className="text-center">
                  {/* Agent Photo */}
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-600 shadow-lg">
                    <Image
                      src={property.agent.avatar_url || 'https://via.placeholder.com/96x96?text=Agent'}
                      alt={property.agent.full_name || 'Agent'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Agent Info */}
                  <h3 className="text-lg font-bold text-white mb-1">
                    {property.agent.full_name}
                  </h3>
                  <p className="text-yellow-600 font-semibold mb-3 text-sm">
                    {property.agent.agent_details?.office || 'Real Estate Agent'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      4.9 (89 reviews)
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        8
                      </div>
                      <div className="text-xs text-gray-400">Years Exp.</div>
                    </div>
                    <div className="bg-black-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        150
                      </div>
                      <div className="text-xs text-gray-400">Properties</div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                      <PhoneIcon className="w-4 h-4 inline mr-2" />
                      Call Agent
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
                      WhatsApp
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                      <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                      Email
                    </button>
                    {/* View Profile Button */}
                    <Link
                      href={`/agents/${property.agent?.agent_details?.id || property.agent?.id}`}
                      className="w-full block text-center py-3 px-4 rounded-lg font-semibold text-sm bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>

                  {/* Bio */}
                  {property.agent.agent_details?.bio && (
                    <div className="mt-6 pt-4 border-t border-gray-600">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {property.agent.agent_details.bio}
                      </p>
                    </div>
                  )}

                  {/* Specialties */}
                  {property.agent.agent_details?.areas && property.agent.agent_details.areas.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {property.agent.agent_details.areas.slice(0, 3).map((area, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-yellow-600/20 text-yellow-600 rounded-full font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-black-800 border border-gray-700 rounded-2xl p-6 shadow-lg text-white min-h-[400px]">
              <h3 className="text-lg font-bold text-yellow-600 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href={`/inquire/${property.id}`}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors text-center block"
                >
                  💬 Ask Questions
                </Link>
                <Link
                  href={`/apply/${property.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors text-center block"
                >
                  📝 Apply for Property
                </Link>
                <button className="bg-black-700 hover:bg-black-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                  📅 Schedule Viewing
                </button>
                <button className="bg-black-700 hover:bg-black-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                  📋 Request More Info
                </button>
                <button className="bg-black-700 hover:bg-black-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                  ⚖️ Compare Properties
                </button>
                <button className="bg-black-700 hover:bg-black-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                  🖨️ Print Details
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-black-800 border border-gray-700 rounded-2xl p-6 shadow-lg min-h-[400px]">
              <h3 className="text-lg font-bold text-yellow-600 mb-4">Get In Touch</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Message (optional)"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-colors resize-none bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-all shadow-md"
                >
                  📤 Send Message
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3 text-center">
                We'll get back to you within 24 hours
              </p>
            </div>

            {/* Property Value Calculator */}
            <div className="bg-black-800 border border-gray-700 rounded-2xl p-6 shadow-lg text-white min-h-[400px]">
              <h3 className="text-lg font-bold text-yellow-600 mb-4">Property Value</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300 text-sm">Price per sqft</span>
                  <span className="text-white font-semibold">
                    {property.sqft ? formatPrice(Math.round(property.price / property.sqft), property.currency || 'AED') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300 text-sm">Estimated Value</span>
                  <span className="text-white font-semibold">
                    {formatPrice(property.price, property.currency || 'AED')}
                  </span>
                </div>
                <button className="w-full bg-black-700 hover:bg-black-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-600">
                  📊 Get Full Valuation Report
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Similar <span className="text-yellow-600">Properties</span>
              </h2>
              <p className="text-lg text-gray-300">
                Discover more properties you might be interested in
              </p>
            </div>
            <PropertySlider
              title=""
              properties={relatedProperties.map(prop => ({
                id: prop.id,
                title: prop.title,
                price: prop.price,
                priceLabel: prop.status === 'sale' ? 'total' : 'per_month',
                image: prop.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
                location: `${prop.area}, ${prop.city}`,
                beds: prop.beds || 0,
                baths: prop.baths || 0,
                sqft: prop.sqft || 0,
                type: prop.type || 'apartment',
                featured: prop.featured || false,
              }))}
              showCount={3}
            />
          </section>
        )}

        {/* Featured Agents Section */}
        <PropertyAgents />
      </div>
    </div>
  )
}