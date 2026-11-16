import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Card, Eyebrow } from "./card"

/** A titled group of rows: "Active (3)", "Past (12)" … */
export function ListSection({
  title,
  count,
  attention = false,
  children,
}: {
  title: string
  count?: number
  /** Highlights the group in amber when it needs the user's action. */
  attention?: boolean
  children: React.ReactNode
}) {
  return (
    <section>
      <Eyebrow className={cn("mb-3 flex items-center gap-2", attention && "text-amber-600")}>
        {attention && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />}
        {title}
        {count !== undefined && <span className="font-semibold opacity-70">· {count}</span>}
      </Eyebrow>
      <Card className={cn("divide-y divide-slate-100 overflow-hidden", attention && "border-amber-200")}>
        {children}
      </Card>
    </section>
  )
}

/** One row: title + subtitle on the left, meta (amount, badges, actions) on the right. */
export function ListRow({
  href,
  title,
  subtitle,
  children,
}: {
  href?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}) {
  const body = (
    <>
      <div className="min-w-[9rem] flex-1">
        <div className="truncate text-sm font-bold text-slate-900">{title}</div>
        {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="ml-auto flex flex-shrink-0 items-center gap-3">
        {children}
        {href && (
          <ChevronRight
            size={16}
            className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500"
          />
        )}
      </div>
    </>
  )

  const className = "group flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4"

  return href ? (
    <Link href={href} className={cn(className, "transition-colors hover:bg-indigo-50/40")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

/** Right-aligned money figure for list rows. */
export function RowAmount({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("hidden text-sm font-semibold tabular-nums text-slate-700 sm:block", className)}>
      {children}
    </span>
  )
}
