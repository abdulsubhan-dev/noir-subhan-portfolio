/**
 * ProjectPreviewModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * High-fidelity project viewer modal for the Admin panel.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Building2, Layers, Tag, Eye, Calendar } from 'lucide-react'
import type { DBProject } from '../services/db'

interface ProjectPreviewModalProps {
  project: DBProject | null
  categoryName?: string
  onClose: () => void
  onEdit?: (project: DBProject) => void
}

export function ProjectPreviewModal({
  project,
  categoryName,
  onClose,
  onEdit,
}: ProjectPreviewModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-3xl bg-[#0C0C0C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto max-h-[92vh] flex flex-col"
          style={{
            boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 40px rgba(245,124,0,0.06)',
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080808]">
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  project.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/10 text-white/60 border border-white/10'
                }`}
              >
                {project.status}
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D7E2EA] truncate max-w-md">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onEdit(project)
                  }}
                  className="px-3.5 py-1.5 bg-[#F57C00] text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#ff8f1a] transition-all"
                >
                  Edit Project
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Project Image */}
            <div className="rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2 min-h-[300px]">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Client / Brand
                  </div>
                  <div className="text-xs font-bold text-[#D7E2EA] truncate">
                    {project.brandName}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Category
                  </div>
                  <div className="text-xs font-bold text-[#D7E2EA] truncate">
                    {categoryName || project.categorySlug}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Type
                  </div>
                  <div className="text-xs font-bold text-[#D7E2EA] truncate">
                    {project.type || 'Design'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#F57C00] mb-1">
                  Creative Overview
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{project.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
