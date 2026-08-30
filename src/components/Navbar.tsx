import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Design tokens — same system as the hero section ─────────────────────────
const C = {
  bg:           'rgba(10, 10, 10, 0.92)',
  border:       'rgba(255,255,255,0.07)',
  borderHover:  'rgba(255,255,255,0.18)',
  textPrimary:  '#D7E2EA',
  textMuted:    'rgba(187,204,215,0.50)',
  textActive:   '#BBCCD7',
  activeBg:     'rgba(215,226,234,0.07)',
  activeBorder: 'rgba(215,226,234,0.14)',
  ctaBorder:    'rgba(215,226,234,0.22)',
  ctaBorderHov: 'rgba(215,226,234,0.60)',
  ctaGlow:      '0 0 20px rgba(215,226,234,0.08)',
  orange:       '#BE4C00',          // matches ContactButton gradient end
  shadow:       '0 8px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
}

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]

function scrollTo(href: string) {
  if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ─── Arrow icon — orange only on the arrow to match ContactButton accent ──────
function Arrow() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
      style={{ display: 'inline-block', marginLeft: 5, flexShrink: 0, marginTop: -1 }}>
      <path d="M1 8L8 1M8 1H2.5M8 1V6.5"
        stroke={C.orange} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── CTA — black + silver, orange only on the arrow ──────────────────────────
function CTAButton({ onClick, fullWidth }: { onClick?: () => void; fullWidth?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href="https://wa.me/923200474990"
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        width: fullWidth ? '100%' : undefined,
        flexShrink: 0,
        background: hov ? 'rgba(215,226,234,0.05)' : 'transparent',
        border: `1px solid ${hov ? C.ctaBorderHov : C.ctaBorder}`,
        boxShadow: hov ? C.ctaGlow : 'none',
        borderRadius: 9999,
        padding: '8px 20px',
        color: C.textPrimary,
        fontFamily: 'inherit',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textDecoration: 'none',
      }}
    >
      Let&apos;s Talk <Arrow />
    </a>
  )
}

// ─── Hamburger ────────────────────────────────────────────────────────────────
function Hamburger({ open, toggle }: { open: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle menu"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 5, padding: 4, flexShrink: 0, marginLeft: 8,
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{
            rotate: open && i === 0 ? 45 : open && i === 2 ? -45 : 0,
            y:      open && i === 0 ?  6 : open && i === 2 ? -6  : 0,
            opacity: open && i === 1 ? 0 : 1,
            scaleX:  open && i === 1 ? 0 : 1,
          }}
          transition={{ duration: 0.22 }}
          style={{
            display: 'block',
            width: 20, height: 1.5,
            background: C.textPrimary,
            borderRadius: 2,
            transformOrigin: 'center',
          }}
        />
      ))}
    </button>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen,      setMenuOpen]      = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Active section detection
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const obs: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id) },
        { rootMargin: '-35% 0px -55% 0px' }
      )
      o.observe(el)
      obs.push(o)
    })
    return () => obs.forEach(o => o.disconnect())
  }, [])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [menuOpen])

  return (
    <>
      {/* ── Fixed pill ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', top: 22, left: 0, right: 0,
          zIndex: 100,
          display: 'flex', justifyContent: 'center',
          paddingInline: 16,
          pointerEvents: 'none',
        }}
      >
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '12px 24px',
            background: C.bg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${C.border}`,
            borderRadius: 9999,
            boxShadow: C.shadow,
          }}
        >
          {/* ── Brand ──────────────────────────────────────────────────── */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); scrollTo('#') }}
            style={{
              fontFamily: 'inherit',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: C.textPrimary,
              textDecoration: 'none',
              flexShrink: 0,
              marginRight: 'auto',
              /* Mirror the hero gradient text on the brand label */
              background: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NOIR_SUBHAN
          </a>

          {/* ── Desktop links ──────────────────────────────────────────── */}
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 2, margin: '0 auto' }}>
            {NAV_LINKS.map(link => {
              const active = activeSection === link.href.slice(1)
              return (
                <NavLink
                  key={link.label}
                  label={link.label}
                  active={active}
                  onClick={() => scrollTo(link.href)}
                />
              )
            })}
          </div>

          {/* ── CTA ────────────────────────────────────────────────────── */}
          <div className="hidden sm:block" style={{ marginLeft: 'auto' }}>
            <CTAButton onClick={() => scrollTo('#contact')} />
          </div>

          {/* ── Mobile hamburger ───────────────────────────────────────── */}
          <div className="sm:hidden" style={{ marginLeft: 'auto' }}>
            <Hamburger open={menuOpen} toggle={() => setMenuOpen(v => !v)} />
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            key="menu"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -10,  scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'fixed', top: 82, left: 16, right: 16,
              zIndex: 99,
              background: 'rgba(8,8,8,0.97)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '6px 0' }}>
              {NAV_LINKS.map((link, i) => {
                const active = activeSection === link.href.slice(1)
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href); setMenuOpen(false) }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px 24px',
                      fontFamily: 'inherit',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: active ? C.textPrimary : C.textMuted,
                      borderBottom: i < NAV_LINKS.length - 1
                        ? `1px solid rgba(255,255,255,0.05)` : 'none',
                      background: active ? C.activeBg : 'transparent',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: C.textPrimary,
                        flexShrink: 0,
                      }} />
                    )}
                  </motion.a>
                )
              })}
            </div>

            <div style={{
              margin: '0 16px 16px',
              paddingTop: 12,
              borderTop: `1px solid rgba(255,255,255,0.06)`,
            }}>
              <CTAButton onClick={() => { scrollTo('#contact'); setMenuOpen(false) }} fullWidth />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── NavLink — desktop ────────────────────────────────────────────────────────
function NavLink({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: active ? C.activeBg : hov ? 'rgba(215,226,234,0.04)' : 'transparent',
        border: `1px solid ${active ? C.activeBorder : 'transparent'}`,
        borderRadius: 9999,
        padding: '7px 16px',
        fontFamily: 'inherit',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: active || hov ? C.textActive : C.textMuted,
        cursor: 'pointer',
        transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      {label}
      {/* Ultra-thin silver underline on active — no pill, no color fill */}
      {active && (
        <motion.span
          layoutId="navUnderline"
          style={{
            position: 'absolute',
            bottom: 5,
            left: 16, right: 16,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #BBCCD7, transparent)',
            borderRadius: 1,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        />
      )}
    </button>
  )
}
