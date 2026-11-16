import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { toneStyles, type Tone } from "./tones"

const sizes = {
  sm: { box: "h-9 w-9 rounded-xl", icon: 16 },
  md: { box: "h-11 w-11 rounded-xl", icon: 20 },
  lg: { box: "h-14 w-14 rounded-2xl", icon: 26 },
}

/** Tinted square holding an icon — the motif from the marketing "studio" cards. */
export function IconTile({
  icon: Icon,
  tone = "indigo",
  size = "md",
  className,
}: {
  icon: LucideIcon
  tone?: Tone
  size?: keyof typeof sizes
  className?: string
}) {
  const t = toneStyles[tone]
  const s = sizes[size]
  return (
    <div className={cn("flex flex-shrink-0 items-center justify-center", s.box, t.soft, className)}>
      <Icon size={s.icon} className={t.icon} />
    </div>
  )
}
