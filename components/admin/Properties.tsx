'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, BuildingOfficeIcon, HomeModernIcon, MapIcon, BuildingStorefrontIcon, SparklesIcon, CubeIcon, WrenchScrewdriverIcon, TruckIcon, ShoppingBagIcon, Bars3Icon, LinkIcon, ChevronUpIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, CurrencyDollarIcon, PaperClipIcon, ArrowDownTrayIcon, EnvelopeIcon, EnvelopeOpenIcon, ClockIcon } from '@heroicons/react/24/outline'
import PropertyForm from '@/components/PropertyForm'

interface PropertiesProps {
  activeTab: string
  properties: any[]
  setProperties: (properties: any[]) => void
  agents?: any[]
  categories?: any[]
}

export default function Properties({ activeTab, properties, setProperties, agents = [], categories = [] }: PropertiesProps) {
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [publishedFilter, setPublishedFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<any>(null)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)

  // Filter and sort properties
  const filterAndSortProperties = () => {
    let filtered = [...properties]

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(property => property.category === categoryFilter)
    }

    if (publishedFilter !== 'all') {
      filtered = filtered.filter(property => property.published === (publishedFilter === 'true'))
    }

    if (featuredFilter !== 'all') {
      filtered = filtered.filter(property => property.featured === (featuredFilter === 'true'))
    }

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      if (sortBy === 'title') {
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
      } else if (sortBy === 'price') {
        aValue = a.price
        bValue = b.price
      } else if (sortBy === 'status') {
        aValue = a.status
        bValue = b.status
      } else if (sortBy === 'type') {
        aValue = a.type
        bValue = b.type
      } else if (sortBy === 'views' || sortBy === 'inquiries') {
        aValue = a[sortBy] || 0
        bValue = b[sortBy] || 0
      } else if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(a[sortBy]).getTime()
        bValue = new Date(b[sortBy]).getTime()
      } else {
        aValue = a[sortBy]
        bValue = b[sortBy]
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredProperties(filtered)
  }

  useEffect(() => {
    filterAndSortProperties()
  }, [properties, searchTerm, statusFilter, typeFilter, categoryFilter, publishedFilter, featuredFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage)

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProperties.length === paginatedProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(paginatedProperties.map(p => p.id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      setProperties(properties.filter(p => !selectedProperties.includes(p.id)))
      setSelectedProperties([])
    } else if (action === 'publish') {
      setProperties(properties.map(p =>
        selectedProperties.includes(p.id) ? { ...p, published: true } : p
      ))
      setSelectedProperties([])
    } else if (action === 'unpublish') {
      setProperties(properties.map(p =>
        selectedProperties.includes(p.id) ? { ...p, published: false } : p
      ))
      setSelectedProperties([])
    } else if (action === 'feature') {
      setProperties(properties.map(p =>
        selectedProperties.includes(p.id) ? { ...p, featured: true } : p
      ))
      setSelectedProperties([])
    } else if (action === 'unfeature') {
      setProperties(properties.map(p =>
        selectedProperties.includes(p.id) ? { ...p, featured: false } : p
      ))
      setSelectedProperties([])
    }
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(properties.filter(p => p.id !== propertyId))
  }

  const handleUpdateProperty = (updatedProperty: any) => {
    setProperties(properties.map(p =>
      p.id === updatedProperty.id ? updatedProperty : p
    ))
  }

  if (activeTab !== 'properties') return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Properties Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddProperty(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{properties.length}</p>
              <p className="text-sm text-muted-foreground">Total Properties</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <EyeIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {properties.filter(p => p.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {properties.reduce((sum, p) => sum + (p.views || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[250px]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
              <option value="furnished-studio">Furnished Studio</option>
              <option value="residential-plot">Residential Plot</option>
              <option value="industrial-plot">Industrial Plot</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Categories</option>
              {categories.filter(category => category.isActive).map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Published</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Featured</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="updatedAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="status">Sort by Status</option>
              <option value="views">Sort by Views</option>
              <option value="inquiries">Sort by Inquiries</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            {selectedProperties.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedProperties.length} selected
                </span>
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-4 py-2 bg-red-500 text-white border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="publish">Publish</option>
                  <option value="unpublish">Unpublish</option>
                  <option value="feature">Mark as Featured</option>
                  <option value="unfeature">Remove Featured</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Property Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Agent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Published</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Featured</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProperties.map((property) => (
                <tr key={property.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {property.images && property.images.length > 0 && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1">{property.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{property.address}, {property.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded capitalize">
                      {property.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {property.currency} {property.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{property.status}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.published ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {property.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      property.property_status === 'ready' ? 'bg-green-500/10 text-green-500' :
                      property.property_status === 'off-plan' ? 'bg-blue-500/10 text-blue-500' :
                      property.property_status === 'under-construction' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {property.property_status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {property.agent_id ? agents.find(agent => agent.id === property.agent_id)?.name || 'Unknown Agent' : 'No Agent Assigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.published ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {property.published ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.featured ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {property.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPropertyDetails(property)
                          setShowPropertyDetails(true)
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProperty(property)
                          setShowAddProperty(true)
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProperties.length)} of {filteredProperties.length} properties
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Property Modal */}
      {showAddProperty && (
        <PropertyForm
          isOpen={showAddProperty}
          onClose={() => {
            setShowAddProperty(false)
            setEditingProperty(null)
          }}
          onSubmit={(data) => {
            if (editingProperty) {
              handleUpdateProperty({
                ...data,
                id: editingProperty.id,
                category: data.type, // Map type to category
                location: data.address,
                updatedAt: new Date().toISOString().split('T')[0],
                views: editingProperty.views || 0,
                inquiries: editingProperty.inquiries || 0
              })
            } else {
              const newProperty = {
                ...data,
                id: Date.now().toString(),
                category: data.type, // Map type to category
                location: data.address,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
                views: 0,
                inquiries: 0
              }
              setProperties([newProperty, ...properties])
            }
            setShowAddProperty(false)
            setEditingProperty(null)
          }}
          initialData={editingProperty ? {
            ...editingProperty,
            type: editingProperty.category || 'apartment',
            address: editingProperty.location || '',
            property_status: editingProperty.status || 'ready',
            published: editingProperty.status === 'active'
          } : undefined}
          mode={editingProperty ? 'edit' : 'create'}
        />
      )}

      {/* Property Details Modal */}
      {showPropertyDetails && selectedPropertyDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Property Details</h2>
                <button
                  onClick={() => {
                    setShowPropertyDetails(false)
                    setSelectedPropertyDetails(null)
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedPropertyDetails.images && selectedPropertyDetails.images.length > 0 && (
                    <img
                      src={selectedPropertyDetails.images[0]}
                      alt={selectedPropertyDetails.title}
                      className="w-full h-64 rounded-lg object-cover mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{selectedPropertyDetails.title}</h3>
                  <p className="text-muted-foreground mb-4">{selectedPropertyDetails.address}, {selectedPropertyDetails.city}</p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPropertyDetails.published ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {selectedPropertyDetails.published ? 'Published' : 'Draft'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      selectedPropertyDetails.status === 'sale' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      For {selectedPropertyDetails.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      selectedPropertyDetails.property_status === 'ready' ? 'bg-green-500/10 text-green-500' :
                      selectedPropertyDetails.property_status === 'off-plan' ? 'bg-blue-500/10 text-blue-500' :
                      selectedPropertyDetails.property_status === 'under-construction' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {selectedPropertyDetails.property_status.replace('-', ' ')}
                    </span>
                    {selectedPropertyDetails.featured && (
                      <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-sm rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-foreground">
                        {selectedPropertyDetails.currency} {selectedPropertyDetails.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Price</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-foreground">{selectedPropertyDetails.views || 0}</p>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-foreground">{selectedPropertyDetails.inquiries || 0}</p>
                      <p className="text-sm text-muted-foreground">Inquiries</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-foreground">{selectedPropertyDetails.sqft}</p>
                      <p className="text-sm text-muted-foreground">Sq Ft</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    {selectedPropertyDetails.beds > 0 && (
                      <div>
                        <p className="text-xl font-bold text-foreground">{selectedPropertyDetails.beds}</p>
                        <p className="text-sm text-muted-foreground">Beds</p>
                      </div>
                    )}
                    {selectedPropertyDetails.baths > 0 && (
                      <div>
                        <p className="text-xl font-bold text-foreground">{selectedPropertyDetails.baths}</p>
                        <p className="text-sm text-muted-foreground">Baths</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xl font-bold text-foreground">{selectedPropertyDetails.sqft}</p>
                      <p className="text-sm text-muted-foreground">Sq Ft</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{selectedPropertyDetails.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground capitalize">{selectedPropertyDetails.type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-foreground capitalize">{selectedPropertyDetails.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Status:</span>
                      <span className="text-foreground capitalize">{selectedPropertyDetails.property_status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="text-foreground">{selectedPropertyDetails.published ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Featured:</span>
                      <span className="text-foreground">{selectedPropertyDetails.featured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{selectedPropertyDetails.sqft} sq ft</span>
                    </div>
                    {selectedPropertyDetails.beds > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="text-foreground">{selectedPropertyDetails.beds}</span>
                      </div>
                    )}
                    {selectedPropertyDetails.baths > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span className="text-foreground">{selectedPropertyDetails.baths}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Location & Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="text-foreground">{selectedPropertyDetails.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span className="text-foreground">{selectedPropertyDetails.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="text-foreground">{selectedPropertyDetails.area}</span>
                    </div>
                    {selectedPropertyDetails.features && selectedPropertyDetails.features.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Features:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPropertyDetails.features.map((feature: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}