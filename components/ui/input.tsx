import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils/cn"

// One field style for every text input, textarea and select on the platform.
export const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(fieldClass, "h-11", className)} ref={ref} {...props} />
  )
)
Input.displayName = "Input"

const NativeSelect = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <select ref={ref} className={cn(fieldClass, "h-11 appearance-none pr-9")} {...props}>
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  )
)
NativeSelect.displayName = "NativeSelect"

export { Input, NativeSelect }
