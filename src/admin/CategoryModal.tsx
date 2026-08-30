/**
 * CategoryModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal for creating and updating portfolio design categories.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud, Layers, Hash, FileText, Link, Eye } from 'lucide-react'
import type { DBCategory } from '../services/db'
import { usePortfolioData } from '../context/PortfolioContext'

interface CategoryModalProps {
  isOpen: boolean
  categoryToEdit?: DBCategory | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function CategoryModal({
  isOpen,
  categoryToEdit,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const { saveCategory, optimizeImage } = usePortfolioData()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [order, setOrder] = useState<number>(1)
  const [visible, setVisible] = useState(true)

  const [isCustomSlug, setIsCustomSlug] = useState(false)
  const [isProcessingImg, setIsProcessingImg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name)
      setSlug(categoryToEdit.slug)
      setDescription(categoryToEdit.description)
      setCoverImage(categoryToEdit.coverImage)
      setOrder(categoryToEdit.order)
      setVisible(categoryToEdit.visible)
      setIsCustomSlug(true)
    } else {
      setName('')
      setSlug('')
      setDescription('')
      setCoverImage('')
      setOrder(1)
      setVisible(true)
      setIsCustomSlug(false)
    }
    setErrors({})
  }, [categoryToEdit, isOpen])

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val)
    if (!isCustomSlug && !categoryToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  if (!isOpen) return null

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, coverImage: 'Please select a valid image (PNG, JPG, WEBP).' }))
      return
    }

    setIsProcessingImg(true)
    setErrors((prev) => ({ ...prev, coverImage: '' }))

    try {
      const dataUrl = await optimizeImage(file, 1600, 1600, 0.88)
      setCoverImage(dataUrl)
    } catch (err) {
      setErrors((prev) => ({ ...prev, coverImage: 'Failed to process image.' }))
    } finally {
      setIsProcessingImg(false)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Category name is required'
    if (!slug.trim()) errs.slug = 'Category slug is required'
    if (!description.trim()) errs.description = 'Description is required'
    if (!coverImage) errs.coverImage = 'Representative cover image is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await saveCategory({
        id: categoryToEdit?.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        coverImage,
        order: Number(order) || 1,
        visible,
      })

      onSuccess(categoryToEdit ? 'Category updated' : 'Category created successfully')
      onClose()
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: 'Failed to save category. Please retry.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-xl bg-[#0C0C0C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        style={{
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 40px rgba(245,124,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
                {categoryToEdit ? 'Edit Category' : 'New Category'}
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#D7E2EA]">
              {categoryToEdit ? 'Update Category' : 'Create Category Card'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="category-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 custom-scrollbar">
          {errors.form && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center justify-between">
              <span>Cover Card Preview Image <span className="text-[#F57C00]">*</span></span>
              {coverImage && (
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

            {coverImage ? (
              <div className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/50 aspect-[4/3] max-h-48 flex items-center justify-center">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#F57C00] text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#ff8f1a] transition-all"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  errors.coverImage
                    ? 'border-rose-500/50 bg-rose-500/5'
                    : 'border-white/10 hover:border-white/25 bg-[#121212]'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#F57C00]">
                  {isProcessingImg ? (
                    <div className="w-4 h-4 border-2 border-[#F57C00] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                  {isProcessingImg ? 'Optimizing...' : 'Upload Category Cover Image'}
                </p>
              </div>
            )}
            {errors.coverImage && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.coverImage}</p>
            )}
          </div>

          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Category Name <span className="text-[#F57C00]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Social Media"
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
              />
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1">
                <Link className="w-3.5 h-3.5 text-[#F57C00]" />
                <span>URL Slug <span className="text-[#F57C00]">*</span></span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                  setIsCustomSlug(true)
                }}
                placeholder="e.g. social-media"
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all font-mono"
              />
              {errors.slug && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Category Description <span className="text-[#F57C00]">*</span></span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Social campaigns, promotional creatives and visual communication crafted for different brands."
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl p-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Order & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
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

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#141414] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-[#F57C00] focus:ring-[#F57C00] bg-black accent-[#F57C00]"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 select-none">
                  Visible on Public Site
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            form="category-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black font-extrabold text-xs uppercase tracking-[0.14em] rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{categoryToEdit ? 'Save Changes' : 'Create Category'}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
