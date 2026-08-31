/**
 * AdminLogin.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dark luxury login screen for NOIR_SUBHAN Admin Panel.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import brandLogo from '../assets/logo.png'

interface AdminLoginProps {
  onLogin: (passcode: string) => Promise<{ success: boolean; message?: string }>
  onBackToSite: () => void
}

export function AdminLogin({ onLogin, onBackToSite }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode.trim()) {
      setError('Please enter the admin passcode.')
      return
    }

    setIsLoading(true)
    setError('')

    const res = await onLogin(passcode.trim())
    if (!res.success) {
      setError(res.message || 'Incorrect passcode.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#D7E2EA] flex flex-col justify-center items-center p-4 relative overflow-hidden font-['Kanit',sans-serif]">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F57C00]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.015]">
        <span className="text-[30vw] font-black text-white tracking-tighter">NOIR</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-md bg-[#0C0C0C]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl z-10"
        style={{
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(245,124,0,0.06)',
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img src={brandLogo} alt="Noir Subhan Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-[0.25em] text-[#F57C00] uppercase">
              Management Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#BBCCD7] to-[#646973]">
            NOIR_SUBHAN
          </h1>
          <p className="text-xs text-white/50 mt-1 font-light tracking-wide">
            Enter your admin credentials to manage portfolio content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full bg-[#141414] border border-white/10 focus:border-[#F57C00]/60 focus:ring-2 focus:ring-[#F57C00]/20 rounded-xl px-4 py-3.5 text-sm text-[#D7E2EA] placeholder-white/20 outline-none transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1.5"
              >
                <span>•</span> {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-[#F57C00] hover:bg-[#ff8f1a] text-black font-extrabold text-xs uppercase tracking-[0.18em] py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#F57C00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            onClick={onBackToSite}
            type="button"
            className="text-xs font-semibold text-white/40 hover:text-[#D7E2EA] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <span>←</span> Back to Public Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  )
}
