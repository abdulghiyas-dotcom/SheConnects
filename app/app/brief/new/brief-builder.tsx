"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"

  if (step === "done") {
    return (
      <div className="rounded-2xl border border-trust-200 bg-white shadow-card p-8 text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-trust-50 mx-auto">
          <CheckCircle className="text-trust-600" size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Brief saved!</h2>
        <p className="text-sm text-slate-500">
          You can now browse freelancers and send them this brief as an offer.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => router.push("/app/freelancers")}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Browse freelancers
          </button>
          <button
            onClick={() => router.push("/app/client/dashboard")}
            className="h-10 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 text-sm font-semibold text-white shadow-brand transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (step === "review" && suggestion) {
    return (
      <div className="space-y-4">
        {/* AI analysis card */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles size={15} />
            <span className="text-sm font-semibold">AI analysis</span>
          </div>
          <p className="text-sm text-slate-700">{suggestion.summary}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 pt-1">
            <span>Suggested track</span>
            <span className="text-slate-800 font-semibold">{TRACK_LABELS[suggestion.track] ?? suggestion.track}</span>
            <span>Confidence</span>
            <span className="text-slate-700">{Math.round(suggestion.confidence * 100)}%</span>
          </div>
        </div>

        {/* Brief review card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title</p>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-slate-600 whitespace-pre-line">{description}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Estimated hours
              <span className="text-slate-400 font-normal normal-case ml-1">(AI suggested {suggestion.estimatedHours}h — adjust if needed)</span>
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        </div>

        {saveError && <p className="text-xs text-red-600">{saveError}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => setStep("form")}
            disabled={saving}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-5 text-sm font-semibold text-white shadow-brand transition-colors"
          >
            {saving ? "Saving…" : "Save brief"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-6 space-y-5">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Project title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Redesign our company website"
          maxLength={200}
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Describe what you need</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Describe the project in as much detail as you can — goals, deliverables, audience, tech stack, timeline, etc."
          className={`${fieldClass} resize-none`}
        />
      </div>

      {analyzeError && <p className="text-xs text-red-600">{analyzeError}</p>}

      <button
        onClick={analyze}
        disabled={analyzing || !title.trim() || !description.trim()}
        className="inline-flex items-center gap-2 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-5 text-sm font-semibold text-white shadow-brand transition-colors"
      >
        <Sparkles size={14} />
        {analyzing ? "Analyzing…" : "Analyze with AI"}
      </button>
    </div>
  )
}
