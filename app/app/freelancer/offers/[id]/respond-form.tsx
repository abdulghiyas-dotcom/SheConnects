"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FormError } from "@/components/ui/field"
import { PriceRows } from "@/components/ui/price-rows"
import { calculatePricing } from "@/lib/utils/pricing"

interface Props {
  offerId: string
  currentPriceCents: number
  vatRate: number
  vatLabel: string
}

export function RespondForm({ offerId, currentPriceCents, vatRate, vatLabel }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<"idle" | "counter" | "decline">("idle")
  const [priceInput, setPriceInput] = useState((currentPriceCents / 100).toFixed(2))
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const [declinedReason, setDeclinedReason] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const counterCents = Math.round(parseFloat(priceInput || "0") * 100)
  const pricing = counterCents >= 100 ? calculatePricing(counterCents, vatRate) : null

  async function post(action: string, extra?: object) {
    setError("")
    setLoading(action)
    try {
      const res = await fetch(`/api/offers/${offerId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return }
      router.refresh()
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(null)
    }
  }

  if (mode === "counter") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Propose a counter-offer</h3>

        <Field label="Your fee (€)" htmlFor="counter-price">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
            <Input
              id="counter-price"
              type="number"
              min="1"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="pl-8"
            />
          </div>
        </Field>

        <Field label="Proposed timeline" htmlFor="counter-timeline">
          <Input
            id="counter-timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 3 weeks"
          />
        </Field>

        {pricing && (
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
            <PriceRows
              rows={[
                { label: "Your earnings", cents: pricing.freelancerPriceCents },
                { label: "Platform fee (20%)", cents: pricing.commissionCents },
                ...(pricing.vatCents > 0 ? [{ label: vatLabel, cents: pricing.vatCents }] : []),
              ]}
              total={{ label: "Client pays", cents: pricing.totalCents }}
            />
          </div>
        )}

        <Field label="Message" htmlFor="counter-message" optional>
          <Textarea
            id="counter-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Explain your counter-proposal…"
          />
        </Field>

        <FormError>{error}</FormError>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => post("counter", { freelancerPriceCents: counterCents, timeline, message })}
            disabled={!!loading || counterCents < 100 || !timeline.trim()}
          >
            {loading === "counter" ? "Sending…" : "Send counter-offer"}
          </Button>
          <Button variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
        </div>
      </div>
    )
  }

  if (mode === "decline") {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Decline this offer</h3>
        <Field label="Reason" htmlFor="decline-reason" optional>
          <Textarea
            id="decline-reason"
            value={declinedReason}
            onChange={(e) => setDeclinedReason(e.target.value)}
            rows={2}
            placeholder="Let the client know why you're declining (optional)"
          />
        </Field>
        <FormError>{error}</FormError>
        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={() => post("decline", { declinedReason })}
            disabled={!!loading}
          >
            {loading === "decline" ? "Declining…" : "Confirm decline"}
          </Button>
          <Button variant="ghost" onClick={() => setMode("idle")}>Cancel</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => post("accept")} disabled={!!loading}>
        {loading === "accept" ? "Accepting…" : "Accept offer"}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setMode("counter")} disabled={!!loading}>
          Counter
        </Button>
        <Button variant="danger" onClick={() => setMode("decline")} disabled={!!loading}>
          Decline
        </Button>
      </div>
      <FormError>{error}</FormError>
    </div>
  )
}
