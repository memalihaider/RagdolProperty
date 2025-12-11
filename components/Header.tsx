'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  NewspaperIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface DropdownLink {
  href: string
  label: string
  icon?: typeof HomeIcon
  description?: string
}

interface SubCategory {
  label: string
  href: string
}

interface Category {
  label: string
  href?: string
  subcategories?: SubCategory[]
}

interface NavDropdown {
  label: string
  categories: Category[]
}

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [newEnquiriesCount, setNewEnquiriesCount] = useState<number>(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  const [pendingPropertiesCount, setPendingPropertiesCount] = useState<number>(0)
  const [pendingAgentsCount, setPendingAgentsCount] = useState<number>(0)
  const [userNotificationsCount, setUserNotificationsCount] = useState<number>(0)

  // Main navigation dropdowns with hierarchical categories
  const navDropdowns: Record<string, NavDropdown> = {
    buy: {
      label: 'Buy',
      categories: [
        { label: 'All Properties for Sale', href: '/properties?action=buy' },
        { 
          label: 'By Type',
          subcategories: [
            { label: 'Apartments', href: '/properties?action=buy&type=apartment' },
            { label: 'Villas', href: '/properties?action=buy&type=villa' },
            { label: 'Townhouses', href: '/properties?action=buy&type=townhouse' },
            { label: 'Plots', href: '/properties?action=buy&type=plot' },
            { label: 'Commercial', href: '/properties?action=buy&type=commercial' },
            { label: 'Penthouses', href: '/properties?action=buy&type=penthouse' },
          ]
        },
        {
          label: 'By Location',
          subcategories: [
            { label: 'Dubai Marina', href: '/properties?action=buy&area=Dubai Marina' },
            { label: 'Palm Jumeirah', href: '/properties?action=buy&area=Palm Jumeirah' },
            { label: 'Jumeirah Beach Residence', href: '/properties?action=buy&area=Jumeirah Beach Residence' },
            { label: 'Dubai Hills Estate', href: '/properties?action=buy&area=Dubai Hills Estate' },
            { label: 'Business Bay', href: '/properties?action=buy&area=Business Bay' },
            { label: 'Downtown Dubai', href: '/properties?action=buy&area=Downtown Dubai' },
          ]
        },
        {
          label: 'By Price Range',
          subcategories: [
            { label: 'Under AED 1M', href: '/properties?action=buy&maxPrice=1000000' },
            { label: 'AED 1M - 3M', href: '/properties?action=buy&minPrice=1000000&maxPrice=3000000' },
            { label: 'AED 3M - 5M', href: '/properties?action=buy&minPrice=3000000&maxPrice=5000000' },
            { label: 'AED 5M - 10M', href: '/properties?action=buy&minPrice=5000000&maxPrice=10000000' },
            { label: 'Above AED 10M', href: '/properties?action=buy&minPrice=10000000' },
          ]
        },
        {
          label: 'Furnished Properties',
          subcategories: [
            { label: 'Furnished Studios', href: '/properties?action=buy&type=studio&furnished=true' },
            { label: 'Furnished 1-bed', href: '/properties?action=buy&beds=1&furnished=true' },
            { label: 'Furnished 2-bed', href: '/properties?action=buy&beds=2&furnished=true' },
            { label: 'Furnished 3-bed', href: '/properties?action=buy&beds=3&furnished=true' },
          ]
        },
      ],
    },
    rent: {
      label: 'Rent',
      categories: [
        { label: 'All Properties for Rent', href: '/properties?action=rent' },
        {
          label: 'By Type',
          subcategories: [
            { label: 'Apartments', href: '/properties?action=rent&type=apartment' },
            { label: 'Villas', href: '/properties?action=rent&type=villa' },
            { label: 'Townhouses', href: '/properties?action=rent&type=townhouse' },
            { label: 'Commercial', href: '/properties?action=rent&type=commercial' },
          ]
        },
        {
          label: 'By Location',
          subcategories: [
            { label: 'Dubai Marina', href: '/properties?action=rent&area=Dubai Marina' },
            { label: 'Palm Jumeirah', href: '/properties?action=rent&area=Palm Jumeirah' },
            { label: 'Jumeirah Beach Residence', href: '/properties?action=rent&area=Jumeirah Beach Residence' },
            { label: 'Business Bay', href: '/properties?action=rent&area=Business Bay' },
            { label: 'Dubai Hills Estate', href: '/properties?action=rent&area=Dubai Hills Estate' },
          ]
        },
        {
          label: 'Furnished Properties',
          subcategories: [
            { label: 'Furnished Studios', href: '/properties?action=rent&type=studio&furnished=true' },
            { label: 'Furnished 1-bed', href: '/properties?action=rent&beds=1&furnished=true' },
            { label: 'Furnished 2-bed', href: '/properties?action=rent&beds=2&furnished=true' },
            { label: 'Furnished 3-bed', href: '/properties?action=rent&beds=3&furnished=true' },
            { label: 'Furnished 4-bed', href: '/properties?action=rent&beds=4&furnished=true' },
          ]
        },
      ],
    },
    luxe: {
      label: 'Luxe',
      categories: [
        { label: 'All Luxury Properties', href: '/properties?category=luxe' },
        {
          label: 'Luxury Properties for Sale',
          subcategories: [
            { label: 'Apartments', href: '/properties?action=buy&category=luxe&type=apartment' },
            { label: 'Villas', href: '/properties?action=buy&category=luxe&type=villa' },
            { label: 'Homes', href: '/properties?action=buy&category=luxe&beds=3' },
            { label: 'Penthouses', href: '/properties?action=buy&category=luxe&type=penthouse' },
            { label: 'Mansions', href: '/properties?action=buy&category=luxe&type=villa&minPrice=20000000' },
            { label: 'Townhouses', href: '/properties?action=buy&category=luxe&type=townhouse' },
          ]
        },
        {
          label: 'Luxury Properties for Rent',
          subcategories: [
            { label: 'Luxury Apartments', href: '/properties?action=rent&category=luxe&type=apartment' },
            { label: 'Luxury Villas', href: '/properties?action=rent&category=luxe&type=villa' },
            { label: 'Penthouse Rentals', href: '/properties?action=rent&category=luxe&type=penthouse' },
            { label: 'Mansion Rentals', href: '/properties?action=rent&category=luxe&type=villa&minPrice=500000' },
          ]
        },
        {
          label: 'By Luxury Price Range',
          subcategories: [
            { label: 'AED 2M - 5M', href: '/properties?category=luxe&minPrice=2000000&maxPrice=5000000' },
            { label: 'AED 5M - 10M', href: '/properties?category=luxe&minPrice=5000000&maxPrice=10000000' },
            { label: 'AED 10M - 20M', href: '/properties?category=luxe&minPrice=10000000&maxPrice=20000000' },
            { label: 'AED 20M - 50M', href: '/properties?category=luxe&minPrice=20000000&maxPrice=50000000' },
            { label: 'Above AED 50M', href: '/properties?category=luxe&minPrice=50000000' },
          ]
        },
        {
          label: 'Premium Locations',
          subcategories: [
            { label: 'Palm Jumeirah', href: '/properties?category=luxe&area=Palm Jumeirah' },
            { label: 'Dubai Marina', href: '/properties?category=luxe&area=Dubai Marina' },
            { label: 'Jumeirah Beach Residence', href: '/properties?category=luxe&area=Jumeirah Beach Residence' },
            { label: 'Emirates Hills', href: '/properties?category=luxe&area=Emirates Hills' },
            { label: 'Dubai Hills Estate', href: '/properties?category=luxe&area=Dubai Hills Estate' },
            { label: 'Downtown Dubai', href: '/properties?category=luxe&area=Downtown Dubai' },
            { label: 'Business Bay', href: '/properties?category=luxe&area=Business Bay' },
          ]
        },
        {
          label: 'Dubai Branded Residences',
          subcategories: [
            { label: 'DAMAC Properties', href: '/properties?category=luxe&developer=DAMAC' },
            { label: 'Emaar Properties', href: '/properties?category=luxe&developer=Emaar' },
            { label: 'Nakheel Properties', href: '/properties?category=luxe&developer=Nakheel' },
            { label: 'Dubai Properties', href: '/properties?category=luxe&developer=Dubai Properties' },
          ]
        },
        {
          label: 'Luxury Features',
          subcategories: [
            { label: 'Beachfront', href: '/properties?category=luxe&features=beachfront' },
            { label: 'Private Pool', href: '/properties?category=luxe&features=private_pool' },
            { label: 'Marina View', href: '/properties?category=luxe&features=marina_view' },
            { label: 'Golf Course', href: '/properties?category=luxe&features=golf_course' },
          ]
        },
      ],
    },
    commercial: {
      label: 'Commercial',
      categories: [
        { label: 'All Commercial Properties', href: '/properties?type=commercial' },
        {
          label: 'Offices',
          subcategories: [
            { label: 'Offices for Sale', href: '/properties?action=buy&type=commercial&subtype=office' },
            { label: 'Offices for Rent', href: '/properties?action=rent&type=commercial&subtype=office' },
          ]
        },
        {
          label: 'Retail & Shops',
          subcategories: [
            { label: 'Shops for Sale', href: '/properties?action=buy&type=commercial&subtype=shop' },
            { label: 'Shops for Rent', href: '/properties?action=rent&type=commercial&subtype=shop' },
          ]
        },
        {
          label: 'Commercial Plots',
          subcategories: [
            { label: 'Plots for Sale', href: '/properties?action=buy&type=plot&category=commercial' },
          ]
        },
        {
          label: 'Warehouses & Industrial',
          subcategories: [
            { label: 'Warehouses for Sale', href: '/properties?action=buy&type=commercial&subtype=warehouse' },
            { label: 'Warehouses for Rent', href: '/properties?action=rent&type=commercial&subtype=warehouse' },
          ]
        },
      ],
    },
    sell: {
      label: 'Sell',
      categories: [
        { label: 'List Your Property', href: '/sell' },
      ],
    },
    projects: {
      label: 'Projects',
      categories: [
        { label: 'All Projects', href: '/projects' },
        {
          label: 'By Status',
          subcategories: [
            { label: 'Off-Plan Projects', href: '/projects?status=off-plan' },
            { label: 'Under Construction', href: '/projects?status=in-progress' },
            { label: 'Ready Projects', href: '/projects?status=completed' },
          ]
        },
        {
          label: 'By Developer',
          subcategories: [
            { label: 'Emaar Projects', href: '/projects?developer=Emaar' },
            { label: 'DAMAC Projects', href: '/projects?developer=DAMAC' },
            { label: 'Nakheel Projects', href: '/projects?developer=Nakheel' },
            { label: 'Dubai Properties', href: '/projects?developer=Dubai Properties' },
          ]
        },
      ],
    },
    agents: {
      label: 'Agents',
      categories: [
        { label: 'Find an Agent', href: '/agents' },
      ],
    },
    services: {
      label: 'Services',
      categories: [
        {
          label: 'Property Management',
          subcategories: [
            { label: 'Residential Property Management', href: '/services/property-management' },
            // { label: 'Commercial Property Management', href: '/services/commercial-property-management' },
            // { label: 'Vacation Rental Management', href: '/services/vacation-rental-management' },
            // { label: 'Property Maintenance', href: '/services/property-maintenance' },
          ]
        },
        {
          label: 'Property Inspection & Handover',
          subcategories: [
            { label: 'Snagging & Handover Services', href: '/services/snagging-handover' },
            // { label: 'Pre-Purchase Inspection', href: '/services/pre-purchase-inspection' },
            // { label: 'Property Valuation', href: '/services/property-valuation' },
            // { label: 'Building Inspection', href: '/services/building-inspection' },
          ]
        },
        // {
        //   label: 'Real Estate Consulting',
        //   subcategories: [
        //     { label: 'Investment Consulting', href: '/services/investment-consulting' },
        //     { label: 'Market Analysis', href: '/services/market-analysis' },
        //     { label: 'Legal Services', href: '/services/legal-services' },
        //     { label: 'Mortgage Advisory', href: '/services/mortgage-advisory' },
        //   ]
        // },
        // {
        //   label: 'Additional Services',
        //   subcategories: [
        //     { label: 'Interior Design', href: '/services/interior-design' },
        //     { label: 'Property Photography', href: '/services/property-photography' },
        //     { label: 'Virtual Tours', href: '/services/virtual-tours' },
        //     { label: 'All Services', href: '/services' },
        //   ]
        // },
      ],
    },
    more: {
      label: 'More',
      categories: [
        { label: 'Career', href: '/careers' },
        { label: 'News', href: '/news' },
        { label: 'Guides', href: '/guides' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Why Invest in Dubai', href: '/why-invest-dubai' },
      ],
    },
  }

  const mainNavItems = [
    { key: 'buy', label: 'Buy', isDropdown: true },
    { key: 'rent', label: 'Rent', isDropdown: true },
    { key: 'luxe', label: 'Luxe', isDropdown: true },
    { key: 'commercial', label: 'Commercial', isDropdown: true },
  ]

  const publicLinks = [
    { key: 'sell', label: 'Sell', isDropdown: true },
    { key: 'agents', label: 'Agents', isDropdown: true },
    { key: 'services', label: 'Services', isDropdown: true },
    { key: 'more', label: 'More', isDropdown: true },
  ]

  const userLinks = [
    { href: '/account', label: 'Dashboard', icon: UserCircleIcon },
    { href: '/account/saved', label: 'Saved', icon: HeartIcon },
    { href: '/account/enquiries', label: 'Enquiries', icon: ChatBubbleLeftRightIcon },
    { href: '/account/notifications', label: 'Notifications', icon: BellIcon },
    { href: '/account/settings', label: 'Settings', icon: Cog6ToothIcon },
  ]

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const NavDropdownMenu = ({ item }: { item: (typeof mainNavItems)[0] | (typeof publicLinks)[0] }) => {
    if (!('key' in item) || !item.isDropdown) return null

    const dropdown = navDropdowns[item.key]
    if (!dropdown) return null

    return (
      <div className="absolute left-0 mt-0 min-w-max bg-background border border-border rounded-md shadow-lg py-2 z-50 max-h-[500px] overflow-y-auto">
        {dropdown.categories.map((category, categoryIdx) => (
          <div key={categoryIdx}>
            {category.subcategories ? (
              // Category with subcategories
              <div className="px-4 py-3 border-b border-border last:border-b-0">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  {category.label}
                </div>
                <div className="space-y-1">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // Simple category link
              <Link
                href={category.href || '#'}
                onClick={() => setOpenDropdown(null)}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                {category.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Fetch initial counts and subscribe to realtime updates
  useEffect(() => {
    let enquiriesChannel: RealtimeChannel | null = null
    let messagesChannel: RealtimeChannel | null = null
    let propertiesChannel: RealtimeChannel | null = null
    let agentsChannel: RealtimeChannel | null = null
    let notificationsChannel: RealtimeChannel | null = null

    const fetchNewEnquiries = async () => {
      try {
        const { count } = await supabase
          .from('enquiries')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')

        setNewEnquiriesCount(count ?? 0)
      } catch (err) {
        console.error('Failed to fetch new enquiries count', err)
      }
    }

    const fetchPendingProperties = async () => {
      try {
        const { count } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('published', false)

        setPendingPropertiesCount(count ?? 0)
      } catch (err) {
        console.error('Failed to fetch pending properties count', err)
      }
    }

    const fetchPendingAgents = async () => {
      try {
        const { count } = await supabase
          .from('agents')
          .select('id', { count: 'exact', head: true })
          .eq('approved', false)

        setPendingAgentsCount(count ?? 0)
      } catch (err) {
        console.error('Failed to fetch pending agents count', err)
      }
    }

    const fetchUnreadMessages = async (profileId?: string) => {
      try {
        if (!profileId) {
          setUnreadMessagesCount(0)
          return
        }
        // Get list of enquiry ids belonging to this user
        const { data: userEnquiries } = await supabase.from('enquiries').select('id').eq('user_id', profileId)
        const ids = (Array.isArray(userEnquiries) ? userEnquiries : []).map((e: { id: string }) => e.id)
        if (!ids.length) {
          setUnreadMessagesCount(0)
          return
        }
        const { count } = await supabase
          .from('enquiry_messages')
          .select('id', { count: 'exact', head: true })
          .is('read_at', null)
          .in('enquiry_id', ids)
          .neq('sender_type', 'customer')

        setUnreadMessagesCount(count ?? 0)
      } catch (err) {
        console.error('Failed to fetch unread messages count', err)
      }
    }

    const fetchUserNotifications = async (profileId?: string) => {
      try {
        if (!profileId) {
          return setUserNotificationsCount(0)
        }
        const { count } = await supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .is('read_at', null)
          .eq('user_id', profileId)

        setUserNotificationsCount(count ?? 0)
      } catch (err) {
        console.error('Failed to fetch notifications count', err)
      }
    }

    if (profile?.role === 'admin') {
      // initial fetch and subscription for admin enquiries
      fetchNewEnquiries()
      fetchPendingProperties()
      fetchPendingAgents()
      enquiriesChannel = supabase
        .channel('public:enquiries')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, (payload) => {
          // re-fetch counts whenever enquiries change (INSERT or UPDATE)
          fetchNewEnquiries()
        })
        .subscribe()
      propertiesChannel = supabase
        .channel('public:properties')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
          fetchPendingProperties()
        })
        .subscribe()
      agentsChannel = supabase
        .channel('public:agents')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
          fetchPendingAgents()
        })
        .subscribe()
    }

    // For normal users we fetch unread messages for their enquiries and subscribe to message changes
    if (profile?.id) {
      fetchUnreadMessages(profile.id)
      fetchUserNotifications(profile.id)
      messagesChannel = supabase
        .channel(`public:enquiry_messages:user:${profile.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiry_messages' }, (payload) => {
          // Re-fetch unread messages count to keep UI consistent
          fetchUnreadMessages(profile.id)
        })
        .subscribe()
      notificationsChannel = supabase
        .channel(`public:notifications:user:${profile.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
          fetchUserNotifications(profile.id)
        })
        .subscribe()
    }

    return () => {
      // Unsubscribe channels on cleanup
      const chs = [enquiriesChannel, messagesChannel, propertiesChannel, agentsChannel, notificationsChannel]
      chs.forEach((ch) => {
        if (ch) {
          try { supabase.removeChannel(ch) } catch (e) { /* ignore */ }
        }
      })
    }
  }, [profile])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gradient">RAGDOL</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {mainNavItems.map((item) => {
              if (item.isDropdown && 'key' in item) {
                return (
                  <div
                    key={item.key}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group-hover:text-primary">
                      <span>{item.label}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {openDropdown === item.key && <NavDropdownMenu item={item} />}
                  </div>
                )
              }
              return null
            })}

            {/* Divider */}
            <div className="mx-4 h-6 w-px bg-border" />

            {/* Right dropdowns */}
            {publicLinks.map((link) => {
              if (link.isDropdown && 'key' in link) {
                return (
                  <div
                    key={link.key}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(link.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group-hover:text-primary">
                      <span>{link.label}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {openDropdown === link.key && <NavDropdownMenu item={link} />}
                  </div>
                )
              }
              return null
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User dropdown */}
                <div className="hidden lg:flex items-center space-x-4">
                  {profile?.role === 'admin' && (
                    <>
                      <Link
                        href="/admin"
                        className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Admin
                        {newEnquiriesCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                            {newEnquiriesCount}
                          </span>
                        )}
                        {pendingPropertiesCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-yellow-600 rounded-full">
                            {pendingPropertiesCount}
                          </span>
                        )}
                        {pendingAgentsCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                            {pendingAgentsCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/sell"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        List Property
                      </Link>
                    </>
                  )}
                  {profile?.role === 'agent' && (
                    <Link
                      href="/agent"
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Agent Portal
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {profile?.full_name || 'Account'}
                  </Link>
                  {/* Notifications */}
                  <Link
                    href="/account/notifications"
                    className="relative inline-flex items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <BellIcon className="h-5 w-5" />
                    {userNotificationsCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                        {userNotificationsCount}
                      </span>
                    )}
                  </Link>
                  {/* Desktop quick link to user's enquiries with unread badge */}
                  <Link
                    href="/account/enquiries"
                    className="relative inline-flex items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    {unreadMessagesCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link href="/auth/login" className="btn-outline">
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {mainNavItems.map((item) => {
                if (item.isDropdown && 'key' in item) {
                  const dropdown = navDropdowns[item.key]
                  return (
                    <div key={item.key} className="border-b border-border pb-3">
                      <div className="px-3 py-2 text-sm font-bold text-primary uppercase tracking-wider">{item.label}</div>
                      <div className="space-y-1 ml-3">
                        {dropdown?.categories.map((category, categoryIdx) => (
                          <div key={categoryIdx} className="space-y-1">
                            {category.subcategories ? (
                              <>
                                <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 mt-2">
                                  {category.label}
                                </div>
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </>
                            ) : (
                              <Link
                                href={category.href || '#'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                              >
                                {category.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })}

              <div className="my-4 h-px bg-border" />

              {publicLinks.map((link) => {
                if (link.isDropdown && 'key' in link) {
                  const dropdown = navDropdowns[link.key]
                  return (
                    <div key={link.key} className="border-b border-border pb-3">
                      <div className="px-3 py-2 text-sm font-bold text-primary uppercase tracking-wider">{link.label}</div>
                      <div className="space-y-1 ml-3">
                        {dropdown?.categories.map((category, categoryIdx) => (
                          <div key={categoryIdx} className="space-y-1">
                            {category.subcategories ? (
                              <>
                                <div className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 mt-2">
                                  {category.label}
                                </div>
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </>
                            ) : (
                              <Link
                                href={category.href || '#'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                              >
                                {category.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })}

              <div className="border-t border-border pt-4">
                {user ? (
                  <>
                    {userLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary px-2 py-2',
                            isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                          {link.href === '/account/enquiries' && unreadMessagesCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                              {unreadMessagesCount}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                    {profile?.role === 'admin' && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2"
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          <span>Admin</span>
                          {newEnquiriesCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                              {newEnquiriesCount}
                            </span>
                          )}
                          {pendingPropertiesCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-yellow-600 rounded-full">
                              {pendingPropertiesCount}
                            </span>
                          )}
                          {pendingAgentsCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                              {pendingAgentsCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/sell"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2"
                        >
                          <PlusIcon className="h-5 w-5" />
                          <span>List Property</span>
                        </Link>
                      </>
                    )}
                    {profile?.role === 'agent' && (
                      <Link
                        href="/agent"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2"
                      >
                        <UsersIcon className="h-5 w-5" />
                        <span>Agent Portal</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2 w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-outline text-center"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
