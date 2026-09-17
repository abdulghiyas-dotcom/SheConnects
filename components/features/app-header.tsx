"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils/cn"

type Props = {
  title: string
  userName?: string
  userEmail?: string
  notificationCount?: number
  backHref?: string
  backLabel?: string
}

export function AppHeader({
  title,
  userName,
  userEmail,
  notificationCount = 0,
  backHref,
  backLabel,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2e6df] bg-[#fdfdfb]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mr-1 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ← {backLabel ?? "Back"}
          </Link>
        )}
        <div><p className="hidden text-[10px] font-bold tracking-[.14em] text-[#7a897f] sm:block">SHECONNECTS WORKSPACE</p><h1 className="text-base font-bold tracking-tight text-[#17241f] truncate">{title}</h1></div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-[#edf2eb] hover:text-[#26735e] transition-colors">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        {userName && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-28 truncate">{userName}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-52 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg">
                  {userEmail && (
                    <div className="border-b border-slate-100 px-4 py-2 mb-1">
                      <p className="text-xs font-medium text-slate-800 truncate">{userName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User size={14} />
                    Profile
                  </button>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <Link
                    href="/app/sign-in"
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LogOut size={14} />
                    Sign out
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
