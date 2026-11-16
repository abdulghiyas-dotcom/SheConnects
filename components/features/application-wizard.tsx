"use client"

import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AuthShell } from "./auth-shell"

export const WIZARD_STEPS = [
  { slug: "apply",       label: "Account",      path: "/app/apply" },
  { slug: "about-you",   label: "About you",    path: "/app/apply/about-you" },
  { slug: "track",       label: "Track",        path: "/app/apply/track" },
  { slug: "skills",      label: "Skills",       path: "/app/apply/skills" },
  { slug: "experience",  label: "Experience",   path: "/app/apply/experience" },
  { slug: "portfolio",   label: "Portfolio",    path: "/app/apply/portfolio" },
  { slug: "identity",    label: "Verification", path: "/app/apply/identity" },
  { slug: "voice",       label: "Voice intro",  path: "/app/apply/voice" },
  { slug: "review",      label: "Submit",       path: "/app/apply/review" },
] as const

interface WizardShellProps {
  currentStep: number
  title: string
  subtitle?: string
  children: React.ReactNode
}

/** Frame for the freelancer application: numbered step rail + one form card. */
export function WizardShell({ currentStep, title, subtitle, children }: WizardShellProps) {
  const total = WIZARD_STEPS.length

  return (
    <AuthShell
      bare
      topRight={
        <span className="font-semibold text-slate-700">
          Step {currentStep} <span className="font-normal text-slate-400">of {total}</span>
        </span>
      }
    >
      {/* Segmented progress */}
      <div className="flex gap-1 px-4 pt-4 sm:px-6 lg:hidden" aria-hidden>
        {WIZARD_STEPS.map((step, i) => (
          <div
            key={step.slug}
            className={cn("h-1 flex-1 rounded-full", i < currentStep ? "bg-indigo-600" : "bg-slate-200")}
          />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:py-14">
        {/* Step rail — the numbered-steps pattern from "How it works" */}
        <aside className="hidden lg:block">
          <Badge tone="purple" eyebrow className="mb-6">Freelancer application</Badge>
          <ol>
            {WIZARD_STEPS.map((step, i) => {
              const n = i + 1
              const done = n < currentStep
              const current = n === currentStep
              const last = n === total
              return (
                <li key={step.slug} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black",
                        done && "bg-emerald-100 text-emerald-700",
                        current && "bg-indigo-600 text-white shadow-sm",
                        !done && !current && "bg-slate-100 text-slate-400"
                      )}
                    >
                      {done ? <Check size={13} strokeWidth={3} /> : n}
                    </span>
                    {!last && <span className={cn("my-1 w-px flex-1", done ? "bg-emerald-200" : "bg-slate-200")} style={{ minHeight: 14 }} />}
                  </div>
                  <span
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "pt-1 text-sm",
                      current && "font-bold text-slate-900",
                      done && "font-medium text-slate-600",
                      !done && !current && "text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              )
            })}
          </ol>
        </aside>

        <main className="min-w-0">
          <Card className="rounded-3xl p-6 sm:p-9">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
              Step {currentStep} · {WIZARD_STEPS[currentStep - 1]?.label}
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </Card>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Lock size={12} className="text-emerald-500" />
            Your data is encrypted and never shared without your consent.
          </p>
        </main>
      </div>
    </AuthShell>
  )
}

/** Back / Continue row at the bottom of every wizard step. */
export function WizardActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">{children}</div>
}
