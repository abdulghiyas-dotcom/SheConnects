/**
 * PRIVACY ENFORCEMENT — public-safe Prisma client.
 *
 * Afghan freelancers' real identities are stored in the UserIdentity table.
 * This wrapper throws if any query attempts to include UserIdentity,
 * preventing real names from ever appearing on public-facing pages.
 *
 * Use this client in all public routes (directory, profiles, search).
 * Never use the raw prisma client from lib/db/client.ts in public routes.
 */

import { prisma } from "./client"

function createPublicProxy() {
  return new Proxy(prisma, {
    get(target, prop) {
      const value = (target as never)[prop]

      if (prop === "userIdentity") {
        throw new Error(
          "[PRIVACY VIOLATION] Attempted to access UserIdentity from a public route. " +
            "Public pages must never query real freelancer identities. " +
            "Use prismaAdmin from lib/db/prisma-admin.ts for admin operations."
        )
      }

      if (typeof value === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (value as any).bind(target)
      }

      return value
    },
  })
}

export const prismaPublic = createPublicProxy()
