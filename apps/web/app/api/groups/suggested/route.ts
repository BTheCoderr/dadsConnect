import { httpErrors, jsonOk } from "@/lib/http"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("dad_groups")
    .select("id, name, topics, visibility, member_count")
    .order("member_count", { ascending: false })
    .limit(12)

  if (error) return httpErrors.server("Failed to load groups", error)

  const items = (data ?? []).map((g) => ({
    id: g.id as string,
    name: g.name as string,
    topics: (g.topics as string[]) ?? [],
    memberCount: (g.member_count as number) ?? 0,
    visibility: (g.visibility as "public" | "private") ?? "public",
  }))

  return jsonOk({ items })
}


