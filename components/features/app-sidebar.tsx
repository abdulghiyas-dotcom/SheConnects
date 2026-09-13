"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import {
  LayoutDashboard,
  Inbox,
  FolderOpen,
  Users,
  ClipboardList,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Sparkles,
  Search,
} from "lucide-react"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

type SidebarVariant = "client" | "freelancer" | "admin"

const clientNav: NavItem[] = [
  { label: "Dashboard",   href: "/app/client/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Freelancers", href: "/app/freelancers",       icon: <Search size={18} /> },
  { label: "AI Matching", href: "/app/brief/new",         icon: <Sparkles size={18} /> },
  { label: "Offers",      href: "/app/offers",            icon: <Inbox size={18} /> },
  { label: "Projects",    href: "/app/projects",          icon: <FolderOpen size={18} /> },
]

const freelancerNav: NavItem[] = [
  { label: "Dashboard", href: "/app/freelancer/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Offers",    href: "/app/freelancer/offers",    icon: <Inbox size={18} /> },
  { label: "Projects",  href: "/app/freelancer/projects",  icon: <FolderOpen size={18} /> },
  { label: "My Alias",  href: "/app/freelancer/alias",     icon: <User size={18} /> },
]

const adminNav: NavItem[] = [
  { label: "Overview",     href: "/app/admin",              icon: <LayoutDashboard size={18} /> },
  { label: "Applications", href: "/app/admin/applications", icon: <ClipboardList size={18} /> },
  { label: "Freelancers",  href: "/app/admin/freelancers",  icon: <Users size={18} /> },
  { label: "Clients",      href: "/app/admin/clients",      icon: <User size={18} /> },
  { label: "Projects",     href: "/app/admin/projects",     icon: <FolderOpen size={18} /> },
  { label: "Payments",     href: "/app/admin/payments",     icon: <CreditCard size={18} /> },
]

const variantNav: Record<SidebarVariant, NavItem[]> = {
  client: clientNav,
  freelancer: freelancerNav,
  admin: adminNav,
}

type Props = {
  variant: SidebarVariant
  userName?: string
  userRole?: string
  collapsible?: boolean
}

export function AppSidebar({ variant, userName, userRole, collapsible = true }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const nav = variantNav[variant]

  return (
    <aside
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex h-[68px] flex-row bg-[#193b31] text-white shadow-[0_-8px_30px_rgba(25,59,49,.14)] lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:shadow-none transition-all duration-300 ease-in-out",
        "w-full",
        collapsed ? "lg:w-16" : "lg:w-60",
        "lg:min-h-screen lg:flex-shrink-0"
      )}
    >
      {/* Logo */}
      <div className={cn("hidden items-center gap-3 border-b border-white/10 px-4 py-4 lg:flex", collapsed && "justify-center px-0")}>
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/icon.png"
            alt="SheConnects"
            width={32}
            height={32}
            className="rounded-full"
          />
        </Link>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none">SheConnects</p>
            <p className="mt-0.5 text-[10px] text-slate-400 leading-none truncate">
              {variant === "admin" ? "Admin Panel" : variant === "freelancer" ? "Freelancer" : "Platform"}
            </p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 items-center justify-around gap-1 overflow-x-auto px-2 py-2 lg:block lg:space-y-0.5 lg:px-2 lg:py-4">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[9px] font-medium transition-all duration-150 lg:flex-row lg:px-3 lg:py-2.5 lg:text-sm",
                isActive
                  ? "bg-brand-600 text-white shadow-brand"
                  : "text-slate-400 hover:bg-white/10 hover:text-white",
                collapsed && "lg:justify-center lg:px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="max-w-[64px] truncate lg:max-w-none">{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + collapse toggle */}
      <div className="hidden border-t border-white/10 px-2 py-3 space-y-1 lg:block">
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        )}

        {userName && (
          <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2", collapsed && "justify-center px-0")}>
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{userName}</p>
                {userRole && <p className="text-[10px] text-slate-400 truncate">{userRole}</p>}
              </div>
            )}
          </div>
        )}

        <Link
          href="/app/sign-in"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Link>
      </div>
    </aside>
  )
}
