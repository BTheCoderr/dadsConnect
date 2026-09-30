import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const supabase = await getSupabaseServerClient()
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  const { data: { user }, error: userErr } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()

  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [profileResult, privateResult, groupsResult, meetupsResult, threadsResult] = await Promise.all([
    supabase.from("profiles").select("id,name,avatar_url,bio,interests,created_at").eq("id", user.id).maybeSingle(),
    supabase.from("profile_private").select("kids_ages,city,state,city_opt_in").eq("user_id", user.id).maybeSingle(),
    supabase.from("group_members").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("meetup_attendees").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("threads").select("*", { count: "exact", head: true }).eq("author_id", user.id),
  ])

  if (profileResult.error) return NextResponse.json({ error: profileResult.error.message }, { status: 500 })
  if (privateResult.error) return NextResponse.json({ error: privateResult.error.message }, { status: 500 })

  const profile = profileResult.data
  const privateProfile = privateResult.data

  return NextResponse.json({
    ok: true,
    profile: profile ? {
      id: profile.id,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      interests: profile.interests ?? [],
      createdAt: profile.created_at,
    } : null,
    privateProfile: privateProfile ? {
      kidsAges: privateProfile.kids_ages ?? [],
      city: privateProfile.city,
      state: privateProfile.state,
      cityOptIn: privateProfile.city_opt_in,
    } : null,
    stats: {
      groups: groupsResult.count ?? 0,
      meetups: meetupsResult.count ?? 0,
      discussions: threadsResult.count ?? 0,
    },
  })
}
