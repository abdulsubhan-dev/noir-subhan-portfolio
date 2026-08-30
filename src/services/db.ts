/**
 * db.ts — NOIR_SUBHAN IndexedDB Persistent Storage Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides reliable, client-side persistence for Projects, Categories, Brands,
 * Settings, and uploaded image assets (base64/data URLs).
 * Automatically seeds initial data on first launch.
 */

import {
  BRANDS as INITIAL_BRANDS,
  CATEGORIES as INITIAL_CATEGORIES,
  type Brand as InitBrand,
  type Category as InitCategory,
  type Project as InitProject,
} from '../data/projectsData'

export interface DBBrand {
  id: string
  name: string
  role: string
  website?: string
  description?: string
  order: number
  visible: boolean
  createdAt: number
  updatedAt: number
}

export interface DBCategory {
  id: string
  slug: string
  name: string
  description: string
  coverImage: string
  order: number
  visible: boolean
  createdAt: number
  updatedAt: number
}

export interface DBProject {
  id: string
  categorySlug: string
  brandName: string
  title: string
  image: string
  type: string
  description?: string
  isFeatured?: boolean
  status: 'published' | 'draft'
  order: number
  createdAt: number
  updatedAt: number
}

export interface DBSettings {
  adminPasswordHash?: string
  lastBackupDate?: string
  siteTitle?: string
}

const DB_NAME = 'NoirSubhanPortfolioDB'
const DB_VERSION = 1

