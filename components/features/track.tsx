import { Code2, Palette, Languages, BarChart3, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Tone } from "@/components/ui/tones"

// Single source of truth for how the four studio tracks are named and coloured.
// Colours follow the "Four specialised studios" section of the marketing site.
export const TRACKS: Record<string, { label: string; tone: Tone; icon: LucideIcon }> = {
  PROGRAMMING:     { label: "Dev & Tech",      tone: "indigo",  icon: Code2 },
  CREATIVE_DESIGN: { label: "Creative Design", tone: "purple",  icon: Palette },
  TRANSLATION:     { label: "Translation",     tone: "amber",   icon: Languages },
  RESEARCH_DATA:   { label: "Research & Data", tone: "emerald", icon: BarChart3 },
}

export function trackLabel(track: string): string {
  return TRACKS[track]?.label ?? track.replace(/_/g, " ")
}

export function TrackBadge({ track }: { track: string }) {
  const config = TRACKS[track]
  return (
    <Badge tone={config?.tone ?? "slate"} dot>
      {trackLabel(track)}
    </Badge>
  )
}
