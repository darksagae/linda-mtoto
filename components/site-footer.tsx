import Link from 'next/link'
import { LogoMark } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="font-display text-lg font-semibold">Linda Mtoto</span>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            A private place for young people to record online harm and take the next safe step. Built for dignity,
            privacy and access.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Use Linda Mtoto</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>
              <Link className="hover:text-ink" href="/report">
                Make a private report
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href="/open">
                Open my report
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href="/toolkit">
                Safety toolkit
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Our promises</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>No accounts or sign-up</li>
            <li>No analytics or trackers</li>
            <li>Encrypted with your own key</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-soft sm:px-6">
          Prototype for demonstration. Not an emergency or staffed support service — no organisation receives your
          report. If you are in danger, contact a trusted adult or local emergency services.
        </p>
      </div>
    </footer>
  )
}
