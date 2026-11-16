import { cn } from "@/lib/utils/cn"
import { Label } from "./label"

type Props = {
  label: React.ReactNode
  htmlFor?: string
  optional?: boolean
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/** Label + control + hint, spaced the same way on every form. */
export function Field({ label, htmlFor, optional, hint, className, children }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </Label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-slate-400">{hint}</p>}
    </div>
  )
}

/** Inline form error — same red panel on every form. */
export function FormError({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) return null
  return (
    <div
      role="alert"
      className={cn("rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600", className)}
    >
      {children}
    </div>
  )
}
