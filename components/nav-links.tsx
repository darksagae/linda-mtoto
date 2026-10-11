'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/report', label: 'Make a report' },
  { href: '/open', label: 'Open my report' },
  { href: '/toolkit', label: 'Safety tips' },
]

export function NavLinks({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className={`items-center justify-center gap-1 ${className}`}>
      {LINKS.map(({ href, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-4 ${
              active ? 'bg-iris-soft text-iris' : 'text-ink-soft hover:bg-sunken hover:text-ink'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
