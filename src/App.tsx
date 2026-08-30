/**
 * App.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root Application Router & Provider for NOIR_SUBHAN.
 * Renders the public portfolio or the protected /admin CMS portal.
 */

import React, { useState, useEffect } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import { AdminApp } from './admin/AdminApp'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MarqueeSection from './components/MarqueeSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import ProjectsSection from './components/ProjectsSection'
import Footer from './components/Footer'

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.startsWith('/admin') ||
      hash === '#admin' ||
      hash.startsWith('#admin')
    )
  })

  // Listen for browser back/forward and hash changes
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      setIsAdminRoute(
        path === '/admin' ||
          path === '/admin/' ||
          path.startsWith('/admin') ||
          hash === '#admin' ||
          hash.startsWith('#admin')
      )
    }

    window.addEventListener('popstate', checkRoute)
    window.addEventListener('hashchange', checkRoute)

    // Keyboard shortcut: Alt + A or Cmd/Ctrl + Shift + A to jump to Admin
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault()
        navigateToAdmin()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('popstate', checkRoute)
      window.removeEventListener('hashchange', checkRoute)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  const navigateToAdmin = () => {
    window.history.pushState(null, '', '/admin')
    setIsAdminRoute(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const navigateToPublicSite = () => {
    window.history.pushState(null, '', '/')
    setIsAdminRoute(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <PortfolioProvider>
      {isAdminRoute ? (
        <AdminApp onBackToSite={navigateToPublicSite} />
      ) : (
        <div className="main-wrapper" style={{ overflowX: 'clip' }}>
          {/* Fixed floating navbar */}
          <Navbar />

          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <Footer />
        </div>
      )}
    </PortfolioProvider>
  )
}
