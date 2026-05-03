import { cn } from "@/lib/utils/cn"

type LineItem = {
  label: string
  amount: number
  description?: string
  highlight?: boolean
}

type Props = {
  items: LineItem[]
  total: number
  currency?: string
  className?: string
}

function formatAmount(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function PriceBreakdown({ items, total, currency = "EUR", className }: Props) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white overflow-hidden", className)}>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center justify-between px-5 py-3",
              item.highlight && "bg-brand-50/50"
            )}
          >
            <div>
              <p className={cn("text-sm font-medium", item.highlight ? "text-brand-900" : "text-slate-700")}>
                {item.label}
              </p>
              {item.description && (
                <p className="text-xs text-slate-400">{item.description}</p>
              )}
            </div>
            <p className={cn("text-sm font-semibold tabular-nums", item.highlight ? "text-brand-700" : "text-slate-800")}>
              {formatAmount(item.amount, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
        <p className="text-sm font-semibold text-white">Total due today</p>
        <p className="text-lg font-bold tabular-nums text-white">{formatAmount(total, currency)}</p>
      </div>
    </div>
  )
}
