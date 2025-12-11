import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Database } from '@/lib/database.types'
import ListingCard from '@/components/ListingCard'
import PropertySlider from '@/components/PropertySlider'
import HeroSearch from '@/components/HeroSearch'
import { Metadata } from 'next'
import {
  BuildingOffice2Icon,
  HomeIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  NewspaperIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
// Database types already imported above

export const metadata: Metadata = {
  title: 'RAGDOL - Premium Real Estate in Dubai | Buy, Sell & Rent Properties',
  description: 'Find your dream property in Dubai. Browse luxury apartments, villas, plots, and commercial properties. Premier real estate platform with expert guidance.',
  keywords: 'real estate dubai, property for sale dubai, buy house dubai, luxury apartments dubai, villas dubai, property investment dubai',
  openGraph: {
    title: 'RAGDOL - Premium Real Estate in Dubai',
    description: 'Find your dream property in Dubai. Browse luxury apartments, villas, plots, and commercial properties.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAGDOL - Premium Real Estate in Dubai',
    description: 'Find your dream property in Dubai. Browse luxury apartments, villas, plots, and commercial properties.',
  },
}

type Property = Database['public']['Tables']['properties']['Row']

// Mock featured properties for slider
const mockFeaturedProperties = [
  {
    id: '1',
    title: 'Luxury Penthouse in Downtown Dubai',
    price: 12500000,
    priceLabel: 'total',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    location: 'Downtown Dubai, Dubai',
    beds: 4,
    baths: 5,
    sqft: 4200,
    type: 'Penthouse',
    featured: true,
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
  },
  {
    id: '4',
    title: 'Studio Apartment Downtown Perfect Investment',
    price: 950000,
    priceLabel: 'total',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    location: 'Downtown Dubai, Dubai',
    beds: 1,
    baths: 1,
    sqft: 580,
    type: 'Studio',
    featured: true,
  },
  {
    id: '5',
    title: 'Spacious 2BR Apartment with Terrace',
    price: 2100000,
    priceLabel: 'total',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    location: 'JBR Beach, Dubai',
    beds: 2,
    baths: 2,
    sqft: 1350,
    type: 'Apartment',
    featured: true,
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
    featured: true,
  },
]

// Mock rental properties
const mockRentalProperties = [
  {
    id: 'r1',
    title: 'Furnished Studio with Utilities Included',
    price: 4500,
    priceLabel: 'per_month',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    location: 'Downtown Dubai, Dubai',
    beds: 1,
    baths: 1,
    sqft: 450,
    type: 'Studio',
    featured: false,
  },
  {
    id: 'r2',
    title: 'Modern 2BR Apartment - Furnished',
    price: 8500,
    priceLabel: 'per_month',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    location: 'Dubai Marina, Dubai',
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: 'Apartment',
    featured: false,
  },
  {
    id: 'r3',
    title: 'Luxury Villa with Private Pool',
    price: 18000,
    priceLabel: 'per_month',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    location: 'Arabian Ranches, Dubai',
    beds: 4,
    baths: 4,
    sqft: 4000,
    type: 'Villa',
    featured: false,
  },
  {
    id: 'r4',
    title: 'Cozy 1BR Apartment - Great Location',
    price: 5500,
    priceLabel: 'per_month',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    location: 'JBR Beach, Dubai',
    beds: 1,
    baths: 1,
    sqft: 700,
    type: 'Apartment',
    featured: false,
  },
]

// Type helpers
type AgentRow = Database['public']['Tables']['agents']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type AgentWithProfile = AgentRow & { profiles?: ProfileRow | null }

// Interface for UI properties
interface UIProperty {
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

// Transform database property to UI property
function transformProperty(dbProperty: Property, isRental: boolean = false): UIProperty {
  return {
    id: dbProperty.id || '',
    title: dbProperty.title || 'Untitled Property',
    price: dbProperty.price || 0,
    priceLabel: isRental ? 'per_month' : 'total',
    image: (dbProperty.images && Array.isArray(dbProperty.images) && dbProperty.images[0]) ? dbProperty.images[0] : '/api/placeholder/400/300',
    location: dbProperty.address ? `${dbProperty.address}${dbProperty.area ? ', ' + dbProperty.area : ''}` : 'Dubai',
    beds: dbProperty.beds || 0,
    baths: dbProperty.baths || 0,
    sqft: dbProperty.built_up_area || dbProperty.sqft || 0,
    type: dbProperty.type || 'Property',
    featured: dbProperty.featured || false,
  }
}

// Fetch featured properties (sale status)
async function getFeaturedProperties(limit = 6): Promise<UIProperty[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'sale')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return (data as Property[]).map(p => transformProperty(p, false))
  } catch (err) {
    return []
  }
}

// Fetch rental properties (rent status)
async function getRentalProperties(limit = 4): Promise<UIProperty[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'rent')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return (data as Property[]).map(p => transformProperty(p, true))
  } catch (err) {
    return []
  }
}

// Fetch top agents by rating
async function getTopAgents(limit = 4): Promise<AgentWithProfile[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('agents')
      .select('*, profiles:profiles(*)')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data as AgentWithProfile[]
  } catch (err) {
    return []
  }
}

