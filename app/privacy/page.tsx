'use client'

import { EyeIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: EyeIcon,
      title: 'Data Collection',
      content: 'We collect information you provide directly and automatically through your use of our services.'
    },
    {
      icon: LockClosedIcon,
      title: 'Data Protection',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access.'
    },
    {
      icon: UserGroupIcon,
      title: 'Data Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties without your consent.'
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
              Privacy <span className="text-[#d4af37]">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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

          {/* Privacy Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                This Privacy Policy explains how RAGDOL ("we," "our," or "us") collects, uses, discloses, and safeguards
                your information when you use our website, mobile application, and related services (collectively, the "Service").
              </p>
              <p className="text-[#a3a3a3] leading-relaxed">
                By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#d4af37]">Personal Information</h3>
                  <p className="text-[#a3a3a3] leading-relaxed mb-3">
                    We collect personal information that you provide to us, including:
                  </p>
                  <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-1 ml-4">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Property preferences and search history</li>
                    <li>Communication preferences</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#d4af37]">Usage Information</h3>
                  <p className="text-[#a3a3a3] leading-relaxed mb-3">
                    We automatically collect certain information when you use our Service:
                  </p>
                  <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-1 ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Search queries and property views</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li>Providing and maintaining our Service</li>
                <li>Creating and managing your account</li>
                <li>Processing transactions and payments</li>
                <li>Connecting you with real estate agents and properties</li>
                <li>Sending you updates, newsletters, and marketing communications</li>
                <li>Improving our Service and developing new features</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li><strong>With Real Estate Agents:</strong> To connect you with relevant professionals</li>
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our Service</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to the sharing</li>
              </ul>
              <p className="text-[#a3a3a3] leading-relaxed mt-4">
                We do not sell, trade, or rent your personal information to third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience on our Service. These include:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our Service</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-[#a3a3a3] leading-relaxed mt-4">
                You can control cookie settings through your browser preferences or our cookie consent tool.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information,
                including:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and employee training</li>
                <li>Secure data storage and processing facilities</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-[#a3a3a3] leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                We retain your personal information for as long as necessary to provide our Service, comply with legal obligations,
                resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Rights and Choices</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                Our Service is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected personal information
                from a child under 18, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that
                such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our Service
                after such changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[#262626] rounded-lg p-4 border border-[#333333]">
                <p className="text-[#a3a3a3]">Email: privacy@ragdol.com</p>
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