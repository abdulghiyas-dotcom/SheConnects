"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export const WIZARD_STEPS = [
  { slug: "apply",       label: "Create account",    path: "/app/apply" },
  { slug: "about-you",   label: "About you",         path: "/app/apply/about-you" },
  { slug: "track",       label: "Your track",        path: "/app/apply/track" },
  { slug: "skills",      label: "Skills",            path: "/app/apply/skills" },
  { slug: "experience",  label: "Experience",        path: "/app/apply/experience" },
  { slug: "portfolio",   label: "Portfolio",         path: "/app/apply/portfolio" },
  { slug: "identity",    label: "Verification",      path: "/app/apply/identity" },
  { slug: "voice",       label: "Voice intro",       path: "/app/apply/voice" },
  { slug: "review",      label: "Review & submit",   path: "/app/apply/review" },
] as const

interface WizardShellProps {
  currentStep: number   // 1-indexed
  title: string
  subtitle?: string
  children: React.ReactNode
  /** Pass completed step count from DB to mark earlier steps as done */
  completedSteps?: number
}

export function WizardShell({
  currentStep,
  title,
  subtitle,
  children,
  completedSteps = 0,
}: WizardShellProps) {
  const totalSteps = WIZARD_STEPS.length

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">SheConnects</span>
          <span className="text-xs text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-1 bg-brand-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Step pills — desktop only */}
        <div className="hidden md:flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, i) => {
            const stepNum = i + 1
            const isDone = stepNum < currentStep || i < completedSteps
            const isCurrent = stepNum === currentStep

            return (
              <div key={step.slug} className="flex items-center gap-1 flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    isDone && "bg-trust-50 text-trust-700",
                    isCurrent && "bg-brand-100 text-brand-700",
                    !isDone && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <Check size={10} className="text-trust-600" />
                  ) : (
                    <span className={cn(
                      "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-semibold",
                      isCurrent ? "bg-brand-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {stepNum}
                    </span>
                  )}
                  {step.label}
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className="w-3 h-px bg-border flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}
