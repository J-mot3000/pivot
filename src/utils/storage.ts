import type { SiteData } from '../types'

const STORAGE_KEY = 'portfolio-site-data'

export const loadStoredData = (): SiteData | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SiteData
  } catch {
    return null
  }
}

export const saveStoredData = (data: SiteData) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const clearStoredData = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
