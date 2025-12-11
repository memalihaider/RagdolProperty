'use client'

import { useState } from 'react'
import { ChartBarIcon, GlobeAltIcon, BuildingOfficeIcon, CurrencyDollarIcon, ShieldCheckIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const investmentReasons = [
  {
    title: 'Zero Capital Gains Tax',
    description: 'Dubai offers 0% capital gains tax on property sales, allowing investors to keep 100% of their profits.',
    icon: CurrencyDollarIcon,
    stats: 'Save up to 20-30% vs other markets'
  },
  {
    title: 'Stable Economy & Currency',
    description: 'Dubai\'s economy is pegged to the US Dollar, providing currency stability and economic predictability.',
    icon: ArrowTrendingUpIcon,
    stats: 'USD pegged since 1997'
  },
  {
    title: 'World-Class Infrastructure',
    description: 'Dubai boasts exceptional infrastructure including the world\'s busiest airport, modern metro, and smart city initiatives.',
    icon: BuildingOfficeIcon,
    stats: 'Dubai International Airport: 90M+ passengers/year'
  },
  {
    title: 'Strategic Location',
    description: 'Dubai serves as a gateway between East and West, with excellent connectivity to major global markets.',
    icon: GlobeAltIcon,
    stats: 'Direct flights to 280+ destinations'
  },
  {
    title: 'Strong Legal Framework',
    description: 'Dubai offers clear property laws, strong contract enforcement, and protection for foreign investors.',
    icon: ShieldCheckIcon,
    stats: 'Ranked #1 in MENA for investor protection'
  },
  {
    title: 'Growing Population & Demand',
    description: 'Dubai\'s population is growing rapidly, driving demand for residential and commercial properties.',
    icon: ChartBarIcon,
    stats: 'Population growth: 3.5M to 4.5M by 2030'
  }
]

const marketData = [
  { year: '2020', price: 100, rental: 100 },
  { year: '2021', price: 115, rental: 108 },
  { year: '2022', price: 135, rental: 118 },
  { year: '2023', price: 160, rental: 132 },
  { year: '2024', price: 190, rental: 148 },
  { year: '2025', price: 225, rental: 165 }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    country: 'UK',
    investment: 'AED 5M Portfolio',
    quote: 'Dubai property has been our best investment decision. The returns are consistent and the lifestyle is unmatched.',
    returns: '+45% in 3 years'
  },
  {
    name: 'Ahmed Al-Rashid',
    country: 'Saudi Arabia',
    investment: 'AED 8M Commercial',
    quote: 'The business environment in Dubai is world-class. Our commercial property investment has exceeded all expectations.',
    returns: '+60% in 4 years'
  },
  {
    name: 'Maria Gonzalez',
    country: 'Spain',
    investment: 'AED 3M Residential',
    quote: 'Moving to Dubai and investing in property was the best decision for our family. The growth potential is incredible.',
    returns: '+35% in 2 years'
  }
]

const benefits = [
  '100% foreign ownership in freehold areas',
  'No capital gains tax on property sales',
  'Stable currency pegged to USD',
  'World-class healthcare and education',
  'Tax-free income for many investors',
  'Modern infrastructure and smart city initiatives',
  'Strategic location for business expansion',
  'Growing tourism and business sectors',
  'Strong legal protection for investors',
  'Easy repatriation of profits'
]

export default function WhyInvestDubaiPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
              Why Invest in Dubai?
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Discover why Dubai is the world's premier destination for property investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Start Investing Today
              </button>
              <button
                className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
                style={{ borderColor: '#d4af37', color: '#d4af37' }}
              >
                Download Investment Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'market-data', 'testimonials', 'benefits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-[#f5f5f5] hover:text-[#d4af37]'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Overview */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
                World's Leading Investment Destination
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                Dubai has established itself as the premier global destination for property investment,
                offering unparalleled opportunities for both individual and institutional investors.
              </p>
            </div>

            {/* Key Investment Reasons */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
                Why Dubai Stands Out
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {investmentReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border text-center"
                    style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                  >
                    <reason.icon className="h-12 w-12 mx-auto mb-4" style={{ color: '#d4af37' }} />
                    <h3 className="text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                      {reason.title}
                    </h3>
                    <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                      {reason.description}
                    </p>
                    <div className="text-sm font-medium" style={{ color: '#d4af37' }}>
                      {reason.stats}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>125%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Average Property Appreciation (5 years)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>7.2%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Average Rental Yield</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>0%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Capital Gains Tax</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>280+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Direct Flight Destinations</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market-data' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Dubai Property Market Performance
            </h2>

            {/* Market Chart Simulation */}
            <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: '#141414', border: '1px solid #d4af37' }}>
              <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: '#f5f5f5' }}>
                Property Price & Rental Index (2020-2025)
              </h3>
              <div className="space-y-6">
                {marketData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="w-16 font-medium" style={{ color: '#f5f5f5' }}>{data.year}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: '#f5f5f5', opacity: 0.6 }}>Property Price</div>
                          <div className="w-full bg-[#262626] rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(data.price / 225) * 100}%`,
                                backgroundColor: '#d4af37'
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium w-12 text-right" style={{ color: '#d4af37' }}>
                          {data.price}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: '#f5f5f5', opacity: 0.6 }}>Rental Index</div>
                          <div className="w-full bg-[#262626] rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(data.rental / 165) * 100}%`,
                                backgroundColor: '#f5f5f5'
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium w-12 text-right" style={{ color: '#f5f5f5' }}>
                          {data.rental}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#d4af37' }}>Price Growth</h3>
                <p className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>125%</p>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Average increase over 5 years</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#d4af37' }}>Rental Yield</h3>
                <p className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>7.2%</p>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Average gross rental yield</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#d4af37' }}>Occupancy Rate</h3>
                <p className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>92%</p>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Average property occupancy</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Success Stories from Dubai Investors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <div className="mb-4">
                    <div className="text-lg font-semibold mb-1" style={{ color: '#d4af37' }}>
                      {testimonial.returns}
                    </div>
                    <div className="text-sm" style={{ color: '#f5f5f5', opacity: 0.6 }}>
                      {testimonial.investment}
                    </div>
                  </div>
                  <blockquote className="mb-4 italic" style={{ color: '#f5f5f5', opacity: 0.9 }}>
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-medium" style={{ color: '#f5f5f5' }}>{testimonial.name}</div>
                    <div className="text-sm" style={{ color: '#f5f5f5', opacity: 0.6 }}>{testimonial.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Complete Investment Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg"
                  style={{ backgroundColor: '#141414' }}
                >
                  <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: '#d4af37' }} />
                  <span style={{ color: '#f5f5f5' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Ready to Start Your Dubai Investment Journey?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Join thousands of successful investors who have discovered Dubai's unparalleled investment potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              Get Investment Consultation
            </button>
            <button
              className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
              style={{ borderColor: '#d4af37', color: '#d4af37' }}
            >
              Schedule Property Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}