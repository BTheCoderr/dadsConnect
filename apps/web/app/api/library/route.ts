import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const supabase = await getSupabaseServerClient()
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  const {
    data: { user },
    error: userError,
  } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("saves")
    .select(
      `id, read_status, ts,
       content:content_id (id, title, image, excerpt, read_time, source:source_id (name))`,
    )
    .eq("user_id", user.id)
    .order("ts", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data ?? []).map((row: any) => ({
    id: row.id,
    source: row.content?.source?.name ?? "",
    title: row.content?.title ?? "",
    image: row.content?.image ?? null,
    excerpt: row.content?.excerpt ?? "",
    read_time: row.content?.read_time ?? 5,
    read_status: row.read_status ?? "unread",
  }))

  return NextResponse.json({ items })
}


