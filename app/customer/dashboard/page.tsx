'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  UserIcon, 
  HomeIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function CustomerDashboard() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  const stats = [
    { label: 'Saved Properties', value: '12', icon: HeartIcon },
    { label: 'Active Inquiries', value: '3', icon: ChatBubbleLeftRightIcon },
    { label: 'Valuations', value: '2', icon: ChartBarIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar / Navigation */}
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-72 bg-secondary min-h-screen p-8 fixed left-0 top-0">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-secondary" />
            </div>
            <span className="text-2xl font-serif text-white tracking-tighter">RAGDOL</span>
          </div>

          <nav className="space-y-2 flex-1">
            <Link href="/customer/dashboard" className="flex items-center gap-4 px-6 py-4 bg-primary text-secondary font-bold rounded-2xl transition-all">
              <HomeIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/customer/profile" className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <UserIcon className="h-5 w-5" />
              My Profile
            </Link>
            <Link href="/properties" className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <HeartIcon className="h-5 w-5" />
              Saved Listings
            </Link>
            <Link href="/customer/property-valuation" className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <ChartBarIcon className="h-5 w-5" />
              Valuations
            </Link>
            <Link href="/customer/questions" className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <QuestionMarkCircleIcon className="h-5 w-5" />
              My Inquiries
            </Link>
          </nav>

          <div className="pt-8 border-t border-white/10">
            <button 
              onClick={signOut}
              className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-400 transition-all w-full"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-8 md:p-12">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-serif text-secondary mb-2">
                Welcome back, <span className="text-primary italic">{profile?.full_name?.split(' ')[0] || 'Client'}</span>
              </h1>
              <p className="text-slate-500">Manage your luxury real estate portfolio and inquiries.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-secondary">{profile?.full_name || user.email}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Private Client</div>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                  {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/10 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+2 this month</span>
                </div>
                <div className="text-3xl font-serif text-secondary mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Action */}
              <div className="relative overflow-hidden bg-secondary rounded-[2.5rem] p-10 text-white">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                  <Image 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
                    alt="Luxury Home"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10 max-w-md">
                  <h3 className="text-3xl font-serif mb-4">Ready to find your <span className="text-primary italic">next masterpiece?</span></h3>
                  <p className="text-slate-300 mb-8">Explore our latest off-market opportunities and exclusive developments in Dubai.</p>
                  <Link href="/properties" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all">
                    Browse Properties
                    <SparklesIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10">
                <h3 className="text-2xl font-serif text-secondary mb-8">Recent Activity</h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0">
                        <Image 
                          src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop`}
                          alt="Property"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-secondary font-bold group-hover:text-primary transition-colors">Inquiry sent for Palm Jumeirah Villa</div>
                        <div className="text-sm text-slate-400">2 days ago • Property ID: #PJ-992</div>
                      </div>
                      <div className="text-xs font-bold text-primary uppercase tracking-widest">Pending</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
                <h3 className="text-xl font-serif text-secondary mb-6">Quick Services</h3>
                <div className="grid gap-4">
                  <Link href="/customer/property-valuation" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 transition-all group">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <ChartBarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-secondary group-hover:text-primary">Get Valuation</span>
                  </Link>
                  <Link href="/customer/questions" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 transition-all group">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-secondary group-hover:text-primary">Ask an Expert</span>
                  </Link>
                  <Link href="/customer/profile" className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary/10 transition-all group">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Cog6ToothIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-secondary group-hover:text-primary">Settings</span>
                  </Link>
                </div>
              </div>

              <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20">
                <h3 className="text-xl font-serif text-secondary mb-4">Need Assistance?</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">Your dedicated account manager is available 24/7 for any inquiries.</p>
                <button className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:text-secondary transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
