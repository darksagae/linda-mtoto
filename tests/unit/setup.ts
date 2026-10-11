import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach } from 'vitest'
import { closeAll } from '@/lib/db'
import { resetRateLimits } from '@/lib/rate-limit'

let dir = ''

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'linda-'))
  process.env.LINDA_DB = join(dir, 'reports.sqlite3')
  resetRateLimits()
})

afterEach(() => {
  closeAll()
  rmSync(dir, { recursive: true, force: true })
})
