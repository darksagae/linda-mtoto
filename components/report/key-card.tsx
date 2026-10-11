'use client'

import { ArrowRight, KeyRound, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { CopyButton } from '../copy-button'

export function KeyCard({
  reportId,
  accessKey,
  onContinue,
  headingRef,
}: {
  reportId: string
  accessKey: string
  onContinue: () => void
  headingRef: React.Ref<HTMLHeadingElement>
}) {
  const [saved, setSaved] = useState(false)
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        <div className="bg-iris px-6 py-8 text-on-iris sm:px-10">
          <KeyRound className="size-9" aria-hidden="true" />
          <h2 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-3xl font-semibold tracking-tight">
            Your report is saved. Now save your key.
          </h2>
          <p className="mt-2 opacity-85">
            You need both of these to open your report again. They will only be shown this once.
          </p>
        </div>
        <div className="space-y-5 p-6 sm:p-10">
          <Secret label="Report ID" value={reportId} />
          <Secret label="Access key" value={accessKey} />
          <div className="flex gap-3 rounded-3xl bg-coral-soft p-5 text-sm">
            <TriangleAlert className="size-5 shrink-0 text-coral" aria-hidden="true" />
            <p>
              <strong>We cannot recover a lost key</strong> — that is what keeps your report private. Write both down or
              keep them somewhere only you can see. Avoid shared phones, photos or group chats.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 pt-2">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
              className="size-5 shrink-0 accent-iris"
            />
            <span className="font-medium">I have saved my report ID and access key</span>
          </label>
          <button type="button" className="btn btn-primary w-full" disabled={!saved} onClick={onContinue}>
            Show my safety plan <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Secret({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <p className="text-xs font-bold tracking-[0.1em] text-ink-soft uppercase">{label}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <code className="font-mono text-lg font-semibold tracking-wide break-all sm:text-xl" data-testid={label}>
          {value}
        </code>
        <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />
      </div>
    </div>
  )
}
