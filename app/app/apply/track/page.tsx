import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { TrackForm } from "./track-form"

export default async function TrackPage() {
  const user = await requireRole("FREELANCER")

  const freelancer = await prismaAdmin.freelancer.findUnique({
    where: { userId: user.id },
    select: { track: true },
  })

  return <TrackForm currentTrack={freelancer?.track ?? null} />
}
