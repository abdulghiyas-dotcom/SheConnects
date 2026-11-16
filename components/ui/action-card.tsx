import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { IconTile } from "./icon-tile"
import type { Tone } from "./tones"

type Props = {
  href: string
  icon: LucideIcon
  tone?: Tone
  title: string
  description: string
  /** Amber outline when the destination needs attention. */
  attention?: boolean
}

/** Shortcut tile used on the dashboards. */
export function ActionCard({ href, icon, tone = "indigo", title, description, attention }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border bg-white px-5 py-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        attention ? "border-amber-200" : "border-slate-200/70 hover:border-indigo-200"
      )}
    >
      <IconTile icon={icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className={cn("truncate text-xs", attention ? "font-semibold text-amber-700" : "text-slate-500")}>
          {description}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="ml-auto flex-shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500"
      />
    </Link>
  )
}
