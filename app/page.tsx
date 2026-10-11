import {
  ArrowRight,
  Ban,
  BookOpen,
  Check,
  EyeOff,
  Fingerprint,
  HeartHandshake,
  IdCard,
  KeyRound,
  Lock,
  NotebookPen,
  PhoneOff,
  ShieldCheck,
  Trash2,
  UserX,
} from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    icon: NotebookPen,
    title: 'Tell us what happened',
    body: 'Choose what kind of harm it was and write only what feels safe. No names, numbers or photos needed.',
  },
  {
    icon: KeyRound,
    title: 'Save your private key',
    body: 'You get a report ID and an access key. Only someone with both can open your report — not even us.',
  },
  {
    icon: ShieldCheck,
    title: 'Follow your safety plan',
    body: 'Tick off steps as you go, add notes when things change, download a copy or delete it all.',
  },
]

const NEVER = [
  { icon: UserX, label: 'Your name' },
  { icon: PhoneOff, label: 'Your phone number' },
  { icon: IdCard, label: 'Your school or ID' },
  { icon: Ban, label: 'Photos or screenshots' },
]

const PROMISES = [
  {
    icon: Lock,
    title: 'Encrypted with your key',
    body: 'Your words are locked with a key only you hold. The server keeps a fingerprint of the key, never the key itself.',
  },
  {
    icon: EyeOff,
    title: 'No tracking at all',
    body: 'No analytics, cookies, ads or third-party scripts. Nothing follows you around the internet.',
  },
  {
    icon: Trash2,
    title: 'Delete whenever you want',
    body: 'One button removes your report, your plan and every note from the server, for good.',
  },
]

const GUIDES = [
  {
    href: '/toolkit#threats',
    title: 'Someone is threatening me',
    body: 'What to do — and not do — if someone demands money or photos.',
  },
  {
    href: '/toolkit#accounts',
    title: 'Lock down my accounts',
    body: 'Passwords, two-step verification and signed-in devices.',
  },
  { href: '/toolkit#trusted', title: 'Talk to someone I trust', body: 'Simple ways to start a hard conversation.' },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] size-[38rem] rounded-full bg-iris/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-60 -left-40 size-[26rem] rounded-full bg-coral/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Private · Free · No sign-up</span>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl">
              Something happened online? <em className="font-medium text-iris">You don’t have to face it alone.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">
              Linda Mtoto helps young people write down what happened, get a clear step-by-step safety plan and come
              back to it privately — without giving a name, phone number or email.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/report" className="btn btn-primary">
                Make a private report <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/open" className="btn btn-secondary">
                Open my report
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <Lock className="size-4 text-moss" aria-hidden="true" /> Encrypted with your key
              </li>
              <li className="flex items-center gap-2">
                <EyeOff className="size-4 text-moss" aria-hidden="true" /> No tracking
              </li>
              <li className="flex items-center gap-2">
                <Trash2 className="size-4 text-moss" aria-hidden="true" /> Delete any time
              </li>
            </ul>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="how">
        <h2 id="how" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Three steps, at your own pace
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="card p-7">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-iris-soft text-iris">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="font-display text-4xl font-semibold text-line-strong">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-ink-soft">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="privacy">
        <div className="overflow-hidden rounded-[2rem] bg-ink text-paper dark:border dark:border-line dark:bg-surface dark:text-ink">
          <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Fingerprint className="size-10 text-coral" aria-hidden="true" />
              <h2 id="privacy" className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Built so your story stays yours
              </h2>
              <p className="mt-4 opacity-75">We never ask for anything that could identify you.</p>
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {NEVER.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm dark:bg-sunken"
                  >
                    <Icon className="size-4 shrink-0 text-coral" aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-4">
              {PROMISES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-3xl bg-white/6 p-6 dark:bg-sunken">
                  <Icon className="mt-1 size-6 shrink-0 text-coral" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm opacity-75">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="toolkit">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">
              <BookOpen className="size-3.5" aria-hidden="true" /> Safety toolkit
            </span>
            <h2 id="toolkit" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Not ready to report? Start here.
            </h2>
          </div>
          <Link href="/toolkit" className="btn btn-ghost -mr-4">
            See all guides <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {GUIDES.map(({ href, title, body }) => (
            <Link key={href} href={href} className="card group p-7 transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-ink-soft">{body}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-iris">
                Read guide{' '}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-coral/30 bg-coral-soft p-7 sm:flex-row sm:items-center sm:p-9">
          <HeartHandshake className="size-10 shrink-0 text-coral" aria-hidden="true" />
          <p className="text-ink">
            <strong>If you are in danger right now,</strong> go somewhere safe and contact a trusted adult or local
            emergency services. Linda Mtoto is a prototype — it is not an emergency service and no organisation receives
            your report.
          </p>
        </div>
      </section>
    </>
  )
}

function HeroPreview() {
  const items = [
    { label: 'Check you are safe right now', done: true },
    { label: 'Tell someone you trust', done: true },
    { label: 'Do not pay or send anything more', done: false },
    { label: 'Save the details, then block', done: false },
  ]
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none lg:mx-0">
      <div className="card absolute -top-12 right-2 z-10 rotate-3 px-4 py-3 shadow-(--shadow-lift) sm:-right-4">
        <p className="text-[0.65rem] font-bold tracking-[0.1em] text-ink-soft uppercase">Report ID</p>
        <p className="font-mono text-sm font-semibold">LM-7K2Q9-XH4TD</p>
      </div>
      <div className="card relative p-7 shadow-(--shadow-lift)">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-moss-soft px-3 py-1 text-xs font-semibold text-moss">Encrypted</span>
          <span className="text-xs text-ink-soft">2 of 7 steps</span>
        </div>
        <p className="mt-5 font-display text-2xl font-semibold">Your safety plan</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sunken">
          <div className="h-full w-2/7 rounded-full bg-iris" />
        </div>
        <ul className="mt-6 space-y-3">
          {items.map(({ label, done }) => (
            <li key={label} className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                  done ? 'border-iris bg-iris text-on-iris' : 'border-line-strong'
                }`}
              >
                {done && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className={`text-sm ${done ? 'text-ink-soft line-through' : 'font-medium'}`}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card absolute -bottom-8 -left-2 -rotate-2 px-5 py-4 shadow-(--shadow-lift) sm:-left-8">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <NotebookPen className="size-4 text-coral" /> Note added today
        </p>
        <p className="mt-1 text-xs text-ink-soft">“Blocked the account and told my aunt.”</p>
      </div>
    </div>
  )
}
