import { cn } from "@/lib/utils/cn"
import { Card, Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { InitialsAvatar } from "@/components/ui/initials-avatar"

type Round = {
  roundNumber: number
  proposedBy: string
  proposedScope: string | null
  proposedTimeline: string | null
  message: string | null
  freelancerPriceCents: number
  commissionCents: number
  vatCents: number
  totalCents: number
  createdAt: Date
}

type Props = {
  rounds: Round[]
  /** Who is looking at the history — decides the wording of names and fees. */
  viewer: "client" | "freelancer"
  clientName: string
  freelancerAlias: string
}

/** Offer / counter-offer history, shared by the client and freelancer offer pages. */
export function NegotiationRounds({ rounds, viewer, clientName, freelancerAlias }: Props) {
  if (rounds.length === 0) return null

  return (
    <section>
      <Eyebrow className="mb-3">Negotiation history</Eyebrow>
      <div className="space-y-3">
        {rounds.map((round) => {
          const fromClient = round.proposedBy === "CLIENT"
          const author = fromClient ? clientName : freelancerAlias
          const heading =
            viewer === "client"
              ? fromClient ? "Your offer" : `${freelancerAlias}'s counter`
              : fromClient ? clientName : "Your counter"

          return (
            <Card
              key={round.roundNumber}
              className={cn("p-6", !fromClient && "border-indigo-100 bg-indigo-50/40 sm:ml-8")}
            >
              <div className="flex items-center gap-3">
                <InitialsAvatar name={author} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{heading}</p>
                  <p className="text-xs text-slate-400">
                    Round {round.roundNumber} · {new Date(round.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {round.proposedScope && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">{round.proposedScope}</p>
              )}
              {round.message && (
                <p className="mt-3 border-l-2 border-slate-200 pl-3 text-sm italic leading-relaxed text-slate-500">
                  &ldquo;{round.message}&rdquo;
                </p>
              )}

              <PriceRows
                className="mt-5 border-t border-slate-200/70 pt-4"
                rows={[
                  { label: viewer === "client" ? "Freelancer fee" : "Your earnings", cents: round.freelancerPriceCents },
                  { label: "Platform fee", cents: round.commissionCents },
                  ...(round.vatCents > 0 ? [{ label: "VAT", cents: round.vatCents }] : []),
                ]}
                total={{ label: viewer === "client" ? "Total" : "Client pays", cents: round.totalCents }}
              />

              {round.proposedTimeline && (
                <p className="mt-3 text-xs text-slate-500">
                  Timeline: <span className="font-semibold text-slate-700">{round.proposedTimeline}</span>
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
