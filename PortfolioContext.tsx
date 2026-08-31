/**
 * PortfolioContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reactive React Context for NOIR_SUBHAN Portfolio & Admin Panel.
 * Supports hybrid cloud sync (Supabase) + local offline cache (IndexedDB).
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  portfolioDB,
  type DBBrand,
  type DBCategory,
  type DBProject,
} from '../services/db'
import {
  isSupabaseConfigured,
  fetchCloudBrands,
  fetchCloudCategories,
  fetchCloudProjects,
  upsertCloudBrand,
  upsertCloudCategory,
  upsertCloudProject,
  deleteCloudBrand,
  deleteCloudCategory,
  deleteCloudProject,
  uploadImageToSupabase,
} from '../services/supabase'

export interface PortfolioContextType {
  brands: DBBrand[]
  categories: DBCategory[]
  projects: DBProject[]
  isLoading: boolean
  isCloudConnected: boolean
  
  // Auth state
  isAuthenticated: boolean
  login: (password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>
  
  // CRUD - Projects
  saveProject: (project: Omit<DBProject, 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<DBProject>
  deleteProject: (id: string) => Promise<void>
  reorderProjects: (orderedIds: string[]) => Promise<void>
  
  // CRUD - Categories
  saveCategory: (category: Omit<DBCategory, 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<DBCategory>
  deleteCategory: (id: string) => Promise<{ success: boolean; message?: string }>
  reorderCategories: (orderedIds: string[]) => Promise<void>
  
  // CRUD - Brands
  saveBrand: (brand: Omit<DBBrand, 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<DBBrand>
  deleteBrand: (id: string) => Promise<{ success: boolean; message?: string }>
  reorderBrands: (orderedIds: string[]) => Promise<void>
  
  // Utilities
  optimizeImage: (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => Promise<string>
  exportBackup: () => Promise<string>
  importBackup: (json: string) => Promise<void>
  resetDefaults: () => Promise<void>
  refreshData: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | null>(null)

const AUTH_STORAGE_KEY = 'noir_admin_auth_session'

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<DBBrand[]>([])
  const [categories, setCategories] = useState<DBCategory[]>([])
  const [projects, setProjects] = useState<DBProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCloudConnected] = useState<boolean>(isSupabaseConfigured())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' || localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  })

  // ── Load All Data (Cloud First if configured, IndexedDB Fallback) ────────────
  const loadData = useCallback(async () => {
    try {
      await portfolioDB.init()

      if (isSupabaseConfigured()) {
        const [cloudB, cloudC, cloudP] = await Promise.all([
          fetchCloudBrands(),
          fetchCloudCategories(),
          fetchCloudProjects(),
        ])

        if (cloudB.length > 0 || cloudC.length > 0 || cloudP.length > 0) {
          setBrands(cloudB)
          setCategories(cloudC)
          setProjects(cloudP)

          // Sync to IndexedDB cache
          cloudB.forEach((b) => portfolioDB.saveBrand(b))
          cloudC.forEach((c) => portfolioDB.saveCategory(c))
          cloudP.forEach((p) => portfolioDB.saveProject(p))
          setIsLoading(false)
          return
        }
      }

      // IndexedDB Fallback
      const [b, c, p] = await Promise.all([
        portfolioDB.getBrands(),
        portfolioDB.getCategories(),
        portfolioDB.getProjects(),
      ])
      setBrands(b)
      setCategories(c)
      setProjects(p)

      // If Cloud is configured but cloud tables are empty, seed cloud tables automatically
      if (isSupabaseConfigured() && (b.length > 0 || c.length > 0 || p.length > 0)) {
        b.forEach((item) => upsertCloudBrand(item))
        c.forEach((item) => upsertCloudCategory(item))
        p.forEach((item) => upsertCloudProject(item))
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ── Auth ────────────────────────────────────────────────────────────────────
  const login = async (password: string) => {
    try {
      const storedPassword = (await portfolioDB.getSetting('adminPassword')) || 'subhan2026'
      if (password === storedPassword) {
        setIsAuthenticated(true)
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        return { success: true }
      }
      return { success: false, message: 'Invalid admin passcode. Please try again.' }
    } catch (err) {
      return { success: false, message: 'Authentication error. Please retry.' }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const changePassword = async (oldPass: string, newPass: string) => {
    try {
      const stored = (await portfolioDB.getSetting('adminPassword')) || 'subhan2026'
      if (oldPass !== stored) {
        return { success: false, message: 'Current passcode is incorrect.' }
      }
      if (!newPass || newPass.trim().length < 4) {
        return { success: false, message: 'New passcode must be at least 4 characters.' }
      }
      await portfolioDB.setSetting('adminPassword', newPass.trim())
      return { success: true, message: 'Passcode updated successfully.' }
    } catch (err) {
      return { success: false, message: 'Failed to update passcode.' }
    }
  }

  // ── Project CRUD ────────────────────────────────────────────────────────────
  const saveProject = async (
    data: Omit<DBProject, 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<DBProject> => {
    const now = Date.now()
    const isNew = !data.id || data.id.startsWith('temp-')
    const id = isNew ? `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` : data.id!

    const existing = projects.find((p) => p.id === id)
    const order = data.order || (isNew ? projects.length + 1 : existing?.order || 1)

    // Upload image to Cloud storage if Supabase is connected
    let imageUrl = data.image
    if (isSupabaseConfigured() && data.image.startsWith('data:')) {
      imageUrl = await uploadImageToSupabase(data.image, `proj-${id}`)
    }

    const fullProject: DBProject = {
      id,
      categorySlug: data.categorySlug,
      brandName: data.brandName,
      title: data.title.trim(),
      image: imageUrl,
      type: data.type || 'Design',
      description: data.description || '',
      isFeatured: data.isFeatured ?? false,
      status: data.status || 'published',
      order,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    // If marked as featured, update the category cover image automatically
    if (fullProject.isFeatured && fullProject.image) {
      const cat = categories.find((c) => c.slug === fullProject.categorySlug)
      if (cat) {
        await saveCategory({ ...cat, coverImage: fullProject.image, updatedAt: now })
      }
    }

    await portfolioDB.saveProject(fullProject)
    if (isSupabaseConfigured()) {
      await upsertCloudProject(fullProject)
    }
    await loadData()
    return fullProject
  }

  const deleteProject = async (id: string) => {
    await portfolioDB.deleteProject(id)
    if (isSupabaseConfigured()) {
      await deleteCloudProject(id)
    }
    await loadData()
  }

  const reorderProjects = async (orderedIds: string[]) => {
    const projectMap = new Map(projects.map((p) => [p.id, p]))
    const updates: Promise<void>[] = []

    orderedIds.forEach((id, index) => {
      const proj = projectMap.get(id)
      if (proj && proj.order !== index + 1) {
        const updated = { ...proj, order: index + 1, updatedAt: Date.now() }
        updates.push(portfolioDB.saveProject(updated))
        if (isSupabaseConfigured()) {
          updates.push(upsertCloudProject(updated))
        }
      }
    })

    await Promise.all(updates)
    await loadData()
  }

  // ── Category CRUD ───────────────────────────────────────────────────────────
  const saveCategory = async (
    data: Omit<DBCategory, 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<DBCategory> => {
    const now = Date.now()
    const isNew = !data.id || data.id.startsWith('temp-')
    const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const id = isNew ? `cat-${slug}` : data.id!

    const existing = categories.find((c) => c.id === id || c.slug === slug)
    const order = data.order || (isNew ? categories.length + 1 : existing?.order || 1)

    let coverUrl = data.coverImage
    if (isSupabaseConfigured() && data.coverImage.startsWith('data:')) {
      coverUrl = await uploadImageToSupabase(data.coverImage, `cat-${id}`)
    }

    const fullCat: DBCategory = {
      id,
      slug,
      name: data.name.trim(),
      description: data.description.trim(),
      coverImage: coverUrl,
      order,
      visible: data.visible ?? true,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    await portfolioDB.saveCategory(fullCat)
    if (isSupabaseConfigured()) {
      await upsertCloudCategory(fullCat)
    }
    await loadData()
    return fullCat
  }

  const deleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (!cat) return { success: false, message: 'Category not found.' }

    const linkedProjects = projects.filter((p) => p.categorySlug === cat.slug)
    if (linkedProjects.length > 0) {
      return {
        success: false,
        message: `This category contains ${linkedProjects.length} projects. Please reassign or delete these projects before deleting the category.`,
      }
    }

    await portfolioDB.deleteCategory(id)
    if (isSupabaseConfigured()) {
      await deleteCloudCategory(id)
    }
    await loadData()
    return { success: true }
  }

  const reorderCategories = async (orderedIds: string[]) => {
    const catMap = new Map(categories.map((c) => [c.id, c]))
    const updates: Promise<void>[] = []

    orderedIds.forEach((id, index) => {
      const cat = catMap.get(id)
      if (cat && cat.order !== index + 1) {
        const updated = { ...cat, order: index + 1, updatedAt: Date.now() }
        updates.push(portfolioDB.saveCategory(updated))
        if (isSupabaseConfigured()) {
          updates.push(upsertCloudCategory(updated))
        }
      }
    })

    await Promise.all(updates)
    await loadData()
  }

  // ── Brand CRUD ──────────────────────────────────────────────────────────────
  const saveBrand = async (
    data: Omit<DBBrand, 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<DBBrand> => {
    const now = Date.now()
    const isNew = !data.id || data.id.startsWith('temp-')
    const id = isNew
      ? `brand-${Date.now()}-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : data.id!

    const existing = brands.find((b) => b.id === id)
    const order = data.order || (isNew ? brands.length + 1 : existing?.order || 1)

    const fullBrand: DBBrand = {
      id,
      name: data.name.trim(),
      role: data.role.trim(),
      website: data.website?.trim() || '',
      description: data.description?.trim() || '',
      order,
      visible: data.visible ?? true,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    await portfolioDB.saveBrand(fullBrand)
    if (isSupabaseConfigured()) {
      await upsertCloudBrand(fullBrand)
    }
    await loadData()
    return fullBrand
  }

  const deleteBrand = async (id: string) => {
    const brand = brands.find((b) => b.id === id)
    if (!brand) return { success: false, message: 'Brand not found.' }

    const linkedProjects = projects.filter((p) => p.brandName.toLowerCase() === brand.name.toLowerCase())
    if (linkedProjects.length > 0) {
      return {
        success: false,
        message: `Brand "${brand.name}" has ${linkedProjects.length} associated projects. Please update those projects first.`,
      }
    }

    await portfolioDB.deleteBrand(id)
    if (isSupabaseConfigured()) {
      await deleteCloudBrand(id)
    }
    await loadData()
    return { success: true }
  }

  const reorderBrands = async (orderedIds: string[]) => {
    const brandMap = new Map(brands.map((b) => [b.id, b]))
    const updates: Promise<void>[] = []

    orderedIds.forEach((id, index) => {
      const b = brandMap.get(id)
      if (b && b.order !== index + 1) {
        const updated = { ...b, order: index + 1, updatedAt: Date.now() }
        updates.push(portfolioDB.saveBrand(updated))
        if (isSupabaseConfigured()) {
          updates.push(upsertCloudBrand(updated))
        }
      }
    })

    await Promise.all(updates)
    await loadData()
  }

  // ── Image Optimizer ─────────────────────────────────────────────────────────
  const optimizeImage = (
    file: File,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.88
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            } else {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(e.target?.result as string)
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          const format = file.type === 'image/png' ? 'image/png' : 'image/webp'
          const dataUrl = canvas.toDataURL(format, quality)
          resolve(dataUrl)
        }
        img.onerror = () => resolve(e.target?.result as string)
        img.src = e.target?.result as string
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  // ── Backup & Restore ────────────────────────────────────────────────────────
  const exportBackup = async () => {
    return await portfolioDB.exportFullDatabase()
  }

  const importBackup = async (json: string) => {
    await portfolioDB.importFullDatabase(json)
    await loadData()
  }

  const resetDefaults = async () => {
    await portfolioDB.resetToDefaults()
    await loadData()
  }

  return (
    <PortfolioContext.Provider
      value={{
        brands,
        categories,
        projects,
        isLoading,
        isCloudConnected,
        isAuthenticated,
        login,
        logout,
        changePassword,
        saveProject,
        deleteProject,
        reorderProjects,
        saveCategory,
        deleteCategory,
        reorderCategories,
        saveBrand,
        deleteBrand,
        reorderBrands,
        optimizeImage,
        exportBackup,
        importBackup,
        resetDefaults,
        refreshData: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolioData() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider')
  }
  return context
}
