import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { closeAll, databasePath } from '@/lib/db'
import { addNote, createReport, deleteReport, getReport, setCompletedSteps } from '@/lib/reports'
import { createReportSchema } from '@/lib/schema'
import './setup'

const input = createReportSchema.parse({
  category: 'harassment',
  platform: 'whatsapp',
  ongoing: 'yes',
  summary: 'Fictional: repeated unwanted messages from a classmate.',
  evidence: 'Fictional: messages on 3 and 4 March.',
  consent: true,
})

describe('report repository', () => {
  it('creates, reopens after restart and never stores plaintext', () => {
    const { accessKey, report } = createReport(input)
    expect(report.plan.length).toBeGreaterThan(3)
    closeAll()
    const raw = readFileSync(databasePath()).toString('latin1')
    expect(raw).not.toContain('unwanted messages')
    expect(raw).not.toContain(accessKey)
    const again = getReport(report.id.toLowerCase(), accessKey.replaceAll('-', ''))
    expect(again?.summary).toBe(input.summary)
    expect(again?.evidence).toBe(input.evidence)
  })

  it('refuses wrong keys and unknown IDs', () => {
    const { report } = createReport(input)
    const { accessKey: otherKey } = createReport(input)
    expect(getReport(report.id, otherKey)).toBeNull()
    expect(getReport('LM-00000-00000', otherKey)).toBeNull()
    expect(getReport(report.id, '')).toBeNull()
    expect(deleteReport(report.id, otherKey)).toBe(false)
  })

  it('tracks plan progress, keeps only real steps and stores notes', () => {
    const { accessKey, report } = createReport(input)
    const updated = setCompletedSteps(report.id, accessKey, ['safe-now', 'safe-now', 'made-up'])
    expect(updated?.completedSteps).toEqual(['safe-now'])
    const noted = addNote(report.id, accessKey, 'Fictional: blocked the account today.')
    expect(noted?.notes.map((n) => n.body)).toEqual(['Fictional: blocked the account today.'])
    closeAll()
    expect(getReport(report.id, accessKey)?.completedSteps).toEqual(['safe-now'])
  })

  it('deletes the report and its notes', () => {
    const { accessKey, report } = createReport(input)
    addNote(report.id, accessKey, 'note')
    expect(deleteReport(report.id, accessKey)).toBe(true)
    expect(getReport(report.id, accessKey)).toBeNull()
  })
})
