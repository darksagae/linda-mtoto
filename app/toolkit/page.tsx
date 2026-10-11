import { ArrowRight, Ban, HeartHandshake, KeyRound, NotebookPen, ShieldAlert, Sun, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Safety toolkit',
  description: 'Practical, step-by-step guides for staying safe online and getting support.',
}

type Guide = {
  id: string
  icon: LucideIcon
  title: string
  intro: string
  steps: string[]
  quote?: { label: string; lines: string[] }
}

const GUIDES: Guide[] = [
  {
    id: 'threats',
    icon: ShieldAlert,
    title: 'If someone is threatening you',
    intro:
      'Someone demanding money, photos or favours — or threatening to share something about you — is trying to scare you into acting fast. You can slow down.',
    steps: [
      'Stop replying, but do not delete the conversation yet.',
      'Do not pay and do not send anything more. Paying rarely makes it stop.',
      'Write down the account name, profile link, dates and what was demanded.',
      'Block and report the account on the platform.',
      'Tell an adult you trust. You will not be in trouble — the person threatening you is the one doing wrong.',
    ],
  },
  {
    id: 'accounts',
    icon: KeyRound,
    title: 'Lock down your accounts',
    intro: 'A few minutes of settings can stop someone getting into your accounts or finding out more about you.',
    steps: [
      'Use a different password for every account, starting with your email.',
      'Turn on two-step verification so a password alone is not enough.',
      'Check signed-in devices and connected apps; remove anything you do not recognise.',
      'Make your profiles private and review who can message, tag or find you.',
      'Check your recovery email and phone number are still yours.',
    ],
  },
  {
    id: 'evidence',
    icon: NotebookPen,
    title: 'Keep evidence safely',
    intro: 'A simple record helps others understand what happened. Your safety matters more than evidence.',
    steps: [
      'Note the date, time, app and username for each incident.',
      'Copy profile links or message links where you can.',
      'Screenshots of messages can help — only if it feels safe to take them.',
      'Never save or forward intimate images, even as evidence. Write down where they appeared instead.',
      'Keep your notes somewhere private, like a Linda Mtoto report.',
    ],
  },
  {
    id: 'block',
    icon: Ban,
    title: 'Block, mute and report',
    intro: 'Every major app has tools to control who can reach you. Using them is not overreacting.',
    steps: [
      'Mute hides someone’s posts or messages without them knowing.',
      'Restrict or limit lets you control replies and comments quietly.',
      'Block stops someone contacting you or seeing your profile.',
      'Report tells the platform. The person you report is usually not told who reported them.',
      'Only use the official app or website to report — never links sent to you in messages.',
    ],
  },
  {
    id: 'trusted',
    icon: HeartHandshake,
    title: 'Talk to someone you trust',
    intro:
      'It can be hard to start the conversation. A parent, carer, teacher, school counsellor, relative or older friend can help you decide what to do.',
    steps: [
      'Choose a time and place where you feel comfortable.',
      'You don’t have to share every detail — start with what you’re ready to say.',
      'If the first person doesn’t help, try someone else. You deserve to be heard.',
    ],
    quote: {
      label: 'Ways to start',
      lines: [
        '“Something is happening online and I don’t know what to do.”',
        '“Can I show you something? I need help working out what to do next.”',
        '“I’m worried about some messages I’ve been getting.”',
      ],
    },
  },
  {
    id: 'wellbeing',
    icon: Sun,
    title: 'Look after yourself',
    intro: 'Online harm can leave you feeling anxious, angry, embarrassed or numb. All of those feelings are normal.',
    steps: [
      'Take breaks from your phone and turn off notifications if they make you anxious.',
      'Do something that calms you — music, a walk, time with people you like.',
      'Try not to check the harmful content over and over.',
      'If you feel overwhelmed or unsafe, tell someone you trust straight away.',
    ],
  },
]

export default function ToolkitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <header className="max-w-2xl">
        <span className="eyebrow">Safety toolkit</span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Small steps. More control.
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Practical guides you can use right now — no report needed. Read them in any order.
        </p>
      </header>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Guides" className="lg:sticky lg:top-28">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {GUIDES.map(({ id, title, icon: Icon }) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-ink-soft hover:bg-sunken hover:text-ink lg:rounded-2xl lg:whitespace-normal"
                >
                  <Icon className="size-4 shrink-0 text-iris" aria-hidden="true" />
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {GUIDES.map(({ id, icon: Icon, title, intro, steps, quote }) => (
            <section key={id} id={id} className="card p-6 sm:p-10" aria-labelledby={`${id}-title`}>
              <span className="grid size-12 place-items-center rounded-2xl bg-iris-soft text-iris">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 id={`${id}-title`} className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-ink-soft">{intro}</p>
              <ol className="mt-6 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken text-xs font-bold text-ink-soft">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              {quote && (
                <div className="mt-6 rounded-3xl bg-sunken p-6">
                  <p className="text-xs font-bold tracking-[0.1em] text-ink-soft uppercase">{quote.label}</p>
                  <ul className="mt-3 space-y-2 font-display text-lg italic">
                    {quote.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          <div className="flex flex-col items-start gap-5 rounded-(--radius-card) bg-iris p-8 text-on-iris sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold">Ready to write it down?</h2>
              <p className="mt-1 opacity-85">Get a personal safety plan you can come back to.</p>
            </div>
            <Link href="/report" className="btn shrink-0 bg-surface text-ink hover:bg-paper">
              Make a private report <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
