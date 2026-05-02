import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/server"

export default async function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // If logged in as a non-freelancer, redirect to their dashboard
  if (user && user.role !== "FREELANCER") {
    redirect("/app/client/dashboard")
  }

  return <>{children}</>
}
