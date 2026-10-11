import { describe, expect, it } from 'vitest'
import { newAccessKey, newReportId, normalizeAccessKey, normalizeReportId } from '@/lib/keys'

describe('report IDs and access keys', () => {
  it('generates readable, well-formed values', () => {
    expect(newReportId()).toMatch(/^LM-[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/)
    expect(newAccessKey()).toMatch(/^([0-9A-HJKMNP-TV-Z]{5}-){5}[0-9A-HJKMNP-TV-Z]{5}$/)
    expect(new Set(Array.from({ length: 200 }, newAccessKey)).size).toBe(200)
  })

  it('forgives case, spacing and look-alike characters', () => {
    const id = newReportId()
    expect(normalizeReportId(id.toLowerCase().replaceAll('-', ' '))).toBe(id)
    expect(normalizeReportId(id.slice(3))).toBe(id)
    expect(normalizeAccessKey('ioL0o-ABCDE-FGHJK-MNPQR-STVWX-YZ123')).toBe('10100-ABCDE-FGHJK-MNPQR-STVWX-YZ123')
  })

  it('rejects values that cannot be valid', () => {
    expect(normalizeReportId('LM-123')).toBeNull()
    expect(normalizeAccessKey('too-short')).toBeNull()
    expect(normalizeAccessKey('UUUUU-UUUUU-UUUUU-UUUUU-UUUUU-UUUUU')).toBeNull()
  })
})
