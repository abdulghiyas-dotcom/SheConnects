"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function PayoutMarkSentButton({ payoutId }: { payoutId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function markSent() {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SENT" }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed"); return }
      router.refresh()
    } catch {
      setError("Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button size="sm" variant="outline" onClick={markSent} disabled={loading}>
        {loading ? "Saving…" : "Mark sent"}
      </Button>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
