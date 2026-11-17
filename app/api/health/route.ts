import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/client"
import { getAppUrl } from "@/lib/utils/app-url"
import { env } from "@/lib/env"

/**
 * GET /api/health — deployment self-check.
 *
 * Open it in a browser on any deployment to see what is missing or broken:
 * which branch was built, which settings are absent, whether the database
 * answers and has its tables, and whether the Supabase keys are accepted.
 *
 * It never returns setting values, connection strings or raw error messages:
 * only names of missing settings, yes/no results and a plain-language fix.
 */

export const dynamic = "force-dynamic"

type Check = { name: string; ok: boolean; detail: string; fix?: string }

// What each feature needs. "core" is required for sign-in and every button.
const SETTINGS: Record<string, { needed: string[]; anyOf?: string[][]; feature: string }> = {
  core: {
    feature: "Sign-in, dashboards and every button",
    needed: ["DATABASE_URL", "DIRECT_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  },
  payments: {
    feature: "Card payments (Stripe)",
    needed: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  uploads: {
    feature: "Portfolio, ID and voice uploads (Cloudflare R2)",
    needed: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"],
  },
  emails: {
    feature: "Notification emails (Resend)",
    needed: ["RESEND_API_KEY"],
    anyOf: [["EMAIL_FROM", "RESEND_FROM_EMAIL"]],
  },
  ai: {
    // Only Groq is required: Gemini is the fallback when Groq is rate-limited.
    // Hugging Face and Langfuse keys are read by lib/ai but nothing calls them yet.
    feature: "\"Analyze with AI\" on the project brief",
    needed: ["GROQ_API_KEY"],
  },
}

const has = (key: string) => !!process.env[key]?.trim()

function settingsChecks(): Check[] {
  return Object.entries(SETTINGS).map(([name, s]) => {
    const missing = s.needed.filter((k) => !has(k))
    for (const group of s.anyOf ?? []) if (!group.some(has)) missing.push(group.join(" or "))
    const optional = name !== "core"
    if (missing.length === 0) return { name: `settings: ${name}`, ok: true, detail: `${s.feature}: all set` }
    return {
      name: `settings: ${name}${optional ? " (optional)" : ""}`,
      ok: false,
      detail: optional
        ? `Not set up — ${s.feature} won't work until you add: ${missing.join(", ")}`
        : `${s.feature} need: ${missing.join(", ")}`,
      fix:
        "Vercel → Project → Settings → Environment Variables. Add them for Production (and Preview), then redeploy — " +
        "NEXT_PUBLIC_ values only take effect after a new build.",
    }
  })
}

/** Looks at the shape of DATABASE_URL (never returns it). */
function connectionStringCheck(): Check | null {
  const raw = process.env.DATABASE_URL
  if (!raw) return null
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return {
      name: "database: connection string",
      ok: false,
      detail: "DATABASE_URL is not a valid URL",
      fix: "Copy it again from Supabase → Connect. If the password contains @ : / ? # or %, it must be URL-encoded.",
    }
  }
  const pooled = url.hostname.includes("pooler.supabase.com")
  const port = url.port || "5432"
  if (url.hostname.startsWith("db.") && url.hostname.endsWith(".supabase.co")) {
    return {
      name: "database: connection string",
      ok: false,
      detail: "DATABASE_URL uses the direct connection (db.<project>.supabase.co). Vercel functions need the pooled one.",
      fix:
        "Supabase → Connect → Transaction pooler: use that string (port 6543) for DATABASE_URL, add ?pgbouncer=true&connection_limit=1, " +
        "and put the direct/session string (port 5432) in DIRECT_URL.",
    }
  }
  if (pooled && port === "6543" && url.searchParams.get("pgbouncer") !== "true") {
    return {
      name: "database: connection string",
      ok: false,
      detail: "DATABASE_URL uses the transaction pooler (port 6543) without ?pgbouncer=true",
      fix: "Add ?pgbouncer=true&connection_limit=1 to the end of DATABASE_URL, then redeploy.",
    }
  }
  return { name: "database: connection string", ok: true, detail: pooled ? `pooled connection, port ${port}` : `port ${port}` }
}

/** Turns a Prisma error into a plain explanation without exposing its message. */
function explainDbError(err: unknown): { detail: string; fix: string } {
  const code =
    err instanceof Prisma.PrismaClientKnownRequestError
      ? err.code
      : err instanceof Prisma.PrismaClientInitializationError
        ? err.errorCode
        : undefined
  const message = err instanceof Error ? err.message : ""

  if (code === "P1001" || /Can't reach database server/i.test(message))
    return { detail: "The database server can't be reached", fix: "Check the host and port in DATABASE_URL, and that the Supabase project isn't paused." }
  if (code === "P1000" || /Authentication failed|password authentication failed/i.test(message))
    return { detail: "The database rejected the username or password", fix: "Copy the connection string again from Supabase → Connect, with the database password filled in (Settings → Database lets you reset it)." }
  if (code === "P1003")
    return { detail: "The database named in DATABASE_URL does not exist", fix: "The database name at the end of the URL should normally be /postgres." }
  if (code === "P2021" || /does not exist in the current database/i.test(message))
    return { detail: "The database is reachable but the tables have not been created", fix: "Run `npx prisma db push` once against this database (with DATABASE_URL and DIRECT_URL set), then `npm run db:seed` if you want test accounts." }
  if (/prepared statement .* (already|does not) exist/i.test(message))
    return { detail: "The pooler is rejecting Prisma's prepared statements", fix: "Add ?pgbouncer=true&connection_limit=1 to DATABASE_URL." }
  if (/Environment variable not found/i.test(message))
    return { detail: "A database setting is missing", fix: "Set both DATABASE_URL and DIRECT_URL, then redeploy." }
  if (/timed out|timeout/i.test(message))
    return { detail: "The database took too long to answer", fix: "Use the pooled connection string (port 6543) and check that the Supabase project is running." }
  return { detail: `Database error${code ? ` ${code}` : ""}`, fix: "See Vercel → Logs for the full message." }
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))])
}

