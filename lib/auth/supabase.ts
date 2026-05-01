import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { env } from "@/lib/env"

// Client-side Supabase client (used in Client Components)
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey)
}

// Server-side Supabase client (used in Server Components and Server Actions)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — cookies can't be set from here, only from middleware
        }
      },
    },
  })
}

// Admin Supabase client — bypasses Row Level Security
// Only use in admin server actions and seed scripts
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js")
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
