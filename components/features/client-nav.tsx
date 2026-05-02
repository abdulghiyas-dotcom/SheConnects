import Link from "next/link"
import { cn } from "@/lib/utils/cn"

interface ClientNavProps {
  active?: "dashboard" | "freelancers" | "offers" | "projects" | "brief"
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string
  isActive: boolean
  children: React.ReactNode
}) {
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

export function ClientNav({ active }: ClientNavProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">SheConnects</span>
        <nav className="flex items-center gap-5">
          <NavLink href="/app/client/dashboard" isActive={active === "dashboard"}>Dashboard</NavLink>
          <NavLink href="/app/freelancers" isActive={active === "freelancers"}>Freelancers</NavLink>
          <NavLink href="/app/offers" isActive={active === "offers"}>Offers</NavLink>
          <NavLink href="/app/projects" isActive={active === "projects"}>Projects</NavLink>
          <NavLink href="/app/brief/new" isActive={active === "brief"}>New brief</NavLink>
          <NavLink href="/app/sign-in" isActive={false}>Sign out</NavLink>
        </nav>
      </div>
    </header>
  )
}
