import type { NextRequest } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { httpErrors, jsonOk } from "@/lib/http"
import { rankFeed } from "@dadsconnect/shared"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor")

  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("content")
    .select("id, source_id, url, title, image, topics, read_time, published_at, excerpt")
    .order("published_at", { ascending: false })
    .limit(20)

  if (cursor) {
    query = query.lt("published_at", cursor)
  }

  const { data, error } = await query
  if (error) return httpErrors.server("Failed to load feed", error)

  const items = (data ?? []).map((row) => ({
    id: row.id as string,
    sourceId: row.source_id as string,
    url: row.url as string,
    title: row.title as string,
    image: (row.image as string | null) ?? null,
    topics: (row.topics as string[]) ?? [],
    readTime: (row.read_time as number) ?? 5,
    publishedAt: (row.published_at as string) ?? new Date().toISOString(),
    excerpt: (row.excerpt as string | null) ?? undefined,
  }))

  // Personalize ranking using user interests if available
  let interests: string[] = []
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single()
    interests = ((profile?.interests as string[]) ?? []).filter(Boolean)
  }

  const ranked = rankFeed(items, { interests })
  const nextCursor = ranked.length > 0 ? (data?.[data.length - 1]?.published_at as string) : undefined

  return jsonOk({ items: ranked, nextCursor })
}


