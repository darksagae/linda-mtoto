// Report content is encrypted with a key derived from the reporter's access
// key. The server stores only a hash of that key, so the database alone
// cannot be read without it.
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto'

const IV_BYTES = 12
const TAG_BYTES = 16

export function authHash(accessKey: string) {
  return createHash('sha256').update(`linda-mtoto/auth/v1:${accessKey}`).digest('hex')
}

export function hashesMatch(a: string, b: string) {
  const left = Buffer.from(a, 'hex')
  const right = Buffer.from(b, 'hex')
  return left.length === right.length && timingSafeEqual(left, right)
}

export function contentKey(accessKey: string, reportId: string) {
  return Buffer.from(hkdfSync('sha256', accessKey, reportId, 'linda-mtoto/content/v1', 32))
}

export function seal(key: Buffer, value: unknown, context: string) {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  cipher.setAAD(Buffer.from(context))
  const body = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()])
  return Buffer.concat([iv, body, cipher.getAuthTag()]).toString('base64url')
}

export function open<T>(key: Buffer, sealed: string, context: string): T {
  const raw = Buffer.from(sealed, 'base64url')
  const iv = raw.subarray(0, IV_BYTES)
  const tag = raw.subarray(raw.length - TAG_BYTES)
  const body = raw.subarray(IV_BYTES, raw.length - TAG_BYTES)
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAAD(Buffer.from(context))
  decipher.setAuthTag(tag)
  return JSON.parse(Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8')) as T
}
