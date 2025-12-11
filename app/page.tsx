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

// Mock agents data
const mockAgents = [
  {
    id: 'a1',
    name: 'Sarah Ahmed',
    title: 'Senior Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    experience: '8+ years',
    properties: 150,
    rating: 4.9,
    reviews: 89,
    specialties: ['Luxury Properties', 'Investment Properties'],
  },
  {
    id: 'a2',
    name: 'Ahmed Hassan',
    title: 'Commercial Property Specialist',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    experience: '12+ years',
    properties: 200,
    rating: 4.8,
    reviews: 124,
    specialties: ['Commercial', 'Office Spaces'],
  },
  {
    id: 'a3',
    name: 'Fatima Khan',
    title: 'Luxury Property Consultant',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    experience: '6+ years',
    properties: 95,
    rating: 5.0,
    reviews: 67,
    specialties: ['Luxury Villas', 'High-end Apartments'],
  },
  {
    id: 'a4',
    name: 'Omar Al-Rashid',
    title: 'Property Investment Advisor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    experience: '10+ years',
    properties: 180,
    rating: 4.7,
    reviews: 98,
    specialties: ['Investment Properties', 'Off-plan Projects'],
  },
]

// Mock partners data
const mockPartners = [
  {
    id: 'p1',
    name: 'Dubai Properties',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
    description: 'Leading real estate developer in Dubai',
  },
  {
    id: 'p2',
    name: 'Emaar Properties',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
    description: 'Premium property development company',
  },
  {
    id: 'p3',
    name: 'DAMAC Properties',
    logo: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=200&q=80',
    description: 'Luxury lifestyle and real estate developer',
  },
  {
    id: 'p4',
    name: 'Nakheel Properties',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
    description: 'Master developer of Dubai properties',
  },
  {
    id: 'p5',
    name: 'Dubai Chamber',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&q=80',
    description: 'Business and real estate chamber',
  },
  {
    id: 'p6',
    name: 'REA Dubai',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&q=80',
    description: 'Real Estate Association of Dubai',
  },
]

// Mock blogs data
const mockBlogs = [
  {
    id: 'b1',
    title: 'Dubai Real Estate Market Trends 2024',
    excerpt: 'Discover the latest trends shaping Dubai\'s property market and what it means for investors.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    author: 'Market Analysis Team',
    date: '2024-12-01',
    readTime: '5 min read',
    category: 'Market Insights',
  },
  {
    id: 'b2',
    title: 'Investment Opportunities in Dubai Marina',
    excerpt: 'Why Dubai Marina remains one of the most attractive investment destinations in the UAE.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    author: 'Investment Advisors',
    date: '2024-11-28',
    readTime: '4 min read',
    category: 'Investment',
  },
  {
    id: 'b3',
    title: 'Luxury Living: Dubai\'s Most Exclusive Communities',
    excerpt: 'Explore Dubai\'s premier luxury residential communities and their unique offerings.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    author: 'Luxury Specialist',
    date: '2024-11-25',
    readTime: '6 min read',
    category: 'Luxury',
  },
]

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      // Silently fail for development with placeholder credentials
      return []
    }

    return data || []
  } catch (err) {
    // Silently fail for development with placeholder credentials
    return []
  }
}

async function getLatestProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      // Silently fail for development with placeholder credentials
      return []
    }

    return data || []
  } catch (err) {
    // Silently fail for development with placeholder credentials
    return []
  }
}

export default async function Home({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const params = searchParams || {}
  const initialSearch = (params.search as string) || ''
  const [featuredProperties, latestProperties] = await Promise.all([
    getFeaturedProperties(),
    getLatestProperties(),
  ])

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Dream <span className="text-gradient">Property</span>
              <br />
              in Dubai
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium apartments, villas, plots, and commercial properties
              across major cities in Dubai
            </p>

            {/* Quick Search */}
            <div className="max-w-3xl mx-auto">
              {/* Client-side search component */}
              <HeroSearch initialValue={initialSearch} />

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link
                  href="/apartments"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  Apartments
                </Link>
                <Link
                  href="/villas"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  Villas
                </Link>
                <Link
                  href="/townhouses"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  Townhouses
                </Link>
                <Link
                  href="/residential-plots"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  Residential Plots
                </Link>
                <Link
                  href="/furnished-studio"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  Furnished Studios
                </Link>
                <Link
                  href="/plots"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  All Plots
                </Link>
                <Link
                  href="/properties-dubai"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  All Properties
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  New Projects
                </Link>
                <Link
                  href="/properties?featured=true"
                  className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors"
                >
                  ✨ Featured
                </Link>
              </div>
            </div>
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
            properties={mockFeaturedProperties}
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
            properties={mockRentalProperties}
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

      {/* Latest Properties */}
      {latestProperties.length > 0 && (
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
              {latestProperties.map((property) => (
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
      )}

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
            {mockAgents.map((agent) => (
              <div key={agent.id} className="card-custom group hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  {/* Agent Image */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(agent.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({agent.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{agent.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">{agent.experience} experience</p>

                  {/* Stats */}
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{agent.properties}</div>
                      <div>Properties</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {agent.specialties.map((specialty, index) => (
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

      {/* Partners Section */}
      <section className="section-padding bg-card">
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
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest real estate news, market trends, and expert advice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogs.map((blog) => (
              <article key={blog.id} className="card-custom group overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/blog" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

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
