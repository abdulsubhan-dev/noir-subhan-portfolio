/**
 * SettingsTab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin settings, passcode management, full JSON backup & restore.
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
} from 'lucide-react'
import { usePortfolioData } from '../context/PortfolioContext'

interface SettingsTabProps {
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
  onConfirmReset: () => void
}

export function SettingsTab({ onSuccess, onError, onConfirmReset }: SettingsTabProps) {
  const { changePassword, exportBackup, importBackup, projects, categories, brands } =
    usePortfolioData()

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [isChangingPass, setIsChangingPass] = useState(false)
  const [passError, setPassError] = useState('')

  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
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
          System Settings &amp; Data Backup
        </h1>
        <p className="text-xs text-white/50 mt-0.5">
          Manage your security passcode, export offline backups, and manage local storage.
        </p>
      </div>

      {/* Database Overview Card */}
      <div className="p-6 rounded-3xl bg-[#0C0C0C] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D7E2EA]">
              IndexedDB Persistent Storage
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Client-side persistent database active. Storing {projects.length} projects,{' '}
              {categories.length} categories, and {brands.length} brands.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
        </span>
      </div>

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
