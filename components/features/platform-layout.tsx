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
    <div className="flex min-h-screen bg-[#f6f7f4]">
      <AppSidebar variant={variant} userName={userName} userRole={userRole} />
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader title={title} notificationCount={notifications} />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
