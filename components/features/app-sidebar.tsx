"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  FolderOpen,
  Users,
  ClipboardList,
  CreditCard,
  LogOut,
  UserRound,
  Building2,
  ShieldCheck,
  Sparkles,
  Search,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import type { Tone } from "@/components/ui/tones"
import { Brand } from "./brand"

export type ShellVariant = "client" | "freelancer" | "admin"

type NavItem = { label: string; href: string; icon: LucideIcon; exact?: boolean }

const NAV: Record<ShellVariant, NavItem[]> = {
  client: [
    { label: "Dashboard",   href: "/app/client/dashboard", icon: LayoutDashboard },
    { label: "Freelancers", href: "/app/freelancers",      icon: Search },
    { label: "AI matching", href: "/app/brief/new",        icon: Sparkles },
    { label: "Offers",      href: "/app/offers",           icon: Inbox },
    { label: "Projects",    href: "/app/projects",         icon: FolderOpen },
  ],
  freelancer: [
    { label: "Dashboard", href: "/app/freelancer/dashboard", icon: LayoutDashboard },
    { label: "Offers",    href: "/app/freelancer/offers",    icon: Inbox },
    { label: "Projects",  href: "/app/freelancer/projects",  icon: FolderOpen },
    { label: "My alias",  href: "/app/freelancer/alias",     icon: UserRound },
  ],
  admin: [
    { label: "Overview",     href: "/app/admin",              icon: LayoutDashboard, exact: true },
    { label: "Applications", href: "/app/admin/applications", icon: ClipboardList },
    { label: "Freelancers",  href: "/app/admin/freelancers",  icon: Users },
    { label: "Clients",      href: "/app/admin/clients",      icon: Building2 },
    { label: "Projects",     href: "/app/admin/projects",     icon: FolderOpen },
    { label: "Payments",     href: "/app/admin/payments",     icon: CreditCard },
  ],
}

const WORKSPACE: Record<ShellVariant, { label: string; tone: Tone; icon: LucideIcon }> = {
  client:     { label: "Organisation", tone: "indigo", icon: Building2 },
  freelancer: { label: "Freelancer",   tone: "purple", icon: UserRound },
  admin:      { label: "Admin",        tone: "slate",  icon: ShieldCheck },
}

function NavList({ variant, onNavigate }: { variant: ShellVariant; onNavigate?: () => void }) {
  const pathname = usePathname()
  const workspace = WORKSPACE[variant]

  return (
    <div className="flex h-full flex-col">
      <div className="px-3">
        <Badge tone={workspace.tone} eyebrow>
          <workspace.icon size={11} />
          {workspace.label}
        </Badge>
      </div>

      <nav className="mt-4 flex-1 space-y-1" aria-label="Platform">
        {NAV[variant].map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-indigo-50 font-semibold text-indigo-700"
                  : "font-medium text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600"
              )}
            >
              <item.icon size={18} className={active ? "text-indigo-600" : "text-slate-400"} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 pt-3">
        <Link
          href="/app/sign-in"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut size={18} className="text-slate-400" />
          Sign out
        </Link>
      </div>
    </div>
  )
}

export function AppSidebar({ variant }: { variant: ShellVariant }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile drawer on navigation and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-100 bg-white lg:flex">
        <div className="flex h-16 items-center px-6">
          <Brand tagline />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-4">
          <NavList variant={variant} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <NavList variant={variant} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
