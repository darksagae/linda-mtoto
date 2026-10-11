'use client'

import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api, type ReportView as Report } from '@/lib/api-client'
import {
  CATEGORIES,
  LIMITS,
  ONGOING,
  PLATFORMS,
  STARTED,
  categoryTitle,
  ongoingLabel,
  platformLabel,
  startedLabel,
  type CategoryId,
  type OngoingId,
  type PlatformId,
  type StartedId,
} from '@/lib/catalog'
import { CategoryIcon } from './category-icon'
import { KeyCard } from './key-card'
import { ReportView } from './report-view'

type Form = {
  category: CategoryId | ''
  platform: PlatformId
  started: StartedId
  ongoing: OngoingId
  summary: string
  evidence: string
  consent: boolean
}

const EMPTY: Form = {
  category: '',
  platform: 'none',
  started: 'unsure',
  ongoing: 'unsure',
  summary: '',
  evidence: '',
  consent: false,
}

const STEPS = ['What happened', 'A little more', 'Evidence notes', 'Check and save'] as const

function validate(step: number, form: Form): string | null {
  if (step === 0 && !form.category) return 'Choose the option that fits best. You can pick “Something else”.'
  if (step === 1) {
    const length = form.summary.trim().length
    if (length < LIMITS.summaryMin) return `Write at least ${LIMITS.summaryMin} characters about what happened.`
    if (length > LIMITS.summaryMax) return `Keep your summary under ${LIMITS.summaryMax} characters.`
  }
  if (step === 2 && form.evidence.length > LIMITS.evidenceMax) {
    return `Keep evidence notes under ${LIMITS.evidenceMax} characters.`
  }
  if (step === 3 && !form.consent) return 'Please tick the box to confirm you understand how your report is saved.'
  return null
}

