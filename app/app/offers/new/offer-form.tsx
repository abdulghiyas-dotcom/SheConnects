"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="scope" className="text-sm font-medium text-slate-700">What do you need done?</Label>
        <textarea
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          rows={4}
          required
          placeholder={`Describe the project for ${freelancerAlias} — what you need, the expected output, and any important details.`}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price" className="text-sm font-medium text-slate-700">{freelancerAlias}&apos;s fee (€)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">€</span>
            <input
              id="price"
              type="number"
              min="1"
              step="0.01"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="500.00"
              required
              className={`${fieldClass} pl-7 h-11`}
            />
          </div>
          <p className="text-xs text-slate-400">This goes directly to {freelancerAlias}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="timeline" className="text-sm font-medium text-slate-700">Timeline</Label>
          <input
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 2 weeks"
            required
            className={`${fieldClass} h-11`}
          />
        </div>
      </div>

      {/* Live price breakdown */}
      {pricing && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price breakdown</p>
          <div className="grid grid-cols-2 gap-x-8 text-xs text-slate-500">
            <span>{freelancerAlias}&apos;s fee</span>
            <span className="text-right tabular-nums">{formatEur(pricing.freelancerPriceCents)}</span>
            <span>Platform fee (20%)</span>
            <span className="text-right tabular-nums">{formatEur(pricing.commissionCents)}</span>
          </div>
          <div className="border-t border-slate-200 my-1" />
          <div className="grid grid-cols-2 gap-x-8 text-xs text-slate-500">
            <span>Subtotal</span>
            <span className="text-right tabular-nums">{formatEur(pricing.subtotalCents)}</span>
            {pricing.vatCents > 0 && (
              <>
                <span>{vatLabel}</span>
                <span className="text-right tabular-nums">{formatEur(pricing.vatCents)}</span>
              </>
            )}
          </div>
          <div className="border-t border-slate-200 my-1" />
          <div className="grid grid-cols-2 gap-x-8 text-xs font-semibold text-slate-800">
            <span>Total you pay</span>
            <span className="text-right tabular-nums">{formatEur(pricing.totalCents)}</span>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium text-slate-700">
          Message to {freelancerAlias}{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any extra context, questions, or specific requirements…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-5 text-sm font-semibold text-white shadow-brand transition-colors"
        >
          {loading ? "Sending…" : `Send offer to ${freelancerAlias}`}
        </button>
      </div>
    </form>
  )
}
