import type { Metadata } from 'next'
import { ReportWizard } from '@/components/report/wizard'

export const metadata: Metadata = { title: 'Make a private report' }

export default function ReportPage() {
  return (
    <div className="px-4 py-8 sm:px-6 md:py-12">
      <h1 className="sr-only">Make a private report</h1>
      <ReportWizard />
    </div>
  )
}
