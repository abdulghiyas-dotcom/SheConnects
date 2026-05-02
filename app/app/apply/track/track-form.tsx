"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { WizardShell } from "@/components/features/application-wizard"

const TRACKS = [
  {
    value: "PROGRAMMING",
    label: "Development & Tech",
    description: "Websites, apps, WordPress, Python, databases, SEO",
    icon: "💻",
  },
  {
    value: "CREATIVE_DESIGN",
    label: "Creative Design",
    description: "Graphic design, Figma, video editing, brand identity, social media",
    icon: "🎨",
  },
  {
    value: "TRANSLATION",
    label: "Translation & Language",
    description: "Dari, Pashto, Farsi, English — documents, subtitles, legal",
    icon: "🌐",
  },
  {
    value: "RESEARCH_DATA",
    label: "Research & Data",
    description: "Market research, data entry, surveys, report writing, grant research",
    icon: "📊",
  },
] as const

export function TrackForm({ currentTrack }: { currentTrack: string | null }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string>(currentTrack ?? "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) {
      setError("Please select a track to continue.")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/apply/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: selected }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to save. Please try again.")
        return
      }

      router.push("/app/apply/skills")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardShell
      currentStep={3}
      title="Your track"
      subtitle="Pick the area that best describes your work. You can always refine your skills in the next step."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRACKS.map((track) => (
            <button
              key={track.value}
              type="button"
              onClick={() => setSelected(track.value)}
              className={cn(
                "text-left p-4 rounded-xl border-2 transition-all",
                selected === track.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-border hover:border-brand-300 bg-white"
              )}
            >
              <div className="text-2xl mb-2">{track.icon}</div>
              <div className="font-medium text-sm text-foreground">{track.label}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{track.description}</div>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/about-you")}>
            Back
          </Button>
          <Button type="submit" disabled={loading || !selected}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </WizardShell>
  )
}
