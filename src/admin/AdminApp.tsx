/**
 * AdminApp.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Main controller for the NOIR_SUBHAN Admin CMS.
 * Handles auth gating, active tabs, modals, confirm dialogs, and toast stacks.
 */

import React, { useState } from 'react'
import { usePortfolioData } from '../context/PortfolioContext'
import { AdminLogin } from './AdminLogin'
import { AdminLayout } from './AdminLayout'
import { DashboardTab } from './DashboardTab'
import { ProjectsTab } from './ProjectsTab'
import { CategoriesTab } from './CategoriesTab'
import { BrandsTab } from './BrandsTab'
import { SettingsTab } from './SettingsTab'
import { ProjectModal } from './ProjectModal'
import { CategoryModal } from './CategoryModal'
import { BrandModal } from './BrandModal'
import { ProjectPreviewModal } from './ProjectPreviewModal'
import { ConfirmDialog } from './ConfirmDialog'
import { ToastContainer, type ToastMessage } from './Toast'
import type { DBBrand, DBCategory, DBProject } from '../services/db'

interface AdminAppProps {
  onBackToSite: () => void
}

export function AdminApp({ onBackToSite }: AdminAppProps) {
  const {
    isAuthenticated,
    isLoading,
    login,
    logout,
    categories,
    brands,
    projects,
    deleteProject,
    deleteCategory,
    deleteBrand,
    resetDefaults,
  } = usePortfolioData()

  const [activeTab, setActiveTab] = useState('dashboard')

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<DBProject | null>(null)

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<DBCategory | null>(null)

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [brandToEdit, setBrandToEdit] = useState<DBBrand | null>(null)

  const [previewProject, setPreviewProject] = useState<DBProject | null>(null)

  // Confirmation dialogs state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    variant?: 'danger' | 'warning'
    onConfirm: () => Promise<void>
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  })

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // If DB is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D7E2EA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F57C00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Loading Admin Engine...
          </span>
        </div>
      </div>
    )
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={async (pass) => {
          const res = await login(pass)
          if (res.success) {
            addToast('success', 'Authenticated', 'Welcome to NOIR_SUBHAN Admin Panel.')
          }
          return res
        }}
        onBackToSite={onBackToSite}
      />
    )
  }

  // Deletion handlers with confirmation
  const handleDeleteProjectPrompt = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Project',
      variant: 'danger',
      onConfirm: async () => {
        await deleteProject(id)
        addToast('success', 'Project Deleted', `"${title}" has been removed.`)
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleDeleteCategoryPrompt = (id: string, name: string, projectCount: number) => {
    if (projectCount > 0) {
      addToast(
        'error',
        'Cannot Delete Category',
        `This category contains ${projectCount} projects. Please delete or reassign those projects first.`
      )
      return
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${name}"?`,
      confirmLabel: 'Delete Category',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteCategory(id)
        if (res.success) {
          addToast('success', 'Category Deleted', `Category "${name}" removed.`)
        } else {
          addToast('error', 'Failed', res.message)
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleDeleteBrandPrompt = (id: string, name: string, projectCount: number) => {
    if (projectCount > 0) {
      addToast(
        'error',
        'Cannot Delete Brand',
        `Brand "${name}" has ${projectCount} associated projects. Please update those projects first.`
      )
      return
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Brand',
      message: `Are you sure you want to delete brand "${name}" from your portfolio?`,
      confirmLabel: 'Delete Brand',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteBrand(id)
        if (res.success) {
          addToast('success', 'Brand Deleted', `Brand "${name}" removed.`)
        } else {
          addToast('error', 'Failed', res.message)
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleResetDefaultsPrompt = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Entire Database',
      message:
        'WARNING: This will reset all projects, categories, and brands back to the original initial portfolio data. All custom uploads will be cleared.',
      confirmLabel: 'Reset Database',
      variant: 'danger',
      onConfirm: async () => {
        await resetDefaults()
        addToast('success', 'Database Reset', 'Portfolio restored to default initial state.')
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={() => {
          logout()
          addToast('info', 'Logged Out', 'You have been signed out.')
        }}
        onBackToSite={onBackToSite}
      >
        {activeTab === 'dashboard' && (
          <DashboardTab
            onAddProject={() => {
              setProjectToEdit(null)
              setIsProjectModalOpen(true)
            }}
            onAddCategory={() => {
              setCategoryToEdit(null)
              setIsCategoryModalOpen(true)
            }}
            onAddBrand={() => {
              setBrandToEdit(null)
              setIsBrandModalOpen(true)
            }}
            onEditProject={(p) => {
              setProjectToEdit(p)
              setIsProjectModalOpen(true)
            }}
            onPreviewProject={(p) => setPreviewProject(p)}
            onDeleteProject={handleDeleteProjectPrompt}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            onAddProject={() => {
              setProjectToEdit(null)
              setIsProjectModalOpen(true)
            }}
            onEditProject={(p) => {
              setProjectToEdit(p)
              setIsProjectModalOpen(true)
            }}
            onPreviewProject={(p) => setPreviewProject(p)}
            onDeleteProject={handleDeleteProjectPrompt}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            onAddCategory={() => {
              setCategoryToEdit(null)
              setIsCategoryModalOpen(true)
            }}
            onEditCategory={(c) => {
              setCategoryToEdit(c)
              setIsCategoryModalOpen(true)
            }}
            onDeleteCategory={handleDeleteCategoryPrompt}
          />
        )}

        {activeTab === 'brands' && (
          <BrandsTab
            onAddBrand={() => {
              setBrandToEdit(null)
              setIsBrandModalOpen(true)
            }}
            onEditBrand={(b) => {
              setBrandToEdit(b)
              setIsBrandModalOpen(true)
            }}
            onDeleteBrand={handleDeleteBrandPrompt}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            onSuccess={(msg) => addToast('success', 'Success', msg)}
            onError={(msg) => addToast('error', 'Error', msg)}
            onConfirmReset={handleResetDefaultsPrompt}
          />
        )}
      </AdminLayout>

      {/* ── Modals ── */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        categories={categories}
        brands={brands}
        onClose={() => {
          setIsProjectModalOpen(false)
          setProjectToEdit(null)
        }}
        onSuccess={(msg) => addToast('success', 'Success', msg)}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setCategoryToEdit(null)
        }}
        onSuccess={(msg) => addToast('success', 'Success', msg)}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        brandToEdit={brandToEdit}
        onClose={() => {
          setIsBrandModalOpen(false)
          setBrandToEdit(null)
        }}
        onSuccess={(msg) => addToast('success', 'Success', msg)}
      />

      <ProjectPreviewModal
        project={previewProject}
        categoryName={
          categories.find((c) => c.slug === previewProject?.categorySlug)?.name || ''
        }
        onClose={() => setPreviewProject(null)}
        onEdit={(p) => {
          setPreviewProject(null)
          setProjectToEdit(p)
          setIsProjectModalOpen(true)
        }}
      />

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* ── Toast Notifications Stack ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
