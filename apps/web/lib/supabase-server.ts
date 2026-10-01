import { cookies, headers } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@dadsconnect/shared"

function env(name: string, fallback?: string) {
  const value = process.env[name] || (fallback ? process.env[fallback] : undefined)
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export async function getSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const url = env("NEXT_PUBLIC_SUPABASE_URL")
  const key = env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const cookieStore = await cookies()
  const headersList = await headers()
  const authHeader = headersList.get("authorization")
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (bearer) {
    return createSupabaseClient<Database>(url, key, {
      global: { headers: { Authorization: `Bearer ${bearer}` } },
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    })
  }

  return createServerClient<Database>(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
