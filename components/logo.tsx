export function LogoMark({ className = 'size-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" className="fill-iris" />
      <path
        d="M20 9.5 29 13v7.2c0 5.4-3.7 9.6-9 11.3-5.3-1.7-9-5.9-9-11.3V13l9-3.5Z"
        fill="none"
        className="stroke-on-iris"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="19.5" r="3.4" className="fill-coral" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-xl leading-none font-semibold tracking-tight">Linda Mtoto</span>
    </span>
  )
}
