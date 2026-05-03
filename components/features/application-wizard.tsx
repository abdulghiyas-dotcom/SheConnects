"use client"

import Link from "next/link"
import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export const WIZARD_STEPS = [
  { slug: "apply",       label: "Account",     path: "/app/apply" },
  { slug: "about-you",   label: "About you",   path: "/app/apply/about-you" },
  { slug: "track",       label: "Track",       path: "/app/apply/track" },
  { slug: "skills",      label: "Skills",      path: "/app/apply/skills" },
  { slug: "experience",  label: "Experience",  path: "/app/apply/experience" },
  { slug: "portfolio",   label: "Portfolio",   path: "/app/apply/portfolio" },
  { slug: "identity",    label: "Verification", path: "/app/apply/identity" },
  { slug: "voice",       label: "Voice intro", path: "/app/apply/voice" },
  { slug: "review",      label: "Submit",      path: "/app/apply/review" },
] as const

interface WizardShellProps {
  currentStep: number
  title: string
  subtitle?: string
  children: React.ReactNode
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
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/icon.png" alt="SheConnects" width={26} height={26} className="rounded-full" />
            <span className="text-sm font-semibold text-slate-900">SheConnects</span>
          </Link>

          {/* Step pills — desktop */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {WIZARD_STEPS.map((step, i) => {
              const stepNum = i + 1
              const isDone = stepNum < currentStep || i < completedSteps
              const isCurrent = stepNum === currentStep

              return (
                <div key={step.slug} className="flex items-center gap-1 flex-shrink-0">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                      isDone    && "bg-trust-50 text-trust-700",
                      isCurrent && "bg-brand-600 text-white shadow-brand",
                      !isDone && !isCurrent && "text-slate-400"
                    )}
                  >
                    {isDone ? (
                      <Check size={10} />
                    ) : (
                      <span className={cn(
                        "h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-bold",
                        isCurrent ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {stepNum}
                      </span>
                    )}
                    <span className={cn(isCurrent ? "" : "hidden sm:inline")}>{step.label}</span>
                  </div>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div className={cn("w-3 h-px flex-shrink-0", isDone ? "bg-trust-300" : "bg-slate-200")} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile step count */}
          <span className="md:hidden text-xs font-medium text-slate-500">
            Step {currentStep} / {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <div
            className="h-0.5 bg-brand-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Step content card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-7 md:p-9">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {currentStep}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{title}</h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your data is encrypted and never shared without your consent.
        </p>
      </main>
    </div>
  )
}
