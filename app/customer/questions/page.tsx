'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface Enquiry {
  id: string
  property_id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  created_at: string
  responded_at?: string
  property: {
    id: string
    title: string
    slug: string
    image: string
    location: string
    price: number
    currency: string
  } | null
}

export default function CustomerQuestions() {
  const [activeTab, setActiveTab] = useState<'history' | 'ask'>('history')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingEnquiries, setLoadingEnquiries] = useState(true)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general'
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/customer/enquiries')
        const data = await response.json()
        setEnquiries(data.enquiries)
      } catch (error) {
        console.error('Error fetching enquiries:', error)
      } finally {
        setLoadingEnquiries(false)
      }
    }

    if (user) {
      fetchEnquiries()
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
      const response = await fetch('/api/customer/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: null, // General enquiry
          name: 'Customer',
          email: user.email,
          phone: '',
          message: `${formData.subject}: ${formData.message}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit enquiry')
      }

      setSuccess(true)
      setFormData({
        subject: '',
        message: '',
        category: 'general'
      })

      // Refresh enquiries
      const data = await response.json()
      setEnquiries(prev => [data.enquiry, ...prev])
      setActiveTab('history')
    } catch (err) {
      setError('An unexpected error occurred')
    }

    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'responded':
        return 'Responded'
      case 'pending':
        return 'Pending'
      default:
        return 'Sent'
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-serif text-secondary">Enquiry Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll get back to you within 24 hours with a response.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('history')
              }}
              className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
            >
              View My Enquiries
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-serif text-secondary">Enquiry Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll get back to you within 24 hours with a response.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setActiveTab('history')
              }}
              className="mt-6 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
            >
              View My Enquiries
            </button>
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
                <h1 className="text-2xl font-serif text-secondary">My Inquiries</h1>
                <p className="text-sm text-slate-500">View and manage your property enquiries</p>
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
                My Inquiries
              </button>
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'ask'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Ask a Question
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'history' ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif text-secondary">Inquiry History</h2>
                  <button
                    onClick={() => setActiveTab('ask')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-secondary hover:text-primary transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Inquiry
                  </button>
                </div>

                {loadingEnquiries ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-slate-200 rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                ) : enquiries.length > 0 ? (
                  <div className="space-y-6">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(enquiry.status)}
                            <div>
                              <h3 className="font-bold text-secondary">
                                {enquiry.property ? enquiry.property.title : 'General Inquiry'}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {enquiry.property ? `${enquiry.property.location} • ${enquiry.property.price?.toLocaleString()} ${enquiry.property.currency}` : 'General Question'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{getStatusText(enquiry.status)}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(enquiry.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-600 text-sm leading-relaxed">{enquiry.message}</p>
                        </div>

                        {enquiry.status === 'responded' && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800">Response Received</span>
                            </div>
                            <p className="text-sm text-green-600">
                              Our team has responded to your inquiry. Check your email for details.
                              {enquiry.responded_at && ` Responded on ${new Date(enquiry.responded_at).toLocaleDateString()}.`}
                            </p>
                          </div>
                        )}

                        {enquiry.status === 'pending' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-5 w-5 text-blue-600" />
                              <span className="font-bold text-blue-800">Awaiting Response</span>
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                              We're reviewing your inquiry and will get back to you within 24 hours.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-secondary mb-2">No inquiries yet</h3>
                    <p className="text-slate-500 mb-6">Have questions about properties or our services? We're here to help.</p>
                    <button
                      onClick={() => setActiveTab('ask')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all"
                    >
                      Ask a Question
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-serif text-secondary mb-2">Ask Our Experts</h2>
                  <p className="text-slate-500">Get answers to your property-related questions from our experienced team</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Brief description of your question"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="property">Property Information</option>
                      <option value="valuation">Property Valuation</option>
                      <option value="investment">Investment Advice</option>
                      <option value="legal">Legal Questions</option>
                      <option value="financing">Financing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Please provide details about your question..."
                      value={formData.message}
                      onChange={handleInputChange}
                    />
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
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
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