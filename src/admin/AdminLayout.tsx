/**
 * AdminLayout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsive Admin Shell with sidebar, mobile drawer, header, and active tabs.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Building2,
  Settings,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react'

interface AdminLayoutProps {
  activeTab: string
  onSelectTab: (tab: string) => void
  onLogout: () => void
  onBackToSite: () => void
  children: React.ReactNode
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'brands', label: 'Brands', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function AdminLayout({
  activeTab,
  onSelectTab,
  onLogout,
  onBackToSite,
  children,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#D7E2EA] flex font-['Kanit',sans-serif]">
      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0A] border-r border-white/10 flex-col justify-between p-6 flex-shrink-0 relative z-20">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F57C00] font-black text-sm shadow-inner">
              NS
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#BBCCD7] to-[#646973]">
                NOIR_SUBHAN
              </h2>
              <span className="text-[10px] font-bold text-[#F57C00] uppercase tracking-[0.2em] block -mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? 'bg-[#F57C00] text-black shadow-lg shadow-[#F57C00]/20 font-extrabold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#F57C00]'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/5 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Live Portfolio</span>
            <ArrowUpRight className="w-4 h-4 text-[#F57C00]" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[99990] lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-72 max-w-[80vw] bg-[#0A0A0A] border-r border-white/10 p-6 flex flex-col justify-between z-10 shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F57C00] font-black text-sm">
                      NS
                    </div>
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-white">
                        NOIR_SUBHAN
                      </h2>
                      <span className="text-[9px] font-bold text-[#F57C00] uppercase tracking-widest block">
                        Admin CMS
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-lg text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-1.5">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                          isActive
                            ? 'bg-[#F57C00] text-black font-extrabold shadow-lg shadow-[#F57C00]/20'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#F57C00]'}`} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-2">
                <button
                  onClick={onBackToSite}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5"
                >
                  <span>Live Portfolio</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F57C00]" />
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#080808]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-[#D7E2EA] hidden sm:inline-block">
              NOIR_SUBHAN CMS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-[#D7E2EA] transition-all"
            >
              <span>Public Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#F57C00]" />
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-[#F57C00] font-bold text-xs">
                S
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-tight">Subhan</div>
                <div className="text-[9px] text-[#F57C00] font-mono leading-tight">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
