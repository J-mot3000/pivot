import type { SiteData } from '../types'

export const isSiteData = (value: unknown): value is SiteData => {
  if (!value || typeof value !== 'object') return false
  const data = value as SiteData
  return Boolean(
    data.profile &&
      data.resume &&
      data.portfolio &&
      data.contact &&
      typeof data.profile.name === 'string' &&
      Array.isArray(data.resume.experience) &&
      Array.isArray(data.resume.education) &&
      Array.isArray(data.portfolio)
  )
}
