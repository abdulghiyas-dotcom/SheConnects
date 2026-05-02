import Link from "next/link"
import { cn } from "@/lib/utils/cn"

interface FreelancerNavProps {
  active?: "dashboard" | "offers" | "projects"
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

export function FreelancerNav({ active }: FreelancerNavProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-base font-semibold">SheConnects</span>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink href="/app/freelancer/dashboard" isActive={active === "dashboard"}>Dashboard</NavLink>
          <NavLink href="/app/freelancer/offers" isActive={active === "offers"}>Offers</NavLink>
          <NavLink href="/app/freelancer/projects" isActive={active === "projects"}>Projects</NavLink>
          <NavLink href="/app/sign-in" isActive={false}>Sign out</NavLink>
        </nav>
      </div>
    </header>
  )
}
