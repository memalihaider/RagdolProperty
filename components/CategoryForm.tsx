'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  BuildingOfficeIcon,
  HomeModernIcon,
  HomeIcon,
  MapIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'

interface CategoryFormData {
  id: string
  name: string
  description: string
  icon: string
  color: string
  isActive: boolean
  parentId?: string
  order: number
}

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => void
  initialData?: Partial<CategoryFormData>
  mode?: 'create' | 'edit'
}

const availableIcons = [
  { name: 'BuildingOfficeIcon', component: BuildingOfficeIcon, label: 'Office Building' },
  { name: 'HomeModernIcon', component: HomeModernIcon, label: 'Modern Home' },
  { name: 'HomeIcon', component: HomeIcon, label: 'Home' },
  { name: 'MapIcon', component: MapIcon, label: 'Map' },
  { name: 'BuildingStorefrontIcon', component: BuildingStorefrontIcon, label: 'Storefront' },
  { name: 'SparklesIcon', component: SparklesIcon, label: 'Sparkles' },
  { name: 'CubeIcon', component: CubeIcon, label: 'Cube' },
  { name: 'WrenchScrewdriverIcon', component: WrenchScrewdriverIcon, label: 'Tools' },
  { name: 'TruckIcon', component: TruckIcon, label: 'Truck' },
  { name: 'ShoppingBagIcon', component: ShoppingBagIcon, label: 'Shopping' },
]

const categoryColors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
]

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    id: initialData?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    icon: initialData?.icon || 'BuildingOfficeIcon',
    color: initialData?.color || 'blue',
    isActive: initialData?.isActive ?? true,
    parentId: initialData?.parentId,
    order: initialData?.order || 0,
  })

  const [selectedIcon, setSelectedIcon] = useState(availableIcons.find(icon => icon.name === formData.icon) || availableIcons[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        description: initialData.description || '',
        icon: initialData.icon || 'BuildingOfficeIcon',
        color: initialData.color || 'blue',
        isActive: initialData.isActive ?? true,
        parentId: initialData.parentId,
        order: initialData.order || 0,
      })
      setSelectedIcon(availableIcons.find(icon => icon.name === initialData.icon) || availableIcons[0])
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIconSelect = (icon: typeof availableIcons[0]) => {
    setSelectedIcon(icon)
    setFormData(prev => ({ ...prev, icon: icon.name }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="e.g., apartment, villa"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  required
                  disabled={mode === 'edit'}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier, cannot be changed after creation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Luxury Apartments"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Icon & Appearance</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Choose Icon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {availableIcons.map((icon) => {
                  const IconComponent = icon.component
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => handleIconSelect(icon)}
                      className={`p-3 border-2 rounded-lg transition-colors ${
                        selectedIcon.name === icon.name
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      title={icon.label}
                    >
                      <IconComponent className="h-6 w-6 text-foreground mx-auto" />
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Theme Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {categoryColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      formData.color === color.value
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    title={color.label}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.class} mx-auto`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Settings</h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-border"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                Category is active and visible to users
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}