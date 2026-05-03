"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"
import type { LucideIcon } from "lucide-react"

type TrendDirection = "up" | "down" | "neutral"

type Props = {
  icon?: LucideIcon
  iconColor?: string
  iconBg?: string
  value: string | number
  label: string
  description?: string
  trend?: { value: string; direction: TrendDirection }
  animate?: boolean
  className?: string
}

export function StatCard({
  icon: Icon,
  iconColor = "text-brand-600",
  iconBg = "bg-brand-50",
  value,
  label,
  description,
  trend,
  animate = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!animate) { setVisible(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate])

  const trendColor = trend?.direction === "up"
    ? "text-trust-600"
    : trend?.direction === "down"
    ? "text-red-500"
    : "text-slate-500"

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-white border border-slate-100 p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      {Icon && (
        <div className={cn("mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
      )}
      <p
        className={cn(
          "text-3xl font-bold tracking-tight text-slate-900 transition-all duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
      {trend && (
        <p className={cn("mt-2 text-xs font-medium", trendColor)}>
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.value}
        </p>
      )}
    </div>
  )
}
