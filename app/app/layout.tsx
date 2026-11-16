import type { Metadata } from "next"
import "@fontsource/jetbrains-mono"

export const metadata: Metadata = {
  title: {
    template: "%s | SheConnects",
    default: "SheConnects Platform",
  },
  description: "Digital work with human impact",
}

// Fonts, tokens and base styles come from the root layout (app/layout.tsx +
// app/globals.css) so the platform and the marketing site share one design language.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen font-sans text-slate-900 antialiased">{children}</div>
}
