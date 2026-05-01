import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./platform.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

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
    <div className={`${inter.variable} ${mono.variable} font-sans antialiased min-h-screen bg-background`}>
      {children}
    </div>
  )
}
