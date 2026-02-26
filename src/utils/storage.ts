import type { SiteData } from '../types'
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// const STORAGE_KEY = 'portfolio-site-data'

export const loadStoredData = async (): Promise<SiteData | null> => {
  try {
    const docRef = doc(db, 'portfolio', 'siteData')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as SiteData
    }
    return null
  } catch (error) {
    console.error('Error loading data:', error)
    return null
  }
}

export const saveStoredData = async (data: SiteData) => {
  try {
    const docRef = doc(db, 'portfolio', 'siteData')
    await setDoc(docRef, data)
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

export const clearStoredData = async () => {
  try {
    const docRef = doc(db, 'portfolio', 'siteData')
    await setDoc(docRef, {})
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}
