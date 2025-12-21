'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Agents from '@/components/admin/Agents'

export default function AgentManagementPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  // Check auth
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, profile, loading, router])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <Agents />
        </div>
      )}
    </div>
  )
}
