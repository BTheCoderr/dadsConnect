import { createBrowserClient } from "@supabase/ssr"

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] || (fallback ? process.env[fallback] : undefined)
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  )
}
