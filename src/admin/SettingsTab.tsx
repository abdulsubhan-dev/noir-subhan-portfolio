/**
 * SettingsTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin settings, passcode management, full JSON backup & restore, and
 * Supabase Multi-Device Cloud Sync configuration.
 */

import React, { useState, useRef } from 'react'
import {
  Lock,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Database,
  CheckCircle2,
  AlertTriangle,
  Key,
  HardDrive,
  Cloud,
  CloudCheck,
  Globe,
  Copy,
  Check,
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'

interface SettingsTabProps {
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  onConfirmReset: () => void
}

const SUPABASE_SQL_SCRIPT = `-- 1. Create Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  website TEXT,
  description TEXT,
  "order" INT DEFAULT 1,
  visible BOOLEAN DEFAULT true,
  "createdAt" BIGINT,
  "updatedAt" BIGINT
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  "coverImage" TEXT,
  "order" INT DEFAULT 1,
  visible BOOLEAN DEFAULT true,
  "createdAt" BIGINT,
  "updatedAt" BIGINT
);

-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  "categorySlug" TEXT NOT NULL,
  "brandName" TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  type TEXT,
  description TEXT,
  "isFeatured" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  "order" INT DEFAULT 1,
  "createdAt" BIGINT,
  "updatedAt" BIGINT
);

-- Enable Row Level Security & Public Access for Portfolio
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public All Brands" ON public.brands FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public All Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public All Projects" ON public.projects FOR ALL USING (true);
`

export function SettingsTab({ onSuccess, onError, onConfirmReset }: SettingsTabProps) {
  const { changePassword, exportBackup, importBackup, projects, categories, brands, isCloudConnected } =
    usePortfolioData()

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [isChangingPass, setIsChangingPass] = useState(false)
  const [passError, setPassError] = useState('')

  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Passcode change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError('')

    if (!oldPass || !newPass || !confirmPass) {
      setPassError('All passcode fields are required.')
      return
    }

    if (newPass !== confirmPass) {
      setPassError('New passcodes do not match.')
      return
    }

    if (newPass.length < 4) {
      setPassError('New passcode must be at least 4 characters.')
      return
    }

    setIsChangingPass(true)
    const res = await changePassword(oldPass, newPass)
    setIsChangingPass(false)

    if (res.success) {
      onSuccess('Admin passcode updated successfully!')
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
    } else {
      setPassError(res.message || 'Failed to update passcode.')
    }
  }

  // Export JSON Backup
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const json = await exportBackup()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      a.href = url
      a.download = `noir-subhan-portfolio-backup-${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      onSuccess('Portfolio database exported successfully!')
    } catch (err) {
      onError('Failed to export database backup.')
    } finally {
      setIsExporting(false)
    }
  }

  // Import JSON Backup
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      await importBackup(text)
      onSuccess('Portfolio backup restored successfully!')
    } catch (err: any) {
      onError(err.message || 'Failed to import backup file. Ensure it is a valid JSON backup.')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 3000)
    onSuccess('Supabase SQL setup script copied to clipboard!')
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
            Preferences &amp; Safety
          </span>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">
          System Settings &amp; Cloud Database
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Manage your security passcode, export offline backups, and configure Multi-Device Cloud Sync.
        </p>
      </div>

      {/* Cloud & Local Database Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Cloud Connection Status */}
        <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                  Multi-Device Cloud Sync
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {isCloudConnected
                    ? 'Supabase Cloud Database active'
                    : 'Local Mode (IndexedDB)'}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                isCloudConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isCloudConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cloud Active
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> Local Only
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed">
            {isCloudConnected
              ? 'Your portfolio is synced to Supabase Cloud! Any changes made in Admin are instantly live across all devices globally.'
              : 'Add your free Supabase URL & Key in .env to enable instant automatic sync across all mobiles and PCs.'}
          </p>
        </div>

        {/* Local IndexedDB Card */}
        <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 text-[#D7E2EA] flex items-center justify-center flex-shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA]">
                  Local Offline Cache
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5">
                  IndexedDB Storage
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed">
            Storing {projects.length} projects, {categories.length} categories, and {brands.length}{' '}
            brands in high-speed local browser cache.
          </p>
        </div>
      </div>

      {/* Cloud Setup Guide Card (if not connected) */}
      {!isCloudConnected && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C0C0C] border border-[#F57C00]/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              100% Free Cloud Setup Guide
            </span>
          </div>
          <h3 className="text-lg font-black uppercase text-[#D7E2EA]">
            How to Enable Instant Multi-Device Sync (3 Steps)
          </h3>

          <div className="space-y-3 text-xs text-white/70 leading-relaxed pt-2">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F57C00]/20 text-[#F57C00] font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <p>
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#F57C00] font-bold hover:underline">supabase.com</a>, create a free project, and go to <strong>Project Settings → API</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F57C00]/20 text-[#F57C00] font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <p>
                Copy your <strong>Project URL</strong> and <strong>anon public key</strong>, and paste them into the <code>.env</code> file in your project:
              </p>
            </div>

            <div className="bg-[#121212] p-3 rounded-xl font-mono text-[11px] text-[#D7E2EA] border border-white/10 space-y-1">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <span className="w-6 h-6 rounded-full bg-[#F57C00]/20 text-[#F57C00] font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <div className="space-y-2 flex-1">
                <p>
                  In Supabase dashboard, open <strong>SQL Editor</strong>, paste this setup script, and click <strong>Run</strong>:
                </p>
                <button
                  onClick={copySql}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#D7E2EA] font-bold text-xs rounded-xl flex items-center gap-2 transition-colors border border-white/10"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#F57C00]" />}
                  <span>{copiedSql ? 'SQL Script Copied!' : 'Copy Supabase SQL Setup Script'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security / Passcode */}
        <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="p-2 rounded-xl bg-white/5 text-[#F57C00]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D7E2EA]">
                Change Admin Passcode
              </h3>
              <p className="text-[11px] text-white/40">
                Update the password used to access /admin
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {passError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Current Passcode
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter current passcode..."
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-4 py-2.5 text-xs text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                New Passcode
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new passcode..."
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-4 py-2.5 text-xs text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Confirm New Passcode
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new passcode..."
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 rounded-xl px-4 py-2.5 text-xs text-[#D7E2EA] placeholder-white/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-2.5 bg-[#F57C00] hover:bg-[#ff8f1a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#F57C00]/10 disabled:opacity-50"
            >
              {isChangingPass ? 'Updating...' : 'Update Passcode'}
            </button>
          </form>
        </div>

        {/* Backup & Data Controls */}
        <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="p-2 rounded-xl bg-white/5 text-[#F57C00]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#D7E2EA]">
                  Backup &amp; Restore
                </h3>
                <p className="text-[11px] text-white/40">
                  Export or restore your complete portfolio dataset
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Export Button */}
              <div>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-[#D7E2EA] border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  <Download className="w-4 h-4 text-[#F57C00]" />
                  <span>{isExporting ? 'Generating JSON...' : 'Export Database Backup (JSON)'}</span>
                </button>
                <p className="text-[10px] text-white/40 mt-1 text-center">
                  Downloads all designs, categories, and settings as a standalone file.
                </p>
              </div>

              {/* Import Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-[#D7E2EA] border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  <Upload className="w-4 h-4 text-[#F57C00]" />
                  <span>{isImporting ? 'Restoring...' : 'Restore from JSON File'}</span>
                </button>
                <p className="text-[10px] text-white/40 mt-1 text-center">
                  Upload a previously exported JSON backup to restore your data.
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset to Defaults */}
          <div className="pt-4 border-t border-rose-500/10">
            <button
              type="button"
              onClick={onConfirmReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Initial Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
