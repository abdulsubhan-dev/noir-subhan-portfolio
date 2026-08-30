/**
 * Toast.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Sleek, high-contrast feedback notifications for the NOIR_SUBHAN Admin Panel.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10"
            style={{
              background: 'rgba(12, 12, 12, 0.95)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(245,124,0,0.06)',
            }}
          >
            <div className="mt-0.5 flex-shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#F57C00]" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#D7E2EA]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D7E2EA] leading-tight">
                {t.title}
              </h4>
              {t.message && (
                <p className="text-xs text-white/60 mt-1 leading-relaxed break-words">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-white/40 hover:text-white transition-colors p-0.5 rounded-lg flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
