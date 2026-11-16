"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/ui/field"

interface Props {
  offerId: string
  status: string
}

export function ClientOfferActions({ offerId, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function post(action: string, extra?: object) {
    setError("")
    setLoading(action)
    try {
      const res = await fetch(`/api/offers/${offerId}/close`, {
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

  if (!["SENT", "COUNTERED", "CLIENT_REVIEWING"].includes(status)) return null

  return (
    <div className="flex flex-col gap-2">
      {status === "COUNTERED" && (
        <Button onClick={() => post("accept")} disabled={!!loading}>
          {loading === "accept" ? "Accepting…" : "Accept counter-offer"}
        </Button>
      )}
      <Button variant="danger" onClick={() => post("withdraw")} disabled={!!loading}>
        {loading === "withdraw" ? "Withdrawing…" : "Withdraw offer"}
      </Button>
      {status !== "COUNTERED" && (
        <p className="text-xs leading-relaxed text-slate-400">
          Waiting for the freelancer to respond. You can withdraw the offer until then.
        </p>
      )}
      <FormError>{error}</FormError>
    </div>
  )
}
