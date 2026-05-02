// Type-safe environment variable access
// Throws at startup if required variables are missing

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

function optional(key: string): string | undefined {
  return process.env[key]
}

export const env = {
  // Core
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",

  // Database
  databaseUrl: () => required("DATABASE_URL"),
  directUrl: () => required("DIRECT_URL"),

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),

  // AI
  groqApiKey: () => required("GROQ_API_KEY"),
  googleAiApiKey: () => required("GOOGLE_AI_API_KEY"),
  huggingFaceApiKey: () => required("HUGGINGFACE_API_KEY"),
  langfuseSecretKey: () => required("LANGFUSE_SECRET_KEY"),
  langfusePublicKey: () => required("LANGFUSE_PUBLIC_KEY"),
  langfuseBaseUrl: process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com",

  // AI models
  groqDefaultModel: process.env.GROQ_DEFAULT_MODEL ?? "llama-3.3-70b-versatile",
  groqFastModel: process.env.GROQ_FAST_MODEL ?? "llama-3.1-8b-instant",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",

  // Company
  companyName: process.env.COMPANY_LEGAL_NAME ?? "SheConnects SRL",
  commissionPercentage: Number(process.env.COMMISSION_PERCENTAGE ?? "20"),
  defaultVatRate: Number(process.env.DEFAULT_VAT_RATE ?? "0.22"),

  // Auth
  authSecret: () => required("AUTH_SECRET"),

  // R2 Storage
  r2AccountId: optional("R2_ACCOUNT_ID"),
  r2AccessKeyId: optional("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: optional("R2_SECRET_ACCESS_KEY"),
  r2BucketName: optional("R2_BUCKET_NAME"),
  r2PublicUrl: optional("R2_PUBLIC_URL"),

  // Stripe
  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

  // Email
  resendApiKey: optional("RESEND_API_KEY"),
  emailFrom: process.env.EMAIL_FROM ?? "SheConnects <hello@sheconnects.work>",
} as const
