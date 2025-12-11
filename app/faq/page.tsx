'use client'

import { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const faqCategories = [
  {
    title: 'Buying Property',
    icon: '🏠',
    questions: [
      {
        question: 'What documents do I need to buy property in Dubai?',
        answer: 'To buy property in Dubai, you\'ll need: passport copy, visa copy, Emirates ID, proof of income/funds, bank statements, and property purchase agreement. Additional requirements may apply for off-plan purchases.'
      },
      {
        question: 'Can foreigners buy property in Dubai?',
        answer: 'Yes, foreigners can buy property in Dubai. There are no restrictions on foreign ownership in freehold areas. Properties in Dubai Marina, Jumeirah Lakes Towers, and other freehold areas can be owned 100% by foreigners.'
      },
      {
        question: 'What is the process for buying off-plan property?',
        answer: 'Off-plan buying involves: selecting a property, signing a reservation agreement, paying booking fees, signing the SPA within 30 days, paying remaining deposit, and taking possession upon completion. Due diligence is crucial.'
      },
      {
        question: 'How much are property transfer fees in Dubai?',
        answer: 'Property transfer fees in Dubai include: 4% registration fee, 0.25% escrow fee, 0.125% registration fee for off-plan, and 4% VAT on new properties. Additional costs may include agent fees and legal fees.'
      },
      {
        question: 'What is the minimum investment required?',
        answer: 'There is no minimum investment requirement for property purchases in Dubai. You can buy a studio apartment or a fraction of a property, though most investors start with AED 1-2 million investments.'
      }
    ]
  },
  {
    title: 'Selling Property',
    icon: '💰',
    questions: [
      {
        question: 'How long does it take to sell a property in Dubai?',
        answer: 'Property sales in Dubai typically take 3-6 months depending on location, price, and market conditions. Prime locations may sell faster, while off-market or unique properties may take longer.'
      },
      {
        question: 'What are the selling costs and fees?',
        answer: 'Selling costs include: real estate agent commission (2-4%), DLD transfer fees (4%), escrow account fee (0.25%), and potential capital gains tax considerations. Marketing costs may also apply.'
      },
      {
        question: 'Do I need to be present for the sale?',
        answer: 'You can appoint a power of attorney to handle the sale in your absence. Many property owners successfully sell their Dubai properties remotely through appointed representatives.'
      },
      {
        question: 'Can I sell my property before completion?',
        answer: 'Yes, off-plan properties can be sold before completion through assignment. This requires developer approval and proper legal documentation. Assignment fees typically range from 2-5%.'
      },
      {
        question: 'What is the capital gains tax on property sales?',
        answer: 'Dubai has no capital gains tax on property sales. However, if you\'re not a tax resident, you may have tax implications in your home country.'
      }
    ]
  },
  {
    title: 'Investment & Finance',
    icon: '📊',
    questions: [
      {
        question: 'What are the mortgage options for expats?',
        answer: 'Expats can get mortgages up to 75-80% of property value with interest rates from 3-6%. Requirements include minimum salary AED 15,000-25,000, good credit history, and employment visa.'
      },
      {
        question: 'Is Dubai property a good investment?',
        answer: 'Dubai property has shown strong appreciation historically. Key advantages include 0% capital gains tax, stable economy, tourism growth, and Expo 2020 legacy developments.'
      },
      {
        question: 'What is the rental yield in Dubai?',
        answer: 'Rental yields vary by location and property type: Dubai Marina (6-8%), Jumeirah Beach Residence (5-7%), Downtown Dubai (4-6%), and affordable areas (7-10%). Average yield is around 6-7%.'
      },
      {
        question: 'Are there any tax benefits for property investors?',
        answer: 'Dubai offers tax advantages including 0% capital gains tax, 0% income tax on rental income for some investors, and various free zones with 0% corporate tax. No inheritance tax applies.'
      },
      {
        question: 'What are the best areas for investment?',
        answer: 'Top investment areas include Dubai Marina, Jumeirah Beach Residence, Dubai Silicon Oasis, Dubai South, and Dubai Creek Harbour. Consider factors like infrastructure, job growth, and rental demand.'
      }
    ]
  },
  {
    title: 'Legal & Documentation',
    icon: '📋',
    questions: [
      {
        question: 'What is a Title Deed (Noon Book)?',
        answer: 'A Title Deed is the official ownership document issued by Dubai Land Department (DLD). It contains property details, owner information, and legal boundaries. It\'s essential for ownership transfer and mortgage purposes.'
      },
      {
        question: 'What is the difference between freehold and leasehold?',
        answer: 'Freehold properties offer permanent ownership rights. Leasehold properties have long-term leases (usually 99 years) from developers or government. Freehold areas include Dubai Marina, Dubai Festival City, and Jumeirah Lakes Towers.'
      },
      {
        question: 'What is the Dubai Land Department (DLD)?',
        answer: 'DLD is the government authority responsible for property registration, title deeds, planning approvals, and land management in Dubai. All property transactions must be registered with DLD.'
      },
      {
        question: 'What is a Memorandum of Understanding (MOU)?',
        answer: 'An MOU is a preliminary agreement outlining the main terms of a property transaction. It\'s not legally binding but shows serious intent. The formal Sale and Purchase Agreement (SPA) follows the MOU.'
      },
      {
        question: 'What are the escrow account requirements?',
        answer: 'All property transactions over AED 500,000 require an escrow account. 20% of the purchase price must be deposited into escrow before registration. Funds are released upon completion of all legal requirements.'
      }
    ]
  },
  {
    title: 'Living in Dubai',
    icon: '🌴',
    questions: [
      {
        question: 'What visas are available for property owners?',
        answer: 'Property owners can apply for various visas: 5-year residence visa (renewable), 10-year golden visa (for investors), or 1-5 year visit visas. Golden visa requires AED 2 million+ property investment.'
      },
      {
        question: 'Are there property management services available?',
        answer: 'Yes, professional property management companies handle tenant screening, rent collection, maintenance, and property oversight. Fees typically range from 5-10% of monthly rent.'
      },
      {
        question: 'What are the utility costs for properties?',
        answer: 'Average monthly utilities: electricity AED 500-1,500, water/gas AED 200-500, internet AED 300-600, maintenance fees AED 500-2,000 depending on property size and location.'
      },
      {
        question: 'Can I rent out my property on Airbnb?',
        answer: 'Short-term rentals are regulated. Properties in freehold areas can be rented for up to 90 days per year without additional licenses. Commercial licenses are required for longer-term short rentals.'
      },
      {
        question: 'What are the community guidelines?',
        answer: 'Dubai has strict community guidelines: no alcohol consumption in public, modest dress code in public spaces, respect for Islamic customs during Ramadan, and adherence to noise regulations.'
      }
    ]
  }
]

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (questionId: string) => {
    const newOpenQuestions = new Set(openQuestions)
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId)
    } else {
      newOpenQuestions.add(questionId)
    }
    setOpenQuestions(newOpenQuestions)
  }

  const allQuestions = faqCategories.flatMap(category =>
    category.questions.map((q, index) => ({
      ...q,
      id: `${category.title.toLowerCase().replace(' ', '-')}-${index}`,
      category: category.title
    }))
  )

  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === 'all' || question.category.toLowerCase().replace(' ', '-') === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#f5f5f5' }}>
      {/* Hero Section */}
      <div className="relative py-20" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
              Find answers to common questions about Dubai's real estate market
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
              >
                Browse All FAQs
              </button>
              <button
                className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
                style={{ borderColor: '#d4af37', color: '#d4af37' }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {['all', 'buying-property', 'selling-property', 'investment-finance', 'legal-documentation', 'living-dubai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent text-[#f5f5f5] hover:text-[#d4af37]'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'all' && (
          <div className="space-y-12">
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#d4af37' }} />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: '#d4af37',
                    backgroundColor: '#262626',
                    color: '#f5f5f5'
                  }}
                />
              </div>
            </div>

            {/* FAQ Categories */}
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>
                    {category.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const questionId = `${category.title.toLowerCase().replace(' ', '-')}-${faqIndex}`
                    const isOpen = openQuestions.has(questionId)

                    return (
                      <div
                        key={faqIndex}
                        className="border rounded-lg"
                        style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#262626] transition-colors"
                        >
                          <span className="font-medium" style={{ color: '#f5f5f5' }}>
                            {faq.question}
                          </span>
                          <ChevronDownIcon
                            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            style={{ color: '#d4af37' }}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p style={{ color: '#f5f5f5', opacity: 0.8 }}>
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category-specific views */}
        {activeTab !== 'all' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f5f5f5' }}>
              {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} FAQs
            </h2>
            <div className="space-y-4">
              {filteredQuestions.map((faq) => {
                const isOpen = openQuestions.has(faq.id)

                return (
                  <div
                    key={faq.id}
                    className="border rounded-lg"
                    style={{ borderColor: '#d4af37', backgroundColor: '#141414' }}
                  >
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#262626] transition-colors"
                    >
                      <span className="font-medium" style={{ color: '#f5f5f5' }}>
                        {faq.question}
                      </span>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: '#d4af37' }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p style={{ color: '#f5f5f5', opacity: 0.8 }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: '#141414' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <QuestionMarkCircleIcon className="h-16 w-16 mx-auto mb-6" style={{ color: '#d4af37' }} />
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
            Still Have Questions?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#f5f5f5', opacity: 0.8 }}>
            Our expert team is here to help you with personalized guidance for your Dubai property journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#d4af37', color: '#0d0d0d' }}
            >
              Get Expert Consultation
            </button>
            <button
              className="px-8 py-4 border-2 rounded-lg font-semibold transition-colors"
              style={{ borderColor: '#d4af37', color: '#d4af37' }}
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}