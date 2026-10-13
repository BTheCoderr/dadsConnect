import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@dadsconnect/shared"
import { getRequestUser, getSupabaseServerClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  // Account deletion is intentionally Bearer-only. It cannot be triggered by
  // a browser cookie or a cross-origin HTML form.
  const authorization = req.headers.get("authorization")
  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ error: "Sign in again to delete your account." }, { status: 401 })
  }
  const payload = await req.json().catch(() => null)
  const password = typeof payload?.password === "string" ? payload.password : ""
  if (payload?.confirmation !== "DELETE" || password.length < 8 || password.length > 500) {
    return NextResponse.json({ error: "Password and deletion confirmation are required." }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !publishable || !serviceKey) {
    return NextResponse.json({ error: "Account deletion is not configured. Contact support." }, { status: 503 })
  }

  try {
    const client = await getSupabaseServerClient()
    const { data: { user }, error: userError } = await getRequestUser(client, req)
    if (userError || !user?.email) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

    // Require password reauthentication for this irreversible action.
    const verifier = createClient(url, publishable, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    const verified = await verifier.auth.signInWithPassword({ email: user.email, password })
    if (verified.error || verified.data.user?.id !== user.id) {
      return NextResponse.json({ error: "Password is incorrect." }, { status: 403 })
    }

    // Privileged client is server-only. It must never be bundled into Expo.
    const admin = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    // Creator foreign keys use ON DELETE RESTRICT, so remove owned
    // meetups and groups before deleting the Auth user/profile cascade.
    const meetups = await admin.from("meetups").delete().eq("created_by", user.id)
    if (meetups.error) throw new Error("Could not remove owned meetups.")
    const groups = await admin.from("dad_groups").delete().eq("created_by", user.id)
    if (groups.error) throw new Error("Could not remove owned groups.")
    const deleted = await admin.auth.admin.deleteUser(user.id)
    if (deleted.error) throw new Error("Could not remove the account.")

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({
      error: "Deletion could not be completed. Please contact support; some owned content may already have been removed.",
    }, { status: 500 })
  }
}
