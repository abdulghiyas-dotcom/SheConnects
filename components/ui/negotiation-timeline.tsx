import { cn } from "@/lib/utils/cn"

type OfferRound = {
  round: number
  proposedBy: "client" | "freelancer"
  proposerName: string
  amount: number
  message?: string
  createdAt: string
  status: "pending" | "accepted" | "countered" | "declined"
}

type Props = {
  rounds: OfferRound[]
  currency?: string
  className?: string
}

const statusStyles: Record<OfferRound["status"], string> = {
  pending:   "bg-accent-50 text-accent-700 border-accent-100",
  accepted:  "bg-trust-50 text-trust-700 border-trust-100",
  countered: "bg-brand-50 text-brand-700 border-brand-100",
  declined:  "bg-red-50 text-red-700 border-red-100",
}

export function NegotiationTimeline({ rounds, currency = "EUR", className }: Props) {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-EU", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div className={cn("space-y-4", className)}>
      {rounds.map((round, index) => {
        const isClient = round.proposedBy === "client"
        const isLast = index === rounds.length - 1
        const prevAmount = index > 0 ? rounds[index - 1].amount : null
        const delta = prevAmount !== null ? round.amount - prevAmount : null

        return (
          <div key={round.round} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                isClient ? "bg-slate-700" : "bg-brand-600"
              )}>
                R{round.round}
              </div>
              {!isLast && <div className="mt-1 w-0.5 flex-1 min-h-[16px] bg-slate-200" />}
            </div>

            <div className={cn("flex-1 rounded-2xl border p-4 pb-5", isLast ? "border-brand-200 bg-brand-50/30" : "border-slate-100 bg-white")}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{round.proposerName}</p>
                  <p className="text-[11px] text-slate-400">{formatDate(round.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {delta !== null && delta !== 0 && (
                    <span className={cn("text-xs font-medium", delta > 0 ? "text-trust-600" : "text-red-500")}>
                      {delta > 0 ? "+" : ""}{formatAmount(delta)}
                    </span>
                  )}
                  <p className="text-lg font-bold text-slate-900">{formatAmount(round.amount)}</p>
                </div>
              </div>

              {round.message && (
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{round.message}</p>
              )}

              <div className="mt-3">
                <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", statusStyles[round.status])}>
                  {round.status}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
