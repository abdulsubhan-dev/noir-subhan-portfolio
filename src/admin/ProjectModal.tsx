/**
 * ProjectModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal for creating and updating portfolio projects.
 * Supports drag-and-drop image upload and client-side image compression.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Sparkles,
  Layers,
  Building2,
  Tag,
  FileText,
  Eye,
  Hash,
} from 'lucide-react'
import type { DBBrand, DBCategory, DBProject } from '../services/db'
import { usePortfolioData } from '../context/PortfolioContext'

interface ProjectModalProps {
  isOpen: boolean
  projectToEdit?: DBProject | null
  categories: DBCategory[]
  brands: DBBrand[]
  onClose: () => void
  onSuccess: (msg: string) => void
}

const COMMON_TYPES = [
  'Social Media Design',
  'Product Display',
  'Product Advertising',
  'Digital Banner',
  'Print Banner',
  'Brand Identity',
  'Instagram Carousel',
  'Motion Graphic',
  'Web Design',
  'Print Design',
  'Logo Design',
]

export function ProjectModal({
  isOpen,
  projectToEdit,
  categories,
  brands,
  onClose,
  onSuccess,
}: ProjectModalProps) {
  const { saveProject, optimizeImage } = usePortfolioData()

  const [title, setTitle] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [brandName, setBrandName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [order, setOrder] = useState<number>(1)
  
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessingImg, setIsProcessingImg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title)
      setCategorySlug(projectToEdit.categorySlug)
      setBrandName(projectToEdit.brandName)
      setType(projectToEdit.type || '')
      setDescription(projectToEdit.description || '')
      setImage(projectToEdit.image)
      setIsFeatured(projectToEdit.isFeatured || false)
      setStatus(projectToEdit.status)
      setOrder(projectToEdit.order)
    } else {
      setTitle('')
      setCategorySlug(categories[0]?.slug || '')
      setBrandName(brands[0]?.name || '')
      setType('Social Media Design')
      setDescription('')
      setImage('')
      setIsFeatured(false)
      setStatus('published')
      setOrder(1)
    }
    setErrors({})
  }, [projectToEdit, categories, brands, isOpen])

  if (!isOpen) return null

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file (PNG, JPG, WEBP).' }))
      return
    }

    setIsProcessingImg(true)
    setErrors((prev) => ({ ...prev, image: '' }))

    try {
      const dataUrl = await optimizeImage(file, 2000, 2000, 0.9)
      setImage(dataUrl)
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: 'Failed to process image. Please try another file.' }))
    } finally {
      setIsProcessingImg(false)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Project title is required'
    if (!categorySlug) errs.categorySlug = 'Please select a category'
    if (!brandName) errs.brandName = 'Please select or enter a brand'
    if (!image) errs.image = 'Project artwork/image is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await saveProject({
        id: projectToEdit?.id,
        title: title.trim(),
        categorySlug,
        brandName: brandName.trim(),
        type: type.trim() || 'Design',
        description: description.trim(),
        image,
        isFeatured,
        status,
        order: Number(order) || 1,
      })

      onSuccess(projectToEdit ? 'Project updated successfully' : 'New project created successfully')
      onClose()
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: 'Failed to save project. Please retry.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-2xl bg-[#0C0C0C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        style={{
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 40px rgba(245,124,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
                {projectToEdit ? 'Edit Mode' : 'New Entry'}
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#D7E2EA]">
              {projectToEdit ? 'Update Project' : 'Add New Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
          {errors.form && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          {/* Image Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center justify-between">
              <span>Project Design / Image <span className="text-[#F57C00]">*</span></span>
              {image && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-[#F57C00] hover:underline font-semibold"
                >
                  Change Image
                </button>
              )}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
              className="hidden"
            />

            {image ? (
              <div className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/50 aspect-video max-h-60 flex items-center justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#F57C00] text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#ff8f1a] transition-all"
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleFile(file)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-[#F57C00] bg-[#F57C00]/5'
                    : errors.image
                    ? 'border-rose-500/50 bg-rose-500/5'
                    : 'border-white/10 hover:border-white/25 bg-[#121212]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#F57C00]">
                  {isProcessingImg ? (
                    <div className="w-5 h-5 border-2 border-[#F57C00] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                    {isProcessingImg ? 'Optimizing image...' : 'Click or Drag & Drop Design Here'}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1">
                    Supports PNG, JPG, WEBP (Retains high resolution)
                  </p>
                </div>
              </div>
            )}
            {errors.image && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.image}</p>
            )}
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
              Project Title <span className="text-[#F57C00]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Testron Product Campaign"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Category & Brand Selectors in 2 Cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#F57C00]" />
                <span>Category <span className="text-[#F57C00]">*</span></span>
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] outline-none transition-all cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-[#121212] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categorySlug && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.categorySlug}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#F57C00]" />
                <span>Brand / Client <span className="text-[#F57C00]">*</span></span>
              </label>
              <input
                type="text"
                list="brands-list"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Trinutra"
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
              />
              <datalist id="brands-list">
                {brands.map((b) => (
                  <option key={b.id} value={b.name} />
                ))}
              </datalist>
              {errors.brandName && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.brandName}</p>
              )}
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Project Type / Badge</span>
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. Social Media Design"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
            />
            {/* Quick badges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_TYPES.slice(0, 6).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                    type === t
                      ? 'bg-[#F57C00]/15 border-[#F57C00]/40 text-[#F57C00]'
                      : 'bg-white/[0.03] border-white/5 text-white/50 hover:text-white/80 hover:border-white/15'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Optional Description / Context</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the creative campaign, concepts, or objectives..."
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl p-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Status, Featured & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Visibility Status
              </label>
              <div className="flex rounded-xl bg-[#141414] border border-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    status === 'published'
                      ? 'bg-[#F57C00] text-black shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    status === 'draft'
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-[#F57C00]" />
                <span>Display Order</span>
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#D7E2EA] outline-none transition-all"
              />
            </div>

            {/* Set as Cover */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#141414] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-[#F57C00] focus:ring-[#F57C00] bg-black accent-[#F57C00]"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 select-none">
                  Set as Category Cover
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black font-extrabold text-xs uppercase tracking-[0.14em] rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{projectToEdit ? 'Save Changes' : 'Publish Project'}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
