"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { WizardShell, WizardActions } from "@/components/features/application-wizard"
import { TRACKS as TRACK_STYLE } from "@/components/features/track"
import { IconTile } from "@/components/ui/icon-tile"
import { FormError } from "@/components/ui/field"
import { Check } from "lucide-react"

const TRACKS = [
  {
    value: "PROGRAMMING",
    label: "Development & Tech",
    description: "Websites, apps, WordPress, Python, databases, SEO",
  },
  {
    value: "CREATIVE_DESIGN",
    label: "Creative Design",
    description: "Graphic design, Figma, video editing, brand identity, social media",
  },
  {
    value: "TRANSLATION",
    label: "Translation & Language",
    description: "Dari, Pashto, Farsi, English — documents, subtitles, legal",
  },
  {
    value: "RESEARCH_DATA",
    label: "Research & Data",
    description: "Market research, data entry, surveys, report writing, grant research",
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Track">
          {TRACKS.map((track) => {
            const style = TRACK_STYLE[track.value]
            const isSelected = selected === track.value
            return (
              <button
                key={track.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(track.value)}
                className={cn(
                  "relative rounded-2xl border p-5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-card"
                )}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
                <IconTile icon={style.icon} tone={style.tone} className="mb-4" />
                <p className="text-sm font-black text-slate-900">{track.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{track.description}</p>
              </button>
            )
          })}
        </div>

        <FormError>{error}</FormError>

        <WizardActions>
          <Button type="button" variant="ghost" onClick={() => router.push("/app/apply/about-you")}>
            Back
          </Button>
          <Button type="submit" disabled={loading || !selected}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </WizardActions>
      </form>
    </WizardShell>
  )
}
