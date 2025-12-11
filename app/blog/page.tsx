import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate Blog & Market Insights | Dubai Property News | RAGDOL',
  description: 'Stay updated with the latest Dubai real estate news, market insights, investment tips, and expert guides. Comprehensive coverage of property trends and market analysis.',
  keywords: 'real estate blog dubai, property news dubai, market insights dubai, real estate tips dubai, property investment dubai, market analysis dubai',
  openGraph: {
    title: 'Real Estate Blog & Market Insights | Dubai Property News',
    description: 'Stay updated with the latest Dubai real estate news, market insights, and investment tips.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Blog & Market Insights | Dubai Property News',
    description: 'Stay updated with the latest Dubai real estate news and market insights.',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-custom">
        <div className="card-custom p-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Real Estate Blog & Guides</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Expert insights, market analysis, and tips for property buyers and sellers.
          </p>
          <div className="text-primary font-semibold">📰 Blog page - Coming Soon</div>
        </div>
      </div>
    </div>
  )
}
