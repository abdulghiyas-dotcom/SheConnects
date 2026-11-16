import { Badge } from "./badge"
import type { Tone } from "./tones"

export type StatusVariant =
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

const variantTone: Record<StatusVariant, Tone> = {
  active:      "emerald",
  pending:     "amber",
  declined:    "red",
  in_progress: "indigo",
  completed:   "emerald",
  cancelled:   "slate",
  training:    "purple",
  interview:   "blue",
  screening:   "amber",
  applied:     "slate",
  default:     "slate",
}

type Props = {
  variant?: StatusVariant
  label: string
  dot?: boolean
  className?: string
}

export function StatusBadge({ variant = "default", label, dot = true, className }: Props) {
  return (
    <Badge tone={variantTone[variant]} dot={dot} className={className}>
      {label}
    </Badge>
  )
}
