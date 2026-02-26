import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { PortfolioItem, Profile, Resume, SiteData } from './types'
import { fetchDefaultData } from './utils/data'
import { clearStoredData, loadStoredData, saveStoredData } from './utils/storage'
import { migrateToFirebase } from './utils/migrate'
import { isSiteData } from './utils/validators'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'

function App() {
  const [data, setData] = useState<SiteData | null>(null)
  const [defaultData, setDefaultData] = useState<SiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'home' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'home',
  )
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

  const importJson = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = JSON.parse(text) as unknown
    if (!isSiteData(parsed)) {
      throw new Error('That file does not match the required data shape.')
    }
    setError('')
    setData(parsed)
    setDraftProfile(structuredClone(parsed.profile))
    setDraftResume(structuredClone(parsed.resume))
    setDraftPortfolio(structuredClone(parsed.portfolio))
    await saveStoredData(parsed)
  }

  return (
    <div className="page">
      <Header profile={profile} />

      {view === 'admin' ? (
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
            onImport={importJson}
            onError={setError}
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
    </div>
  )
}

export default App
