// Small helpers shared by the API route handlers.

const MAX_BODY_BYTES = 16_000

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) return json({ error: error.message }, error.status)
  console.error('Unexpected API error') // Never log request bodies or keys.
  return json({ error: 'Something went wrong. Please try again.' }, 500)
}

/** Rejects writes that come from another site. */
export function assertSameOrigin(request: Request) {
  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin' && site !== 'none') {
    throw new HttpError(403, 'Cross-site request rejected.')
  }
  const origin = request.headers.get('origin')
  if (!origin) return
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    throw new HttpError(403, 'Cross-site request rejected.')
  }
  if (originHost !== host) throw new HttpError(403, 'Cross-site request rejected.')
}

export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new HttpError(415, 'Send JSON.')
  }
  const text = await request.text()
  if (!text || new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new HttpError(413, 'Request is empty or too large.')
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'Request is not valid JSON.')
  }
}

export function bearerKey(request: Request) {
  const header = request.headers.get('authorization') ?? ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

export function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local'
}
