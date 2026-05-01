/**
 * ADMIN-ONLY Prisma client — full access including UserIdentity.
 *
 * Only import this in:
 *   - app/app/(admin)/** routes
 *   - Server actions protected by requireRole("ADMIN") or requireRole("TEAM")
 *   - Internal scripts (prisma/seed.ts, scripts/)
 *
 * Never import this in public routes or client components.
 */

import { prisma } from "./client"

export const prismaAdmin = prisma
