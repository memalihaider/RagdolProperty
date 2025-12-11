'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BuildingOfficeIcon,
  HomeModernIcon,
  HomeIcon,
  MapIcon,
  SparklesIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShoppingBagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  Bars3Icon,
  LinkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import PropertyForm from '@/components/PropertyForm'
import NavItemForm from '@/components/NavItemForm'
import CategoryForm from '@/components/CategoryForm'
import UserForm from '@/components/UserForm'
import Dashboard from '@/components/admin/Dashboard'
import Properties from '@/components/admin/Properties'
import Reports from '@/components/admin/Reports'
import Settings from '@/components/admin/Settings'
import System from '@/components/admin/System'
import SEO from '@/components/admin/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const propertyCategories = [
  { id: '1', name: 'Apartments', description: 'Modern residential apartments', icon: '🏢', isActive: true },
  { id: '2', name: 'Villas', description: 'Luxury standalone villas', icon: '🏠', isActive: true },
  { id: '3', name: 'Townhouses', description: 'Attached residential units', icon: '🏘️', isActive: true },
  { id: '4', name: 'Penthouses', description: 'Top-floor luxury apartments', icon: '🌆', isActive: true },
  { id: '5', name: 'Offices', description: 'Commercial office spaces', icon: '🏢', isActive: true },
  { id: '6', name: 'Retail', description: 'Retail and commercial spaces', icon: '🛍️', isActive: true },
  { id: '7', name: 'Land', description: 'Plots and land for development', icon: '🌱', isActive: true },
  { id: '8', name: 'Warehouses', description: 'Industrial and storage spaces', icon: '🏭', isActive: true }
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  // Properties Management State
  const [properties, setProperties] = useState<any[]>([])
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<any>(null)

  // Categories Management State
  const [categories, setCategories] = useState<any[]>(propertyCategories)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [showCategoryDetails, setShowCategoryDetails] = useState(false)
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState<any>(null)

  // Users Management State
  const [users, setUsers] = useState<any[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.alrashid@email.com',
      phone: '+971 50 123 4567',
      role: 'customer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      location: 'Dubai Marina, Dubai',
      joinDate: '2024-01-15',
      lastLogin: '2024-12-10',
      totalInquiries: 5,
      favoriteProperties: 12
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+971 50 987 6543',
      role: 'customer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      location: 'Jumeirah, Dubai',
      joinDate: '2024-02-20',
      lastLogin: '2024-12-09',
      totalInquiries: 3,
      favoriteProperties: 8
    },
    {
      id: '3',
      name: 'Mohammed Al-Farsi',
      email: 'mohammed.alfarsi@email.com',
      phone: '+971 50 555 1234',
      role: 'customer',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      location: 'Business Bay, Dubai',
      joinDate: '2024-03-10',
      lastLogin: '2024-11-15',
      totalInquiries: 1,
      favoriteProperties: 3
    }
  ])
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null)

  // Navigation Management State
  const [navItems, setNavItems] = useState<any[]>([
    { id: '1', label: 'Home', href: '/', isActive: true, order: 1 },
    { id: '2', label: 'Properties', href: '/properties', isActive: true, order: 2 },
    { id: '3', label: 'Sell', href: '/sell', isActive: true, order: 3 },
    { id: '4', label: 'About', href: '/about', isActive: true, order: 4 },
    { id: '5', label: 'Contact', href: '/contact', isActive: true, order: 5 }
  ])
  const [showAddNavItem, setShowAddNavItem] = useState(false)
  const [editingNavItem, setEditingNavItem] = useState<any>(null)

  // Forms Management State
  const [inquiryForms, setInquiryForms] = useState<any[]>([
    {
      id: '1',
      propertyId: 'prop-001',
      propertyTitle: 'Luxury 3BR Villa in Palm Jumeirah',
      customerName: 'Ahmed Al-Rashid',
      customerEmail: 'ahmed.alrashid@email.com',
      customerPhone: '+971 50 123 4567',
      message: 'I am interested in this property. Can you please provide more details about the amenities and availability?',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-12-10T10:30:00Z',
      updatedAt: '2024-12-10T10:30:00Z'
    },
    {
      id: '2',
      propertyId: 'prop-002',
      propertyTitle: 'Modern 2BR Apartment in Dubai Marina',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+971 50 987 6543',
      message: 'Is this property still available? I would like to schedule a viewing.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-12-09T14:20:00Z',
      updatedAt: '2024-12-10T09:15:00Z'
    },
    {
      id: '3',
      propertyId: 'prop-003',
      propertyTitle: 'Commercial Office Space in Business Bay',
      customerName: 'Mohammed Al-Farsi',
      customerEmail: 'mohammed.alfarsi@email.com',
      customerPhone: '+971 50 555 1234',
      message: 'Please send me the floor plans and lease terms for this office space.',
      status: 'completed',
      priority: 'low',
      createdAt: '2024-12-08T16:45:00Z',
      updatedAt: '2024-12-09T11:30:00Z'
    }
  ])
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
  const [showInquiryDetails, setShowInquiryDetails] = useState(false)

  // Dashboard analytics state
  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: {
      totalProperties: 0,
      totalViews: 0,
      totalInquiries: 0,
      totalRevenue: 0,
    },
    propertyAnalytics: {
      viewsByCategory: [],
    },
    revenueAnalytics: {
      monthlyRevenue: [],
    },
  })
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')

  // Check authentication
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  const handlePropertySubmit = async (propertyData: any) => {
    if (editingProperty) {
      // Update existing property
      setProperties(prev => prev.map(p =>
        p.id === editingProperty.id ? { ...p, ...propertyData, updatedAt: new Date().toISOString().split('T')[0] } : p
      ))
    } else {
      // Create new property
      const newProperty = {
        id: Date.now().toString(),
        ...propertyData,
        status: 'available',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        inquiries: 0
      }
      setProperties(prev => [...prev, newProperty])
    }
    setShowAddProperty(false)
    setEditingProperty(null)
  }

  const handleCategorySubmit = async (categoryData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(c =>
        c.id === editingCategory.id ? { ...c, ...categoryData, updatedAt: new Date().toISOString().split('T')[0] } : c
      ))
    } else {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        ...categoryData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setCategories(prev => [...prev, newCategory])
    }
    setShowAddCategory(false)
    setEditingCategory(null)
  }

  const handleUserSubmit = async (userData: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u =>
        u.id === editingUser.id ? { ...u, ...userData, updatedAt: new Date().toISOString().split('T')[0] } : u
      ))
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
        totalInquiries: 0,
        favoriteProperties: 0
      }
      setUsers(prev => [...prev, newUser])
    }
    setShowAddUser(false)
    setEditingUser(null)
  }

  const handleNavItemSubmit = async (navItemData: any) => {
    if (editingNavItem) {
      // Update existing nav item
      setNavItems(prev => prev.map(n =>
        n.id === editingNavItem.id ? { ...n, ...navItemData } : n
      ))
    } else {
      // Create new nav item
      const newNavItem = {
        id: Date.now().toString(),
        ...navItemData
      }
      setNavItems(prev => [...prev, newNavItem])
    }
    setShowAddNavItem(false)
    setEditingNavItem(null)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'properties'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              Properties
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'categories'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <MapIcon className="w-5 h-5" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'users'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <EyeIcon className="w-5 h-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'forms'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <PencilIcon className="h-4 w-4" />
              Inquiries
            </button>
            <button
              onClick={() => setActiveTab('navigation')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'navigation'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              Navigation
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'analytics'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <SparklesIcon className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                activeTab === 'system'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <CubeIcon className="w-5 h-5" />
              System
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || 'Admin'}</h1>
              <p className="text-muted-foreground mt-1">Manage your real estate platform</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'dashboard' && (
            <Dashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              analyticsData={analyticsData}
              selectedTimeRange={selectedTimeRange}
              setSelectedTimeRange={setSelectedTimeRange}
            />
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Property Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Manage your property listings and availability
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProperty(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Property
                </button>
              </div>

              {/* Property Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{properties.length}</div>
                      <div className="text-sm text-muted-foreground">Total Properties</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {properties.filter(p => p.status === 'available').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {properties.filter(p => p.status === 'pending').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <XMarkIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {properties.filter(p => p.status === 'sold').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Sold</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      {property.images?.[0] && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          property.status === 'available'
                            ? 'bg-green-500/90 text-white'
                            : property.status === 'pending'
                            ? 'bg-yellow-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{property.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          AED {property.price?.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProperty(property)
                              setShowAddProperty(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPropertyDetails(property)
                              setShowPropertyDetails(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {properties.length === 0 && (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <BuildingOfficeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first property to start showcasing your real estate listings.
                  </p>
                  <button
                    onClick={() => setShowAddProperty(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add First Property
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Category Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Organize your properties with custom categories
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Category
                </button>
              </div>

              {/* Category Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <MapIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{categories.length}</div>
                      <div className="text-sm text-muted-foreground">Total Categories</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {categories.filter(c => c.isActive).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <XMarkIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {categories.filter(c => !c.isActive).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Inactive</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            category.isActive
                              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category)
                              setShowAddCategory(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCategoryDetails(category)
                              setShowCategoryDetails(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {categories.length === 0 && (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <MapIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Categories Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create categories to better organize your property listings.
                  </p>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add First Category
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Manage customer accounts and user information
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add User
                </button>
              </div>

              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{users.length}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {users.filter(u => u.status === 'active').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {users.filter(u => u.status === 'inactive').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Inactive</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {users.reduce((sum, u) => sum + u.totalInquiries, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Inquiries</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{user.phone}</div>
                            <div className="text-sm text-muted-foreground">{user.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
                                : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'active'
                                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div>Inquiries: {user.totalInquiries}</div>
                            <div>Favorites: {user.favoriteProperties}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingUser(user)
                                  setShowAddUser(true)
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUserDetails(user)
                                  setShowUserDetails(true)
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div className="space-y-6">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Inquiry Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Handle customer inquiries and property requests
                  </p>
                </div>
              </div>

              {/* Inquiry Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{inquiryForms.length}</div>
                      <div className="text-sm text-muted-foreground">Total Inquiries</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {inquiryForms.filter(i => i.status === 'pending').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <BriefcaseIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {inquiryForms.filter(i => i.status === 'in_progress').length}
                      </div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <EyeIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {inquiryForms.filter(i => i.status === 'completed').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inquiryForms.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-foreground line-clamp-2">{inquiry.propertyTitle}</div>
                            <div className="text-sm text-muted-foreground">ID: {inquiry.propertyId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{inquiry.customerName}</div>
                            <div className="text-sm text-muted-foreground">{inquiry.customerEmail}</div>
                            <div className="text-sm text-muted-foreground">{inquiry.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              inquiry.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                                : inquiry.status === 'in_progress'
                                ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                : 'bg-green-500/10 text-green-700 dark:text-green-400'
                            }`}>
                              {inquiry.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              inquiry.priority === 'high'
                                ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                                : inquiry.priority === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                                : 'bg-green-500/10 text-green-700 dark:text-green-400'
                            }`}>
                              {inquiry.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedInquiry(inquiry)
                                setShowInquiryDetails(true)
                              }}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Navigation Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Customize your website navigation menu
                  </p>
                </div>
                <button
                  onClick={() => setShowAddNavItem(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Menu Item
                </button>
              </div>

              {/* Navigation Items */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Label</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {navItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">{item.label}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">{item.href}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{item.order}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.isActive
                                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'bg-red-500/10 text-red-700 dark:text-red-400'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingNavItem(item)
                                  setShowAddNavItem(true)
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <Reports />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'system' && <System />}
        </div>
      </main>

      {/* Modals */}
      {showAddProperty && (
        <PropertyForm
          isOpen={showAddProperty}
          onClose={() => {
            setShowAddProperty(false)
            setEditingProperty(null)
          }}
          onSubmit={handlePropertySubmit}
          initialData={editingProperty}
          mode={editingProperty ? 'edit' : 'create'}
        />
      )}

      {showAddCategory && (
        <CategoryForm
          isOpen={showAddCategory}
          onClose={() => {
            setShowAddCategory(false)
            setEditingCategory(null)
          }}
          onSubmit={handleCategorySubmit}
          initialData={editingCategory}
          mode={editingCategory ? 'edit' : 'create'}
        />
      )}

      {showAddUser && (
        <UserForm
          isOpen={showAddUser}
          onClose={() => {
            setShowAddUser(false)
            setEditingUser(null)
          }}
          onSubmit={handleUserSubmit}
          initialData={editingUser}
          mode={editingUser ? 'edit' : 'create'}
        />
      )}

      {showAddNavItem && (
        <NavItemForm
          isOpen={showAddNavItem}
          onClose={() => {
            setShowAddNavItem(false)
            setEditingNavItem(null)
          }}
          onSubmit={handleNavItemSubmit}
          initialData={editingNavItem}
          mode={editingNavItem ? 'edit' : 'create'}
        />
      )}

      {/* Details Modals */}
      {showPropertyDetails && selectedPropertyDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Property Details</h2>
                <button
                  onClick={() => setShowPropertyDetails(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(selectedPropertyDetails, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {showCategoryDetails && selectedCategoryDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Category Details</h2>
                <button
                  onClick={() => setShowCategoryDetails(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(selectedCategoryDetails, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {showUserDetails && selectedUserDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(selectedUserDetails, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {showInquiryDetails && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Inquiry Details</h2>
                <button
                  onClick={() => setShowInquiryDetails(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Property Information</h3>
                <p className="text-muted-foreground">{selectedInquiry.propertyTitle}</p>
                <p className="text-sm text-muted-foreground">ID: {selectedInquiry.propertyId}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Customer Information</h3>
                <p className="text-muted-foreground">{selectedInquiry.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedInquiry.customerEmail}</p>
                <p className="text-sm text-muted-foreground">{selectedInquiry.customerPhone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Message</h3>
                <p className="text-muted-foreground">{selectedInquiry.message}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedInquiry.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    : selectedInquiry.status === 'in_progress'
                    ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
                    : 'bg-green-500/10 text-green-700 dark:text-green-400'
                }`}>
                  {selectedInquiry.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedInquiry.priority === 'high'
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                    : selectedInquiry.priority === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    : 'bg-green-500/10 text-green-700 dark:text-green-400'
                }`}>
                  {selectedInquiry.priority} priority
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
