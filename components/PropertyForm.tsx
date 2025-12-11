'use client'

import { useState, useRef, useCallback } from 'react'
import { XMarkIcon, PhotoIcon, MapPinIcon, PlusIcon, TrashIcon, CloudArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'

interface PropertyFormData {
  title: string
  slug: string
  description: string
  category: string
  type: string
  status: string
  property_status: string
  price: number
  currency: string
  beds: number
  baths: number
  sqft: number
  images: string[]
  floorplans: string[]
  features: string[]
  address: string
  city: string
  area: string
  coords: { lat: number; lng: number } | null
  published: boolean
  featured: boolean
  project_id?: string
  developer_id?: string
  agent_id?: string
}

interface PropertyFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PropertyFormData) => void
  initialData?: Partial<PropertyFormData>
  mode?: 'create' | 'edit'
  agents?: any[]
  categories?: any[]
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'furnished-studio', label: 'Furnished Studio' },
  { value: 'residential-plot', label: 'Residential Plot' },
  { value: 'industrial-plot', label: 'Industrial Plot' },
]

const propertyStatuses = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

const propertyStatusOptions = [
  { value: 'ready', label: 'Ready' },
  { value: 'off-plan', label: 'Off Plan' },
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'reserved', label: 'Reserved' },
]

const currencies = [
  { value: 'AED', label: 'AED' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

const commonFeatures = [
  'Swimming Pool',
  'Gym & Fitness Center',
  'Concierge Service',
  'Valet Parking',
  'Rooftop Terrace',
  'Floor-to-Ceiling Windows',
  'Premium Appliances',
  'Walk-in Closets',
  'Smart Home System',
  '24/7 Security',
  'Balcony',
  'Built-in Wardrobes',
  'Parking',
  'Garden',
  'Maid Service',
  'Sea View',
  'City View',
  'Burj Khalifa View',
]

export default function PropertyForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  agents = [],
  categories = []
}: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    type: initialData?.type || 'apartment',
    status: initialData?.status || 'sale',
    property_status: initialData?.property_status || 'ready',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'AED',
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    sqft: initialData?.sqft || 0,
    images: initialData?.images || [],
    floorplans: initialData?.floorplans || [],
    features: initialData?.features || [],
    address: initialData?.address || '',
    city: initialData?.city || 'Dubai',
    area: initialData?.area || '',
    coords: initialData?.coords || null,
    published: initialData?.published || false,
    featured: initialData?.featured || false,
    project_id: initialData?.project_id,
    developer_id: initialData?.developer_id,
    agent_id: initialData?.agent_id,
  })

  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFloorplanUrl, setNewFloorplanUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showReorderMode, setShowReorderMode] = useState(false)
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    if (mainImageIndex >= index && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  // Enhanced Image Management Functions
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await handleFileUpload(files)
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await handleFileUpload(files)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = async (files: File[]) => {
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
        continue
      }

      try {
        // In a real application, you would upload to a cloud storage service
        // For now, we'll create a data URL for demonstration
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }))
        }
        reader.readAsDataURL(file)

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Failed to upload "${file.name}". Please try again.`)
      }
    }

    setTimeout(() => setUploadProgress(0), 1000)
  }

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    if (!showReorderMode) return
    setDraggedImageIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!showReorderMode || draggedImageIndex === null || draggedImageIndex === dropIndex) {
      setDraggedImageIndex(null)
      return
    }

    const newImages = [...formData.images]
    const [draggedImage] = newImages.splice(draggedImageIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    setFormData(prev => ({
      ...prev,
      images: newImages
    }))

    // Update main image index if it was moved
    if (mainImageIndex === draggedImageIndex) {
      setMainImageIndex(dropIndex)
    } else if (mainImageIndex > draggedImageIndex && mainImageIndex <= dropIndex) {
      setMainImageIndex(mainImageIndex - 1)
    } else if (mainImageIndex < draggedImageIndex && mainImageIndex >= dropIndex) {
      setMainImageIndex(mainImageIndex + 1)
    }

    setDraggedImageIndex(null)
  }

  const addFloorplan = () => {
    if (newFloorplanUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        floorplans: [...prev.floorplans, newFloorplanUrl.trim()]
      }))
      setNewFloorplanUrl('')
    }
  }

  const removeFloorplan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      floorplans: prev.floorplans.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const addCommonFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Ensure main image is first in the array
      const reorderedImages = [...formData.images]
      if (mainImageIndex > 0) {
        const mainImage = reorderedImages.splice(mainImageIndex, 1)[0]
        reorderedImages.unshift(mainImage)
      }

      const submitData = {
        ...formData,
        images: reorderedImages,
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {mode === 'create' ? 'Add New Property' : 'Edit Property'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    required
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Select a category...</option>
                    {categories.filter(category => category.isActive).map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    required
                  >
                    {propertyStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Status
                  </label>
                  <select
                    value={formData.property_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_status: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    {propertyStatusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assigned Agent
                  </label>
                  <select
                    value={formData.agent_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, agent_id: e.target.value || undefined }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  >
                    <option value="">Select an agent...</option>
                    {agents.filter(agent => agent.isActive).map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground w-20"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
                  placeholder="Detailed property description..."
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Property Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData(prev => ({ ...prev, beds: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.baths}
                    onChange={(e) => setFormData(prev => ({ ...prev, baths: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData(prev => ({ ...prev, sqft: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="e.g., Downtown Dubai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Coordinates (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={formData.coords?.lat || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        coords: {
                          lat: Number(e.target.value),
                          lng: prev.coords?.lng || 0
                        }
                      }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={formData.coords?.lng || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        coords: {
                          lat: prev.coords?.lat || 0,
                          lng: Number(e.target.value)
                        }
                      }))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Property Images</h3>
                <span className="text-sm text-muted-foreground">{formData.images.length} images</span>
              </div>

              <div className="space-y-4">
                {/* Drag & Drop Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      Drag & drop images here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WebP up to 10MB each
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Choose Files
                  </button>
                </div>

                {/* URL Input as Alternative */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image URL here..."
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-foreground">
                        Select Main Image
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowReorderMode(!showReorderMode)}
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ArrowsUpDownIcon className="h-4 w-4" />
                        {showReorderMode ? 'Done Reordering' : 'Reorder Images'}
                      </button>
                    </div>

                    <select
                      value={mainImageIndex}
                      onChange={(e) => setMainImageIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    >
                      {formData.images.map((image, index) => (
                        <option key={index} value={index}>
                          Image {index + 1} {index === mainImageIndex ? '(Main)' : ''}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative group border rounded-lg overflow-hidden ${
                            showReorderMode ? 'cursor-move' : ''
                          } ${index === mainImageIndex ? 'ring-2 ring-primary' : ''}`}
                          draggable={showReorderMode}
                          onDragStart={(e) => handleImageDragStart(e, index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleImageDrop(e, index)}
                        >
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />

                          {/* Main Image Badge */}
                          {index === mainImageIndex && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg">
                              Main
                            </div>
                          )}

                          {/* Image Number */}
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                            {index + 1}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setMainImageIndex(index)}
                              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                              title="Set as main image"
                            >
                              <PhotoIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                              title="Remove image"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Drag Handle */}
                          {showReorderMode && (
                            <div className="absolute bottom-2 right-2 p-1 bg-black/50 text-white rounded">
                              <ArrowsUpDownIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Image Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Uploading images...</span>
                          <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Floorplans */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Floorplans</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Add Floorplan URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newFloorplanUrl}
                      onChange={(e) => setNewFloorplanUrl(e.target.value)}
                      placeholder="https://example.com/floorplan.jpg"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addFloorplan}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {formData.floorplans.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.floorplans.map((floorplan, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={floorplan}
                          alt={`Floorplan ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFloorplan(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Features & Amenities</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Add Custom Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="e.g., Private Elevator"
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Common Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonFeatures.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addCommonFeature(feature)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.features.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Selected Features
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground">Published</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-foreground">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-muted/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}