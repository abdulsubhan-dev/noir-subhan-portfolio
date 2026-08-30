/**
 * BrandsTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client brands & company management tab for NOIR_SUBHAN Admin Panel.
 */

import React from 'react'
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Globe,
  ChevronUp,
  ChevronDown,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'
import type { DBBrand } from '../services/db'

interface BrandsTabProps {
  onAddBrand: () => void
  onEditBrand: (brand: DBBrand) => void
  onDeleteBrand: (id: string, name: string, count: number) => void
}

export function BrandsTab({
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
}: BrandsTabProps) {
  const { brands, projects, saveBrand, reorderBrands } = usePortfolioData()

  const handleToggleVisible = async (brand: DBBrand) => {
    await saveBrand({ ...brand, visible: !brand.visible })
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === brands.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const newOrder = [...brands]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    await reorderBrands(newOrder.map((b) => b.id))
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              Partnerships
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">
            Client Brands ({brands.length})
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Companies and brands showcased in the "Brands I've Worked With" section.
          </p>
        </div>

        <button
          onClick={onAddBrand}
          className="flex items-center gap-2 px-5 py-3 bg-[#F57C00] hover:bg-[#ff8f1a] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-[#F57C00]/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Brands Table */}
      <div className="rounded-2xl bg-[#0C0C0C] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                <th className="py-3.5 px-4 w-12 text-center">Order</th>
                <th className="py-3.5 px-4">Brand / Client Name</th>
                <th className="py-3.5 px-4">Service Scope / Role</th>
                <th className="py-3.5 px-4">Associated Projects</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {brands.map((b, idx) => {
                const linkedProjects = projects.filter(
                  (p) => p.brandName.toLowerCase() === b.name.toLowerCase()
                )

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Order Controls */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-[11px] text-white/40 w-4">
                          {b.order}
                        </span>
                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-white/40 hover:text-[#F57C00] disabled:opacity-20"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === brands.length - 1}
                            className="p-0.5 text-white/40 hover:text-[#F57C00] disabled:opacity-20"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Brand Name & Website */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold uppercase text-[#D7E2EA] group-hover:text-[#F57C00] transition-colors text-sm">
                        {b.name}
                      </div>
                      {b.website && (
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-white/40 hover:text-[#F57C00] flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="w-3 h-3" />
                          <span className="truncate max-w-xs">{b.website}</span>
                        </a>
                      )}
                    </td>

                    {/* Service Role */}
                    <td className="py-3.5 px-4">
                      <span className="text-white/70 font-medium">{b.role}</span>
                    </td>

                    {/* Projects Count */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono font-bold text-white/80">
                        {linkedProjects.length} designs
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleVisible(b)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                          b.visible
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                            : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/20'
                        }`}
                      >
                        {b.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditBrand(b)}
                          title="Edit Brand"
                          className="p-2 rounded-xl text-white/40 hover:text-[#F57C00] hover:bg-[#F57C00]/10 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBrand(b.id, b.name, linkedProjects.length)}
                          title="Delete Brand"
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
    </div>
  )
}
