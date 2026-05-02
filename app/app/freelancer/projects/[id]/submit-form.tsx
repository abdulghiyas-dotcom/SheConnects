"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  projectId: string
  milestoneId: string
  milestoneStatus: string
}

export function MilestoneSubmitForm({ projectId, milestoneId, milestoneStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function post(action: string) {
    setError("")
    setLoading(action)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
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

  if (milestoneStatus === "PENDING") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button size="sm" variant="outline" onClick={() => post("start")} disabled={!!loading}>
          {loading === "start" ? "Starting…" : "Start work"}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  if (milestoneStatus === "IN_PROGRESS" || milestoneStatus === "REVISION_REQUESTED") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button size="sm" onClick={() => post("submit")} disabled={!!loading}>
          {loading === "submit" ? "Submitting…" : "Submit for review"}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return null
}
