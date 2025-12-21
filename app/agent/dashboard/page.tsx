'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderIcon,
  EnvelopeIcon,
  EyeIcon,
  HeartIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface AgentStats {
  total_properties: number
  active_properties: number
  applications_received: number
  applications_pending: number
  total_views: number
  total_favorites: number
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats>({
    total_properties: 12,
    active_properties: 8,
    applications_received: 45,
    applications_pending: 12,
    total_views: 1240,
    total_favorites: 89,
  })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [recentProperties, setRecentProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch recent applications
      const appsRes = await fetch('/api/agent/applications?limit=5')
      const appsData = await appsRes.json()
      setRecentApplications(appsData.applications || [])

      // Fetch recent properties
      const propsRes = await fetch('/api/agent/properties?limit=3')
      const propsData = await propsRes.json()
      setRecentProperties(propsData.properties || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Active Listings', value: stats.active_properties, icon: BuildingOfficeIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Views', value: stats.total_views, icon: EyeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Leads', value: stats.applications_pending, icon: UserGroupIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Favorites', value: stats.total_favorites, icon: HeartIcon, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      {/* Top Navigation / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <SparklesIcon className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Elite Agent Portal</span>
          </div>
          <h1 className="text-4xl font-serif text-secondary">
            Command <span className="text-primary italic">Center</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 w-64 transition-all"
            />
          </div>
          <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <Link href="/agent/properties/new" className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-lg shadow-secondary/20">
            <PlusIcon className="h-5 w-5" />
            New Listing
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${stat.bg} rounded-2xl transition-colors`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Growth</div>
                <div className="text-emerald-500 font-bold text-sm">+12%</div>
              </div>
            </div>
            <div className="text-4xl font-serif text-secondary mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm uppercase tracking-widest font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Recent Leads */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-serif text-secondary">Recent Inquiries</h3>
              <Link href="/agent/applications" className="text-primary font-bold text-sm hover:underline underline-offset-4">View All Leads</Link>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center gap-6 p-6 hover:bg-slate-50 rounded-[2rem] transition-all group border border-transparent hover:border-slate-100">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                    {['JD', 'AS', 'MK', 'RL'][i]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-secondary font-bold text-lg group-hover:text-primary transition-colors">
                        {['John Doe', 'Alice Smith', 'Michael Knight', 'Rose Lee'][i]}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-tighter">New</span>
                    </div>
                    <div className="text-sm text-slate-400 flex items-center gap-4">
                      <span className="flex items-center gap-1"><EnvelopeIcon className="h-3 w-3" /> inquiry@example.com</span>
                      <span className="flex items-center gap-1"><BuildingOfficeIcon className="h-3 w-3" /> Palm Jumeirah Penthouse</span>
                    </div>
                  </div>
                  <button className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all">
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-serif mb-6">Performance <span className="text-primary italic">Insights</span></h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Listing Completion</span>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Response Rate</span>
                  <span className="text-primary font-bold">98%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[98%]"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white hover:text-secondary transition-all">
              Download Report
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-xl font-serif text-secondary mb-8">Quick Actions</h3>
            <div className="grid gap-4">
              <Link href="/agent/properties" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 transition-all group">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FolderIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-secondary group-hover:text-primary">Manage Listings</span>
              </Link>
              <Link href="/agent/account" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 transition-all group">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-secondary group-hover:text-primary">Account Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties & Market Insights */}
      <div className="grid lg:grid-cols-2 gap-12 mt-12">
        {/* Recent Properties */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-secondary">Recent Listings</h3>
            <Link href="/agent/properties" className="text-primary font-bold text-sm hover:underline underline-offset-4">View All</Link>
          </div>

          <div className="space-y-6">
            {recentProperties.length > 0 ? recentProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden">
                  <img
                    src={property.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1nPC90ZXh0Pjwvc3ZnPg=='}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-secondary group-hover:text-primary transition-colors mb-1">{property.title}</h4>
                  <div className="text-sm text-slate-400 flex items-center gap-4">
                    <span>{property.price?.toLocaleString()} {property.currency}</span>
                    <span>{property.beds} beds • {property.baths} baths</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    property.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {property.published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <FolderIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No properties yet</p>
                <Link href="/agent/properties/new" className="text-primary font-bold hover:underline mt-2 inline-block">
                  Create your first listing
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-serif mb-8">Market <span className="text-white/80 italic">Insights</span></h3>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 font-medium">Average Property Price</span>
                <span className="text-2xl font-bold">AED 4.2M</span>
              </div>
              <div className="text-emerald-300 text-sm font-medium">+8.5% from last month</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 font-medium">Market Demand</span>
                <span className="text-2xl font-bold">High</span>
              </div>
              <div className="text-emerald-300 text-sm font-medium">Luxury segment growing</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 font-medium">Your Performance</span>
                <span className="text-2xl font-bold">Top 10%</span>
              </div>
              <div className="text-emerald-300 text-sm font-medium">Above average agent</div>
            </div>
          </div>

          <button className="w-full mt-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl hover:bg-white/30 transition-all">
            View Full Market Report
          </button>
        </div>
      </div>
    </div>
  )
}
