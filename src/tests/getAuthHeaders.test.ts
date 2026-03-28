import { describe, it, expect } from 'vitest'
import { getAuthHeaders } from '../downloader/auth/getAuthHeaders.ts'

describe('getAuthHeaders', () => {
  it('should return correct Content-Type', () => {
    const headers = getAuthHeaders()
    expect(headers['Content-Type']).toBe('text/plain;charset=UTF-8')
  })

  it('should return correct Client-ID', () => {
    const headers = getAuthHeaders()
    expect(headers['Client-ID']).toBe('kimne78kx3ncx6brgo4mv6wki5h1ko')
  })

  it('should return exactly two properties', () => {
    const headers = getAuthHeaders()
    expect(Object.keys(headers)).toHaveLength(2)
  })
})
