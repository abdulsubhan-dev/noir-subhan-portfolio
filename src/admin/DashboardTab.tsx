/**
 * DashboardTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Overview dashboard for NOIR_SUBHAN Admin Panel.
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban,
  Layers,
  Building2,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'
import type { DBProject } from '../services/db'

interface DashboardTabProps {
  onAddProject: () => void
  onAddCategory: () => void
  onAddBrand: () => void
  onEditProject: (project: DBProject) => void
  onPreviewProject: (project: DBProject) => void
  onDeleteProject: (id: string, title: string) => void
  onNavigateTab: (tab: string) => void
}

export function DashboardTab({
  onAddProject,
  onAddCategory,
  onAddBrand,
  onEditProject,
  onPreviewProject,
  onDeleteProject,
  onNavigateTab,
}: DashboardTabProps) {
  const { projects, categories, brands } = usePortfolioData()

  const publishedCount = projects.filter((p) => p.status === 'published').length
  const draftCount = projects.filter((p) => p.status === 'draft').length

  // Sort by newest
  const recentProjects = [...projects]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6)

  // Category counts
  const categoryStats = categories.map((cat) => {
    const count = projects.filter((p) => p.categorySlug === cat.slug).length
    return {
      ...cat,
      count,
      percentage: projects.length > 0 ? Math.round((count / projects.length) * 100) : 0,
    }
  })

  return (
    <div className="space-y-8">
      {/* ── Top Welcome & Quick Actions Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0C0C0C] border border-white/10 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F57C00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              Admin Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#D7E2EA]">
            Welcome Back, Subhan
          </h1>
          <p className="text-xs text-white/50 mt-1 max-w-md">
            Manage your design catalog, client partnerships, and portfolio presentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>

          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#D7E2EA] border border-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            <Layers className="w-4 h-4 text-[#F57C00]" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* ── Stat Cards Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-5 rounded-2xl bg-[#0C0C0C] border border-white/10 hover:border-[#F57C00]/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-white/5 text-[#F57C00] group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#D7E2EA]">{projects.length}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {publishedCount} Live
            </span>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            {draftCount > 0 ? `${draftCount} in drafts` : 'All projects published'}
          </p>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="p-5 rounded-2xl bg-[#0C0C0C] border border-white/10 hover:border-[#F57C00]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Design Categories
            </span>
            <div className="p-2 rounded-xl bg-white/5 text-[#F57C00] group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#D7E2EA]">{categories.length}</div>
          <p className="text-[10px] text-white/40 mt-1">
            Active category cards on public site
          </p>
        </div>

        {/* Brands */}
        <div
          onClick={() => onNavigateTab('brands')}
          className="p-5 rounded-2xl bg-[#0C0C0C] border border-white/10 hover:border-[#F57C00]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Client Brands
            </span>
            <div className="p-2 rounded-xl bg-white/5 text-[#F57C00] group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#D7E2EA]">{brands.length}</div>
          <p className="text-[10px] text-white/40 mt-1">
            Partners in "Brands I've Worked With"
          </p>
        </div>

        {/* Live Status */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl bg-[#0C0C0C] border border-white/10 hover:border-[#F57C00]/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Public Portfolio
            </span>
            <div className="p-2 rounded-xl bg-[#F57C00]/10 text-[#F57C00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#D7E2EA]">
              View Live Website
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">
              Open public portfolio in new tab
            </p>
          </div>
        </a>
      </div>

      {/* ── Category Breakdown & Recent Projects Row ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Distribution */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
              Projects by Category
            </h3>
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-[11px] font-semibold text-[#F57C00] hover:underline uppercase"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {categoryStats.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80">{c.name}</span>
                  <span className="text-white/40 font-mono text-[11px]">{c.count} items</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F57C00] to-[#ff9f1a] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(c.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Updated Projects */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F57C00]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                Recently Added / Updated
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-[11px] font-semibold text-[#F57C00] hover:underline uppercase"
            >
              View All ({projects.length})
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-xs">
              No projects added yet. Click "+ Add Project" to get started.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProjects.map((p) => {
                const cat = categories.find((c) => c.slug === p.categorySlug)
                return (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between gap-4 group hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#D7E2EA] truncate group-hover:text-[#F57C00] transition-colors">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40">
                          <span className="font-semibold text-white/60">{p.brandName}</span>
                          <span>•</span>
                          <span>{cat?.name || p.categorySlug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block ${
                          p.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {p.status}
                      </span>

                      <button
                        onClick={() => onPreviewProject(p)}
                        title="Preview Artwork"
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditProject(p)}
                        title="Edit Project"
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#F57C00] hover:bg-[#F57C00]/10 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(p.id, p.title)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
