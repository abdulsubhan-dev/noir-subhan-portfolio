/**
 * ProjectsSection.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium Projects section for NOIR_SUBHAN portfolio.
 * Dynamically connected to PortfolioContext / IndexedDB CMS data.
 * Hierarchy: Section → Brands → Category Grid → Category Detail → Lightbox
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioData } from '../context/PortfolioContext'
import type { DBBrand, DBCategory, DBProject } from '../services/db'

// ── Design tokens (mirror existing site) ─────────────────────────────────────
const T = {
  bg:          '#050505',
  bgCard:      '#0C0C0C',
  silver:      '#D7E2EA',
  silverMuted: 'rgba(215,226,234,0.45)',
  silverDim:   'rgba(215,226,234,0.25)',
  orange:      '#F57C00',
  orangeGlow:  'rgba(245,124,0,0.18)',
  border:      'rgba(255,255,255,0.07)',
  borderHov:   'rgba(255,255,255,0.16)',
}

// ── Shared fade preset for motion.div ────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, amount: 0 as const, margin: '40px' },
  transition: { delay, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
})

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const { categories, brands, projects, isLoading } = usePortfolioData()

  const [view, setView] = useState<'grid' | 'detail'>('grid')
  const [activeCatSlug, setActiveCatSlug] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ catSlug: string; idx: number } | null>(null)
  const sectionRef = useRef<HTMLDivElement | null>(null)

  // Visible items filtered and sorted by display order
  const visibleBrands = useMemo(() => {
    return brands.filter((b) => b.visible).sort((a, b) => a.order - b.order)
  }, [brands])

  const visibleCategories = useMemo(() => {
    return categories.filter((c) => c.visible).sort((a, b) => a.order - b.order)
  }, [categories])

  const activeCategory = useMemo(() => {
    if (!activeCatSlug) return null
    return categories.find((c) => c.slug === activeCatSlug) || null
  }, [categories, activeCatSlug])

  const activeCategoryProjects = useMemo(() => {
    if (!activeCatSlug) return []
    return projects
      .filter((p) => p.categorySlug === activeCatSlug && p.status === 'published')
      .sort((a, b) => a.order - b.order)
  }, [projects, activeCatSlug])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  // ESC closes lightbox
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const openCategory = useCallback((cat: DBCategory) => {
    setActiveCatSlug(cat.slug)
    setView('detail')
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const closeCategory = useCallback(() => {
    setView('grid')
    setTimeout(() => setActiveCatSlug(null), 350)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10"
      style={{ background: T.bg, minHeight: '60vh' }}
    >
      {/* ── View switcher ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <CategoryGridView
              categories={visibleCategories}
              brands={visibleBrands}
              projects={projects}
              onOpen={openCategory}
            />
          </motion.div>
        ) : (
          <motion.div
            key={activeCatSlug || 'detail'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeCategory && (
              <CategoryDetailView
                category={activeCategory}
                projects={activeCategoryProjects}
                onBack={closeCategory}
                onImageClick={(idx) => setLightbox({ catSlug: activeCategory.slug, idx })}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && activeCategory && (
          <LightboxOverlay
            categoryName={activeCategory.name}
            projects={activeCategoryProjects}
            index={lightbox.idx}
            onClose={() => setLightbox(null)}
            onNavigate={(idx) => setLightbox({ catSlug: activeCategory.slug, idx })}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY GRID VIEW  (main landing of the section)
// ─────────────────────────────────────────────────────────────────────────────
function CategoryGridView({
  categories,
  brands,
  projects,
  onOpen,
}: {
  categories: DBCategory[]
  brands: DBBrand[]
  projects: DBProject[]
  onOpen: (cat: DBCategory) => void
}) {
  return (
    <div className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-24 md:py-32">
      {/* ── PROJECTS heading ──────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 140px)', marginBottom: '3.5rem' }}
        >
          Projects
        </h2>
      </motion.div>

      {/* ── Brands ────────────────────────────────────────────────────── */}
      <BrandsSection brands={brands} />

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.05)}
        style={{ height: 1, background: T.border, margin: '5rem 0 4.5rem' }}
      />

      {/* ── Categories heading ────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.08)}>
        <p
          style={{
            color: T.orange,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Browse by Category
        </p>
        <h3
          style={{
            color: T.silver,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
          }}
        >
          Design Categories
        </h3>
      </motion.div>

      {/* ── Category cards grid ───────────────────────────────────────── */}
      <div
        className="grid gap-4 mt-10"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))' }}
      >
        {categories.map((cat, i) => {
          const publishedCount = projects.filter(
            (p) => p.categorySlug === cat.slug && p.status === 'published'
          ).length

          return (
            <motion.div key={cat.id} {...fadeUp(0.06 + i * 0.055)}>
              <CategoryCard
                category={cat}
                projectCount={publishedCount}
                onClick={() => onOpen(cat)}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function BrandsSection({ brands }: { brands: DBBrand[] }) {
  if (brands.length === 0) return null

  return (
    <div>
      <motion.div {...fadeUp(0.04)}>
        <p
          style={{
            color: T.orange,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Clientele
        </p>
        <h3
          style={{
            color: T.silver,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '2.5rem',
            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
          }}
        >
          Brands I've Worked With
        </h3>
      </motion.div>

      <div style={{ borderTop: `1px solid ${T.border}` }}>
        {brands.map((brand, i) => (
          <motion.div key={brand.id} {...fadeUp(0.07 + i * 0.05)}>
            <BrandRow brand={brand} index={i} isLast={i === brands.length - 1} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BrandRow({ brand, index, isLast }: { brand: DBBrand; index: number; isLast: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(12px, 3vw, 32px)',
        padding: 'clamp(14px, 2vw, 22px) 0',
        borderBottom: !isLast ? `1px solid ${T.border}` : 'none',
        cursor: 'default',
        transition: 'background 0.2s',
      }}
    >
      {/* Index */}
      <span
        style={{
          color: T.silverDim,
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          flexShrink: 0,
          width: 28,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Orange accent line */}
      <span
        style={{
          width: hov ? 32 : 0,
          height: 2,
          background: T.orange,
          flexShrink: 0,
          borderRadius: 2,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      />

      {/* Brand name */}
      <span
        style={{
          flex: 1,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: hov ? T.silver : 'rgba(215,226,234,0.6)',
          fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
          transition: 'color 0.25s ease',
        }}
      >
        {brand.name}
      </span>

      {/* Role */}
      <span
        className="hidden sm:block"
        style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: hov ? T.orange : T.silverDim,
          flexShrink: 0,
          textAlign: 'right',
          transition: 'color 0.25s ease',
        }}
      >
        {brand.role}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────────────────────────────────────────
function CategoryCard({
  category,
  projectCount,
  onClick,
}: {
  category: DBCategory
  projectCount: number
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`Open ${category.name} category`}
      style={{
        display: 'block',
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${hov ? T.borderHov : T.border}`,
          background: T.bgCard,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: hov ? `0 0 32px rgba(0,0,0,0.5), 0 0 0 1px ${T.border}` : 'none',
        }}
      >
        {/* Cover image */}
        <img
          src={category.coverImage}
          alt={category.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hov ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.65s ease',
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hov
              ? 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.5) 45%, rgba(5,5,5,0.1) 100%)'
              : 'linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.25) 55%, rgba(5,5,5,0.0) 100%)',
            transition: 'background 0.35s ease',
          }}
        />

        {/* Orange bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${T.orange}, #FF9F1A)`,
            transformOrigin: 'left',
            transform: `scaleX(${hov ? 1 : 0})`,
            transition: 'transform 0.35s ease',
          }}
        />

        {/* Text content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(14px,2vw,22px)',
          }}
        >
          <div
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: hov ? T.orange : T.silverMuted,
              marginBottom: 6,
              transition: 'color 0.25s ease',
            }}
          >
            {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </div>

          <div
            style={{
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: T.silver,
              lineHeight: 1.1,
              fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)',
              marginBottom: 10,
            }}
          >
            {category.name}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: hov ? T.silver : T.silverDim,
              transition: 'color 0.25s ease',
            }}
          >
            View All
            <span style={{ color: T.orange, fontSize: '0.8rem' }}>→</span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────
function CategoryDetailView({
  category,
  projects,
  onBack,
  onImageClick,
}: {
  category: DBCategory
  projects: DBProject[]
  onBack: () => void
  onImageClick: (idx: number) => void
}) {
  return (
    <div className="px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-24">
      {/* ── Back button ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <BackButton onClick={onBack} />
      </motion.div>

      {/* ── Category header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ marginTop: '2.5rem', marginBottom: '3.5rem' }}
      >
        <p
          style={{
            color: T.orange,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </p>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 100px)', marginBottom: 16 }}
        >
          {category.name}
        </h2>
        <p
          style={{
            color: T.silverMuted,
            fontSize: 'clamp(0.82rem, 1.4vw, 1rem)',
            fontWeight: 400,
            maxWidth: 560,
            lineHeight: 1.65,
          }}
        >
          {category.description}
        </p>
      </motion.div>

      {/* ── Masonry project grid ─────────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="py-20 text-center text-white/40 text-xs font-semibold uppercase tracking-widest border border-white/5 rounded-3xl p-8">
          No published projects available in this category yet.
        </div>
      ) : (
        <div
          style={{
            columns: 'auto 260px',
            columnGap: '1rem',
          }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ breakInside: 'avoid', marginBottom: '1rem', display: 'block' }}
            >
              <ProjectTile project={project} onClick={() => onImageClick(i)} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TILE (inside category detail)
// ─────────────────────────────────────────────────────────────────────────────
function ProjectTile({ project, onClick }: { project: DBProject; onClick: () => void }) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`View ${project.title}`}
      style={{
        display: 'block',
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
      }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${hov ? T.borderHov : T.border}`,
          background: T.bgCard,
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transform: hov ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.55s ease',
            }}
          />

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: hov ? 'rgba(5,5,5,0.45)' : 'rgba(5,5,5,0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.25s ease',
            }}
          >
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.silver,
                opacity: hov ? 1 : 0,
                transform: hov ? 'scale(1)' : 'scale(0.9)',
                transition: 'opacity 0.22s ease, transform 0.22s ease',
                padding: '8px 18px',
                border: `1px solid rgba(215,226,234,0.35)`,
                borderRadius: 9999,
                backdropFilter: 'blur(8px)',
              }}
            >
              View
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ padding: '12px 16px' }}>
          <div
            style={{
              fontSize: '0.6rem',
              color: T.silverDim,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            {project.brandName}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: T.silver,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {project.type || 'Design'}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Back to categories"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'none',
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 9999,
        padding: '8px 20px 8px 14px',
        cursor: 'pointer',
        color: hov ? T.silver : T.silverMuted,
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        transition: 'color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <span style={{ color: T.orange, fontSize: '0.9rem' }}>←</span>
      Back to Categories
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX OVERLAY (portal to body)
// ─────────────────────────────────────────────────────────────────────────────
function LightboxOverlay({
  categoryName,
  projects,
  index,
  onClose,
  onNavigate,
}: {
  categoryName: string
  projects: DBProject[]
  index: number
  onClose: () => void
  onNavigate: (idx: number) => void
}) {
  const project = projects[index]
  const hasPrev = index > 0
  const hasNext = index < projects.length - 1

  // Arrow key navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [index, hasPrev, hasNext, onNavigate])

  if (!project) return null

  const btn = (label: string, action: () => void, extra: React.CSSProperties = {}) => (
    <button
      onClick={action}
      aria-label={label}
      style={{
        position: 'absolute',
        zIndex: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: T.silver,
        borderRadius: 9999,
        width: 46,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        fontFamily: 'inherit',
        backdropFilter: 'blur(8px)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        ...extra,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'
      }}
    >
      {label === 'Close' ? '✕' : label === 'Previous' ? '←' : '→'}
    </button>
  )

  return createPortal(
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3,3,3,0.97)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px 80px',
      }}
    >
      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '88vw',
            maxHeight: '82vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 10,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Close */}
      {btn('Close', onClose, { top: 20, right: 20 })}

      {/* Prev */}
      {hasPrev &&
        btn(
          'Previous',
          () => {
            onNavigate(index - 1)
          },
          { left: 20, top: '50%', transform: 'translateY(-50%)' }
        )}

      {/* Next */}
      {hasNext &&
        btn(
          'Next',
          () => {
            onNavigate(index + 1)
          },
          { right: 20, top: '50%', transform: 'translateY(-50%)' }
        )}

      {/* Metadata */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '0.6rem',
            color: T.silverDim,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          {project.brandName}
        </div>
        <div
          style={{
            fontSize: '0.72rem',
            color: T.silver,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            fontWeight: 700,
          }}
        >
          {project.type || 'Design'}
        </div>
        {/* Counter */}
        <div
          style={{
            fontSize: '0.58rem',
            color: T.silverDim,
            letterSpacing: '0.14em',
            marginTop: 6,
          }}
        >
          {index + 1} / {projects.length}
        </div>
      </div>
    </motion.div>,
    document.body
  )
}
