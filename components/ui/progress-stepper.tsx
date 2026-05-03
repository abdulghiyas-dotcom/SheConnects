"use client"

import { cn } from "@/lib/utils/cn"
import { Check } from "lucide-react"

type Step = {
  label: string
  description?: string
}

type Props = {
  steps: Step[]
  currentStep: number
  className?: string
}

export function ProgressStepper({ steps, currentStep, className }: Props) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-200",
                    isCompleted && "border-brand-600 bg-brand-600 text-white",
                    isCurrent && "border-brand-600 bg-white text-brand-600 shadow-brand",
                    isUpcoming && "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  {isCompleted ? <Check size={14} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-center text-[10px] font-medium leading-tight max-w-14",
                    isCurrent && "text-brand-700",
                    isCompleted && "text-slate-600",
                    isUpcoming && "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1 mt-[-18px] transition-all duration-300",
                    index < currentStep ? "bg-brand-600" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
