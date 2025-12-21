'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CheckIcon, XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

interface Project {
  id: string
  name: string
  slug?: string
  status: string
  developer_id?: string
  city: string
  area?: string
  district?: string
  address?: string
  hero_image_url?: string
  description?: string
  starting_price?: number
  min_price?: number
  max_price?: number
  currency: string
  total_units?: number
  available_units?: number
  sold_units?: number
  amenities?: string[]
  facilities?: string[]
  property_types?: string[]
  featured: boolean
  published: boolean
  launch_date?: string
  completion_date?: string
  handover_date?: string
  payment_plan?: string
  payment_terms?: any
  brochure_url?: string
  video_url?: string
  images?: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  coords?: any
  created_at: string
  updated_at?: string
  inquiries_count?: number
  views_count?: number
}

export default function ProjectManagement() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'planned' | 'in-progress' | 'completed'>('all')

  const [formData, setFormData] = useState({
    name: '',
    status: 'planned',
    developer_id: '',
    city: 'Dubai',
    area: '',
    district: '',
    address: '',
    hero_image_url: '',
    description: '',
    starting_price: '',
    min_price: '',
    max_price: '',
    currency: 'AED',
    total_units: '',
    available_units: '',
    sold_units: '',
    amenities: [] as string[],
    facilities: [] as string[],
    property_types: [] as string[],
    featured: false,
    published: false,
    launch_date: '',
    completion_date: '',
    handover_date: '',
    payment_plan: '',
    payment_terms: '',
    brochure_url: '',
    video_url: '',
    images: [] as string[],
    seo_title: '',
    seo_description: '',
    seo_keywords: [] as string[],
    coords_lat: '',
    coords_lng: ''
  })

  // Check auth
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, profile, loading, router])

  // Load projects
  useEffect(() => {
    if (!loading && user && profile?.role === 'admin') {
      loadProjects()
    }
  }, [user, profile, loading])

  const loadProjects = async () => {
    try {
      setLoadingData(true)
      const response = await fetch('/api/admin/projects?limit=100')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        starting_price: formData.starting_price ? parseFloat(formData.starting_price) : undefined,
        min_price: formData.min_price ? parseFloat(formData.min_price) : undefined,
        max_price: formData.max_price ? parseFloat(formData.max_price) : undefined,
        total_units: formData.total_units ? parseInt(formData.total_units) : undefined,
        available_units: formData.available_units ? parseInt(formData.available_units) : undefined,
        sold_units: formData.sold_units ? parseInt(formData.sold_units) : undefined,
        coords: formData.coords_lat && formData.coords_lng ? {
          lat: parseFloat(formData.coords_lat),
          lng: parseFloat(formData.coords_lng)
        } : undefined,
        seo_keywords: formData.seo_keywords.length > 0 ? formData.seo_keywords : undefined
      }

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        const data = await response.json()
        setProjects([data.project, ...projects])
        setShowAddModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    try {
      const projectData = {
        ...formData,
        starting_price: formData.starting_price ? parseFloat(formData.starting_price) : undefined,
        min_price: formData.min_price ? parseFloat(formData.min_price) : undefined,
        max_price: formData.max_price ? parseFloat(formData.max_price) : undefined,
        total_units: formData.total_units ? parseInt(formData.total_units) : undefined,
        available_units: formData.available_units ? parseInt(formData.available_units) : undefined,
        sold_units: formData.sold_units ? parseInt(formData.sold_units) : undefined,
        coords: formData.coords_lat && formData.coords_lng ? {
          lat: parseFloat(formData.coords_lat),
          lng: parseFloat(formData.coords_lng)
        } : undefined,
        seo_keywords: formData.seo_keywords.length > 0 ? formData.seo_keywords : undefined
      }

      const response = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(projects.map(p => p.id === editingProject.id ? data.project : p))
        setEditingProject(null)
        setShowAddModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      status: project.status,
      developer_id: project.developer_id || '',
      city: project.city,
      area: project.area || '',
      district: project.district || '',
      address: project.address || '',
      hero_image_url: project.hero_image_url || '',
      description: project.description || '',
      starting_price: project.starting_price?.toString() || '',
      min_price: project.min_price?.toString() || '',
      max_price: project.max_price?.toString() || '',
      currency: project.currency,
      total_units: project.total_units?.toString() || '',
      available_units: project.available_units?.toString() || '',
      sold_units: project.sold_units?.toString() || '',
      amenities: project.amenities || [],
      facilities: project.facilities || [],
      property_types: project.property_types || [],
      featured: project.featured,
      published: project.published,
      launch_date: project.launch_date || '',
      completion_date: project.completion_date || '',
      handover_date: project.handover_date || '',
      payment_plan: project.payment_plan || '',
      payment_terms: project.payment_terms || '',
      brochure_url: project.brochure_url || '',
      video_url: project.video_url || '',
      images: project.images || [],
      seo_title: project.seo_title || '',
      seo_description: project.seo_description || '',
      seo_keywords: project.seo_keywords || [],
      coords_lat: project.coords?.lat?.toString() || '',
      coords_lng: project.coords?.lng?.toString() || ''
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'planned',
      developer_id: '',
      city: 'Dubai',
      area: '',
      district: '',
      address: '',
      hero_image_url: '',
      description: '',
      starting_price: '',
      min_price: '',
      max_price: '',
      currency: 'AED',
      total_units: '',
      available_units: '',
      sold_units: '',
      amenities: [],
      facilities: [],
      property_types: [],
      featured: false,
      published: false,
      launch_date: '',
      completion_date: '',
      handover_date: '',
      payment_plan: '',
      payment_terms: '',
      brochure_url: '',
      video_url: '',
      images: [],
      seo_title: '',
      seo_description: '',
      seo_keywords: [],
      coords_lat: '',
      coords_lng: ''
    })
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.area?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const addToArray = (field: 'amenities' | 'facilities' | 'property_types' | 'seo_keywords', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      })
    }
  }

  const removeFromArray = (field: 'amenities' | 'facilities' | 'property_types' | 'seo_keywords', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter(item => item !== value)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <button
            onClick={() => {
              setEditingProject(null)
              resetForm()
              setShowAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Project
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li key={project.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {project.hero_image_url && (
                        <img
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                          src={project.hero_image_url}
                          alt={project.name}
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          {project.city} • {project.area} • {project.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {project.currency} {project.starting_price?.toLocaleString()} - {project.max_price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>

              <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Starting Price</label>
                    <input
                      type="number"
                      value={formData.starting_price}
                      onChange={(e) => setFormData({...formData, starting_price: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Price</label>
                    <input
                      type="number"
                      value={formData.min_price}
                      onChange={(e) => setFormData({...formData, min_price: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Price</label>
                    <input
                      type="number"
                      value={formData.max_price}
                      onChange={(e) => setFormData({...formData, max_price: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AED">AED</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                {/* Units */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Units</label>
                    <input
                      type="number"
                      value={formData.total_units}
                      onChange={(e) => setFormData({...formData, total_units: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available Units</label>
                    <input
                      type="number"
                      value={formData.available_units}
                      onChange={(e) => setFormData({...formData, available_units: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sold Units</label>
                    <input
                      type="number"
                      value={formData.sold_units}
                      onChange={(e) => setFormData({...formData, sold_units: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Launch Date</label>
                    <input
                      type="date"
                      value={formData.launch_date}
                      onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                    <input
                      type="date"
                      value={formData.completion_date}
                      onChange={(e) => setFormData({...formData, completion_date: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Handover Date</label>
                    <input
                      type="date"
                      value={formData.handover_date}
                      onChange={(e) => setFormData({...formData, handover_date: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Media URLs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
                    <input
                      type="url"
                      value={formData.hero_image_url}
                      onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brochure URL</label>
                    <input
                      type="url"
                      value={formData.brochure_url}
                      onChange={(e) => setFormData({...formData, brochure_url: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Video URL</label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Arrays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add amenity"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addToArray('amenities', (e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addToArray('amenities', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeFromArray('amenities', amenity)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Types</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add property type"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addToArray('property_types', (e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addToArray('property_types', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.property_types.map((type, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {type}
                          <button
                            type="button"
                            onClick={() => removeFromArray('property_types', type)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add keyword"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addToArray('seo_keywords', (e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addToArray('seo_keywords', input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seo_keywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeFromArray('seo_keywords', keyword)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coords_lat}
                      onChange={(e) => setFormData({...formData, coords_lat: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.coords_lng}
                      onChange={(e) => setFormData({...formData, coords_lng: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="published"
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700">Published</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingProject(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}