import {
  CircleHelp,
  ImageOff,
  KeyRound,
  MessageCircleWarning,
  ShieldAlert,
  UserRoundX,
  type LucideProps,
} from 'lucide-react'
import type { CategoryId } from '@/lib/catalog'

const ICONS: Record<CategoryId, React.ComponentType<LucideProps>> = {
  harassment: MessageCircleWarning,
  impersonation: UserRoundX,
  extortion: ShieldAlert,
  images: ImageOff,
  account: KeyRound,
  other: CircleHelp,
}

export function CategoryIcon({ category, ...props }: { category: CategoryId } & LucideProps) {
  const Icon = ICONS[category]
  return <Icon aria-hidden="true" {...props} />
}
