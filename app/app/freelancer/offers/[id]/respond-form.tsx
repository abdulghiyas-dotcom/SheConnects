"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculatePricing, formatEur } from "@/lib/utils/pricing"

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
        <h3 className="font-medium">Propose a counter-offer</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Your fee (€)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
              <Input
                type="number"
                min="1"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Proposed timeline</Label>
            <Input
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 3 weeks"
            />
          </div>
        </div>

        {pricing && (
          <div className="rounded-lg bg-secondary/60 border border-border p-3 text-xs space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Your earnings</span><span>{formatEur(pricing.freelancerPriceCents)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform fee (20%)</span><span>{formatEur(pricing.commissionCents)}</span>
            </div>
            {pricing.vatCents > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>{vatLabel}</span><span>{formatEur(pricing.vatCents)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1 mt-1">
              <span>Client pays</span><span>{formatEur(pricing.totalCents)}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Message <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Explain your counter-proposal…"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode("idle")}>Cancel</Button>
          <Button
            onClick={() => post("counter", { freelancerPriceCents: counterCents, timeline, message })}
            disabled={!!loading || counterCents < 100 || !timeline.trim()}
          >
            {loading === "counter" ? "Sending…" : "Send counter-offer"}
          </Button>
        </div>
      </div>
    )
  }

  if (mode === "decline") {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Decline this offer</h3>
        <div className="space-y-2">
          <Label>Reason <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <textarea
            value={declinedReason}
            onChange={(e) => setDeclinedReason(e.target.value)}
            rows={2}
            placeholder="Let the client know why you're declining (optional)"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode("idle")}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => post("decline", { declinedReason })}
            disabled={!!loading}
          >
            {loading === "decline" ? "Declining…" : "Confirm decline"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={() => post("accept")} disabled={!!loading}>
        {loading === "accept" ? "Accepting…" : "Accept offer"}
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setMode("counter")} disabled={!!loading}>
          Counter
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => setMode("decline")}
          disabled={!!loading}
        >
          Decline
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
