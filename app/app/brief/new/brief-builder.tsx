"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle } from "lucide-react"

const TRACK_LABELS: Record<string, string> = {
  PROGRAMMING:     "Programming & Development",
  CREATIVE_DESIGN: "Creative & Design",
  TRANSLATION:     "Translation & Writing",
  RESEARCH_DATA:   "Research & Data",
}

type AISuggestion = {
  track: string
  confidence: number
  estimatedHours: number
  summary: string
}

type Step = "form" | "review" | "done"

export function BriefBuilder() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("form")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null)
  const [estimatedHours, setEstimatedHours] = useState<number | "">("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [savedId, setSavedId] = useState("")

  async function analyze() {
    if (!title.trim() || !description.trim()) return
    setAnalyzeError("")
    setAnalyzing(true)
    try {
      const res = await fetch("/api/brief/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setAnalyzeError(data.error ?? "Analysis failed"); return }
      setSuggestion(data as AISuggestion)
      setEstimatedHours(data.estimatedHours)
      setStep("review")
    } catch {
      setAnalyzeError("Something went wrong. Try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  async function save() {
    if (!suggestion) return
    setSaveError("")
    setSaving(true)
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          suggestedTrack: suggestion.track,
          trackConfidence: suggestion.confidence,
          estimatedHours: estimatedHours === "" ? suggestion.estimatedHours : Number(estimatedHours),
          aiSummary: suggestion.summary,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSaveError(data.error ?? "Failed to save"); return }
      setSavedId(data.id)
      setStep("done")
    } catch {
      setSaveError("Something went wrong. Try again.")
    } finally {
      setSaving(false)
    }
  }

  if (step === "done") {
    return (
      <div className="bg-white rounded-xl border border-trust-200 p-8 text-center space-y-4">
        <CheckCircle className="mx-auto text-trust-600" size={40} />
        <h2 className="text-lg font-semibold">Brief saved!</h2>
        <p className="text-sm text-muted-foreground">
          You can now browse freelancers and send them this brief as an offer.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => router.push("/app/freelancers")}>
            Browse freelancers
          </Button>
          <Button onClick={() => router.push("/app/client/dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (step === "review" && suggestion) {
    return (
      <div className="space-y-5">
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles size={16} />
            <span className="text-sm font-medium">AI analysis</span>
          </div>
          <p className="text-sm text-foreground">{suggestion.summary}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground pt-1">
            <span>Suggested track</span>
            <span className="text-foreground font-medium">{TRACK_LABELS[suggestion.track] ?? suggestion.track}</span>
            <span>Confidence</span>
            <span className="text-foreground">{Math.round(suggestion.confidence * 100)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Title</p>
            <p className="text-sm font-medium">{title}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm whitespace-pre-line">{description}</p>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Estimated hours
              <span className="text-muted-foreground font-normal ml-1">(AI suggested {suggestion.estimatedHours}h — adjust if needed)</span>
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-28 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {saveError && <p className="text-xs text-destructive">{saveError}</p>}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("form")} disabled={saving}>
            Back
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save brief"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-medium">Project title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Redesign our company website"
          maxLength={200}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Describe what you need</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Describe the project in as much detail as you can — goals, deliverables, audience, tech stack, timeline, etc."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      {analyzeError && <p className="text-xs text-destructive">{analyzeError}</p>}

      <Button
        onClick={analyze}
        disabled={analyzing || !title.trim() || !description.trim()}
        className="gap-2"
      >
        <Sparkles size={15} />
        {analyzing ? "Analyzing…" : "Analyze with AI"}
      </Button>
    </div>
  )
}