export default async function HomePage() {
  const topAgents = await getTopAgents()
  const featuredProperties = await getFeaturedProperties()
  const rentalProperties = await getRentalProperties()

  return (
    <div>
      {/* Hero Landing Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
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
                Find Your <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dream Property</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover premium properties in Dubai's most exclusive locations. From luxury apartments to stunning villas, find your perfect home with expert guidance.
              </p>
            </div>

            {/* Search Component */}
            <div className="max-w-3xl mx-auto">
              <HeroSearch />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <Link
                href="/properties"
                className="group px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <HomeIcon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                Browse Properties
              </Link>
              <Link
                href="/projects"
                className="group px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold text-sm hover:bg-secondary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <BuildingOffice2Icon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                New Developments
              </Link>
              <Link
                href="/properties?featured=true"
                className="group px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-full font-semibold text-sm hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <SparklesIcon className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
                Featured Listings
              </Link>
            </div>

            {/* Stats or Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Agents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Video Reels Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Property <span className="text-gradient">Showcase</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore stunning properties through our curated video tours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Video Reel 1 */}
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/thenprogrammer/video/upload/v1764843424/WhatsApp_Video_2025-11-29_at_12.14.53_udvkvk.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm">Luxury Penthouse Tour</h3>
                <p className="text-white/80 text-xs">Downtown Dubai</p>
              </div>
            </div>

            {/* Video Reel 2 */}
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/thenprogrammer/video/upload/v1764843423/WhatsApp_Video_2025-11-29_at_12.13.39_n3dwhm.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm">Beachfront Villa</h3>
                <p className="text-white/80 text-xs">Palm Jumeirah</p>
              </div>
            </div>

            {/* Video Reel 3 */}
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/thenprogrammer/video/upload/v1764843481/WhatsApp_Video_2025-11-29_at_12.19.32_jm5ups.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm">Marina View Apartment</h3>
                <p className="text-white/80 text-xs">Dubai Marina</p>
              </div>
            </div>

            {/* Video Reel 4 */}
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/thenprogrammer/video/upload/v1764843447/WhatsApp_Video_2025-11-29_at_12.18.06_e0j4gz.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm">Modern Townhouse</h3>
                <p className="text-white/80 text-xs">Emirates Hills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Slider */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover hand-picked premium properties from Dubai's most sought-after locations
            </p>
          </div>
          <PropertySlider 
            title=""
            properties={featuredProperties.length > 0 ? featuredProperties : mockFeaturedProperties}
            showCount={4}
          />
        </div>
      </section>

      {/* Rental Properties Slider */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available for <span className="text-gradient">Rent</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible rental options from furnished studios to luxury villas
            </p>
          </div>
          <PropertySlider
            title=""
            properties={rentalProperties.length > 0 ? rentalProperties : mockRentalProperties}
            showCount={4}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore by <span className="text-gradient">Category</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/properties?status=sale"
              className="group card-custom hover:border-primary transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <HomeIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Buy Property
                  </h3>
                  <p className="text-sm text-muted-foreground">Find your dream home</p>
                </div>
              </div>
            </Link>

            <Link
              href="/properties?status=rent"
              className="group card-custom hover:border-primary transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BuildingOffice2Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Rent Property
                  </h3>
                  <p className="text-sm text-muted-foreground">Flexible rental options</p>
                </div>
              </div>
            </Link>

            <Link
              href="/projects"
              className="group card-custom hover:border-primary transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <SparklesIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    New Projects
                  </h3>
                  <p className="text-sm text-muted-foreground">Off-plan developments</p>
                </div>
              </div>
            </Link>

            <Link
              href="/market"
              className="group card-custom hover:border-primary transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Market Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">Data & analytics</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Properties - TODO: Implement with real data */}
      {/* {mockFeaturedProperties.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Latest <span className="text-gradient">Listings</span>
                </h2>
                <p className="text-muted-foreground">
                  Recently added properties
                </p>
              </div>
              <Link
                href="/properties"
                className="btn-outline hidden md:block"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockFeaturedProperties.map((property) => (
                <ListingCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/properties" className="btn-outline">
                View All Properties
              </Link>
            </div>
          </div>
        </section>
      )} */}

      {/* Top Agents Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-gradient">Top Agents</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced real estate professionals who know Dubai inside out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topAgents.map((agent) => (
              <div key={agent.id} className="card-custom group hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  {/* Agent Image */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted">
                      <img
                        src={agent.profiles?.avatar_url || agent.profile_image || '/api/placeholder/96/96'}
                        alt={agent.profiles?.full_name || agent.title || 'Agent'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(agent.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({agent.review_count ?? 0})
                      </span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {agent.profiles?.full_name || agent.title || 'Agent'}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{agent.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">{agent.experience_years ?? 'N/A'} experience</p>

                  {/* Stats */}
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{agent.total_sales ?? agent.total_sales ?? '—'}</div>
                      <div>Properties</div>
                    </div>
                  </div>

                  {/* Specialties */}
                    <div className="flex flex-wrap gap-1 justify-center">
                    {(agent.specializations || []).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Contact Button */}
                  <Link
                    href={`/agents/${agent.id}`}
                    className="btn-primary w-full mt-4 inline-block text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/agents" className="btn-outline">
              View All Agents
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section - TODO: Implement with real data */}
      {/* <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted <span className="text-gradient">Partners</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We collaborate with Dubai's leading real estate developers and organizations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {mockPartners.map((partner) => (
              <div
                key={partner.id}
                className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-background transition-colors"
              >
                <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Blog Section - TODO: Implement with real data */}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Sell Your Property?
            </h2>
            <p className="text-lg text-muted-foreground">
              Get connected with thousands of potential buyers and our expert agents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell" className="btn-primary">
                List Your Property
              </Link>
              <Link href="/agents/register" className="btn-outline">
                Become an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
