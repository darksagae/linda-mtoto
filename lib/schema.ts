import { z } from 'zod'
import { CATEGORY_IDS, LIMITS, ONGOING_IDS, PLATFORM_IDS, STARTED_IDS } from './catalog'

export const createReportSchema = z.object({
  category: z.enum(CATEGORY_IDS, { error: 'Choose what happened.' }),
  platform: z.enum(PLATFORM_IDS, { error: 'Choose a valid platform.' }).default('none'),
  started: z.enum(STARTED_IDS, { error: 'Choose when it started.' }).default('unsure'),
  ongoing: z.enum(ONGOING_IDS, { error: 'Choose whether it is still happening.' }).default('unsure'),
  summary: z
    .string({ error: 'Tell us briefly what happened.' })
    .trim()
    .min(LIMITS.summaryMin, `Write at least ${LIMITS.summaryMin} characters about what happened.`)
    .max(LIMITS.summaryMax, `Keep your summary under ${LIMITS.summaryMax} characters.`),
  evidence: z
    .string({ error: 'Evidence notes must be text.' })
    .trim()
    .max(LIMITS.evidenceMax, `Keep evidence notes under ${LIMITS.evidenceMax} characters.`)
    .default(''),
  consent: z.literal(true, { error: 'Please confirm you understand how your report is saved.' }),
})

export type CreateReportInput = z.infer<typeof createReportSchema>

export const updateReportSchema = z
  .object({
    completedSteps: z.array(z.string().max(64), { error: 'Completed steps must be a list.' }).max(30).optional(),
    note: z
      .string({ error: 'A note must be text.' })
      .trim()
      .min(1, 'Write a note first.')
      .max(LIMITS.noteMax, `Keep notes under ${LIMITS.noteMax} characters.`)
      .optional(),
  })
  .strict()
  .refine((value) => (value.completedSteps === undefined) !== (value.note === undefined), {
    error: 'Send either completed steps or a note.',
  })

export type UpdateReportInput = z.infer<typeof updateReportSchema>

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? 'Check your answers and try again.'
}
