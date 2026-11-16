import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Card } from "./card"
import { IconTile } from "./icon-tile"
import type { Tone } from "./tones"

type Props = {
  icon?: LucideIcon
  tone?: Tone
  value: string | number
  label: string
  description?: string
  className?: string
}

export function StatCard({ icon, tone = "indigo", value, label, description, className }: Props) {
  return (
    <Card className={cn("p-6", className)}>
      {icon && <IconTile icon={icon} tone={tone} className="mb-5" />}
      <p className="text-3xl font-black tracking-tight tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {description && <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>}
    </Card>
  )
}
