import { describe, expect, it } from 'vitest'
import { authHash, contentKey, hashesMatch, open, seal } from '@/lib/crypto'

describe('content encryption', () => {
  it('round-trips with the right key and context', () => {
    const key = contentKey('KEY-A', 'LM-1')
    const sealed = seal(key, { summary: 'fictional' }, 'report:LM-1')
    expect(sealed).not.toContain('fictional')
    expect(open(key, sealed, 'report:LM-1')).toEqual({ summary: 'fictional' })
  })

  it('fails with a different key, report or context', () => {
    const sealed = seal(contentKey('KEY-A', 'LM-1'), { a: 1 }, 'report:LM-1')
    expect(() => open(contentKey('KEY-B', 'LM-1'), sealed, 'report:LM-1')).toThrow()
    expect(() => open(contentKey('KEY-A', 'LM-2'), sealed, 'report:LM-1')).toThrow()
    expect(() => open(contentKey('KEY-A', 'LM-1'), sealed, 'note:LM-1')).toThrow()
  })

  it('compares hashes safely', () => {
    expect(hashesMatch(authHash('a'), authHash('a'))).toBe(true)
    expect(hashesMatch(authHash('a'), authHash('b'))).toBe(false)
    expect(hashesMatch(authHash('a'), 'abcd')).toBe(false)
  })
})
