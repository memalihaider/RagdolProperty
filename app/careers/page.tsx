'use client'

import { useState } from 'react'
import { BriefcaseIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, UserGroupIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const jobOpenings = [
  {
    title: 'Senior Real Estate Agent',
    department: 'Sales',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 25,000 - 50,000/month',
    description: 'Lead sales agent specializing in luxury properties and high-value transactions.',
    requirements: ['5+ years experience', 'Real Estate License', 'Proven sales track record', 'Excellent communication skills']
  },
  {
    title: 'Property Manager',
    department: 'Operations',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 18,000 - 35,000/month',
    description: 'Manage residential and commercial properties, oversee maintenance and tenant relations.',
    requirements: ['3+ years experience', 'Property management certification', 'Strong organizational skills', 'Customer service focus']
  },
  {
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 15,000 - 30,000/month',
    description: 'Develop and execute marketing campaigns for property listings and company branding.',
    requirements: ['3+ years marketing experience', 'Digital marketing skills', 'Social media expertise', 'Creative portfolio']
  },
  {
    title: 'Real Estate Analyst',
    department: 'Research',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 20,000 - 40,000/month',
    description: 'Conduct market research, analyze property data, and provide investment insights.',
    requirements: ['Bachelor\'s in Finance/Economics', 'Data analysis skills', 'Market research experience', 'Report writing']
  },
  {
    title: 'Customer Service Representative',
    department: 'Support',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 12,000 - 20,000/month',
    description: 'Provide exceptional customer service to clients and handle inquiries professionally.',
    requirements: ['2+ years customer service', 'Communication skills', 'CRM experience', 'Problem-solving ability']
  },
  {
    title: 'Junior Real Estate Agent',
    department: 'Sales',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 15,000 - 25,000/month',
    description: 'Entry-level position for aspiring real estate professionals with training provided.',
    requirements: ['Real Estate License preferred', 'Strong communication', 'Motivated and ambitious', 'Willing to learn']
  }
]

const benefits = [
  'Competitive salary packages',
  'Performance-based bonuses',
  'Comprehensive health insurance',
  'Professional development opportunities',
  'Flexible working hours',
  'Paid annual leave',
  'Career advancement paths',
  'Modern office facilities'
]

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Build your career in Dubai's premier real estate company
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                View Open Positions
              </button>
              <button
                className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
                style={{ borderColor: '#d4af37', color: '#d4af37' }}
              >
                Learn About Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'positions', 'benefits', 'apply'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-[#f5f5f5] hover:text-[#d4af37]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Overview */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
                Why Work With Us?
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                Join Dubai's leading real estate company and be part of a dynamic team that's shaping
                the future of property investment in the UAE.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>200+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>15+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>50K+</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#d4af37' }}>98%</div>
                <div style={{ color: '#f5f5f5', opacity: 0.8 }}>Client Satisfaction</div>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <UserGroupIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#d4af37' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>Team Collaboration</h3>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Work with talented professionals in a supportive environment</p>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <AcademicCapIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#d4af37' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>Continuous Learning</h3>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Ongoing training and professional development opportunities</p>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#141414' }}>
                <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#d4af37' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>Competitive Rewards</h3>
                <p style={{ color: '#f5f5f5', opacity: 0.8 }}>Attractive compensation and performance-based incentives</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Current Open Positions
            </h2>
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#141414',
                    borderWidth: selectedJob === index ? '2px' : '1px'
                  }}
                  onClick={() => setSelectedJob(selectedJob === index ? null : index)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                        <span className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {job.department}
                        </span>
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4" style={{ color: '#f5f5f5', opacity: 0.8 }}>
                    {job.description}
                  </p>
                  {selectedJob === index && (
                    <div className="border-t pt-4" style={{ borderColor: '#d4af37' }}>
                      <h4 className="font-semibold mb-2" style={{ color: '#d4af37' }}>Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircleIcon className="h-4 w-4 mr-2" style={{ color: '#d4af37' }} />
                            <span style={{ color: '#f5f5f5', opacity: 0.8 }}>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className="mt-4 px-6 py-2 rounded font-semibold transition-colors"
                        style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
                      >
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              Employee Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg"
                  style={{ backgroundColor: '#141414' }}
                >
                  <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: '#d4af37' }} />
                  <span style={{ color: '#f5f5f5' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#f5f5f5' }}>
              Apply for a Position
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: '#d4af37',
                      backgroundColor: '#262626',
                      color: '#f5f5f5'
                    }}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: '#d4af37',
                      backgroundColor: '#262626',
                      color: '#f5f5f5'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Position Applied For
                </label>
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                >
                  <option value="">Select a position</option>
                  {jobOpenings.map((job, index) => (
                    <option key={index} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Cover Letter
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f5f5f5' }}>
                  Resume/CV
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Submit Application
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Ready to Start Your Real Estate Career?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Join our growing team and be part of Dubai's real estate success story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              View All Positions
            </button>
            <button
              className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
              style={{ borderColor: '#d4af37', color: '#d4af37' }}
            >
              Contact HR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}