async function databaseChecks(): Promise<Check[]> {
  if (!has("DATABASE_URL")) return []
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 8000)
  } catch (err) {
    return [{ name: "database: connection", ok: false, ...explainDbError(err) }]
  }
  const checks: Check[] = [{ name: "database: connection", ok: true, detail: "connected" }]
  try {
    const [users, skills] = await withTimeout(Promise.all([prisma.user.count(), prisma.skill.count()]), 8000)
    checks.push({
      name: "database: tables",
      ok: true,
      detail: `tables exist (${users} users, ${skills} skills)`,
      fix: skills === 0 ? "No skills yet — the application's Skills step will be empty. Run `npm run db:seed` once." : undefined,
    })
  } catch (err) {
    checks.push({ name: "database: tables", ok: false, ...explainDbError(err) })
  }
  return checks
}

async function supabaseCheck(): Promise<Check | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const res = await withTimeout(fetch(`${url.replace(/\/$/, "")}/auth/v1/settings`, { headers: { apikey: key }, cache: "no-store" }), 8000)
    if (res.ok) return { name: "supabase: auth", ok: true, detail: "keys accepted" }
    return {
      name: "supabase: auth",
      ok: false,
      detail: res.status === 401 ? "Supabase rejected NEXT_PUBLIC_SUPABASE_ANON_KEY" : `Supabase answered with status ${res.status}`,
      fix: "Copy the Project URL and the anon/public key again from Supabase → Project Settings → API, then redeploy.",
    }
  } catch {
    return {
      name: "supabase: auth",
      ok: false,
      detail: "NEXT_PUBLIC_SUPABASE_URL can't be reached",
      fix: "It should look like https://<project>.supabase.co, copied from Supabase → Project Settings → API.",
    }
  }
}

/** Supabase project ref from a URL — public information (it is in the browser bundle). */
function supabaseRef(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    const u = new URL(raw)
    // https://<ref>.supabase.co · db.<ref>.supabase.co · postgres.<ref>@…pooler.supabase.com
    const fromUser = /^postgres\.([a-z0-9]+)$/.exec(decodeURIComponent(u.username))?.[1]
    const fromHost = /^(?:db\.)?([a-z0-9]{15,})\.supabase\.co$/.exec(u.hostname)?.[1]
    return fromUser ?? fromHost ?? null
  } catch {
    return null
  }
}

