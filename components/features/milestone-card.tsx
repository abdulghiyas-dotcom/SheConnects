import { Card } from "@/components/ui/card"
import { StatusBadge, type StatusVariant } from "@/components/ui/status-badge"

type Props = {
  index: number
  title: string
  description?: string | null
  statusLabel: string
  statusVariant: StatusVariant
  /** Small lines under the description: due date, submitted, approved … */
  children?: React.ReactNode
  /** Buttons for the viewer (approve / request revision / start / submit). */
  action?: React.ReactNode
}

/** One milestone, shared by the client and freelancer project pages. */
export function MilestoneCard({ index, title, description, statusLabel, statusVariant, children, action }: Props) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-black text-indigo-600">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            {description && (
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-500">{description}</p>
            )}
            <div className="mt-1.5 space-y-0.5 text-xs text-slate-400 empty:hidden">{children}</div>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2.5">
          <StatusBadge variant={statusVariant} label={statusLabel} dot={false} />
          {action}
        </div>
      </div>
    </Card>
  )
}
