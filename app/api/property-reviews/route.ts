'use server'

import { NextRequest, NextResponse } from 'next/server'

// Mock data for property reviews
const mockPendingProperties = [
  {
    id: 'pending-1',
    title: 'Modern Apartment in Dubai Marina',
    description: 'Beautiful 2-bedroom apartment with stunning marina views. Fully furnished and ready to move in.',
    type: 'apartment',
    category: 'residential',
    price: 2500000,
    currency: 'AED',
    beds: 2,
    baths: 2,
    sqft: 1200,
    address: 'Marina Gate, Dubai Marina, Dubai',
    area: 'Dubai Marina',
    city: 'Dubai',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    review_status: 'pending_review',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: 'John Doe',
    phone: '+971 50 123 4567',
    email: 'john@example.com',
    nationality: 'British',
    preferred_contact: 'whatsapp',
    user_role: 'owner'
  },
  {
    id: 'pending-2',
    title: 'Luxury Villa in Palm Jumeirah',
    description: 'Exclusive 5-bedroom villa with private beach access and infinity pool.',
    type: 'villa',
    category: 'luxury',
    price: 15000000,
    currency: 'AED',
    beds: 5,
    baths: 6,
    sqft: 6500,
    address: 'Frond J, Palm Jumeirah, Dubai',
    area: 'Palm Jumeirah',
    city: 'Dubai',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    review_status: 'pending_review',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    name: 'Sarah Smith',
    phone: '+971 55 987 6543',
    email: 'sarah@example.com',
    nationality: 'Emirati',
    preferred_contact: 'phone',
    user_role: 'agent'
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  
  // In a real app, we would fetch from Supabase
  // For now, return mock data
  return NextResponse.json({ 
    properties: status === 'pending' ? mockPendingProperties : [],
    success: true 
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { property_id, action } = body
  
  // Simulate processing
  console.log(`Admin action: ${action} on property ${property_id}`)
  
  return NextResponse.json({ 
    success: true, 
    message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
  })
}
