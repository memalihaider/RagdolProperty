'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getServiceRoleClient } from '@/lib/supabase'

interface Question {
  id: string
  subject: string
  message: string
  category: string
  status: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

interface Valuation {
  id: string
  property_type: string
  location: string
  status: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export default function AdminDashboard() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'valuations' | 'users' | 'properties' | 'settings'>('overview')
  const [questions, setQuestions] = useState<Question[]>([])
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadData()
    }
  }, [user, profile, activeTab])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const adminSupabase = getServiceRoleClient()
      
      if (activeTab === 'questions') {
        try {
          const { data, error } = await (adminSupabase as any)
            .from('customer_questions')
            .select(`
              id, subject, message, category, status, created_at,
              profiles:user_id (full_name, email)
            `)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error loading questions:', error)
            setQuestions([])
          } else {
            setQuestions((data || []) as any)
          }
        } catch (err) {
          console.error('Customer questions table not available:', err)
          setQuestions([])
        }
      } else if (activeTab === 'valuations') {
        try {
          const { data, error } = await (adminSupabase as any)
            .from('property_valuations')
            .select(`
              id, property_type, location, status, created_at,
              profiles:user_id (full_name, email)
            `)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error loading valuations:', error)
            setValuations([])
          } else {
            setValuations((data || []) as any)
          }
        } catch (err) {
          console.error('Property valuations table not available:', err)
          setValuations([])
        }
      } else if (activeTab === 'users') {
        const { data, error } = await adminSupabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading users:', error)
        } else {
          setUsers(data || [])
        }
      } else if (activeTab === 'properties') {
        const { data, error } = await adminSupabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error loading properties:', error)
        } else {
          setProperties(data || [])
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoadingData(false)
  }

  const updateQuestionStatus = async (questionId: string, status: string) => {
    try {
      const adminSupabase = getServiceRoleClient()
      const { error } = await (adminSupabase as any)
        .from('customer_questions')
        .update({ status })
        .eq('id', questionId)

      if (error) {
        console.error('Error updating question:', error)
      } else {
        loadData()
      }
    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  const updateValuationStatus = async (valuationId: string, status: string) => {
    try {
      const adminSupabase = getServiceRoleClient()
      const { error } = await (adminSupabase as any)
        .from('property_valuations')
        .update({ status })
        .eq('id', valuationId)

      if (error) {
        console.error('Error updating valuation:', error)
      } else {
        loadData()
      }
    } catch (error) {
      console.error('Error updating valuation:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {profile?.full_name || user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'questions', label: 'Customer Questions' },
              { id: 'valuations', label: 'Property Valuations' },
              { id: 'users', label: 'User Management' },
              { id: 'properties', label: 'Property Management' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pending Questions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {questions.filter(q => q.status === 'pending').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pending Valuations
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {valuations.filter(v => v.status === 'pending').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Customers
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {new Set([...questions.map(q => q.profiles?.email), ...valuations.map(v => v.profiles?.email)]).size}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Customer Questions
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage customer inquiries and questions.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions yet
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {questions.map((question) => (
                      <li key={question.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {question.subject}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  question.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : question.status === 'answered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {question.status}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {question.profiles?.full_name || question.profiles?.email}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  {question.category}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>{new Date(question.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {question.message}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <select
                              value={question.status}
                              onChange={(e) => updateQuestionStatus(question.id, e.target.value)}
                              className="text-sm border-gray-300 rounded-md"
                            >
                              <option value="pending">Pending</option>
                              <option value="answered">Answered</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'valuations' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Valuations
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage property valuation requests.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : valuations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No valuation requests yet
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {valuations.map((valuation) => (
                      <li key={valuation.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {valuation.property_type} in {valuation.location}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  valuation.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : valuation.status === 'in_review'
                                    ? 'bg-blue-100 text-blue-800'
                                    : valuation.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {valuation.status}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {valuation.profiles?.full_name || valuation.profiles?.email}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>{new Date(valuation.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <select
                              value={valuation.status}
                              onChange={(e) => updateValuationStatus(valuation.id, e.target.value)}
                              className="text-sm border-gray-300 rounded-md"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_review">In Review</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage user accounts and profiles.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <li key={user.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {user.full_name || 'No name'}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.role === 'admin'
                                    ? 'bg-red-100 text-red-800'
                                    : user.role === 'agent'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  ID: {user.id.substring(0, 8)}...
                                </p>
                                {user.phone && (
                                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                    Phone: {user.phone}
                                  </p>
                                )}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>{new Date(user.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage property listings and status.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {loadingData ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No properties found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {properties.map((property) => (
                      <li key={property.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {property.title}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  property.status === 'sale'
                                    ? 'bg-green-100 text-green-800'
                                    : property.status === 'rent'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {property.status}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {property.location}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  {property.type} • {property.price?.toLocaleString()} AED
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>{property.published ? 'Published' : 'Draft'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Admin Settings
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Configure system settings and preferences.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">System Status</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        All systems are operational. Database connections are healthy.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
                      <div className="mt-2 space-y-2">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Clear Cache
                        </button>
                        <button className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Export Data
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Statistics</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">{properties.length}</dd>
                        </div>
                        <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
                        </div>
                        <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Questions</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">{questions.filter(q => q.status === 'pending').length}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}