export function ReportWizard() {
  const [form, setForm] = useState<Form>(EMPTY)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ accessKey: string; report: Report } | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, result, showPlan])

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError(null)
  }

  function next() {
    const problem = validate(step, form)
    if (problem) return setError(problem)
    setError(null)
    setStep((s) => s + 1)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (step < STEPS.length - 1) return next()
    const problem = validate(step, form)
    if (problem) return setError(problem)
    setSubmitting(true)
    setError(null)
    try {
      setResult(await api.create(form))
      setForm(EMPTY)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (result && showPlan) {
    return <ReportView initial={result.report} accessKey={result.accessKey} headingRef={heading} />
  }

  if (result) {
    return (
      <KeyCard
        reportId={result.report.id}
        accessKey={result.accessKey}
        onContinue={() => setShowPlan(true)}
        headingRef={heading}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={submit} noValidate className="card p-6 sm:p-10">
        <div className="mb-8">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{STEPS[step]}</span>
            <span className="text-ink-soft">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken">
            <div
              className="h-full rounded-full bg-iris transition-[width] duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {step === 0 && (
          <fieldset>
            <legend className="contents">
              <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight">
                What happened?
              </h2>
            </legend>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((category) => {
                const checked = form.category === category.id
                return (
                  <label
                    key={category.id}
                    className={`relative flex cursor-pointer gap-4 rounded-3xl border-2 p-5 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-iris ${
                      checked ? 'border-iris bg-iris-soft' : 'border-line bg-paper hover:border-line-strong'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={checked}
                      onChange={() => set('category', category.id)}
                      className="sr-only"
                    />
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                        checked ? 'bg-iris text-on-iris' : 'bg-surface text-iris'
                      }`}
                    >
                      <CategoryIcon category={category.id} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{category.title}</span>
                      <span className="mt-1 block text-sm text-ink-soft">{category.description}</span>
                    </span>
                    {checked && (
                      <Check className="absolute top-4 right-4 size-5 text-iris" strokeWidth={3} aria-hidden="true" />
                    )}
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight">
              Tell us a little more
            </h2>
            <p className="mt-2 text-ink-soft">
              Share only what feels safe. Please don’t include anyone’s full name, phone number or address.
            </p>
            <div className="mt-8 space-y-7">
              <div>
                <label htmlFor="summary" className="label">
                  What happened, in your own words
                </label>
                <textarea
                  id="summary"
                  rows={6}
                  value={form.summary}
                  maxLength={LIMITS.summaryMax}
                  onChange={(e) => set('summary', e.target.value)}
                  aria-describedby="summary-count"
                  className="field min-h-40 resize-y"
                  placeholder="For example: “Someone from my class keeps sending me mean messages and posting about me in a group chat.”"
                />
                <p id="summary-count" className="hint mt-2 text-right">
                  {form.summary.trim().length} / {LIMITS.summaryMax}
                </p>
              </div>
              <div>
                <label htmlFor="platform" className="label">
                  Where is it happening? <span className="font-normal text-ink-soft">Optional</span>
                </label>
                <select
                  id="platform"
                  value={form.platform}
                  onChange={(e) => set('platform', e.target.value as PlatformId)}
                  className="field appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23857d9a' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <ChipGroup
                legend="When did it start?"
                name="started"
                options={STARTED}
                value={form.started}
                onChange={(v) => set('started', v)}
              />
              <ChipGroup
                legend="Is it still happening?"
                name="ongoing"
                options={ONGOING}
                value={form.ongoing}
                onChange={(v) => set('ongoing', v)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight">
              Evidence notes <span className="text-xl font-normal text-ink-soft">(optional)</span>
            </h2>
            <p className="mt-2 text-ink-soft">
              Dates, usernames and links help. Leave out intimate images, passwords and your full name.
            </p>
            <label htmlFor="evidence" className="label mt-6">
              Your notes
            </label>
            <textarea
              id="evidence"
              rows={5}
              value={form.evidence}
              maxLength={LIMITS.evidenceMax}
              onChange={(e) => set('evidence', e.target.value)}
              className="field min-h-32 resize-y"
              placeholder="e.g. 12 March, around 8pm — messages from @fake.account in the class group."
            />
            <p className="hint mt-2 text-right">
              {form.evidence.length} / {LIMITS.evidenceMax}
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 ref={heading} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight">
              Check and save
            </h2>
            <dl className="mt-8 divide-y divide-line rounded-3xl border border-line">
              <ReviewRow label="What happened" onEdit={() => setStep(0)}>
                {categoryTitle(form.category)}
              </ReviewRow>
              <ReviewRow label="In your words" onEdit={() => setStep(1)}>
                <span className="whitespace-pre-wrap">{form.summary.trim()}</span>
              </ReviewRow>
              <ReviewRow label="Details" onEdit={() => setStep(1)}>
                {platformLabel(form.platform)} · Started: {startedLabel(form.started)} · {ongoingLabel(form.ongoing)}
              </ReviewRow>
              <ReviewRow label="Evidence notes" onEdit={() => setStep(2)}>
                <span className="whitespace-pre-wrap">{form.evidence.trim() || 'None added'}</span>
              </ReviewRow>
            </dl>
            <label className="mt-8 flex cursor-pointer gap-4 rounded-3xl bg-sunken p-5">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-iris"
              />
              <span className="text-sm">
                I understand my report is saved, encrypted, on this prototype server. It is{' '}
                <strong>not sent to any organisation</strong> and does not request emergency help.
              </span>
            </label>
          </div>
        )}

        <p role="alert" className="mt-6 min-h-6 text-sm font-semibold text-danger">
          {error}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => (setError(null), setStep((s) => s - 1))}
              className="btn btn-ghost -ml-4"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="submit" className="btn btn-primary">
              Continue <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Lock className="size-4" aria-hidden="true" />
              {submitting ? 'Saving…' : 'Save my private report'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

function ChipGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="label">
        {legend} <span className="font-normal text-ink-soft">Optional</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-iris ${
              value === option.id
                ? 'border-iris bg-iris text-on-iris'
                : 'border-line-strong bg-paper text-ink hover:border-ink-soft'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ReviewRow({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-5 sm:flex-row sm:gap-6">
      <dt className="w-36 shrink-0 text-sm font-semibold text-ink-soft">{label}</dt>
      <dd className="flex-1 break-words">{children}</dd>
      <dd>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-iris hover:underline">
          Edit<span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      </dd>
    </div>
  )
}
