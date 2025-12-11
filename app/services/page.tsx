'use client'

import { CheckIcon } from '@heroicons/react/24/outline'

const services = [
  {
    id: '1',
    title: 'Property Valuation',
    description: 'Professional market valuation of residential and commercial properties',
    features: ['Market Analysis', 'Comparative Study', 'Detailed Report', 'Expert Assessment'],
    icon: '📊',
    color: 'primary',
  },
  {
    id: '2',
    title: 'Investment Advisory',
    description: 'Personalized investment strategies for maximum returns',
    features: ['Portfolio Analysis', 'Market Insights', 'Risk Assessment', 'Growth Planning'],
    icon: '💼',
    color: 'secondary',
  },
  {
    id: '3',
    title: 'Property Management',
    description: 'Complete property management and maintenance services',
    features: ['Tenant Management', 'Maintenance', 'Rent Collection', 'Legal Compliance'],
    icon: '🏘️',
    color: 'primary',
  },
  {
    id: '4',
    title: 'Legal Documentation',
    description: 'Professional handling of all legal documents and contracts',
    features: ['Document Preparation', 'Contract Review', 'Registration', 'Legal Compliance'],
    icon: '📋',
    color: 'secondary',
  },
  {
    id: '5',
    title: 'Financial Planning',
    description: 'Mortgage and financing solutions for property purchases',
    features: ['Financing Options', 'Mortgage Guidance', 'Financial Planning', 'Best Rates'],
    icon: '💰',
    color: 'primary',
  },
  {
    id: '6',
    title: 'Interior Design',
    description: 'Professional interior design and renovation services',
    features: ['Design Consultation', 'Space Planning', 'Material Selection', 'Project Management'],
    icon: '🎨',
    color: 'secondary',
  },
]

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/10 py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Comprehensive Real Estate <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer a full suite of professional services to support every step of your
              real estate journey
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 hover:shadow-xl group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                <div className="space-y-3 pt-6 border-t border-border">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-background transition-all rounded-lg font-semibold">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Calculators Section */}
      <section className="section-padding bg-card border-t border-border">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Useful <span className="text-gradient">Tools & Calculators</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Use our free tools to make informed real estate decisions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Mortgage Calculator',
                desc: 'Calculate monthly mortgage payments based on loan amount and interest rate',
              },
              {
                title: 'ROI Calculator',
                desc: 'Calculate potential return on investment for rental properties',
              },
              {
                title: 'Property Tax Calculator',
                desc: 'Estimate property taxes and transfer fees',
              },
              {
                title: 'Price Per Sqft',
                desc: 'Analyze property prices on a per square foot basis',
              },
              {
                title: 'Rental Yield Calculator',
                desc: 'Calculate rental yield and investment returns',
              },
              {
                title: 'Budget Planner',
                desc: 'Plan your property purchase budget and affordability',
              },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
                <button className="text-primary font-semibold text-sm hover:underline">
                  Use Tool →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Why Choose RAGDOL <span className="text-gradient">Services</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Expert Team',
                desc: 'Experienced professionals with deep market knowledge',
              },
              {
                title: 'Personalized Solutions',
                desc: 'Tailored services to meet your specific needs',
              },
              {
                title: 'Transparency',
                desc: 'Clear communication and no hidden charges',
              },
              {
                title: '24/7 Support',
                desc: 'Dedicated support team available round the clock',
              },
              {
                title: 'Fast Processing',
                desc: 'Quick turnaround time without compromising quality',
              },
              {
                title: 'Competitive Pricing',
                desc: 'Best value for money in the market',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-3xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Contact our team of experts to discuss your real estate needs and
              discover how we can help you achieve your goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30">
                Book Consultation
              </button>
              <button className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-200 rounded-lg font-semibold">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
