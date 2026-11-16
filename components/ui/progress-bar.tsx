import { cn } from "@/lib/utils/cn"

type Props = {
  value: number
  max: number
  /** "sm" is the inline version used in list rows. */
  size?: "sm" | "md"
  className?: string
}

export function ProgressBar({ value, max, size = "md", className }: Props) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn("flex-1 overflow-hidden rounded-full bg-slate-100", size === "sm" ? "h-1.5" : "h-2")}
      >
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-slate-500">
        {value}/{max}
      </span>
    </div>
  )
}
