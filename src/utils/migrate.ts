
import { saveStoredData } from './storage'
import { fetchDefaultData } from './data'

/**
 * Migrate data from siteData.json to Firebase Firestore
 * Run this once to move all your portfolio data to Firebase
 */
export const migrateToFirebase = async (): Promise<void> => {
  try {
    console.log('Starting migration to Firebase...')
    const defaultData = await fetchDefaultData()
    await saveStoredData(defaultData)
    console.log('✓ Migration complete! Your data is now in Firebase.')
    console.log('You can safely delete public/data/siteData.json if you want.')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

/**
 * Quick way to run migration from browser console
 * Just call: window.migratePortfolio?.()
 */
if (import.meta.env.DEV) {
  (window as any).migratePortfolio = migrateToFirebase
}
