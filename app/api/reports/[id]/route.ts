import { HttpError, assertSameOrigin, bearerKey, clientAddress, errorResponse, json, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { NoteLimitError, addNote, deleteReport, getReport, setCompletedSteps } from '@/lib/reports'
import { firstError, updateReportSchema } from '@/lib/schema'

type Context = { params: Promise<{ id: string }> }

// Same message whether the report is missing or the key is wrong, so the
// response never reveals which reports exist.
const UNAVAILABLE = 'We could not open that report. Check your report ID and access key.'

export async function GET(request: Request, { params }: Context) {
  try {
    rateLimit('access', clientAddress(request))
    const report = getReport((await params).id, bearerKey(request))
    if (!report) throw new HttpError(404, UNAVAILABLE)
    return json({ report })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request)
    rateLimit('access', clientAddress(request))
    const parsed = updateReportSchema.safeParse(await readJson(request))
    if (!parsed.success) throw new HttpError(400, firstError(parsed.error))
    const { id } = await params
    const key = bearerKey(request)
    const report =
      parsed.data.note !== undefined
        ? addNote(id, key, parsed.data.note)
        : setCompletedSteps(id, key, parsed.data.completedSteps ?? [])
    if (!report) throw new HttpError(404, UNAVAILABLE)
    return json({ report })
  } catch (error) {
    if (error instanceof NoteLimitError) return json({ error: error.message }, 409)
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request)
    rateLimit('access', clientAddress(request))
    if (!deleteReport((await params).id, bearerKey(request))) throw new HttpError(404, UNAVAILABLE)
    return json({ deleted: true })
  } catch (error) {
    return errorResponse(error)
  }
}
