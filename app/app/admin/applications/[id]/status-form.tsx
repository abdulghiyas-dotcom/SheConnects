"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const TRANSITIONS: Record<string, { next: string; label: string; nextLabel: string }> = {
  APPLIED:   { next: "SCREENING",  label: "Move to screening",   nextLabel: "Screening" },
  SCREENING: { next: "INTERVIEW",  label: "Invite to interview",  nextLabel: "Interview" },
  INTERVIEW: { next: "TRAINING",   label: "Move to training",     nextLabel: "Training"  },
  TRAINING:  { next: "ACTIVE",     label: "Activate freelancer",  nextLabel: "Active"    },
}

interface Props {
  freelancerId: string
  currentStatus: string
}

export function StatusForm({ freelancerId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const transition = TRANSITIONS[currentStatus]

  async function update(newStatus: string) {
    setError("")
    setLoading(newStatus)
    try {
      const res = await fetch(`/api/admin/freelancers/${freelancerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

  if (!transition) return null

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => update(transition.next)} disabled={!!loading}>
        {loading === transition.next ? "Saving…" : transition.label}
      </Button>
      {currentStatus !== "APPLIED" && (
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => update("REJECTED")}
          disabled={!!loading}
        >
          {loading === "REJECTED" ? "Rejecting…" : "Reject"}
        </Button>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
