'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['+971 50 123 4567', '+971 55 765 4321'],
      description: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@ragdol.com', 'support@ragdol.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      details: ['123 Business Bay Tower', 'Business Bay, Dubai, UAE'],
      description: 'Visit us for consultation'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      description: 'Sunday: Closed'
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
              <PaperAirplaneIcon className="h-8 w-8 text-[#1a1a1a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#f5f5f5] mb-4">Message Sent!</h2>
            <p className="text-[#a3a3a3] mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact <span className="text-[#d4af37]">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Get in touch with our expert team. We're here to help you find your dream property
              or answer any questions you may have.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-[#a3a3a3] text-lg mb-8">
              Have questions about buying, selling, or renting property? Our team of experts
              is ready to assist you. Reach out to us through any of the channels below.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-[#a3a3a3]">{detail}</p>
                    ))}
                    <p className="text-[#737373] text-sm mt-1">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] placeholder-[#737373] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] placeholder-[#737373] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] placeholder-[#737373] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-colors"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="buying">Buying Property</option>
                    <option value="selling">Selling Property</option>
                    <option value="renting">Renting Property</option>
                    <option value="valuation">Property Valuation</option>
                    <option value="investment">Investment Advice</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] placeholder-[#737373] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1a1a1a] mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#141414] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-[#a3a3a3] text-lg">
              Located in the heart of Lahore's business district
            </p>
          </div>

          <div className="bg-[#262626] rounded-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-16 w-16 text-[#d4af37] mx-auto mb-4" />
                <p className="text-[#a3a3a3]">Interactive Map Coming Soon</p>
                <p className="text-[#737373] text-sm mt-2">
                  123 Business Avenue, Gulberg, Lahore, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}