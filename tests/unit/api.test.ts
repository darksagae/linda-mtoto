import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/reports/route'
import { DELETE, GET, PATCH } from '@/app/api/reports/[id]/route'
import './setup'

const base = 'http://localhost:3000'
const body = {
  category: 'impersonation',
  platform: 'instagram',
  started: 'week',
  ongoing: 'unsure',
  summary: 'Fictional: a fake account is using my photos.',
  evidence: '',
  consent: true,
}

function request(path: string, method: string, data?: unknown, headers: Record<string, string> = {}) {
  return new Request(base + path, {
    method,
    headers: { host: 'localhost:3000', 'content-type': 'application/json', ...headers },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

async function create() {
  const response = await POST(request('/api/reports', 'POST', body))
  expect(response.status).toBe(201)
  return (await response.json()) as { accessKey: string; report: { id: string } }
}

describe('reports API', () => {
  it('validates input and requires consent', async () => {
    expect((await POST(request('/api/reports', 'POST', { ...body, consent: false }))).status).toBe(400)
    expect((await POST(request('/api/reports', 'POST', { ...body, category: ['x'] }))).status).toBe(400)
    expect((await POST(request('/api/reports', 'POST', { ...body, summary: 'short' }))).status).toBe(400)
    const wrongType = await POST(request('/api/reports', 'POST', body, { 'content-type': 'text/plain' }))
    expect(wrongType.status).toBe(415)
  })

  it('rejects cross-site writes', async () => {
    const response = await POST(request('/api/reports', 'POST', body, { origin: 'https://evil.example' }))
    expect(response.status).toBe(403)
    const fetchSite = await POST(request('/api/reports', 'POST', body, { 'sec-fetch-site': 'cross-site' }))
    expect(fetchSite.status).toBe(403)
  })

  it('runs the full private lifecycle', async () => {
    const { accessKey, report } = await create()
    const path = `/api/reports/${report.id}`
    const auth = { authorization: `Bearer ${accessKey}` }

    expect((await GET(request(path, 'GET'), ctx(report.id))).status).toBe(404)
    expect((await GET(request(path, 'GET', undefined, { authorization: 'Bearer nope' }), ctx(report.id))).status).toBe(
      404,
    )

    const opened = await GET(request(path, 'GET', undefined, auth), ctx(report.id))
    expect(opened.status).toBe(200)
    const view = (await opened.json()).report
    expect(view.summary).toBe(body.summary)
    expect(JSON.stringify(view)).not.toContain(accessKey)

    const progress = await PATCH(request(path, 'PATCH', { completedSteps: ['safe-now'] }, auth), ctx(report.id))
    expect((await progress.json()).report.completedSteps).toEqual(['safe-now'])
    const note = await PATCH(request(path, 'PATCH', { note: 'Fictional follow-up.' }, auth), ctx(report.id))
    expect((await note.json()).report.notes).toHaveLength(1)
    expect((await PATCH(request(path, 'PATCH', { note: '' }, auth), ctx(report.id))).status).toBe(400)
    expect((await PATCH(request(path, 'PATCH', { note: 'x', completedSteps: [] }, auth), ctx(report.id))).status).toBe(
      400,
    )

    expect(
      (await DELETE(request(path, 'DELETE', undefined, { authorization: 'Bearer nope' }), ctx(report.id))).status,
    ).toBe(404)
    expect((await DELETE(request(path, 'DELETE', undefined, auth), ctx(report.id))).status).toBe(200)
    expect((await GET(request(path, 'GET', undefined, auth), ctx(report.id))).status).toBe(404)
  })

  it('rate-limits report creation', async () => {
    for (let i = 0; i < 10; i++) await create()
    expect((await POST(request('/api/reports', 'POST', body))).status).toBe(429)
  })
})
