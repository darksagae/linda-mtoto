import '@fontsource-variable/fraunces'
import '@fontsource-variable/figtree'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { connection } from 'next/server'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: { default: 'Linda Mtoto · Your next safe step', template: '%s · Linda Mtoto' },
  description:
    'A private place for young people to record online harm, get a clear safety plan and come back to it — no name, phone number or account needed.',
  referrer: 'no-referrer',
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf7f1' },
    { media: '(prefers-color-scheme: dark)', color: '#13111b' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render per request so the CSP nonce from proxy.ts reaches every script.
  await connection()
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-iris px-4 py-2 text-on-iris focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
