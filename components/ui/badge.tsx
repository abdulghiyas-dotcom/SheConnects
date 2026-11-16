import { cn } from "@/lib/utils/cn"
import { toneStyles, type Tone } from "./tones"

type Props = {
  tone?: Tone
  dot?: boolean
  /** Uppercase, wide-tracked variant — the marketing "eyebrow pill". */
  eyebrow?: boolean
  className?: string
  children: React.ReactNode
}

export function Badge({ tone = "slate", dot = false, eyebrow = false, className, children }: Props) {
  const t = toneStyles[tone]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold",
        eyebrow ? "px-3 py-1 text-[11px] font-bold uppercase tracking-widest" : "px-2.5 py-0.5 text-xs",
        t.soft,
        t.text,
        t.border,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", t.dot)} />}
      {children}
    </span>
  )
}

/** Neutral tag for skills, languages and other plain attributes. */
export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Selectable pill (skills, suggestions, filters). */
export function ChoiceChip({
  selected,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        selected
          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600",
        className
      )}
      {...props}
    />
  )
}

export const choiceChipClass = (selected: boolean) =>
  cn(
    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
    selected
      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
      : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
  )
