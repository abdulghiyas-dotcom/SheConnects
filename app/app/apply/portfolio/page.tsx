import { requireRole } from "@/lib/auth/server"
import { isR2Configured } from "@/lib/services/r2"
import { PortfolioForm } from "./portfolio-form"

export default async function PortfolioPage() {
  await requireRole("FREELANCER")
  return <PortfolioForm r2Configured={isR2Configured} />
}
