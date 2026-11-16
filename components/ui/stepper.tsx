import { Check } from "lucide-react"
import { cn } from "@/lib/utils/cn"

type Props = {
  steps: { label: string }[]
  /** Zero-based index of the step in progress. */
  currentStep: number
  className?: string
}

/** Horizontal numbered progress, e.g. Applied → Screening → Interview → Training → Active. */
export function Stepper({ steps, currentStep, className }: Props) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, index) => {
        const done = index < currentStep
        const current = index === currentStep
        return (
          <li key={step.label} className="relative flex flex-1 flex-col items-center">
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                  index <= currentStep ? "bg-indigo-600" : "bg-slate-200"
                )}
              />
            )}
            <span
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-black",
                done && "bg-indigo-600 text-white",
                current && "bg-white text-indigo-600 ring-2 ring-indigo-600 ring-offset-2",
                !done && !current && "bg-slate-100 text-slate-400"
              )}
            >
              {done ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span
              aria-current={current ? "step" : undefined}
              className={cn(
                "mt-2.5 text-center text-[11px] leading-tight",
                current ? "font-bold text-indigo-700" : done ? "font-medium text-slate-600" : "text-slate-400"
              )}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
