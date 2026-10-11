'use client'

import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { api, type ReportView as Report } from '@/lib/api-client'
import { ReportView } from './report-view'

export function OpenReport() {
  const [id, setId] = useState('')
  const [key, setKey] = useState('')
  const [reveal, setReveal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [opened, setOpened] = useState<{ report: Report; key: string } | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!id.trim() || !key.trim()) return setError('Enter both your report ID and access key.')
    setLoading(true)
    setError(null)
    try {
      const { report } = await api.open(id.trim(), key.trim())
      setOpened({ report, key: key.trim() })
      setId('')
      setKey('')
      requestAnimationFrame(() => heading.current?.focus())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (opened) {
    return (
      <ReportView initial={opened.report} accessKey={opened.key} headingRef={heading} onClose={() => setOpened(null)} />
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={submit} noValidate className="card p-6 sm:p-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Open my report</h1>
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="report-id" className="label">
              Report ID
            </label>
            <input
              id="report-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="field font-mono tracking-wide uppercase"
              placeholder="LM-XXXXX-XXXXX"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
            />
          </div>
          <div>
            <label htmlFor="access-key" className="label">
              Access key
            </label>
            <div className="relative">
              <input
                id="access-key"
                type={reveal ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="field pr-14 font-mono tracking-wide"
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sunken hover:text-ink"
                aria-label={reveal ? 'Hide access key' : 'Show access key'}
                aria-pressed={reveal}
              >
                {reveal ? (
                  <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                  <Eye className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="hint mt-2">Dashes and capital letters are optional.</p>
          </div>
        </div>
        <p role="alert" className="mt-6 min-h-6 text-sm font-semibold text-danger">
          {error}
        </p>
        <button className="btn btn-primary mt-2 w-full" disabled={loading}>
          {loading ? 'Opening…' : 'Open my report'} <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="mt-6 text-sm text-ink-soft">
          Lost your key? It can’t be recovered — that keeps your report private.{' '}
          <Link href="/report" className="font-semibold text-iris hover:underline">
            Make a new report
          </Link>
        </p>
      </form>
    </div>
  )
}
