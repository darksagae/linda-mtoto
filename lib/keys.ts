// Report IDs and access keys use Crockford base32 so they are easy to read,
// type and say aloud: no I, L, O or U. Client-safe (no Node imports).

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export const ID_PREFIX = 'LM'
const ID_CHARS = 10 // 50 bits: identifies a report, never grants access on its own
const KEY_CHARS = 30 // 150 bits: the secret

function randomChars(count: number) {
  const bytes = new Uint8Array(count)
  crypto.getRandomValues(bytes)
  // 256 is divisible by 32, so masking keeps the distribution uniform.
  return Array.from(bytes, (b) => ALPHABET[b & 31]).join('')
}

function group(chars: string, size = 5) {
  return chars.match(new RegExp(`.{1,${size}}`, 'g'))!.join('-')
}

const alphanumeric = (value: string) => value.toUpperCase().replace(/[^0-9A-Z]/g, '')
const fixLookAlikes = (chars: string) => chars.replace(/[IL]/g, '1').replace(/O/g, '0')
const clean = (value: string) => fixLookAlikes(alphanumeric(value))

export function newReportId() {
  return `${ID_PREFIX}-${group(randomChars(ID_CHARS))}`
}

export function newAccessKey() {
  return group(randomChars(KEY_CHARS))
}

/** Returns the canonical report ID, or null if it cannot be one. */
export function normalizeReportId(value: string): string | null {
  let chars = alphanumeric(value)
  // The prefix is optional; strip it before look-alike fixes turn its L into 1.
  if (chars.startsWith(ID_PREFIX) && chars.length === ID_PREFIX.length + ID_CHARS) {
    chars = chars.slice(ID_PREFIX.length)
  }
  chars = fixLookAlikes(chars)
  if (chars.length !== ID_CHARS || /U/.test(chars)) return null
  return `${ID_PREFIX}-${group(chars)}`
}

/** Returns the canonical access key, or null if it cannot be one. */
export function normalizeAccessKey(value: string): string | null {
  const chars = clean(value)
  if (chars.length !== KEY_CHARS || /U/.test(chars)) return null
  return group(chars)
}
