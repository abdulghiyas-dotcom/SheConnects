import type { FC } from "react"
import { prismaAdmin } from "@/lib/db/prisma-admin"
import { InitialsAvatar } from "@/components/ui/initials-avatar"

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
      <p className="py-6 text-center text-sm text-slate-400">
        No messages yet. Send the first one below.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const name = displayName(m.author)
        return (
          <div key={m.id} className="flex gap-3">
            <InitialsAvatar name={name} size="sm" className="mt-0.5" />
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{name}</span>
                <time className="text-[11px] text-slate-400">
                  {new Date(m.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{m.bodyOriginal}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const MessageThread = MessageThreadAsync as unknown as FC<{ projectId: string }>
