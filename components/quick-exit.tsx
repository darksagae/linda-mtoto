'use client'

import { LogOut } from 'lucide-react'
import { useEffect } from 'react'

// A neutral page to land on. location.replace() keeps this site out of the
// back button's history entry.
const EXIT_URL = 'https://www.google.com/search?q=weather'

export function quickExit() {
  try {
    sessionStorage.clear()
  } catch {}
  document.body.replaceChildren()
  window.location.replace(EXIT_URL)
}

export function QuickExit() {
  useEffect(() => {
    let last = 0
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const now = Date.now()
      if (now - last < 800) quickExit()
      last = now
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <button
      type="button"
      onClick={quickExit}
      className="btn min-h-11 bg-coral px-4 text-sm text-white shadow-[0_8px_20px_-10px_var(--color-coral)] hover:brightness-110 sm:px-5 dark:text-paper"
      title="Leave this site quickly. Shortcut: press Esc twice."
    >
      <LogOut className="size-4" aria-hidden="true" />
      Quick exit
      <kbd className="ml-1 hidden rounded-md bg-white/20 px-1.5 py-0.5 font-sans text-[0.7rem] font-medium lg:inline">
        Esc Esc
      </kbd>
    </button>
  )
}
