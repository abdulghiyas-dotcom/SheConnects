import type { FC } from "react"
import { prismaAdmin } from "@/lib/db/prisma-admin"

function displayName(author: {
  role: string
  freelancer: { alias: string | null } | null
  client: { organizationName: string | null } | null
}): string {
  if (author.role === "FREELANCER") return author.freelancer?.alias ?? "Freelancer"
  if (author.role === "CLIENT") return author.client?.organizationName ?? "Client"
  return "SheConnects Team"
}

async function MessageThreadAsync({ projectId }: { projectId: string }) {
  const messages = await prismaAdmin.message.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      bodyOriginal: true,
      createdAt: true,
      author: {
        select: {
          role: true,
          freelancer: { select: { alias: true } },
          client: { select: { organizationName: true } },
        },
      },
    },
  })

  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No messages yet. Send the first one below.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className="bg-white rounded-xl border border-border px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">{displayName(m.author)}</span>
            <time className="text-xs text-muted-foreground">
              {new Date(m.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <p className="text-sm text-foreground whitespace-pre-line">{m.bodyOriginal}</p>
        </div>
      ))}
    </div>
  )
}

export const MessageThread = MessageThreadAsync as unknown as FC<{ projectId: string }>
