/**
 * BrandModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal for creating and updating client brands and company partnerships.
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Building2, Globe, FileText, Hash } from 'lucide-react'
import type { DBBrand } from '../services/db'
import { usePortfolioData } from '../context/PortfolioContext'

interface BrandModalProps {
  isOpen: boolean
  brandToEdit?: DBBrand | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function BrandModal({
  isOpen,
  brandToEdit,
  onClose,
  onSuccess,
}: BrandModalProps) {
  const { saveBrand } = usePortfolioData()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState<number>(1)
  const [visible, setVisible] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (brandToEdit) {
      setName(brandToEdit.name)
      setRole(brandToEdit.role)
      setWebsite(brandToEdit.website || '')
      setDescription(brandToEdit.description || '')
      setOrder(brandToEdit.order)
      setVisible(brandToEdit.visible)
    } else {
      setName('')
      setRole('')
      setWebsite('')
      setDescription('')
      setOrder(1)
      setVisible(true)
    }
    setErrors({})
  }, [brandToEdit, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Brand / Company name is required'
    if (!role.trim()) errs.role = 'Role / Service scope is required (e.g. Social Media & Branding)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await saveBrand({
        id: brandToEdit?.id,
        name: name.trim(),
        role: role.trim(),
        website: website.trim(),
        description: description.trim(),
        order: Number(order) || 1,
        visible,
      })

      onSuccess(brandToEdit ? 'Brand details updated' : 'Brand added successfully')
      onClose()
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: 'Failed to save brand. Please retry.' }))
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
        className="relative w-full max-w-lg bg-[#0C0C0C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        style={{
          boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 40px rgba(245,124,0,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
                {brandToEdit ? 'Edit Brand' : 'New Partnership'}
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#D7E2EA]">
              {brandToEdit ? 'Update Brand' : 'Add Brand / Client'}
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
        <form id="brand-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 custom-scrollbar">
          {errors.form && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          {/* Brand Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Brand / Client Name <span className="text-[#F57C00]">*</span></span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TRINUTRA"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all font-semibold"
            />
            {errors.name && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Role / Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
              Service Role / Scope <span className="text-[#F57C00]">*</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Product Campaigns & Advertising"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
            />
            {errors.role && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.role}</p>
            )}
          </div>

          {/* Optional Website */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Optional Website Link</span>
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#F57C00]" />
              <span>Optional Notes / Description</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Internal notes about the collaboration or brand context..."
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl p-3 text-xs sm:text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all resize-none"
            />
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
                  Show in Brands Section
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
            form="brand-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black font-extrabold text-xs uppercase tracking-[0.14em] rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{brandToEdit ? 'Save Changes' : 'Add Brand'}</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
