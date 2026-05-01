import Langfuse from "langfuse"
import { env } from "@/lib/env"

// Langfuse Cloud — monitors all AI activity (cost, quality, latency)
// Free tier: 50,000 AI observations/month at cloud.langfuse.com
export const langfuse = new Langfuse({
  secretKey: env.langfuseSecretKey(),
  publicKey: env.langfusePublicKey(),
  baseUrl: env.langfuseBaseUrl,
})
