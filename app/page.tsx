import { ArrowRight, BookOpen, KeyRound, NotebookPen } from 'lucide-react'
import Link from 'next/link'

const ACTIONS = [
  {
    href: '/report',
    icon: NotebookPen,
    title: 'Make a private report',
    body: 'Write down what happened and get a safety plan.',
  },
  { href: '/open', icon: KeyRound, title: 'Open my report', body: 'Use your report ID and access key.' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">What would you like to do?</h1>
      <p className="mt-2 text-ink-soft">Private. No name, phone number or account needed.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {ACTIONS.map(({ href, icon: Icon, title, body }) => (
          <li key={href}>
            <Link
              href={href}
              className="card group flex h-full flex-col p-6 transition-colors hover:border-iris sm:p-7"
            >
              <Icon className="size-7 text-iris" aria-hidden="true" />
              <span className="mt-4 text-xl font-semibold">{title}</span>
              <span className="mt-1 text-ink-soft">{body}</span>
              <ArrowRight
                className="mt-6 size-5 text-iris transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/toolkit"
        className="mt-4 flex items-center gap-3 rounded-(--radius-card) border border-line px-6 py-4 font-semibold hover:border-iris"
      >
        <BookOpen className="size-5 text-iris" aria-hidden="true" /> Safety tips
        <ArrowRight className="ml-auto size-4 text-ink-soft" aria-hidden="true" />
      </Link>

      <p className="mt-8 rounded-2xl bg-coral-soft px-5 py-4 text-sm">
        <strong>In danger right now?</strong> Go somewhere safe and contact a trusted adult or local emergency services.
      </p>
    </div>
  )
}
