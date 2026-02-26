import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { PortfolioItem, Profile, Resume, SiteData } from './types'
import { fetchDefaultData } from './utils/data'
import { clearStoredData, loadStoredData, saveStoredData } from './utils/storage'
import { migrateToFirebase } from './utils/migrate'
import { onAuthChange, logout } from './utils/authService'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { LoginModal } from './components/admin/LoginModal'

function App() {
  const [data, setData] = useState<SiteData | null>(null)
  const [defaultData, setDefaultData] = useState<SiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'home' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'home',
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [draftProfile, setDraftProfile] = useState<Profile | null>(null)
  const [draftResume, setDraftResume] = useState<Resume | null>(null)
  const [draftPortfolio, setDraftPortfolio] = useState<PortfolioItem[] | null>(null)

  useEffect(() => {
    const syncHash = () => {
      setView(window.location.hash === '#admin' ? 'admin' : 'home')
    }
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsAuthenticated(!!user)
      if (!user && view === 'admin') {
        setView('home')
        window.location.hash = '#home'
      }
    })
    return unsubscribe
  }, [view])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+L or Cmd+Alt+L to show login
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'l') {
        e.preventDefault()
        setIsLoginModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (import.meta.env.DEV) {
      ;(window as any).migratePortfolio = migrateToFirebase
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await loadStoredData()
        if (stored) {
          setData(stored)
          setDraftProfile(structuredClone(stored.profile))
          setDraftResume(structuredClone(stored.resume))
          setDraftPortfolio(structuredClone(stored.portfolio))
        }

        try {
          const fallback = await fetchDefaultData()
          setDefaultData(fallback)
          if (!stored) {
            setData(fallback)
            setDraftProfile(structuredClone(fallback.profile))
            setDraftResume(structuredClone(fallback.resume))
            setDraftPortfolio(structuredClone(fallback.portfolio))
          }
        } catch (fetchError) {
          if (!stored) {
            throw fetchError
          }
          setDefaultData(stored)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const isDirty = useMemo(() => {
    if (!data || !draftProfile || !draftResume || !draftPortfolio) return false
    return (
      JSON.stringify(data.profile) !== JSON.stringify(draftProfile) ||
      JSON.stringify(data.resume) !== JSON.stringify(draftResume) ||
      JSON.stringify(data.portfolio) !== JSON.stringify(draftPortfolio)
    )
  }, [data, draftPortfolio, draftProfile, draftResume])

  if (isLoading) {
    return (
      <div className="page">
        <div className="status-card">Loading portfolio…</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="page">
        <div className="status-card error">{error || 'No data available.'}</div>
      </div>
    )
  }

  const { profile, resume, portfolio, contact } = data

  const handleResumeChange = <K extends keyof Resume>(key: K, value: Resume[K]) => {
    setDraftResume((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleProfileChange = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraftProfile((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handlePortfolioChange = (portfolio: PortfolioItem[]) => {
    setDraftPortfolio(portfolio)
  }

  const persistResume = async () => {
    if (!draftProfile || !draftResume || !draftPortfolio) return
    const next = {
      ...data,
      profile: draftProfile,
      resume: draftResume,
      portfolio: draftPortfolio,
    }
    setData(next)
    await saveStoredData(next)
  }

  const handleLogout = async () => {
    await logout()
    setView('home')
    window.location.hash = '#home'
  }

  const resetResume = async () => {
    if (!defaultData) return
    await clearStoredData()
    setData(defaultData)
    setDraftProfile(structuredClone(defaultData.profile))
    setDraftResume(structuredClone(defaultData.resume))
    setDraftPortfolio(structuredClone(defaultData.portfolio))
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'siteData.json'
    link.click()
    URL.revokeObjectURL(url)
  }


  return (
    <div className="page">
      <Header
        profile={profile}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      {view === 'admin' && isAuthenticated ? (
        draftProfile && draftResume && draftPortfolio ? (
          <AdminPage
            draftProfile={draftProfile}
            draftResume={draftResume}
            draftPortfolio={draftPortfolio}
            isDirty={isDirty}
            error={error}
            onProfileChange={handleProfileChange}
            onResumeChange={handleResumeChange}
            onPortfolioChange={handlePortfolioChange}
            onSave={persistResume}
            onReset={resetResume}
            onExport={exportJson}
            onLogout={handleLogout}
          />
        ) : null
      ) : (
        <HomePage
          profile={profile}
          resume={resume}
          portfolio={portfolio}
          contact={contact}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false)
          window.location.hash = '#admin'
        }}
      />
    </div>
  )
}

export default App
