"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, Eyebrow } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FormError } from "@/components/ui/field"
import { IconTile } from "@/components/ui/icon-tile"

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
      setSaving(false)
      void data
      setStep("done")
    } catch {
      setSaveError("Something went wrong. Try again.")
    } finally {
      setSaving(false)
    }
  }

  if (step === "done") {
    return (
      <Card className="flex flex-col items-center px-6 py-12 text-center">
        <IconTile icon={CheckCircle2} tone="emerald" size="lg" className="mb-5" />
        <h2 className="text-xl font-black tracking-tight text-slate-900">Brief saved!</h2>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
          You can now browse freelancers and send them this brief as an offer.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => router.push("/app/client/dashboard")}>
            Dashboard
          </Button>
          <Button onClick={() => router.push("/app/freelancers")}>
            Browse freelancers <ArrowRight size={14} />
          </Button>
        </div>
      </Card>
    )
  }

  if (step === "review" && suggestion) {
    return (
      <div className="space-y-4">
        {/* AI analysis */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles size={15} />
            <span className="text-[11px] font-bold uppercase tracking-widest">AI analysis</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{suggestion.summary}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-indigo-100 pt-4">
            <div>
              <dt className="text-xs text-slate-500">Suggested track</dt>
              <dd className="mt-0.5 text-sm font-bold text-slate-900">{TRACK_LABELS[suggestion.track] ?? suggestion.track}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Confidence</dt>
              <dd className="mt-0.5 text-sm font-bold tabular-nums text-slate-900">{Math.round(suggestion.confidence * 100)}%</dd>
            </div>
          </dl>
        </div>

        {/* Brief review */}
        <Card className="space-y-5 p-6">
          <div>
            <Eyebrow className="mb-1.5">Title</Eyebrow>
            <p className="text-sm font-bold text-slate-900">{title}</p>
          </div>
          <div>
            <Eyebrow className="mb-1.5">Description</Eyebrow>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
          <Field
            label="Estimated hours"
            htmlFor="hours"
            hint={`AI suggested ${suggestion.estimatedHours}h — adjust if needed`}
          >
            <Input
              id="hours"
              type="number"
              min={1}
              max={9999}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-32"
            />
          </Field>
        </Card>

        <FormError>{saveError}</FormError>

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
    <Card className="space-y-5 p-6 sm:p-8">
      <Field label="Project title" htmlFor="title">
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Redesign our company website"
          maxLength={200}
        />
      </Field>

      <Field label="Describe what you need" htmlFor="description">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Describe the project in as much detail as you can — goals, deliverables, audience, tech stack, timeline, etc."
          className="resize-none"
        />
      </Field>

      <FormError>{analyzeError}</FormError>

      <Button onClick={analyze} disabled={analyzing || !title.trim() || !description.trim()}>
        <Sparkles size={14} />
        {analyzing ? "Analyzing…" : "Analyze with AI"}
      </Button>
    </Card>
  )
}
