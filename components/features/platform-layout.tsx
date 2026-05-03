"use client"

import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

type SidebarVariant = "client" | "freelancer" | "admin"

type Props = {
  variant: SidebarVariant
  title: string
  notifications?: number
  userName?: string
  userRole?: string
  children: React.ReactNode
}

export function PlatformLayout({ variant, title, notifications, userName, userRole, children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar variant={variant} userName={userName} userRole={userRole} />
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader title={title} notificationCount={notifications} />
        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
