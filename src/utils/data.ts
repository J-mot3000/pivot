import type { SiteData } from '../types'

const baseUrl = import.meta.env.BASE_URL || '/'
const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
export const DEFAULT_DATA_URL = `${normalizedBaseUrl}data/siteData.json`

export const fetchDefaultData = async (): Promise<SiteData> => {
  const response = await fetch(DEFAULT_DATA_URL)
  if (!response.ok) {
    throw new Error('Failed to load site data')
  }
  return (await response.json()) as SiteData
}
