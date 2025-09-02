import { z } from "zod"
import { httpErrors, jsonOk } from "@/lib/http"
import { getSupabaseServerClient } from "@/lib/supabase-server"

const paramsSchema = z.object({ groupId: z.string().uuid().or(z.string().min(1)) })

export async function GET(_: Request, { params }: { params: { groupId: string } }) {
  const parsed = paramsSchema.safeParse(params)
  if (!parsed.success) return httpErrors.badRequest("Invalid group id", parsed.error.flatten())

  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("threads")
    .select("id, group_id, author_id, title, body, ts, reactions")
    .eq("group_id", parsed.data.groupId)
    .order("ts", { ascending: false })
    .limit(50)

  if (error) return httpErrors.server("Failed to load threads", error)

  const items = (data ?? []).map((t) => ({
    id: t.id as string,
    groupId: t.group_id as string,
    authorId: t.author_id as string,
    title: t.title as string,
    body: t.body as string,
    ts: t.ts as string,
    reactions: (t.reactions as Record<string, number> | null) ?? undefined,
  }))

  return jsonOk({ items })
}


