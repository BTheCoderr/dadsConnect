import { cookies, headers } from "next/headers"
import { createServerClient, type CookieOptions, createClient } from "@supabase/ssr"

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const authHeader = headersList.get("authorization") || headersList.get("Authorization")
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  // If a bearer token is provided, construct a client with that auth token.
  if (bearer) {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        cookies: {
          get() {
            return undefined
          },
          set() {},
          remove() {},
        },
      },
    )
    // @ts-expect-error setAuth is available in supabase-js; typing via ssr wrapper may differ
    client.auth.setAuth(bearer)
    return client
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
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
    },
  )
}

// Export createClient for backward compatibility
export { createClient }


