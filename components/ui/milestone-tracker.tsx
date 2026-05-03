import { cn } from "@/lib/utils/cn"
import { Check, Clock, AlertCircle } from "lucide-react"

type MilestoneStatus = "completed" | "in_progress" | "pending" | "blocked"

type Milestone = {
  title: string
  description?: string
  dueDate?: string
  status: MilestoneStatus
  amount?: number
}

type Props = {
  milestones: Milestone[]
  className?: string
}

const statusConfig: Record<MilestoneStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  completed:   { icon: <Check size={14} />, color: "text-trust-600", bg: "bg-trust-500", label: "Completed" },
  in_progress: { icon: <Clock size={14} />, color: "text-brand-600", bg: "bg-brand-500", label: "In progress" },
  pending:     { icon: <span className="text-xs">○</span>, color: "text-slate-400", bg: "bg-slate-300", label: "Pending" },
  blocked:     { icon: <AlertCircle size={14} />, color: "text-red-600", bg: "bg-red-500", label: "Blocked" },
}

export function MilestoneTracker({ milestones, className }: Props) {
  return (
    <div className={cn("space-y-0", className)}>
      {milestones.map((milestone, index) => {
        const config = statusConfig[milestone.status]
        const isLast = index === milestones.length - 1

        return (
          <div key={milestone.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white",
                  config.bg
                )}
              >
                {config.icon}
              </div>
              {!isLast && (
                <div className={cn(
                  "mt-1 w-0.5 flex-1 min-h-[24px]",
                  milestone.status === "completed" ? "bg-trust-300" : "bg-slate-200"
                )} />
              )}
            </div>

            <div className={cn("pb-6", isLast && "pb-0")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{milestone.title}</p>
                  {milestone.description && (
                    <p className="mt-0.5 text-xs text-slate-500">{milestone.description}</p>
                  )}
                  {milestone.dueDate && (
                    <p className="mt-1 text-[11px] text-slate-400">Due {milestone.dueDate}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {milestone.amount !== undefined && (
                    <p className="text-sm font-semibold text-slate-800">
                      €{milestone.amount.toFixed(2)}
                    </p>
                  )}
                  <span className={cn("text-[11px] font-medium", config.color)}>{config.label}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
