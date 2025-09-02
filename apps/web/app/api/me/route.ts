import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const supabase = getSupabaseServerClient()
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  const {
    data: { user },
    error: userErr,
  } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()

  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 })

  if (!user) return NextResponse.json({ ok: false, profile: null, flags: {} }, { status: 200 })

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, city_opt_in, interests, created_at")
    .eq("id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    profile: profile
      ? {
          id: profile.id,
          name: profile.name,
          avatarUrl: profile.avatar_url,
          cityOptIn: profile.city_opt_in,
          interests: profile.interests ?? [],
          createdAt: profile.created_at,
        }
      : null,
    flags: {},
  })
}