class PortfolioDB {
  private dbPromise: Promise<IDBDatabase> | null = null

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('brands')) {
          const brandStore = db.createObjectStore('brands', { keyPath: 'id' })
          brandStore.createIndex('order', 'order', { unique: false })
          brandStore.createIndex('name', 'name', { unique: false })
        }

        if (!db.objectStoreNames.contains('categories')) {
          const catStore = db.createObjectStore('categories', { keyPath: 'id' })
          catStore.createIndex('slug', 'slug', { unique: true })
          catStore.createIndex('order', 'order', { unique: false })
        }

        if (!db.objectStoreNames.contains('projects')) {
          const projStore = db.createObjectStore('projects', { keyPath: 'id' })
          projStore.createIndex('categorySlug', 'categorySlug', { unique: false })
          projStore.createIndex('brandName', 'brandName', { unique: false })
          projStore.createIndex('status', 'status', { unique: false })
          projStore.createIndex('order', 'order', { unique: false })
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })

    return this.dbPromise
  }

  // ── Seeding ─────────────────────────────────────────────────────────────────
  async init(): Promise<void> {
    const db = await this.getDB()
    const brandsCount = await this.getCount('brands')
    const categoriesCount = await this.getCount('categories')

    if (brandsCount === 0 && categoriesCount === 0) {
      console.log('Seeding initial portfolio data into IndexedDB...')
      await this.seedInitialData()
    }
  }

  private async getCount(storeName: string): Promise<number> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const countReq = store.count()
      countReq.onsuccess = () => resolve(countReq.result)
      countReq.onerror = () => reject(countReq.error)
    })
  }

  async seedInitialData(): Promise<void> {
    const now = Date.now()
    const brands: DBBrand[] = INITIAL_BRANDS.map((b, i) => ({
      id: `brand-${i + 1}-${b.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: b.name,
      role: b.role,
      order: i + 1,
      visible: true,
      createdAt: now,
      updatedAt: now,
    }))

    const categories: DBCategory[] = INITIAL_CATEGORIES.map((c, i) => ({
      id: `cat-${c.slug}`,
      slug: c.slug,
      name: c.name,
      description: c.description,
      coverImage: c.coverImage,
      order: i + 1,
      visible: true,
      createdAt: now,
      updatedAt: now,
    }))

    const projects: DBProject[] = []
    let pIdx = 1

    INITIAL_CATEGORIES.forEach((c) => {
      c.projects.forEach((p, itemIdx) => {
        projects.push({
          id: p.id || `proj-${pIdx++}`,
          categorySlug: c.slug,
          brandName: p.company,
          title: p.title,
          image: p.image,
          type: p.type,
          description: p.description || '',
          isFeatured: itemIdx === 0,
          status: 'published',
          order: itemIdx + 1,
          createdAt: now + pIdx,
          updatedAt: now + pIdx,
        })
      })
    })

    const db = await this.getDB()
    const tx = db.transaction(['brands', 'categories', 'projects', 'settings'], 'readwrite')

    const brandStore = tx.objectStore('brands')
    brands.forEach((b) => brandStore.put(b))

    const catStore = tx.objectStore('categories')
    categories.forEach((c) => catStore.put(c))

    const projStore = tx.objectStore('projects')
    projects.forEach((p) => projStore.put(p))

    const settingsStore = tx.objectStore('settings')
    settingsStore.put({ key: 'adminPassword', value: 'subhan2026' })
    settingsStore.put({ key: 'lastBackupDate', value: new Date().toISOString() })

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  // ── BRANDS CRUD ─────────────────────────────────────────────────────────────
  async getBrands(): Promise<DBBrand[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('brands', 'readonly')
      const store = tx.objectStore('brands')
      const req = store.getAll()
      req.onsuccess = () => {
        const sorted = (req.result as DBBrand[]).sort((a, b) => a.order - b.order)
        resolve(sorted)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async saveBrand(brand: DBBrand): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('brands', 'readwrite')
      const store = tx.objectStore('brands')
      const req = store.put(brand)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async deleteBrand(id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('brands', 'readwrite')
      const store = tx.objectStore('brands')
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── CATEGORIES CRUD ─────────────────────────────────────────────────────────
  async getCategories(): Promise<DBCategory[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const req = store.getAll()
      req.onsuccess = () => {
        const sorted = (req.result as DBCategory[]).sort((a, b) => a.order - b.order)
        resolve(sorted)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async saveCategory(cat: DBCategory): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readwrite')
      const store = tx.objectStore('categories')
      const req = store.put(cat)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async deleteCategory(id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readwrite')
      const store = tx.objectStore('categories')
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── PROJECTS CRUD ───────────────────────────────────────────────────────────
  async getProjects(): Promise<DBProject[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly')
      const store = tx.objectStore('projects')
      const req = store.getAll()
      req.onsuccess = () => {
        const sorted = (req.result as DBProject[]).sort((a, b) => a.order - b.order)
        resolve(sorted)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async saveProject(proj: DBProject): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const req = store.put(proj)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── SETTINGS / AUTH ─────────────────────────────────────────────────────────
  async getSetting(key: string): Promise<any> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly')
      const store = tx.objectStore('settings')
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result ? req.result.value : null)
      req.onerror = () => reject(req.error)
    })
  }

  async setSetting(key: string, value: any): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      const req = store.put({ key, value })
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── BACKUP & RESTORE ────────────────────────────────────────────────────────
  async exportFullDatabase(): Promise<string> {
    const brands = await this.getBrands()
    const categories = await this.getCategories()
    const projects = await this.getProjects()
    const password = (await this.getSetting('adminPassword')) || 'subhan2026'

    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      brands,
      categories,
      projects,
      settings: {
        adminPassword: password,
      },
    }

    return JSON.stringify(exportData, null, 2)
  }

  async importFullDatabase(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString)
      if (!data.brands || !data.categories || !data.projects) {
        throw new Error('Invalid portfolio backup file format')
      }

      const db = await this.getDB()
      const tx = db.transaction(['brands', 'categories', 'projects', 'settings'], 'readwrite')

      const bStore = tx.objectStore('brands')
      const cStore = tx.objectStore('categories')
      const pStore = tx.objectStore('projects')
      const sStore = tx.objectStore('settings')

      bStore.clear()
      cStore.clear()
      pStore.clear()

      data.brands.forEach((b: DBBrand) => bStore.put(b))
      data.categories.forEach((c: DBCategory) => cStore.put(c))
      data.projects.forEach((p: DBProject) => pStore.put(p))

      if (data.settings?.adminPassword) {
        sStore.put({ key: 'adminPassword', value: data.settings.adminPassword })
      }
      sStore.put({ key: 'lastBackupDate', value: new Date().toISOString() })

      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => reject(tx.error)
      })
    } catch (e) {
      console.error('Import failed:', e)
      throw e
    }
  }

  async resetToDefaults(): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(['brands', 'categories', 'projects', 'settings'], 'readwrite')
    tx.objectStore('brands').clear()
    tx.objectStore('categories').clear()
    tx.objectStore('projects').clear()
    tx.objectStore('settings').clear()

    return new Promise((resolve, reject) => {
      tx.oncomplete = async () => {
        await this.seedInitialData()
        resolve()
      }
      tx.onerror = () => reject(tx.error)
    })
  }
}

export const portfolioDB = new PortfolioDB()
