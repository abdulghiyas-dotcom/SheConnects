"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FormError } from "@/components/ui/field"
import { Eyebrow } from "@/components/ui/card"
import { PriceRows } from "@/components/ui/price-rows"
import { calculatePricing } from "@/lib/utils/pricing"

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="What do you need done?" htmlFor="scope">
        <Textarea
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          rows={4}
          required
          placeholder={`Describe the project for ${freelancerAlias} — what you need, the expected output, and any important details.`}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={<>{freelancerAlias}&apos;s fee (€)</>} htmlFor="price" hint={`This goes directly to ${freelancerAlias}`}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 select-none text-sm text-slate-400">€</span>
            <Input
              id="price"
              type="number"
              min="1"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="500.00"
              required
              className="pl-8"
            />
          </div>
        </Field>

        <Field label="Timeline" htmlFor="timeline">
          <Input
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 2 weeks"
            required
          />
        </Field>
      </div>

      {/* Live price breakdown */}
      {pricing && (
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
          <Eyebrow className="mb-3">Price breakdown</Eyebrow>
          <PriceRows
            rows={[
              { label: <>{freelancerAlias}&apos;s fee</>, cents: pricing.freelancerPriceCents },
              { label: "Platform fee (20%)", cents: pricing.commissionCents },
              { label: "Subtotal", cents: pricing.subtotalCents },
              ...(pricing.vatCents > 0 ? [{ label: vatLabel, cents: pricing.vatCents }] : []),
            ]}
            total={{ label: "Total you pay", cents: pricing.totalCents }}
          />
        </div>
      )}

      <Field label={`Message to ${freelancerAlias}`} htmlFor="message" optional>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any extra context, questions, or specific requirements…"
        />
      </Field>

      <FormError>{error}</FormError>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
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
