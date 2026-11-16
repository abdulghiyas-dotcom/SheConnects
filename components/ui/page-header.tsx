import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils/cn"

type Props = {
  title: React.ReactNode
  description?: React.ReactNode
  /** Back link shown above the title on detail pages. */
  back?: { href: string; label: string }
  /** Badge(s) shown next to the title. */
  badge?: React.ReactNode
  /** Buttons aligned to the right. */
  actions?: React.ReactNode
  className?: string
}

/** "← All offers" link above a detail page. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
    >
      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  )
}

/** The one page heading used by every platform screen. */
export function PageHeader({ title, description, back, badge, actions, className }: Props) {
  return (
    <header className={cn("space-y-4", className)}>
      {back && <BackLink href={back.href}>{back.label}</BackLink>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
