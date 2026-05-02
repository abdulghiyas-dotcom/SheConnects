"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
    <div className="space-y-3">
      {status === "COUNTERED" && (
        <Button
          className="w-full"
          onClick={() => post("accept")}
          disabled={!!loading}
        >
          {loading === "accept" ? "Accepting…" : "Accept counter-offer"}
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => post("withdraw")}
        disabled={!!loading}
      >
        {loading === "withdraw" ? "Withdrawing…" : "Withdraw offer"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
