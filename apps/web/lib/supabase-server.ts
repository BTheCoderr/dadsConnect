import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@dadsconnect/shared"

function env(name: string, fallback?: string) {
  const value = process.env[name] || (fallback ? process.env[fallback] : undefined)
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export async function getSupabaseServerClient() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL")
  const key = env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const cookieStore = await cookies()
  const headersList = await headers()
  const authHeader = headersList.get("authorization")
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  return createServerClient<Database>(url, key, {
    ...(bearer
      ? {
          global: { headers: { Authorization: `Bearer ${bearer}` } },
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        }
      : {}),
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot always write cookies. The request proxy
          // owns refresh persistence when the runtime allows it.
        }
      },
    },
  })
}
