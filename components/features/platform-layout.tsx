import { cn } from "@/lib/utils/cn"
import { AppSidebar, type ShellVariant } from "./app-sidebar"

type Props = {
  variant: ShellVariant
  children: React.ReactNode
  className?: string
}

/**
 * The signed-in frame: light sidebar (same header treatment as the marketing
 * site) and one content column, so every page title starts at the same place.
 */
export function PlatformLayout({ variant, children, className }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar variant={variant} />
      <div className="relative lg:pl-64">
        <div aria-hidden className="bg-wash pointer-events-none absolute inset-x-0 top-0 h-80" />
        <main className={cn("relative mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-8 lg:py-10", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
