"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculatePricing, formatEur } from "@/lib/utils/pricing"

interface Props {
  freelancerSlug: string
  freelancerAlias: string
  vatRate: number
  vatLabel: string
}

export function OfferForm({ freelancerSlug, freelancerAlias, vatRate, vatLabel }: Props) {
  const router = useRouter()
  const [scope, setScope] = useState("")
  const [priceInput, setPriceInput] = useState("")
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const priceCents = Math.round(parseFloat(priceInput || "0") * 100)
  const pricing = priceCents >= 100 ? calculatePricing(priceCents, vatRate) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (priceCents < 100) { setError("Minimum offer is €1"); return }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerSlug,
          scope,
          freelancerPriceCents: priceCents,
          timeline,
          message,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to send offer"); return }

      router.push(`/app/offers/${data.offerId}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="scope">What do you need done?</Label>
        <textarea
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          rows={4}
          required
          placeholder={`Describe the project for ${freelancerAlias} — what you need, the expected output, and any important details.`}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{freelancerAlias}'s fee (€)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            <Input
              id="price"
              type="number"
              min="1"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="500.00"
              className="pl-7"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">This goes directly to {freelancerAlias}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 2 weeks"
            required
          />
        </div>
      </div>

      {/* Live price breakdown */}
      {pricing && (
        <div className="rounded-xl bg-secondary/60 border border-border p-4 text-sm space-y-2">
          <p className="font-medium text-foreground mb-1">Price breakdown</p>
          <div className="flex justify-between text-muted-foreground">
            <span>{freelancerAlias}'s fee</span>
            <span>{formatEur(pricing.freelancerPriceCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Platform fee (20%)</span>
            <span>{formatEur(pricing.commissionCents)}</span>
          </div>
          <div className="border-t border-border my-1" />
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatEur(pricing.subtotalCents)}</span>
          </div>
          {pricing.vatCents > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>{vatLabel}</span>
              <span>{formatEur(pricing.vatCents)}</span>
            </div>
          )}
          <div className="border-t border-border my-1" />
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total you pay</span>
            <span>{formatEur(pricing.totalCents)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">
          Message to {freelancerAlias}{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any extra context, questions, or specific requirements…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : `Send offer to ${freelancerAlias}`}
        </Button>
      </div>
    </form>
  )
}
