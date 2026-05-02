import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"

type AdminNavSection = "overview" | "applications" | "freelancers" | "clients" | "projects" | "payments"

function NavLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}

export function AdminNav({ active }: { active: AdminNavSection }) {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">SheConnects</span>
          <Badge variant="secondary" className="text-xs">Admin</Badge>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <NavLink href="/app/admin" isActive={active === "overview"}>Overview</NavLink>
          <NavLink href="/app/admin/applications" isActive={active === "applications"}>Applications</NavLink>
          <NavLink href="/app/admin/freelancers" isActive={active === "freelancers"}>Freelancers</NavLink>
          <NavLink href="/app/admin/clients" isActive={active === "clients"}>Clients</NavLink>
          <NavLink href="/app/admin/projects" isActive={active === "projects"}>Projects</NavLink>
          <NavLink href="/app/admin/payments" isActive={active === "payments"}>Payments</NavLink>
          <NavLink href="/app/sign-in" isActive={false}>Sign out</NavLink>
        </nav>
      </div>
    </header>
  )
}
