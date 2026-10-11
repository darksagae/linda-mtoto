import { ReportWizard } from '@/components/report/wizard'

// The app opens straight on the report form.
export default function Home() {
  return (
    <div className="px-4 py-8 sm:px-6 md:py-12">
      <h1 className="sr-only">Make a private report</h1>
      <ReportWizard />
      <p className="mx-auto mt-6 max-w-3xl rounded-2xl bg-coral-soft px-5 py-4 text-sm">
        <strong>In danger right now?</strong> Go somewhere safe and contact a trusted adult or local emergency services.
      </p>
    </div>
  )
}
