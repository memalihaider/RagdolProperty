'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface Valuation {
  id: string
  property_type: string
  location: string
  size: string
  bedrooms: string
  bathrooms: string
  year_built: string
  condition: string
  additional_features: string
  urgency: string
  contact_method: string
  status: string
  estimated_value?: string
  currency?: string
  created_at: string
  completed_at?: string
}

export default function PropertyValuation() {
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('history')
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingValuations, setLoadingValuations] = useState(true)
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    condition: '',
    additionalFeatures: '',
    urgency: '',
    contactMethod: 'email'
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchValuations = async () => {
      try {
        const response = await fetch('/api/customer/valuations')
        const data = await response.json()
        setValuations(data.valuations)
      } catch (error) {
        console.error('Error fetching valuations:', error)
      } finally {
        setLoadingValuations(false)
      }
    }

    if (user) {
      fetchValuations()
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      router.push('/customer/login')
      return
    }

    try {
      const response = await fetch('/api/customer/valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit valuation request')
      }

      setSuccess(true)
      setFormData({
        propertyType: '',
        location: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: '',
        condition: '',
        additionalFeatures: '',
        urgency: '',
        contactMethod: 'email'
      })
      
      // Refresh valuations
      const data = await response.json()
      setValuations(prev => [data.valuation, ...prev])
      setActiveTab('history')
    } catch (err) {
      setError('An unexpected error occurred')
    }

    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      default:
        return 'Pending'
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-serif text-secondary">Valuation Request Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll get back to you within 24 hours with a detailed valuation report.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('history')
              }}
              className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
            >
              View My Valuations
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Application Submitted!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll review your property details and get back to you with a valuation within 2-3 business days.
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/customer/dashboard')}
                className="text-blue-600 hover:text-blue-500"
              >
                Back to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-slate-400 hover:text-slate-600 mr-4"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-serif text-secondary">Property Valuations</h1>
                <p className="text-sm text-slate-500">Request and track property valuations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                My Valuations
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'request'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Request New Valuation
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'history' ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif text-secondary">Valuation History</h2>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Valuation
                  </button>
                </div>

                {loadingValuations ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-slate-200 rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                ) : valuations.length > 0 ? (
                  <div className="space-y-6">
                    {valuations.map((valuation) => (
                      <div key={valuation.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(valuation.status)}
                            <div>
                              <h3 className="font-bold text-secondary capitalize">
                                {valuation.property_type} in {valuation.location}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {valuation.size} sqm • {valuation.bedrooms} bed • {valuation.bathrooms} bath
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{getStatusText(valuation.status)}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(valuation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {valuation.status === 'completed' && valuation.estimated_value && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800">Valuation Complete</span>
                            </div>
                            <div className="text-2xl font-serif text-green-800">
                              {parseInt(valuation.estimated_value).toLocaleString()} {valuation.currency}
                            </div>
                            <div className="text-sm text-green-600 mt-1">
                              Completed on {valuation.completed_at ? new Date(valuation.completed_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        )}

                        {valuation.status === 'in_progress' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-5 w-5 text-blue-600" />
                              <span className="font-bold text-blue-800">Valuation in Progress</span>
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                              We're analyzing your property details. We'll contact you within 24 hours.
                            </p>
                          </div>
                        )}

                        {valuation.status === 'pending' && (
                          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="h-5 w-5 text-slate-600" />
                              <span className="font-bold text-slate-800">Pending Review</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              Your valuation request is being reviewed. We'll start the process soon.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ChartBarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-secondary mb-2">No valuations yet</h3>
                    <p className="text-slate-500 mb-6">Get started by requesting your first property valuation.</p>
                    <button
                      onClick={() => setActiveTab('request')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all"
                    >
                      Request Valuation
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-serif text-secondary mb-2">Request Property Valuation</h2>
                  <p className="text-slate-500">Get an accurate market valuation for your property</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Property Type *
                      </label>
                      <select
                        name="propertyType"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="studio">Studio</option>
                        <option value="duplex">Duplex</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Location/Area *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., Dubai Marina, Jumeirah"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Size (sqm)
                      </label>
                      <input
                        type="number"
                        name="size"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., 120"
                        value={formData.size}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Bedrooms
                      </label>
                      <select
                        name="bedrooms"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="0">Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Bathrooms
                      </label>
                      <select
                        name="bathrooms"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                      >
                        <option value="">Select</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Year Built
                      </label>
                      <input
                        type="number"
                        name="yearBuilt"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., 2015"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Property Condition
                    </label>
                    <select
                      name="condition"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={formData.condition}
                      onChange={handleInputChange}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="needs_work">Needs Work</option>
                      <option value="off_plan">Off Plan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Additional Features
                    </label>
                    <textarea
                      name="additionalFeatures"
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g., Balcony, parking, gym, pool, etc."
                      value={formData.additionalFeatures}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Urgency Level
                      </label>
                      <select
                        name="urgency"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.urgency}
                        onChange={handleInputChange}
                      >
                        <option value="">Select urgency</option>
                        <option value="low">Low - Just curious</option>
                        <option value="medium">Medium - Planning to sell/buy</option>
                        <option value="high">High - Need valuation urgently</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        name="contactMethod"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={formData.contactMethod}
                        onChange={handleInputChange}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-8 py-3 border border-slate-200 text-secondary font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Request Valuation'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}