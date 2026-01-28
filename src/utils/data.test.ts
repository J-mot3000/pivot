import { describe, expect, it } from 'vitest'
import siteData from '../../public/data/siteData.json'
import { isSiteData } from './validators'

describe('siteData.json', () => {
  it('matches the required schema', () => {
    expect(isSiteData(siteData)).toBe(true)
  })
})
