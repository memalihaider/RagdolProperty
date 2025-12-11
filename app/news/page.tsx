'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NewspaperIcon, CalendarDaysIcon, UserIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const newsArticles = [
  {
    id: 1,
    title: 'Dubai Real Estate Market Shows Strong Q4 Growth',
    excerpt: 'The Dubai property market continues to demonstrate resilience with significant growth in both residential and commercial sectors.',
    date: 'December 5, 2025',
    author: 'Market Analysis Team',
    category: 'Market Report',
    readTime: '5 min read',
    featured: true,
    image: '/api/placeholder/600/400'
  },
  {
    id: 2,
    title: 'New Luxury Developments Launch in Dubai Marina',
    excerpt: 'Several high-end residential projects have been announced in Dubai Marina, offering premium waterfront living options.',
    date: 'December 3, 2025',
    author: 'Development News',
    category: 'New Developments',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 3,
    title: 'Commercial Property Investment Trends in 2026',
    excerpt: 'Analysis of emerging trends in commercial real estate investment and their impact on Dubai\'s business landscape.',
    date: 'December 1, 2025',
    author: 'Investment Team',
    category: 'Investment',
    readTime: '6 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 4,
    title: 'Dubai Ranks Top Global Real Estate Destination',
    excerpt: 'Dubai maintains its position as the world\'s most attractive real estate market according to latest global rankings.',
    date: 'November 28, 2025',
    author: 'International Reports',
    category: 'Global Rankings',
    readTime: '3 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 5,
    title: 'Sustainable Building Practices in UAE Real Estate',
    excerpt: 'How green building initiatives are transforming the construction industry and property values in the UAE.',
    date: 'November 25, 2025',
    author: 'Sustainability Team',
    category: 'Sustainability',
    readTime: '7 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  },
  {
    id: 6,
    title: 'Holiday Season Property Market Update',
    excerpt: 'Seasonal trends and opportunities in Dubai\'s real estate market during the holiday period.',
    date: 'November 22, 2025',
    author: 'Seasonal Analysis',
    category: 'Market Update',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/600/400'
  }
]

const categories = ['All', 'Market Report', 'New Developments', 'Investment', 'Global Rankings', 'Sustainability', 'Market Update']

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('latest')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticle = newsArticles.find(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
              Real Estate News
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Stay informed with the latest Dubai real estate market insights and industry updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Latest Updates
              </button>
              <button
                className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
                style={{ borderColor: '#d4af37', color: '#d4af37' }}
              >
                Market Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['latest', 'market-reports', 'developments', 'insights'].map((tab) => (
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
        {activeTab === 'latest' && (
          <div className="space-y-12">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#d4af37' }} />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#d4af37] text-[#0d0d0d]'
                        : 'bg-[#262626] text-[#f5f5f5] hover:bg-[#d4af37] hover:text-[#0d0d0d]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Article */}
            {featuredArticle && (
              <div className="relative overflow-hidden rounded-lg" style={{ backgroundColor: '#141414' }}>
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div
                      className="h-64 md:h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${featuredArticle.image})` }}
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
                      >
                        Featured
                      </span>
                      <span className="ml-4 text-sm" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
                      {featuredArticle.title}
                    </h2>
                    <p className="mb-6" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                        <UserIcon className="h-4 w-4 mr-1" />
                        {featuredArticle.author}
                        <span className="mx-2">•</span>
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        {featuredArticle.date}
                        <span className="mx-2">•</span>
                        {featuredArticle.readTime}
                      </div>
                      <Link
                        href={`/news/${featuredArticle.id}`}
                        className="flex items-center text-sm font-medium transition-colors"
                        style={{ color: '#d4af37' }}
                      >
                        Read More
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="block rounded-lg overflow-hidden border transition-transform hover:scale-105"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: '#262626', color: '#d4af37' }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs" style={{ color: '#f5f5f5', opacity: 0.6 }}>
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#f5f5f5', opacity: 0.6 }}>
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'market-reports' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Market Reports & Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'Market Report' || article.category === 'Market Update').map((article) => (
                <div
                  key={article.id}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                    {article.title}
                  </h3>
                  <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#f5f5f5', opacity: 0.6 }}>{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-medium transition-colors"
                      style={{ color: '#d4af37' }}
                    >
                      Read Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'developments' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              New Developments & Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'New Developments').map((article) => (
                <div
                  key={article.id}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                    {article.title}
                  </h3>
                  <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#f5f5f5', opacity: 0.6 }}>{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-medium transition-colors"
                      style={{ color: '#d4af37' }}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Investment Insights & Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsArticles.filter(article => article.category === 'Investment' || article.category === 'Global Rankings' || article.category === 'Sustainability').map((article) => (
                <div
                  key={article.id}
                  className="p-6 rounded-lg border"
                  style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                >
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                    {article.title}
                  </h3>
                  <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#f5f5f5', opacity: 0.6 }}>{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-medium transition-colors"
                      style={{ color: '#d4af37' }}
                    >
                      Read Analysis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-6" style={{ color: '#d4af37' }} />
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Stay Updated with Latest News
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Subscribe to our newsletter for exclusive market insights and property updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
              style={{
                borderColor: '#d4af37',
                backgroundColor: '#262626',
                color: '#f5f5f5'
              }}
            />
            <button
              className="px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}