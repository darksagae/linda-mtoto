import Link from 'next/link'
import { Logo } from './logo'
import { NavLinks } from './nav-links'
import { QuickExit } from './quick-exit'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-xl" aria-label="Linda Mtoto home">
          <Logo />
        </Link>
        <NavLinks className="hidden md:flex" />
        <QuickExit />
      </div>
      <NavLinks className="flex border-t border-line/70 px-2 py-1.5 md:hidden" />
    </header>
  )
}
