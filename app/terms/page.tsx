'use client'

import { DocumentTextIcon, ScaleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: DocumentTextIcon,
      title: 'Acceptance of Terms',
      content: 'By accessing and using RAGDOL, you accept and agree to be bound by the terms and provision of this agreement.'
    },
    {
      icon: ScaleIcon,
      title: 'User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their computer.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Service Availability',
      content: 'While we strive to provide continuous service, we do not guarantee that the service will be uninterrupted or error-free.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of <span className="text-[#d4af37]">Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services.
              By using RAGDOL, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#141414] rounded-lg border border-[#333333] p-8 md:p-12">
          <div className="mb-8">
            <p className="text-[#a3a3a3] text-sm mb-4">Last updated: December 6, 2025</p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-[#262626] rounded-lg border border-[#333333] p-6 text-center">
                <section.icon className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                <p className="text-[#a3a3a3] text-sm">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                Welcome to RAGDOL ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website,
                mobile application, and related services (collectively, the "Service"). By accessing or using our Service,
                you agree to be bound by these Terms.
              </p>
              <p className="text-[#a3a3a3] leading-relaxed">
                If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                RAGDOL is UAE's premier real estate platform that connects buyers, sellers, renters, and real estate
                professionals. Our services include:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li>Property listings and search functionality</li>
                <li>Real estate agent connections</li>
                <li>Property valuation tools</li>
                <li>Mortgage calculators</li>
                <li>Market insights and analytics</li>
                <li>Property management services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-[#a3a3a3] leading-relaxed">
                  To access certain features of our Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Use only one account per person</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                You agree not to use our Service to:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm others</li>
                <li>Transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to access our Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Property Listings</h2>
              <div className="space-y-4">
                <p className="text-[#a3a3a3] leading-relaxed">
                  When listing properties on our platform:
                </p>
                <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                  <li>You must have legal authority to list the property</li>
                  <li>All information provided must be accurate and current</li>
                  <li>You are responsible for complying with all applicable laws</li>
                  <li>We reserve the right to remove listings that violate our policies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by RAGDOL and are protected
                by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-[#a3a3a3] leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works of our content without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Disclaimers</h2>
              <div className="space-y-4">
                <p className="text-[#a3a3a3] leading-relaxed">
                  Our Service is provided "as is" without warranties of any kind. We do not guarantee:
                </p>
                <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                  <li>The accuracy of property information</li>
                  <li>The availability of listed properties</li>
                  <li>The qualifications of real estate agents</li>
                  <li>Uninterrupted or error-free service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                In no event shall RAGDOL be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
                from your use of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                We may terminate or suspend your account and access to our Service immediately, without prior notice,
                for any reason, including breach of these Terms. Upon termination, your right to use our Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes
                via email or through our Service. Your continued use of our Service after such modifications constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-[#262626] rounded-lg p-4 border border-[#333333]">
                <p className="text-[#a3a3a3]">Email: legal@ragdol.com</p>
                <p className="text-[#a3a3a3]">Phone: +92 300 1234567</p>
                <p className="text-[#a3a3a3]">Address: 123 Business Bay Tower, Business Bay, Dubai, UAE</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}