import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  const {
    data: { user },
    error: userError,
  } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()
  if (userError || !user) return new NextResponse("Unauthorized", { status: 401 })

  const { error } = await supabase.from("saves").delete().eq("id", params.id).eq("user_id", user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}


