'use client'

import Link from 'next/link'
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Become an Agent', href: '/agents/register' },
    ],
    discover: [
      { label: 'Buy Property', href: '/properties?status=sale' },
      { label: 'Apartments', href: '/apartments' },
      { label: 'Villas', href: '/villas' },
      { label: 'Townhouses', href: '/townhouses' },
      { label: 'Residential Plots', href: '/residential-plots' },
      { label: 'Plots', href: '/plots' },
      { label: 'Furnished Studios', href: '/furnished-studio' },
      { label: 'Properties in Dubai', href: '/properties-dubai' },
      { label: 'Rent Property', href: '/properties?status=rent' },
      { label: 'New Projects', href: '/projects' },
      { label: 'Market Insights', href: '/market' },
    ],
    resources: [
      { label: 'Blog & Guides', href: '/news' },
      { label: 'Mortgage Calculator', href: '/calculators' },
      { label: 'Property Valuation', href: '/sell' },
      { label: 'Area Guides', href: '/guides' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-3xl font-bold text-gradient">RAGDOL</div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Pakistan's premier real estate platform connecting buyers, sellers, and agents
              with their dream properties.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <EnvelopeIcon className="h-5 w-5 text-primary" />
                <span>info@ragdol.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <span>Dubai, UAE</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} RAGDOL. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
