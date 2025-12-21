'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function PropertyValuation() {
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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const router = useRouter()

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
      // Mock insert - simulate success
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      setSuccess(true)
      setTimeout(() => {
        router.push('/customer/dashboard')
      }, 3000)
    } catch (err) {
      setError('An unexpected error occurred')
    }

    setLoading(false)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Property Valuation Application</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Details
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Please provide detailed information about your property for accurate valuation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                      Property Type *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location/Area *
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Dubai Marina, Jumeirah"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                      Size (sqm)
                    </label>
                    <input
                      type="number"
                      name="size"
                      id="size"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., 120"
                      value={formData.size}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                      Bedrooms
                    </label>
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                      Bathrooms
                    </label>
                    <select
                      id="bathrooms"
                      name="bathrooms"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                      Year Built
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      id="yearBuilt"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., 2015"
                      value={formData.yearBuilt}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Property Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                  <label htmlFor="additionalFeatures" className="block text-sm font-medium text-gray-700">
                    Additional Features
                  </label>
                  <textarea
                    id="additionalFeatures"
                    name="additionalFeatures"
                    rows={3}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Balcony, parking, gym, pool, etc."
                    value={formData.additionalFeatures}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                  <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700">
                    Preferred Contact Method
                  </label>
                  <select
                    id="contactMethod"
                    name="contactMethod"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}