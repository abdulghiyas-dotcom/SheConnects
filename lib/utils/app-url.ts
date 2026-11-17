/**
 * The public address of this deployment, for links in emails.
 *
 * NEXT_PUBLIC_APP_URL wins when set — set it for Production only (the live
 * domain). Preview deployments then fall back to their own stable branch
 * address (e.g. https://<project>-git-platform-<team>.vercel.app), so emails
 * sent while testing a preview link back to that preview, not the live site.
 */
export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configured) return configured.replace(/\/$/, "")
  const vercelHost = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
  if (vercelHost) return `https://${vercelHost}`
  return "http://localhost:3000"
}
