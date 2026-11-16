import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils/cn"

/** Logo lockup — identical to the one in the marketing header. */
export function Brand({
  href = "/",
  tagline = false,
  className,
}: {
  href?: string
  tagline?: boolean
  className?: string
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <Image src="/icon.png" alt="SheConnects" width={34} height={34} priority className="rounded-full" />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
          SheConnects
        </span>
        {tagline && (
          <span className="mt-0.5 hidden text-[9px] text-slate-400 sm:block">Digital work with human impact</span>
        )}
      </span>
    </Link>
  )
}
