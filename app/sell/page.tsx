'use client'

import { useState } from 'react'
import { CheckIcon, PhotoIcon, DocumentTextIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const steps = [
  { id: 1, title: 'Property Details', description: 'Tell us about your property' },
  { id: 2, title: 'Pricing & Photos', description: 'Set price and upload images' },
  { id: 3, title: 'Contact Info', description: 'Your contact information' },
  { id: 4, title: 'Review & Publish', description: 'Review and go live' },
]

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    propertyType: 'apartment',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    location: '',
    price: '',
    description: '',
    name: '',
    phone: '',
    email: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/10 py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              List Your Property on <span className="text-gradient">RAGDOL</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Reach thousands of potential buyers and renters. Quick, easy, and completely free
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Steps Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step.id
                          ? 'bg-primary text-background'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? <CheckIcon className="w-6 h-6" /> : step.id}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 transition-all ${
                          currentStep > step.id ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8 space-y-6">
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="studio">Studio</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="office">Office</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Bedrooms
                      </label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Bathrooms
                      </label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-3">
                        Area (Sq Ft)
                      </label>
                      <input
                        type="number"
                        name="area"
                        placeholder="e.g., 1500"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g., Downtown Dubai, Dubai"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your property, features, amenities..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Photos */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      Price (AED)
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g., 2500000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground text-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5" />
                      Upload Photos
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">📸</div>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop your photos here or click to browse
                      </p>
                      <button className="px-6 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all">
                        Choose Photos
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+971 XX XXX XXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-background border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">Review Your Listing</h3>
                    <div className="space-y-3 text-sm">
                      <p>
                        <span className="text-muted-foreground">Property Type:</span>
                        <span className="font-semibold text-foreground ml-2 capitalize">
                          {formData.propertyType}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-semibold text-foreground ml-2">{formData.location}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary text-lg ml-2">
                          AED {parseInt(formData.price).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="font-semibold text-foreground ml-2">{formData.bedrooms}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      ✓ Your listing will be published immediately after review. You will receive a
                      confirmation email shortly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              {currentStep === 4 ? (
                <button className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30">
                  Publish Listing
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-card border-t border-border">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Why List on <span className="text-gradient">RAGDOL</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: '⚡', title: 'Quick & Easy', desc: 'List your property in just 5 minutes' },
              { icon: '💰', title: '100% Free', desc: 'No hidden fees or charges' },
              { icon: '📱', title: 'Wide Reach', desc: 'Reach thousands of buyers and renters' },
              { icon: '⭐', title: 'Top Featured', desc: 'Premium listing options available' },
              { icon: '👥', title: 'Direct Contact', desc: 'Connect directly with interested buyers' },
              { icon: '📊', title: 'Analytics', desc: 'Track views and inquiries' },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
