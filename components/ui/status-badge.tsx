import { cn } from "@/lib/utils/cn"

type StatusVariant =
  | "active"
  | "pending"
  | "declined"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "training"
  | "interview"
  | "screening"
  | "applied"
  | "default"

const variantStyles: Record<StatusVariant, string> = {
  active:      "bg-trust-50 text-trust-700 border-trust-100",
  pending:     "bg-accent-50 text-accent-700 border-accent-100",
  declined:    "bg-red-50 text-red-700 border-red-100",
  in_progress: "bg-brand-50 text-brand-700 border-brand-100",
  completed:   "bg-trust-50 text-trust-700 border-trust-100",
  cancelled:   "bg-slate-100 text-slate-500 border-slate-200",
  training:    "bg-violet-50 text-violet-700 border-violet-100",
  interview:   "bg-blue-50 text-blue-700 border-blue-100",
  screening:   "bg-amber-50 text-amber-700 border-amber-100",
  applied:     "bg-slate-50 text-slate-600 border-slate-200",
  default:     "bg-slate-100 text-slate-600 border-slate-200",
}

const dotStyles: Record<StatusVariant, string> = {
  active:      "bg-trust-500",
  pending:     "bg-accent-500",
  declined:    "bg-red-500",
  in_progress: "bg-brand-500",
  completed:   "bg-trust-500",
  cancelled:   "bg-slate-400",
  training:    "bg-violet-500",
  interview:   "bg-blue-500",
  screening:   "bg-amber-500",
  applied:     "bg-slate-400",
  default:     "bg-slate-400",
}

type Props = {
  variant?: StatusVariant
  label: string
  dot?: boolean
  className?: string
}

export function StatusBadge({ variant = "default", label, dot = true, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotStyles[variant])} />
      )}
      {label}
    </span>
  )
}
