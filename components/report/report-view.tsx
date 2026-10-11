'use client'

import { Check, Download, Lock, NotebookPen, Send, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { api, type ReportView as Report } from '@/lib/api-client'
import { LIMITS, categoryTitle, ongoingLabel, platformLabel, startedLabel } from '@/lib/catalog'
import { CategoryIcon } from './category-icon'

const dateTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

export function ReportView({
  initial,
  accessKey,
  onClose,
  headingRef,
}: {
  initial: Report
  accessKey: string
  onClose?: () => void
  headingRef?: React.Ref<HTMLHeadingElement>
}) {
  const [report, setReport] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const latest = useRef(0)

  const done = report.completedSteps.length
  const total = report.plan.length

  async function toggle(stepId: string) {
    const previous = report.completedSteps
    const completedSteps = previous.includes(stepId) ? previous.filter((id) => id !== stepId) : [...previous, stepId]
    const request = ++latest.current
    setReport((r) => ({ ...r, completedSteps }))
    setError(null)
    try {
      const { report: saved } = await api.update(report.id, accessKey, { completedSteps })
      if (request === latest.current) setReport(saved)
    } catch (e) {
      if (request === latest.current) {
        setReport((r) => ({ ...r, completedSteps: previous }))
        setError((e as Error).message)
      }
    }
  }

  async function addNote(event: React.FormEvent) {
    event.preventDefault()
    if (!note.trim()) return setError('Write a note first.')
    setSavingNote(true)
    setError(null)
    try {
      const { report: saved } = await api.update(report.id, accessKey, { note })
      setReport(saved)
      setNote('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSavingNote(false)
    }
  }

  async function remove() {
    setDeleting(true)
    try {
      await api.remove(report.id, accessKey)
      dialog.current?.close()
      setDeleted(true)
    } catch (e) {
      dialog.current?.close()
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  function download() {
    const blob = new Blob([asText(report)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `linda-mtoto-${report.id}.txt`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  if (deleted) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-moss-soft text-moss">
          <Check className="size-7" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-3xl font-semibold">
          Your report has been deleted
        </h2>
        <p className="mt-3 text-ink-soft">
          Your report, safety plan and notes have been removed from the server. Copies you downloaded are not affected.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </div>
    )
  }

  const notes = [...report.notes].reverse()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-iris text-on-iris">
            <CategoryIcon category={report.category} className="size-7" />
          </span>
          <div>
            <p className="text-sm text-ink-soft">
              <span className="font-mono font-semibold text-ink">{report.id}</span> · Saved {dateTime(report.createdAt)}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight">
              {categoryTitle(report.category)}
            </h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-moss-soft px-4 py-2 text-sm font-semibold text-moss">
          <Lock className="size-4" aria-hidden="true" /> Encrypted · only you can open this
        </span>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-danger-soft px-5 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="card p-6 sm:p-8" aria-labelledby="plan-heading">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h3 id="plan-heading" className="font-display text-2xl font-semibold">
                Your safety plan
              </h3>
              <p className="text-sm text-ink-soft" aria-live="polite">
                {done} of {total} steps done
              </p>
            </div>
            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-sunken"
              role="progressbar"
              aria-label="Safety plan progress"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
            >
              <div
                className="h-full rounded-full bg-iris transition-[width] duration-500"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
            <ol className="mt-6 space-y-3">
              {report.plan.map((step, index) => {
                const checked = report.completedSteps.includes(step.id)
                return (
                  <li key={step.id}>
                    <label
                      className={`flex cursor-pointer gap-4 rounded-3xl border p-5 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-iris ${
                        checked ? 'border-transparent bg-sunken' : 'border-line bg-paper hover:border-line-strong'
                      }`}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggle(step.id)} className="sr-only" />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition-colors ${
                          checked ? 'border-iris bg-iris text-on-iris' : 'border-line-strong text-ink-soft'
                        }`}
                      >
                        {checked ? <Check className="size-4" strokeWidth={3} /> : index + 1}
                      </span>
                      <span>
                        <span className={`block font-semibold ${checked ? 'text-ink-soft line-through' : ''}`}>
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm text-ink-soft">{step.detail}</span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className="card p-6 sm:p-8" aria-labelledby="notes-heading">
            <h3 id="notes-heading" className="flex items-center gap-2 font-display text-2xl font-semibold">
              <NotebookPen className="size-6 text-coral" aria-hidden="true" /> Notes and updates
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Add a note when something changes — what you did, who you told, anything new.
            </p>
            <form onSubmit={addNote} className="mt-5">
              <label htmlFor="note" className="sr-only">
                New note
              </label>
              <textarea
                id="note"
                rows={3}
                value={note}
                maxLength={LIMITS.noteMax}
                onChange={(e) => setNote(e.target.value)}
                className="field resize-y"
                placeholder="e.g. Blocked the account and told my aunt."
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="hint">
                  {note.length} / {LIMITS.noteMax}
                </span>
                <button className="btn btn-primary min-h-11" disabled={savingNote || !note.trim()}>
                  <Send className="size-4" aria-hidden="true" /> {savingNote ? 'Saving…' : 'Add note'}
                </button>
              </div>
            </form>
            {notes.length > 0 ? (
              <ol className="mt-6 space-y-4 border-l-2 border-line pl-5">
                {notes.map((n) => (
                  <li key={n.id} className="relative">
                    <span className="absolute top-1.5 -left-[1.6rem] size-3 rounded-full border-2 border-surface bg-coral" />
                    <p className="text-xs font-semibold text-ink-soft">{dateTime(n.createdAt)}</p>
                    <p className="mt-1 break-words whitespace-pre-wrap">{n.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-6 rounded-2xl bg-sunken px-5 py-4 text-sm text-ink-soft">No notes yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6" aria-labelledby="told-heading">
            <h3 id="told-heading" className="font-semibold">
              What you told us
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <Detail label="Where">{platformLabel(report.platform)}</Detail>
              <Detail label="Started">{startedLabel(report.started)}</Detail>
              <Detail label="Still happening">{ongoingLabel(report.ongoing)}</Detail>
              <Detail label="In your words">
                <span className="whitespace-pre-wrap">{report.summary}</span>
              </Detail>
              {report.evidence && (
                <Detail label="Evidence notes">
                  <span className="whitespace-pre-wrap">{report.evidence}</span>
                </Detail>
              )}
            </dl>
          </section>
          <section className="card space-y-3 p-6" aria-label="Report actions">
            <button type="button" onClick={download} className="btn btn-secondary w-full">
              <Download className="size-4" aria-hidden="true" /> Download a copy
            </button>
            <button type="button" onClick={() => dialog.current?.showModal()} className="btn btn-danger w-full">
              <Trash2 className="size-4" aria-hidden="true" /> Delete permanently
            </button>
            {onClose && (
              <button type="button" onClick={onClose} className="btn btn-ghost w-full">
                <X className="size-4" aria-hidden="true" /> Close report
              </button>
            )}
            <p className="pt-1 text-xs text-ink-soft">The downloaded copy never includes your access key.</p>
          </section>
        </aside>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-(--radius-card) bg-surface p-8 text-ink shadow-(--shadow-lift) backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        <h3 id="delete-title" className="font-display text-2xl font-semibold">
          Delete this report for good?
        </h3>
        <p className="mt-3 text-ink-soft">
          This removes your report, safety plan and all notes from the server. It cannot be undone.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => dialog.current?.close()}>
            Keep it
          </button>
          <button
            type="button"
            className="btn bg-danger text-white hover:brightness-110"
            onClick={remove}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete permanently'}
          </button>
        </div>
      </dialog>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-[0.08em] text-ink-soft uppercase">{label}</dt>
      <dd className="mt-1 break-words">{children}</dd>
    </div>
  )
}

function asText(report: Report) {
  const lines = [
    'LINDA MTOTO — PRIVATE REPORT COPY',
    '',
    `Report ID: ${report.id}`,
    `Saved: ${dateTime(report.createdAt)}`,
    `What happened: ${categoryTitle(report.category)}`,
    `Where: ${platformLabel(report.platform)}`,
    `Started: ${startedLabel(report.started)}`,
    `Still happening: ${ongoingLabel(report.ongoing)}`,
    '',
    'IN YOUR WORDS',
    report.summary,
    '',
    'EVIDENCE NOTES',
    report.evidence || 'None',
    '',
    `SAFETY PLAN (${report.completedSteps.length} of ${report.plan.length} done)`,
    ...report.plan.flatMap((step) => [
      `[${report.completedSteps.includes(step.id) ? 'x' : ' '}] ${step.title}`,
      `    ${step.detail}`,
    ]),
    '',
    'NOTES',
    ...(report.notes.length ? report.notes.map((n) => `- ${dateTime(n.createdAt)}: ${n.body}`) : ['None']),
    '',
    'This copy does not include your access key. Keep it somewhere private.',
  ]
  return lines.join('\n')
}
