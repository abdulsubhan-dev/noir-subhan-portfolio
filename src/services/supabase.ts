/**
 * supabase.ts — Supabase Cloud Integration Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Enables instant multi-device cloud synchronization for Projects, Categories,
 * Brands, and uploaded image assets. Automatically sanitizes project URLs.
 */

import { createClient } from '@supabase/supabase-js'
import type { DBBrand, DBCategory, DBProject } from './db'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

// Auto-clean URL if user pasted the Dashboard URL instead of API URL
const sanitizeSupabaseUrl = (url: string): string => {
  let clean = url.trim()
  if (clean.includes('/dashboard/project/')) {
    const match = clean.match(/\/dashboard\/project\/([a-z0-9]+)/i)
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`
    }
  }
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1)
  }
  return clean
}

export const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl)

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.endsWith('.supabase.co') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 20
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ── Image Uploader to Supabase Storage Bucket ─────────────────────────────────
export async function uploadImageToSupabase(dataUrl: string, fileName: string): Promise<string> {
  if (!supabase) return dataUrl

  try {
    // If it's already a URL (not base64 data URL), return as is
    if (!dataUrl.startsWith('data:')) return dataUrl

    // Convert base64 Data URL to Blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const fileExt = blob.type.split('/')[1] || 'png'
    const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      })

    if (uploadError) {
      console.warn('Supabase storage upload warning:', uploadError.message)
      return dataUrl // fallback to dataUrl if bucket not created yet
    }

    const { data: publicUrlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (err) {
    console.error('Supabase image upload error:', err)
    return dataUrl
  }
}

// ── Cloud Brands ──────────────────────────────────────────────────────────────
export async function fetchCloudBrands(): Promise<DBBrand[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching brands from Supabase:', error)
    return []
  }
  return (data as DBBrand[]) || []
}

export async function upsertCloudBrand(brand: DBBrand): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('brands').upsert(brand)
  if (error) console.error('Error saving brand to Supabase:', error)
}

export async function deleteCloudBrand(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) console.error('Error deleting brand from Supabase:', error)
}

// ── Cloud Categories ──────────────────────────────────────────────────────────
export async function fetchCloudCategories(): Promise<DBCategory[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching categories from Supabase:', error)
    return []
  }
  return (data as DBCategory[]) || []
}

export async function upsertCloudCategory(cat: DBCategory): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('categories').upsert(cat)
  if (error) console.error('Error saving category to Supabase:', error)
}

export async function deleteCloudCategory(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) console.error('Error deleting category from Supabase:', error)
}

// ── Cloud Projects ────────────────────────────────────────────────────────────
export async function fetchCloudProjects(): Promise<DBProject[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching projects from Supabase:', error)
    return []
  }
  return (data as DBProject[]) || []
}

export async function upsertCloudProject(proj: DBProject): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('projects').upsert(proj)
  if (error) console.error('Error saving project to Supabase:', error)
}

export async function deleteCloudProject(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) console.error('Error deleting project from Supabase:', error)
}
