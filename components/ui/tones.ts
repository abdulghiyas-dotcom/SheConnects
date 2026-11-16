// Colour tones shared by badges, stat cards, callouts and icon tiles.
// These are the same Tailwind families the marketing site uses:
// indigo (primary / organisations), purple (freelancers), amber (accent),
// emerald (trust / success), red (danger), slate (neutral).
export type Tone = "indigo" | "purple" | "amber" | "emerald" | "red" | "blue" | "slate"

export const toneStyles: Record<
  Tone,
  { soft: string; text: string; strongText: string; border: string; dot: string; icon: string }
> = {
  indigo:  { soft: "bg-indigo-50",  text: "text-indigo-700",  strongText: "text-indigo-900",  border: "border-indigo-100",  dot: "bg-indigo-500",  icon: "text-indigo-600" },
  purple:  { soft: "bg-purple-50",  text: "text-purple-700",  strongText: "text-purple-900",  border: "border-purple-100",  dot: "bg-purple-500",  icon: "text-purple-600" },
  amber:   { soft: "bg-amber-50",   text: "text-amber-700",   strongText: "text-amber-900",   border: "border-amber-200",   dot: "bg-amber-500",   icon: "text-amber-600" },
  emerald: { soft: "bg-emerald-50", text: "text-emerald-700", strongText: "text-emerald-900", border: "border-emerald-200", dot: "bg-emerald-500", icon: "text-emerald-600" },
  red:     { soft: "bg-red-50",     text: "text-red-700",     strongText: "text-red-900",     border: "border-red-200",     dot: "bg-red-500",     icon: "text-red-600" },
  blue:    { soft: "bg-blue-50",    text: "text-blue-700",    strongText: "text-blue-900",    border: "border-blue-100",    dot: "bg-blue-500",    icon: "text-blue-600" },
  slate:   { soft: "bg-slate-100",  text: "text-slate-600",   strongText: "text-slate-900",   border: "border-slate-200",   dot: "bg-slate-400",   icon: "text-slate-500" },
}