function projectChecks(): Check[] {
  const checks: Check[] = []
  const authRef = supabaseRef(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const dbRef = supabaseRef(process.env.DATABASE_URL)
  if (authRef && dbRef && authRef !== dbRef) {
    checks.push({
      name: "supabase: same project",
      ok: false,
      detail: `Sign-in uses Supabase project ${authRef} but the database is project ${dbRef}`,
      fix: "People would sign in to one project and their data would be looked up in another. Take DATABASE_URL, DIRECT_URL and the API keys from the same Supabase project.",
    })
  } else if (authRef || dbRef) {
    checks.push({ name: "supabase: same project", ok: true, detail: `Using Supabase project ${authRef ?? dbRef}` })
  }

  const appUrl = getAppUrl()
  const appHost = (() => { try { return new URL(appUrl).host } catch { return appUrl } })()
  const isPreview = process.env.VERCEL_ENV === "preview"
  const pinned = !!process.env.NEXT_PUBLIC_APP_URL?.trim()
  checks.push(
    isPreview && pinned
      ? {
          name: "email links (optional)",
          ok: false,
          detail: `This is a preview, but NEXT_PUBLIC_APP_URL is set, so emails from it link to ${appHost}`,
          fix: "In Vercel, set NEXT_PUBLIC_APP_URL for Production only. Previews then link to their own address.",
        }
      : { name: "email links", ok: true, detail: `Emails link to ${appHost}` }
  )
  return checks
}

/** Calls a provider's free "who am I / list models" endpoint. Never sends prompts, never spends tokens. */
async function probe(url: string, headers: Record<string, string>): Promise<{ status: number; body: unknown } | null> {
  try {
    const res = await withTimeout(fetch(url, { headers, cache: "no-store" }), 8000)
    const body = await res.json().catch(() => null)
    return { status: res.status, body }
  } catch {
    return null
  }
}

const rejected = (status: number) => status === 400 || status === 401 || status === 403

function modelIds(body: unknown): string[] {
  const data = (body as { data?: { id?: string }[] } | null)?.data ?? []
  return data.map((m) => (m.id ?? "").replace(/^models\//, ""))
}

async function aiChecks(): Promise<Check[]> {
  const checks: Check[] = []

  if (has("GROQ_API_KEY")) {
    const r = await probe("https://api.groq.com/openai/v1/models", { Authorization: `Bearer ${process.env.GROQ_API_KEY!.trim()}` })
    if (!r) checks.push({ name: "ai: Groq (optional)", ok: false, detail: "Groq could not be reached from this deployment", fix: "Try again in a minute; if it persists, check status.groq.com." })
    else if (rejected(r.status)) checks.push({ name: "ai: Groq (optional)", ok: false, detail: "Groq rejected GROQ_API_KEY", fix: "Create a new key at console.groq.com → API Keys, paste it without spaces or quotes, then redeploy." })
    else if (r.status !== 200) checks.push({ name: "ai: Groq (optional)", ok: false, detail: `Groq answered with status ${r.status}` })
    else {
      const ids = modelIds(r.body)
      // The brief analysis uses the fast model; the default model is kept for future features.
      const missing = [env.groqFastModel, env.groqDefaultModel].filter((m) => !ids.includes(m))
      checks.push(
        missing.length === 0
          ? { name: "ai: Groq", ok: true, detail: `key accepted; models ${env.groqFastModel} and ${env.groqDefaultModel} available` }
          : {
              name: "ai: Groq (optional)",
              ok: missing[0] !== env.groqFastModel,
              detail: `key accepted, but Groq doesn't offer: ${missing.join(", ")}`,
              fix: "Pick a current model id from console.groq.com/docs/models and set GROQ_FAST_MODEL (used by the brief analysis) / GROQ_DEFAULT_MODEL in Vercel.",
            }
      )
    }
  }

  if (has("GOOGLE_AI_API_KEY")) {
    const r = await probe("https://generativelanguage.googleapis.com/v1beta/openai/models", { Authorization: `Bearer ${process.env.GOOGLE_AI_API_KEY!.trim()}` })
    if (!r) checks.push({ name: "ai: Gemini fallback (optional)", ok: false, detail: "Google AI could not be reached from this deployment" })
    else if (rejected(r.status)) checks.push({ name: "ai: Gemini fallback (optional)", ok: false, detail: "Google rejected GOOGLE_AI_API_KEY", fix: "Create a key at aistudio.google.com → Get API key, paste it without spaces or quotes, then redeploy." })
    else if (r.status !== 200) checks.push({ name: "ai: Gemini fallback (optional)", ok: false, detail: `Google AI answered with status ${r.status}` })
    else if (!modelIds(r.body).includes(env.geminiModel))
      checks.push({ name: "ai: Gemini fallback (optional)", ok: false, detail: `key accepted, but Google doesn't offer ${env.geminiModel}`, fix: "Set GEMINI_MODEL in Vercel to a current model id from ai.google.dev/gemini-api/docs/models." })
    else checks.push({ name: "ai: Gemini fallback", ok: true, detail: `key accepted; model ${env.geminiModel} available` })
  } else if (has("GROQ_API_KEY")) {
    checks.push({ name: "ai: Gemini fallback (optional)", ok: false, detail: "Not set up — when Groq is rate-limited the brief analysis will fail instead of switching to Gemini", fix: "Add GOOGLE_AI_API_KEY (free at aistudio.google.com)." })
  }

  if (has("HUGGINGFACE_API_KEY")) {
    const r = await probe("https://huggingface.co/api/whoami-v2", { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY!.trim()}` })
    checks.push(
      r?.status === 200
        ? { name: "ai: Hugging Face (not used yet)", ok: true, detail: "key accepted — reserved for semantic matching, which isn't built yet" }
        : r
          ? { name: "ai: Hugging Face (optional)", ok: false, detail: "Hugging Face rejected HUGGINGFACE_API_KEY (not used by any feature yet)", fix: "Create a read token at huggingface.co/settings/tokens." }
          : { name: "ai: Hugging Face (optional)", ok: false, detail: "Hugging Face could not be reached from this deployment (not used by any feature yet)" }
    )
  }

  if (has("LANGFUSE_PUBLIC_KEY") && has("LANGFUSE_SECRET_KEY")) {
    const auth = Buffer.from(`${process.env.LANGFUSE_PUBLIC_KEY!.trim()}:${process.env.LANGFUSE_SECRET_KEY!.trim()}`).toString("base64")
    const base = env.langfuseBaseUrl.replace(/\/$/, "")
    const r = await probe(`${base}/api/public/projects`, { Authorization: `Basic ${auth}` })
    checks.push(
      r?.status === 200
        ? { name: "ai: Langfuse (not used yet)", ok: true, detail: "keys accepted — reserved for AI monitoring, which isn't wired up yet" }
        : { name: "ai: Langfuse (optional)", ok: false, detail: r ? "Langfuse rejected the public/secret key pair (not used by any feature yet)" : `Langfuse could not be reached at ${base}`, fix: "Copy both keys from the same Langfuse project; if your project is in the US region set LANGFUSE_BASE_URL=https://us.cloud.langfuse.com." }
    )
  } else if (has("LANGFUSE_PUBLIC_KEY") !== has("LANGFUSE_SECRET_KEY")) {
    checks.push({ name: "ai: Langfuse (optional)", ok: false, detail: "Only one of LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY is set", fix: "Add both keys from the same Langfuse project." })
  }

  return checks
}

export async function GET() {
  const [db, supabase, ai] = await Promise.all([databaseChecks(), supabaseCheck(), aiChecks()])
  const checks = [...settingsChecks(), connectionStringCheck(), ...db, supabase, ...projectChecks(), ...ai].filter((c): c is Check => c !== null)

  // Only core problems mean "the buttons won't work"; optional features are reported but don't fail the check.
  const coreFailures = checks.filter((c) => !c.ok && !c.name.endsWith("(optional)"))

  return NextResponse.json(
    {
      ok: coreFailures.length === 0,
      summary:
        coreFailures.length === 0
          ? "Core setup looks good: sign-in and the buttons should work. Items marked (optional) only affect the feature they name."
          : `${coreFailures.length} problem(s) will stop sign-in and the buttons from working — see the "fix" lines.`,
      deployment: {
        branch: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown (not on Vercel, or system variables are hidden)",
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      },
      checks,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
