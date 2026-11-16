import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Card } from "./card"
import { IconTile } from "./icon-tile"

type Props = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <Card className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {icon && <IconTile icon={icon} tone="indigo" size="lg" className="mb-5" />}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  )
}
