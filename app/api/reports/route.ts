import { HttpError, assertSameOrigin, clientAddress, errorResponse, json, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { createReport } from '@/lib/reports'
import { createReportSchema, firstError } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    rateLimit('create', clientAddress(request))
    const parsed = createReportSchema.safeParse(await readJson(request))
    if (!parsed.success) throw new HttpError(400, firstError(parsed.error))
    const { accessKey, report } = createReport(parsed.data)
    return json({ accessKey, report }, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
