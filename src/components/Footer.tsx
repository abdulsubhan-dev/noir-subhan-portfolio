/**
 * Footer.tsx — NOIR_SUBHAN Portfolio
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium closing section with bold, large-scale typography for Identity,
 * Navigation, and Connect sections.
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import brandLogo from '../assets/logo.png'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:          '#050505',
  silver:      '#D7E2EA',
  silverMuted: 'rgba(215,226,234,0.60)',
  silverDim:   'rgba(215,226,234,0.35)',
  orange:      '#F57C00',
  border:      'rgba(255,255,255,0.07)',
  borderBright:'rgba(255,255,255,0.14)',
}

// ── Config ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',     href: '#'        },
  { label: 'About',    href: '#about'   },
  { label: 'Services', href: '#services'},
  { label: 'Projects', href: '#projects'},
]

const SOCIAL_LINKS = [
  { label: 'WhatsApp',  href: 'https://wa.me/923200474990' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/abdul-subhan-71014840b' },
  { label: 'GitHub',    href: 'https://github.com/abdulsubhan-dev' },
  { label: 'Email',     href: 'mailto:abdulsubhan.design@gmail.com' },
  { label: 'Call Phone',href: 'tel:03200474990' },
]

// ── Smooth scroll util ────────────────────────────────────────────────────────
function scrollTo(href: string) {
  if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ── Shared fade-up for whileInView ────────────────────────────────────────────
const fadeUp = (delay = 0, y = 24) => ({
  initial:     { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0 as const, margin: '40px' },
  transition:  {
    delay, duration: 0.65,
    ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number],
  },
})

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer
      id="contact"
      aria-label="Site footer"
      style={{
        background: T.bg,
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${T.border}`,
      }}
    >
      {/* ── Decorative: oversized faint "NS" watermark ───────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -55%)',
          fontSize: 'clamp(260px, 48vw, 680px)',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          lineHeight: 0.8,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: 0.028,
          color: T.silver,
          fontFamily: 'Kanit, sans-serif',
          zIndex: 0,
        }}
      >
        NS
      </div>

      {/* ── Top orange ambient line ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '25%', right: '25%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(245,124,0,0.35), transparent)',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ══ CTA SECTION ════════════════════════════════════════════════ */}
        <div
          className="px-5 sm:px-8 md:px-12 lg:px-16"
          style={{ paddingTop: 'clamp(80px,10vw,140px)', paddingBottom: 'clamp(60px,7vw,100px)' }}
        >
          {/* Eyebrow */}
          <motion.p {...fadeUp(0, 16)} style={{
            color: T.orange, fontSize: '0.75rem', fontWeight: 800,
            letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 28,
          }}>
            Available for Projects &amp; Collaborations
          </motion.p>

          {/* Large CTA heading */}
          <div style={{ overflow: 'hidden', marginBottom: 'clamp(32px,5vw,56px)' }}>
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 150px)' }}
            >
              Let&apos;s Create<br />
              Something<br />
              Bold.
            </motion.h2>
          </div>

          {/* Subtitle + button row */}
          <motion.div {...fadeUp(0.12, 20)}
            className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10"
          >
            <p style={{
              color: T.silverMuted,
              fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
              fontWeight: 400, lineHeight: 1.7,
              maxWidth: 460,
            }}>
              Have a project in mind? Let&apos;s turn the idea into something
              visually unforgettable. Chat directly on WhatsApp or drop an email.
            </p>
            <LetsTalkButton />
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div {...fadeUp(0, 0)}
          style={{ height: 1, background: T.border, margin: '0 clamp(20px,5vw,64px)' }}
        />

        {/* ══ LINKS SECTION ══════════════════════════════════════════════ */}
        <div
          className="px-5 sm:px-8 md:px-12 lg:px-16"
          style={{
            paddingTop: 'clamp(56px,7vw,90px)',
            paddingBottom: 'clamp(56px,7vw,90px)',
          }}
        >
          <div
            className="grid gap-12 lg:gap-16"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            }}
          >
            {/* Brand identity & Direct Contacts */}
            <motion.div {...fadeUp(0.06, 16)}>
              <p style={{
                color: T.silverDim, fontSize: '0.78rem', fontWeight: 800,
                letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 20,
              }}>
                Identity &amp; Location
              </p>
              <div className="flex items-center gap-3 mb-3">
                <img src={brandLogo} alt="Noir Subhan Logo" style={{ height: 48, width: 'auto', borderRadius: 6, objectFit: 'contain' }} />
                <div style={{
                  fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.08em', fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  background: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.1,
                }}>
                  NOIR_SUBHAN
                </div>
              </div>
              <div style={{
                color: T.silverMuted, fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                fontWeight: 600, marginBottom: 18,
                letterSpacing: '0.04em',
              }}>
                Abdul Subhan — Graphic Designer
              </div>

              {/* Direct Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="w-4 h-4 text-[#F57C00] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    Multan, Punjab, Pakistan
                  </span>
                </div>
                <a
                  href="https://wa.me/923200474990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-[#F57C00] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F57C00] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium font-mono tracking-wide">
                    0320 0474990 (WhatsApp)
                  </span>
                </a>
                <a
                  href="mailto:abdulsubhan.design@gmail.com"
                  className="flex items-center gap-3 text-white/80 hover:text-[#F57C00] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#F57C00] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    abdulsubhan.design@gmail.com
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div {...fadeUp(0.1, 16)}>
              <p style={{
                color: T.silverDim, fontSize: '0.78rem', fontWeight: 800,
                letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 20,
              }}>
                Navigation
              </p>
              <nav aria-label="Footer navigation">
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <FooterNavLink label={link.label} href={link.href} />
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* Social / Profiles */}
            <motion.div {...fadeUp(0.14, 16)}>
              <p style={{
                color: T.silverDim, fontSize: '0.78rem', fontWeight: 800,
                letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 20,
              }}>
                Connect
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SOCIAL_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.16 + i * 0.05, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <SocialLink label={link.label} href={link.href} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: T.border, margin: '0 clamp(20px,5vw,64px)' }} />

        {/* ══ BOTTOM BAR ═════════════════════════════════════════════════ */}
        <div
          className="px-5 sm:px-8 md:px-12 lg:px-16"
          style={{
            paddingTop: 22, paddingBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px 24px',
          }}
        >
          <p style={{
            color: T.silverDim, fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            © 2026 NOIR_SUBHAN. All Rights Reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <p style={{
              color: T.silverDim, fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Designed &amp; Crafted by NOIR_SUBHAN
            </p>

            <BackToTopButton />
          </div>
        </div>

      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LET'S TALK BUTTON (WhatsApp)
// ─────────────────────────────────────────────────────────────────────────────
function LetsTalkButton() {
  const [hov, setHov] = useState(false)

  return (
    <a
      href="https://wa.me/923200474990"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Chat on WhatsApp"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        background: hov ? 'rgba(245,124,0,0.08)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(245,124,0,0.6)' : 'rgba(245,124,0,0.28)'}`,
        boxShadow: hov ? '0 0 28px rgba(245,124,0,0.16)' : 'none',
        borderRadius: 9999,
        padding: 'clamp(12px,1.6vw,16px) clamp(24px,3.5vw,40px)',
        color: hov ? '#FF9F1A' : T.silver,
        fontFamily: 'inherit',
        fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
        fontWeight: 800,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.25s ease',
        lineHeight: 1,
        textDecoration: 'none',
      }}
    >
      Let&apos;s Talk
      <motion.span
        animate={{ x: hov ? 4 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ color: T.orange, display: 'inline-block', fontSize: '1.15em' }}
      >
        →
      </motion.span>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER NAV LINK
// ─────────────────────────────────────────────────────────────────────────────
function FooterNavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      onClick={e => { e.preventDefault(); scrollTo(href) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: 'clamp(1rem, 1.6vw, 1.35rem)',
        color: hov ? T.silver : T.silverMuted,
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        lineHeight: 1.2,
      }}
    >
      <motion.span
        animate={{ scaleX: hov ? 1 : 0, x: hov ? 0 : -4 }}
        initial={{ scaleX: 0, x: -4 }}
        style={{
          display: 'inline-block',
          width: 18, height: 2,
          background: T.orange,
          borderRadius: 2,
          transformOrigin: 'left',
        }}
        transition={{ duration: 0.22 }}
      />
      {label}
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL LINK
// ─────────────────────────────────────────────────────────────────────────────
function SocialLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false)
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={`${label} — ${label}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: 'clamp(1rem, 1.6vw, 1.35rem)',
        color: hov ? T.silver : T.silverMuted,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        lineHeight: 1.2,
      }}
    >
      <motion.span
        animate={{ scaleX: hov ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        style={{
          display: 'inline-block',
          width: 18, height: 2,
          background: T.orange,
          borderRadius: 2,
          transformOrigin: 'left',
        }}
        transition={{ duration: 0.22 }}
      />
      {label}
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK TO TOP
// ─────────────────────────────────────────────────────────────────────────────
function BackToTopButton() {
  const [hov, setHov] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const h = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Scroll back to top"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'none',
        border: `1px solid ${hov ? T.borderBright : T.border}`,
        borderRadius: 9999,
        padding: '6px 16px 6px 12px',
        cursor: 'pointer',
        color: hov ? T.silver : T.silverMuted,
        fontFamily: 'inherit',
        fontSize: '0.68rem', fontWeight: 800,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        transition: 'all 0.22s ease',
        lineHeight: 1,
      }}
    >
      <motion.span
        animate={{ y: hov ? -2 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ color: T.orange, fontSize: '0.9rem', display: 'inline-block' }}
      >
        ↑
      </motion.span>
      Back to Top
    </button>
  )
}
