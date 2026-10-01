import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@dadsconnect/shared"

function requiredPublicEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

const supabaseUrl = requiredPublicEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
)

const supabaseKey = requiredPublicEnv(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
)

export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
