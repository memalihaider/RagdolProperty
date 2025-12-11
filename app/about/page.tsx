import { BuildingOfficeIcon, UsersIcon, TrophyIcon, ShieldCheckIcon, HeartIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About RAGDOL - Premier Real Estate Platform in Dubai',
  description: 'Learn about RAGDOL, Dubai\'s premier real estate platform. 15+ years of experience, 50,000+ properties, serving 25,000+ happy customers across 50+ cities.',
  keywords: 'about ragdol, real estate dubai, property platform dubai, real estate company dubai, property experts dubai',
  openGraph: {
    title: 'About RAGDOL - Premier Real Estate Platform in Dubai',
    description: 'Learn about RAGDOL, Dubai\'s premier real estate platform with 15+ years of experience and 50,000+ properties.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About RAGDOL - Premier Real Estate Platform in Dubai',
    description: 'Learn about RAGDOL, Dubai\'s premier real estate platform with 15+ years of experience.',
  },
}

export default function AboutPage() {
  const stats = [
    { label: 'Properties Listed', value: '50,000+', icon: BuildingOfficeIcon },
    { label: 'Happy Customers', value: '25,000+', icon: UsersIcon },
    { label: 'Years of Experience', value: '15+', icon: TrophyIcon },
    { label: 'Cities Covered', value: '50+', icon: GlobeAltIcon },
  ]

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency in all our dealings, ensuring our clients always know what to expect.'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations in every interaction.'
    },
    {
      icon: UsersIcon,
      title: 'Expert Team',
      description: 'Our team of experienced professionals brings decades of combined expertise to serve you better.'
    },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-[#d4af37]">RAGDOL</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              UAE's premier real estate platform, connecting dreams with reality since 2010.
              We make property buying, selling, and renting simple, transparent, and rewarding.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-[#1a1a1a]" />
              </div>
              <div className="text-3xl font-bold text-[#d4af37] mb-2">{stat.value}</div>
              <div className="text-[#a3a3a3]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-[#141414] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-[#a3a3a3] text-lg leading-relaxed mb-6">
                To revolutionize the real estate industry in UAE by providing a seamless,
                transparent, and technology-driven platform that empowers both buyers and sellers
                to make informed decisions and achieve their property goals.
              </p>
              <p className="text-[#a3a3a3] text-lg leading-relaxed">
                We believe that finding the perfect property should be an exciting journey,
                not a stressful ordeal. That's why we've built RAGDOL to be more than just
                a marketplace – it's your trusted partner in real estate.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-32 w-32 text-[#d4af37]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[#141414] p-8 rounded-lg border border-[#333333] text-center">
                <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-[#1a1a1a]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-[#a3a3a3] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-[#141414] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-[#a3a3a3] leading-relaxed">
                <p>
                  Founded in 2010, RAGDOL began as a small real estate agency in Dubai with
                  a simple mission: to make property transactions fair, transparent, and efficient.
                </p>
                <p>
                  What started as a local operation quickly grew as word spread about our
                  commitment to customer satisfaction and innovative approach to real estate.
                  Today, we serve customers across UAE and have expanded our reach
                  internationally.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, from pioneering
                  online property listings to developing advanced search and filtering tools
                  that make finding the perfect property easier than ever.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-square bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="h-32 w-32 text-[#d4af37]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-[#a3a3a3] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect property with RAGDOL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/properties"
              className="bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Browse Properties
            </a>
            <a
              href="/sell"
              className="bg-[#262626] hover:bg-[#333333] text-[#f5f5f5] font-semibold py-3 px-8 rounded-lg border border-[#333333] transition-colors"
            >
              List Your Property
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}