/**
 * CategoriesTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Design category management tab with cover card preview, associated project
 * count verification, reordering, and full CRUD.
 */

import React from 'react'
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  FolderKanban,
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'
import type { DBCategory } from '../services/db'

interface CategoriesTabProps {
  onAddCategory: () => void
  onEditCategory: (category: DBCategory) => void
  onDeleteCategory: (id: string, name: string, count: number) => void
}

export function CategoriesTab({
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesTabProps) {
  const { categories, projects, saveCategory, reorderCategories } = usePortfolioData()

  // Toggle visibility inline
  const handleToggleVisible = async (cat: DBCategory) => {
    await saveCategory({ ...cat, visible: !cat.visible })
  }

  // Move up/down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === categories.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newOrder = [...categories]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    await reorderCategories(newOrder.map((c) => c.id))
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              Taxonomy
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">
            Design Categories ({categories.length})
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Categories automatically generate the visual cards on your public Projects section.
          </p>
        </div>

        <button
          onClick={onAddCategory}
          className="flex items-center gap-2 px-5 py-3 bg-[#F57C00] hover:bg-[#ff8f1a] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const linkedProjects = projects.filter((p) => p.categorySlug === cat.slug)

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border bg-[#0C0C0C] overflow-hidden flex flex-col justify-between transition-all group ${
                cat.visible ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-60'
              }`}
            >
              {/* Cover Card Preview */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white/70 border border-white/10">
                    Order #{cat.order}
                  </span>

                  <button
                    onClick={() => handleToggleVisible(cat)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md transition-colors ${
                      cat.visible
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/10 text-white/50 border-white/10'
                    }`}
                  >
                    {cat.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                {/* Bottom title on card */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#F57C00] uppercase block">
                    {linkedProjects.length} {linkedProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white truncate">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-white/40 mb-1">
                    /{cat.slug}
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Left/Up"
                      className="p-1 rounded-lg bg-white/5 text-white/40 hover:text-[#F57C00] hover:bg-white/10 disabled:opacity-20 transition-all"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === categories.length - 1}
                      title="Move Right/Down"
                      className="p-1 rounded-lg bg-white/5 text-white/40 hover:text-[#F57C00] hover:bg-white/10 disabled:opacity-20 transition-all"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCategory(cat)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-[#F57C00] hover:bg-[#F57C00]/10 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id, cat.name, linkedProjects.length)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
