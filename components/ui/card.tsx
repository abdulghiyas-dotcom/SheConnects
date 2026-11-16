import * as React from "react"

import { cn } from "@/lib/utils/cn"

// White rounded surface with the soft indigo-tinted shadow from the marketing cards.
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-slate-200/70 bg-white shadow-card", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

/** Small uppercase label used above cards and inside them. */
function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] font-bold uppercase tracking-widest text-slate-400", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-base font-bold tracking-tight text-slate-900", className)} {...props} />
}

export { Card, CardTitle, Eyebrow }
