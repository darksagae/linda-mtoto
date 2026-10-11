import type { Metadata } from 'next'
import { ReportWizard } from '@/components/report/wizard'

export const metadata: Metadata = { title: 'Make a private report' }

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <ReportWizard
        intro={
          <header className="mb-10 max-w-2xl">
            <span className="eyebrow">Private report</span>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Let’s write down what happened.
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              Four short steps. Take breaks whenever you need — nothing is saved until you choose to save it.
            </p>
          </header>
        }
      />
    </div>
  )
}
