import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase-server"

const bodySchema = z.object({ contentId: z.string(), note: z.string().optional() })

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  const supabase = getSupabaseServerClient()
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  const {
    data: { user },
    error: userError,
  } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("saves")
    .insert({ user_id: user.id, content_id: parsed.data.contentId, note: parsed.data.note ?? null })
    .select("id, user_id, content_id, note, ts, read_status")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(
    {
      id: data.id,
      userId: data.user_id,
      contentId: data.content_id,
      note: data.note,
      ts: data.ts,
      readStatus: data.read_status,
    },
    { status: 201 },
  )
}


