// Shared, client-safe definitions for the report form and safety plan.

export const CATEGORIES = [
  {
    id: 'harassment',
    title: 'Harassment or bullying',
    description: 'Repeated unwanted messages, insults, threats or being ganged up on.',
  },
  {
    id: 'impersonation',
    title: 'Someone pretending to be me',
    description: 'A fake profile or account using your name, photos or details.',
  },
  {
    id: 'extortion',
    title: 'Threats or demands',
    description: 'Someone demanding money, photos or favours, or threatening to expose you.',
  },
  {
    id: 'images',
    title: 'Private images shared',
    description: 'Intimate or private images shared, or threatened to be shared, without consent.',
  },
  {
    id: 'account',
    title: 'Account hacked or privacy',
    description: 'Someone got into your account, is tracking you or exposing your information.',
  },
  {
    id: 'other',
    title: 'Something else',
    description: 'Anything online that made you feel unsafe or uncomfortable.',
  },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]]

export const PLATFORMS = [
  { id: 'none', label: 'Prefer not to say' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'gaming', label: 'A game or gaming chat' },
  { id: 'sms', label: 'Text messages or calls' },
  { id: 'other', label: 'Somewhere else' },
] as const

export type PlatformId = (typeof PLATFORMS)[number]['id']
export const PLATFORM_IDS = PLATFORMS.map((p) => p.id) as [PlatformId, ...PlatformId[]]

export const STARTED = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'longer', label: 'Longer ago' },
  { id: 'unsure', label: 'Not sure' },
] as const

export type StartedId = (typeof STARTED)[number]['id']
export const STARTED_IDS = STARTED.map((s) => s.id) as [StartedId, ...StartedId[]]

export const ONGOING = [
  { id: 'yes', label: 'Yes, it is still happening' },
  { id: 'no', label: 'No, it has stopped' },
  { id: 'unsure', label: 'Not sure' },
] as const

export type OngoingId = (typeof ONGOING)[number]['id']
export const ONGOING_IDS = ONGOING.map((o) => o.id) as [OngoingId, ...OngoingId[]]

export const LIMITS = {
  summaryMin: 10,
  summaryMax: 2000,
  evidenceMax: 3000,
  noteMax: 1000,
  maxNotes: 50,
} as const

export function categoryTitle(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.title ?? 'Report'
}

export function platformLabel(id: string) {
  return PLATFORMS.find((p) => p.id === id)?.label ?? 'Not specified'
}

export function startedLabel(id: string) {
  return STARTED.find((s) => s.id === id)?.label ?? 'Not sure'
}

export function ongoingLabel(id: string) {
  return ONGOING.find((o) => o.id === id)?.label ?? 'Not sure'
}
