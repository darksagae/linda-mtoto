# Linda Mtoto

**A private place for young people to record online harm, get a clear safety plan and come back to it — without a name, phone number or account.**

Built for UCC Testbed, SafeTech HackLab and Code for Humanity.

## What it does

- **Guided report in four steps:** what happened (6 categories), details (platform, when it started, whether it is ongoing), optional evidence notes, then review with explicit consent.
- **One-time report ID and access key:** both use Crockford base32 so they are easy to read and type, and the key is shown only once. Case, dashes and look-alike characters (O/0, I/L/1) are accepted.
- **Personal safety plan:** transparent rules turn the person's answers into ordered steps. Steps can be ticked off, and progress is saved.
- **Notes over time:** a timeline of encrypted follow-up notes.
- **Download or delete:** a plain-text copy (never including the key), or permanent deletion of the report, plan and notes.
- **Safety tips:** six practical guides covering threats and sextortion, account security, evidence, blocking and reporting, talking to someone, and wellbeing.
- **Quick exit:** a button in every header, plus pressing Esc twice. It replaces the page with a neutral site.

## Privacy and security model

| Concern        | How it is handled                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity       | No accounts, names, phone numbers, emails or uploads.                                                                                                                                     |
| Data at rest   | Report content and notes are encrypted with AES-256-GCM. The key is derived (HKDF-SHA256) from the person's access key, which the server never stores. The database alone cannot be read. |
| Authentication | Only a SHA-256 fingerprint of the access key is stored. It is compared in constant time, and wrong keys and unknown IDs return the same 404.                                              |
| Key handling   | Keys travel only in the `Authorization` header — never in URLs, logs or downloads.                                                                                                        |
| Browser        | A strict per-request nonce CSP (`proxy.ts`), `frame-ancestors 'none'`, `no-referrer`, `nosniff` and a locked-down Permissions-Policy. Pages are `no-store`.                               |
| Abuse          | Same-origin checks on every write, 16 KB body limit, schema validation (zod) and per-IP rate limits.                                                                                      |
| Tracking       | No analytics, cookies or third-party scripts. Fonts are self-hosted.                                                                                                                      |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · zod · SQLite via Node's built-in `node:sqlite` (no native dependencies) · Vitest · Playwright.

```
app/                 pages and API route handlers
  api/reports/       POST create · GET/PATCH/DELETE /[id]
components/          UI (report wizard, key card, report view, quick exit)
lib/
  catalog.ts         categories, platforms and limits (shared)
  safety-plan.ts     transparent rule-based plan
  keys.ts            report ID and access key format
  crypto.ts          hashing, HKDF and AES-GCM
  reports.ts         repository (encrypt/decrypt and SQL)
  db.ts · http.ts · rate-limit.ts · schema.ts
proxy.ts             per-request CSP nonce
tests/unit/          crypto, keys, plan, repository and API tests
tests/e2e/           full browser journey, desktop and mobile
```

## Run it

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev          # http://localhost:3000
```

Production:

```sh
npm run build
npm start
```

Reports are stored in `data/reports.sqlite3` (file mode 600). Set `LINDA_DB` to change the location.

## Test

```sh
npm test                 # unit + API tests (Vitest)
npm run lint             # formatting and type check
npx playwright install chromium   # once
npm run build && npm run test:e2e
```

To use an existing Chromium for end-to-end tests, set `CHROMIUM_PATH=/path/to/chromium`.

## Prototype limits

Use fictional examples only. There is no staffed response service, and no report is sent to any organisation. Before a real deployment, it needs:

- persistent managed storage (serverless file systems are temporary) and a shared rate-limit store
- HTTPS
- a retention policy
- a verified, locally reviewed support directory
- a safeguarding review with child-protection professionals
- an accessibility audit with young users

Quick exit cannot erase browser history or files already downloaded.

Design reference: [Linda Mtoto in Figma](https://www.figma.com/design/CjkiC9g8f6JCvkXbJzQI4Z).

## License

MIT
