import { cn } from "@/lib/utils/cn"
import { formatEur } from "@/lib/utils/pricing"

type Row = { label: React.ReactNode; cents: number }

type Props = {
  rows: Row[]
  total: Row
  className?: string
}

/** Fee / VAT / total breakdown, shown identically on offers, projects and checkout. */
export function PriceRows({ rows, total, className }: Props) {
  return (
    <dl className={cn("space-y-1.5 text-sm", className)}>
      {rows.map((row, i) => (
        <div key={i} className="flex items-baseline justify-between gap-6 text-slate-500">
          <dt>{row.label}</dt>
          <dd className="tabular-nums">{formatEur(row.cents)}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-6 border-t border-slate-200 pt-2.5 font-bold text-slate-900">
        <dt>{total.label}</dt>
        <dd className="tabular-nums">{formatEur(total.cents)}</dd>
      </div>
    </dl>
  )
}
