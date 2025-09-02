import { jsonOk } from "@/lib/http"

export async function GET() {
  // TODO: replace with Supabase query once groups data exists
  return jsonOk({
    items: [
      { id: "g1", name: "New Dads Support", topics: ["newborn"], memberCount: 1247, visibility: "public" },
      { id: "g2", name: "Single Dads Unite", topics: ["single-parenting"], memberCount: 892, visibility: "public" },
    ],
  })
}

import { httpErrors, jsonOk } from "@/lib/http"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("groups")
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


