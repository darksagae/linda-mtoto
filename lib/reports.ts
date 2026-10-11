import { LIMITS, type CategoryId, type OngoingId, type PlatformId, type StartedId } from './catalog'
import { authHash, contentKey, hashesMatch, open, seal } from './crypto'
import { db } from './db'
import { newAccessKey, newReportId, normalizeAccessKey, normalizeReportId } from './keys'
import { buildSafetyPlan, type PlanStep } from './safety-plan'
import type { CreateReportInput } from './schema'

type Payload = {
  category: CategoryId
  platform: PlatformId
  started: StartedId
  ongoing: OngoingId
  summary: string
  evidence: string
  completedSteps: string[]
}

export type Note = { id: number; body: string; createdAt: string }

export type ReportView = Omit<Payload, 'completedSteps'> & {
  id: string
  createdAt: string
  updatedAt: string
  plan: PlanStep[]
  completedSteps: string[]
  notes: Note[]
}

type ReportRow = { id: string; auth_hash: string; payload: string; created_at: string; updated_at: string }
type NoteRow = { id: number; payload: string; created_at: string }

export class NoteLimitError extends Error {}

const reportContext = (id: string) => `report:${id}`
const noteContext = (id: string) => `note:${id}`

function now() {
  return new Date().toISOString()
}

function toView(row: ReportRow, key: Buffer): ReportView {
  const payload = open<Payload>(key, row.payload, reportContext(row.id))
  const plan = buildSafetyPlan(payload)
  const notes = (
    db().prepare('SELECT id, payload, created_at FROM notes WHERE report_id = ? ORDER BY id').all(row.id) as NoteRow[]
  ).map((note) => ({
    id: note.id,
    body: open<{ body: string }>(key, note.payload, noteContext(row.id)).body,
    createdAt: note.created_at,
  }))
  return {
    ...payload,
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    plan,
    completedSteps: payload.completedSteps.filter((id) => plan.some((step) => step.id === id)),
    notes,
  }
}

type Unlocked = { row: ReportRow; key: Buffer; payload: Payload }

/** Finds a report and proves the access key is right. Returns null otherwise. */
function unlock(rawId: string, rawKey: string): Unlocked | null {
  const id = normalizeReportId(rawId)
  const accessKey = normalizeAccessKey(rawKey)
  if (!id || !accessKey) return null
  const row = db().prepare('SELECT * FROM reports WHERE id = ?').get(id) as ReportRow | undefined
  const hash = authHash(accessKey)
  if (!row || !hashesMatch(row.auth_hash, hash)) return null
  const key = contentKey(accessKey, id)
  return { row, key, payload: open<Payload>(key, row.payload, reportContext(id)) }
}

export function createReport(input: CreateReportInput) {
  const accessKey = newAccessKey()
  const payload: Payload = {
    category: input.category,
    platform: input.platform,
    started: input.started,
    ongoing: input.ongoing,
    summary: input.summary,
    evidence: input.evidence,
    completedSteps: [],
  }
  const created = now()
  const insert = db().prepare(
    'INSERT INTO reports (id, auth_hash, payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
  )
  for (let attempt = 0; ; attempt++) {
    const id = newReportId()
    const key = contentKey(accessKey, id)
    try {
      insert.run(id, authHash(accessKey), seal(key, payload, reportContext(id)), created, created)
      const row = db().prepare('SELECT * FROM reports WHERE id = ?').get(id) as ReportRow
      return { accessKey, report: toView(row, key) }
    } catch (error) {
      // Retry only on the (astronomically unlikely) ID collision.
      if (attempt < 3 && String(error).includes('UNIQUE')) continue
      throw error
    }
  }
}

export function getReport(id: string, accessKey: string): ReportView | null {
  const unlocked = unlock(id, accessKey)
  return unlocked && toView(unlocked.row, unlocked.key)
}

export function setCompletedSteps(id: string, accessKey: string, completedSteps: string[]): ReportView | null {
  const unlocked = unlock(id, accessKey)
  if (!unlocked) return null
  const { row, key, payload } = unlocked
  const valid = new Set(buildSafetyPlan(payload).map((step) => step.id))
  const next = { ...payload, completedSteps: [...new Set(completedSteps)].filter((step) => valid.has(step)) }
  const updated = now()
  const sealed = seal(key, next, reportContext(row.id))
  db().prepare('UPDATE reports SET payload = ?, updated_at = ? WHERE id = ?').run(sealed, updated, row.id)
  return toView({ ...row, payload: sealed, updated_at: updated }, key)
}

export function addNote(id: string, accessKey: string, body: string): ReportView | null {
  const unlocked = unlock(id, accessKey)
  if (!unlocked) return null
  const { row, key } = unlocked
  const { count } = db().prepare('SELECT COUNT(*) AS count FROM notes WHERE report_id = ?').get(row.id) as {
    count: number
  }
  if (count >= LIMITS.maxNotes) throw new NoteLimitError(`A report can hold up to ${LIMITS.maxNotes} notes.`)
  const created = now()
  db()
    .prepare('INSERT INTO notes (report_id, payload, created_at) VALUES (?, ?, ?)')
    .run(row.id, seal(key, { body }, noteContext(row.id)), created)
  db().prepare('UPDATE reports SET updated_at = ? WHERE id = ?').run(created, row.id)
  return toView({ ...row, updated_at: created }, key)
}

export function deleteReport(id: string, accessKey: string): boolean {
  const unlocked = unlock(id, accessKey)
  if (!unlocked) return false
  db().prepare('DELETE FROM reports WHERE id = ?').run(unlocked.row.id)
  return true
}
