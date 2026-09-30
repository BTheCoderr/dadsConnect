import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@dadsconnect/shared"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
}

export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
