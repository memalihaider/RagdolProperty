'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Agent {
  id: string
  title: string
  office?: string
  license_no?: string
  brokerage: string
  bio?: string
  whatsapp?: string
  profile_image?: string
  approved: boolean
  verified: boolean
  rating: number
  review_count: number
  experience_years: number
  created_at: string
}

export default function AgentManagement() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'pending'>('all')

  const [formData, setFormData] = useState({
    title: '',
    office: '',
    license_no: '',
    brokerage: 'Global Property Solutions',
    bio: '',
    whatsapp: '',
    telegram: '',
    linkedin_url: '',
    instagram_handle: '',
    website_url: '',
    profile_image: '',
    approved: false,
    rating: 4.5,
    review_count: 0,
    total_sales: 0,
    commission_rate: 2.5,
    experience_years: 5,
    languages: ['English', 'Arabic'],
    certifications: ['RERA Certified'],
    verified: false,
    specializations: ['Residential Properties']
  })

  // Check auth
  useEffect(() => {
    if (!user || profile?.role !== 'admin') {
      router.push('/admin/login')
    }
  }, [user, profile, router])

  // Load agents
  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadAgents()
    }
  }, [user, profile])

  const loadAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/agents?limit=100')
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setAgents([data.agent, ...agents])
        setShowAddModal(false)
        setFormData({
          title: '',
          office: '',
          license_no: '',
          brokerage: 'Global Property Solutions',
          bio: '',
          whatsapp: '',
          telegram: '',
          linkedin_url: '',
          instagram_handle: '',
          website_url: '',
          profile_image: '',
          approved: false,
          rating: 4.5,
          review_count: 0,
          total_sales: 0,
          commission_rate: 2.5,
          experience_years: 5,
          languages: ['English', 'Arabic'],
          certifications: ['RERA Certified'],
          verified: false,
          specializations: ['Residential Properties']
        })
      }
    } catch (error) {
      console.error('Error adding agent:', error)
    }
  }

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAgent) return

    try {
      const response = await fetch(`/api/admin/agents/${editingAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setAgents(agents.map(a => a.id === editingAgent.id ? data.agent : a))
        setEditingAgent(null)
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error updating agent:', error)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return

    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAgents(agents.filter(a => a.id !== agentId))
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
    }
  }

  const handleToggleApproval = async (agent: Agent) => {
    try {
      const response = await fetch(`/api/admin/agents/${agent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agent,
          approved: !agent.approved
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAgents(agents.map(a => a.id === agent.id ? data.agent : a))
      }
    } catch (error) {
      console.error('Error toggling approval:', error)
    }
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.brokerage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterApproved === 'all' || 
                         (filterApproved === 'approved' && agent.approved) ||
                         (filterApproved === 'pending' && !agent.approved)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <button
            onClick={() => {
              setEditingAgent(null)
              setFormData({
                title: '',
                office: '',
                license_no: '',
                brokerage: 'Global Property Solutions',
                bio: '',
                whatsapp: '',
                telegram: '',
                linkedin_url: '',
                instagram_handle: '',
                website_url: '',
                profile_image: '',
                approved: false,
                rating: 4.5,
                review_count: 0,
                total_sales: 0,
                commission_rate: 2.5,
                experience_years: 5,
                languages: ['English', 'Arabic'],
                certifications: ['RERA Certified'],
                verified: false,
                specializations: ['Residential Properties']
              })
              setShowAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Agent
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Agents</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No agents found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brokerage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {agent.profile_image && (
                          <img
                            src={agent.profile_image}
                            alt={agent.title}
                            className="h-10 w-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{agent.title}</div>
                          <div className="text-sm text-gray-500">{agent.whatsapp}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.brokerage}</div>
                      {agent.office && <div className="text-sm text-gray-500">{agent.office}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ⭐ {agent.rating} ({agent.review_count} reviews)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.experience_years} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {agent.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleApproval(agent)}
                        title={agent.approved ? 'Reject' : 'Approve'}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        {agent.approved ? <XMarkIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAgent(agent)
                          setFormData(agent as any)
                          setShowAddModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingAgent ? 'Edit Agent' : 'Add New Agent'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingAgent ? handleUpdateAgent : handleAddAgent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Agent Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Office"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="License Number"
                  value={formData.license_no}
                  onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Brokerage"
                  value={formData.brokerage}
                  onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Profile Image URL"
                  value={formData.profile_image}
                  onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Experience Years"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Rating"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.approved}
                    onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Approved</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Verified</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAgent ? 'Update Agent' : 'Add Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
