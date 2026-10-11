import type { Metadata } from 'next'
import { OpenReport } from '@/components/report/open-form'

export const metadata: Metadata = { title: 'Open my report' }

export default function OpenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <OpenReport />
    </div>
  )
}
