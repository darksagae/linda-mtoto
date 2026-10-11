// Fixed-window, in-memory rate limiting. Per server instance only; use a
// shared store (e.g. Redis) when running more than one instance.
import { HttpError } from './http'

type Window = { count: number; resetAt: number }
const windows = new Map<string, Window>()

export const RULES = {
  create: { limit: 10, windowMs: 10 * 60_000 },
  access: { limit: 120, windowMs: 60_000 },
} as const

export function rateLimit(rule: keyof typeof RULES, client: string) {
  const { limit, windowMs } = RULES[rule]
  const key = `${rule}:${client}`
  const time = Date.now()
  const current = windows.get(key)
  if (!current || current.resetAt <= time) {
    windows.set(key, { count: 1, resetAt: time + windowMs })
    if (windows.size > 10_000) {
      for (const [k, w] of windows) if (w.resetAt <= time) windows.delete(k)
    }
    return
  }
  current.count += 1
  if (current.count > limit) throw new HttpError(429, 'Too many requests. Please wait a few minutes and try again.')
}

export function resetRateLimits() {
  windows.clear()
}
