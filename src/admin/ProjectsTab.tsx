/**
 * ProjectsTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete project management tab with search, multi-filters, sorting,
 * inline status toggling, reordering, and full CRUD.
 */

import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  FileEdit,
  Building2,
  Layers,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'
import type { DBProject } from '../services/db'

interface ProjectsTabProps {
  onAddProject: () => void
  onEditProject: (project: DBProject) => void
  onPreviewProject: (project: DBProject) => void
  onDeleteProject: (id: string, title: string) => void
}

export function ProjectsTab({
  onAddProject,
  onEditProject,
  onPreviewProject,
  onDeleteProject,
}: ProjectsTabProps) {
  const { projects, categories, brands, saveProject, reorderProjects } = usePortfolioData()

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'order' | 'newest' | 'oldest' | 'title'>('order')

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          search.trim() === '' ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.brandName.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase()) ||
          p.categorySlug.toLowerCase().includes(search.toLowerCase())

        const matchesCat = selectedCat === 'all' || p.categorySlug === selectedCat
        const matchesBrand =
          selectedBrand === 'all' || p.brandName.toLowerCase() === selectedBrand.toLowerCase()
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus

        return matchesSearch && matchesCat && matchesBrand && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'order') return a.order - b.order
        if (sortBy === 'newest') return b.createdAt - a.createdAt
        if (sortBy === 'oldest') return a.createdAt - b.createdAt
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return 0
      })
  }, [projects, search, selectedCat, selectedBrand, selectedStatus, sortBy])

  // Toggle status inline
  const handleToggleStatus = async (p: DBProject) => {
    const nextStatus = p.status === 'published' ? 'draft' : 'published'
    await saveProject({ ...p, status: nextStatus })
  }

  // Move project up/down in order
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === filteredProjects.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newOrder = [...filteredProjects]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    await reorderProjects(newOrder.map((p) => p.id))
  }

  return (
    <div className="space-y-6">
      {/* ── Top Bar with Title & Add Button ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              Catalogue
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">
            Project Management ({filteredProjects.length})
          </h1>
        </div>

        <button
          onClick={onAddProject}
          className="flex items-center gap-2 px-5 py-3 bg-[#F57C00] hover:bg-[#ff8f1a] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-[#0C0C0C] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, brand, type..."
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#D7E2EA] placeholder-white/30 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-3 py-2.5 text-xs text-[#D7E2EA] outline-none transition-all cursor-pointer"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-3 py-2.5 text-xs text-[#D7E2EA] outline-none transition-all cursor-pointer"
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-3 py-2.5 text-xs text-[#D7E2EA] outline-none transition-all cursor-pointer"
            >
              <option value="order">Display Order</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mr-1">
            Status:
          </span>
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                selectedStatus === st
                  ? 'bg-[#F57C00] text-black shadow'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}

          {(search || selectedCat !== 'all' || selectedBrand !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setSelectedCat('all')
                setSelectedBrand('all')
                setSelectedStatus('all')
              }}
              className="text-[10px] font-semibold text-[#F57C00] hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Projects Table / Grid ──────────────────────────────────────── */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#F57C00] mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#D7E2EA]">
            No Projects Found
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            No projects match the selected search or filter criteria. Try adjusting your filters or create a new project.
          </p>
          <button
            onClick={onAddProject}
            className="px-5 py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project Now</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0C0C0C] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-20">Artwork</th>
                  <th className="py-3.5 px-4">Project Title & Scope</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Brand / Client</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredProjects.map((p, idx) => {
                  const cat = categories.find((c) => c.slug === p.categorySlug)
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order & Reorder Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-mono text-[11px] text-white/40">{p.order}</span>
                          {sortBy === 'order' && (
                            <div className="flex items-center gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleMove(idx, 'up')}
                                disabled={idx === 0}
                                title="Move Up"
                                className="p-0.5 text-white/40 hover:text-[#F57C00] disabled:opacity-20"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMove(idx, 'down')}
                                disabled={idx === filteredProjects.length - 1}
                                title="Move Down"
                                className="p-0.5 text-white/40 hover:text-[#F57C00] disabled:opacity-20"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => onPreviewProject(p)}
                          className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer relative group/img flex items-center justify-center"
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </td>

                      {/* Title & Type */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#D7E2EA] group-hover:text-[#F57C00] transition-colors">
                          {p.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/60 font-medium">
                            {p.type || 'Design'}
                          </span>
                          {p.isFeatured && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F57C00]/10 text-[#F57C00] font-bold">
                              Cover
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-white/80 font-medium">
                          {cat?.name || p.categorySlug}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="py-3.5 px-4">
                        <span className="text-white/80 font-semibold">{p.brandName}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          title="Click to toggle status"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 w-fit ${
                            p.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                              : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'published' ? 'bg-emerald-400' : 'bg-white/40'
                            }`}
                          />
                          {p.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewProject(p)}
                            title="Preview Artwork"
                            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProject(p)}
                            title="Edit Project"
                            className="p-2 rounded-xl text-white/40 hover:text-[#F57C00] hover:bg-[#F57C00]/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(p.id, p.title)}
                            title="Delete Project"
                            className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
