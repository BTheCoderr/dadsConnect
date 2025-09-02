import { createClient } from '@supabase/supabase-js'

// For server-side operations that need direct database access
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// For database migrations and seeding
export function getDatabaseUrl() {
  return process.env.DATABASE_URL!
}
