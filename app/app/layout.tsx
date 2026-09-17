import type { Metadata } from "next"
import "./platform.css"

export const metadata: Metadata = {
  title: {
    template: "%s | SheConnects",
    default: "SheConnects Platform",
  },
  description: "Digital work with human impact",
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans antialiased min-h-screen bg-background">
      {children}
    </div>
  )
}
