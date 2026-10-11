// Browser-side calls to the reports API. Keys travel only in the
// Authorization header, never in URLs.
import type { ReportView } from './reports'

export type { ReportView }

async function call<T>(path: string, init: RequestInit & { key?: string } = {}): Promise<T> {
  const { key, headers, ...rest } = init
  let response: Response
  try {
    response = await fetch(path, {
      ...rest,
      cache: 'no-store',
      headers: {
        ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
        ...headers,
      },
    })
  } catch {
    throw new Error('We could not reach the server. Check your connection and try again.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? 'Something went wrong. Please try again.')
  return data as T
}

export const api = {
  create: (body: unknown) =>
    call<{ accessKey: string; report: ReportView }>('/api/reports', { method: 'POST', body: JSON.stringify(body) }),
  open: (id: string, key: string) => call<{ report: ReportView }>(`/api/reports/${encodeURIComponent(id)}`, { key }),
  update: (id: string, key: string, body: { completedSteps: string[] } | { note: string }) =>
    call<{ report: ReportView }>(`/api/reports/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      key,
      body: JSON.stringify(body),
    }),
  remove: (id: string, key: string) =>
    call<{ deleted: true }>(`/api/reports/${encodeURIComponent(id)}`, { method: 'DELETE', key }),
}
