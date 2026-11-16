import { cn } from "@/lib/utils/cn"

const gradients = [
  "from-indigo-500 to-purple-600",
  "from-purple-500 to-fuchsia-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-indigo-600",
]

const sizes = {
  sm: "h-8 w-8 rounded-xl text-[11px]",
  md: "h-11 w-11 rounded-xl text-sm",
  lg: "h-16 w-16 rounded-2xl text-xl",
}

/** Initials on a brand gradient. The colour is derived from the name so it stays stable. */
export function InitialsAvatar({
  name,
  size = "md",
  className,
}: {
  name: string
  size?: keyof typeof sizes
  className?: string
}) {
  const seed = Array.from(name).reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) >>> 0, 7)
  return (
    <div
      aria-hidden
      className={cn(
        "flex flex-shrink-0 items-center justify-center bg-gradient-to-br font-black text-white shadow-sm",
        sizes[size],
        gradients[seed % gradients.length],
        className
      )}
    >
      {(name || "?").slice(0, 2).toUpperCase()}
    </div>
  )
}
