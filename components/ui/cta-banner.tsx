import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Props = {
  title: string
  description: string
  href: string
  cta: string
}

/** Solid indigo call-to-action panel — the in-app sibling of the marketing final CTA. */
export function CtaBanner({ title, description, href, cta }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-7 py-8 sm:px-10">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-indigo-200">{description}</p>
        </div>
        <Link
          href={href}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          {cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
