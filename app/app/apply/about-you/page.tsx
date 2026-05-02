import { requireRole } from "@/lib/auth/server"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { AboutYouForm } from "./about-you-form"

export default async function AboutYouPage() {
  const user = await requireRole("FREELANCER")

  const identity = await prismaAdmin.userIdentity.findUnique({
    where: { userId: user.id },
    select: {
      legalFirstName: true,
      legalLastName: true,
      dateOfBirth: true,
      countryOfResidence: true,
      cityOfResidence: true,
    },
  })

  return <AboutYouForm initialData={identity} />
}
