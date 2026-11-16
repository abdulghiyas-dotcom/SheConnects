import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { toneStyles, type Tone } from "./tones"

type Props = {
  tone?: Tone
  icon?: LucideIcon
  title?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/** Tinted notice panel: tips, privacy notes, payment banners, confirmations. */
export function Callout({ tone = "indigo", icon: Icon, title, action, className, children }: Props) {
  const t = toneStyles[tone]
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        t.soft,
        t.border,
        className
      )}
    >
      <div className="flex min-w-0 gap-3">
        {Icon && <Icon size={18} className={cn("mt-0.5 flex-shrink-0", t.icon)} />}
        <div className="min-w-0">
          {title && <p className={cn("text-sm font-bold", t.strongText)}>{title}</p>}
          {children && (
            <div className={cn("text-sm leading-relaxed", t.text, title && "mt-0.5")}>{children}</div>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
