import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '@/lib/catalog'
import { buildSafetyPlan } from '@/lib/safety-plan'

describe('safety plan', () => {
  it('always starts with safety and ends with self-care', () => {
    for (const { id } of CATEGORIES) {
      const plan = buildSafetyPlan({ category: id, platform: 'none', ongoing: 'no' })
      expect(plan[0].id).toBe('safe-now')
      expect(plan.at(-1)?.id).toBe('look-after-yourself')
      expect(new Set(plan.map((s) => s.id)).size).toBe(plan.length)
    }
  })

  it('adds category, ongoing and platform steps transparently', () => {
    const plan = buildSafetyPlan({ category: 'extortion', platform: 'instagram', ongoing: 'yes' }).map((s) => s.id)
    expect(plan).toContain('do-not-pay')
    expect(plan).toContain('take-a-break')
    expect(plan).toContain('platform-help')
    const quiet = buildSafetyPlan({ category: 'extortion', platform: 'sms', ongoing: 'no' }).map((s) => s.id)
    expect(quiet).not.toContain('take-a-break')
    expect(quiet).not.toContain('platform-help')
  })
})
