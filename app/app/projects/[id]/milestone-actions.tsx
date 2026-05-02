"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  projectId: string
  milestoneId: string
  milestoneStatus: string
}

export function MilestoneActions({ projectId, milestoneId, milestoneStatus }: Props) {
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

  if (milestoneStatus !== "SUBMITTED") return null

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" onClick={() => post("approve")} disabled={!!loading}>
        {loading === "approve" ? "Approving…" : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-amber-700 border-amber-200 hover:bg-amber-50"
        onClick={() => post("revision")}
        disabled={!!loading}
      >
        {loading === "revision" ? "Requesting…" : "Request revision"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
