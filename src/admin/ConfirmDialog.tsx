/**
 * ConfirmDialog.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Confirmation modal to prevent accidental deletions or critical actions.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#0C0C0C] border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
          style={{
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(245,124,0,0.05)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl flex-shrink-0 ${
                variant === 'danger'
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-[#F57C00]/10 text-[#F57C00] border border-[#F57C00]/20'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-extrabold uppercase tracking-wider text-[#D7E2EA]">
                {title}
              </h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">{message}</p>
            </div>

            <button
              onClick={onCancel}
              className="text-white/40 hover:text-white transition-colors p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-all border border-transparent"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                variant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                  : 'bg-[#F57C00] hover:bg-[#ff8f1a] text-black shadow-[#F57C00]/20'
              }`}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
