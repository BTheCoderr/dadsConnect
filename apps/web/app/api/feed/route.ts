import type { NextRequest } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { httpErrors, jsonOk } from "@/lib/http"
import { rankFeed, type ContentItem } from "@dadsconnect/shared"

export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url)
  const cursor=searchParams.get("cursor")
  const supabase=await getSupabaseServerClient()

  let query=supabase
    .from("content")
    .select("id,source_id,url,title,image,topics,read_time,published_at,excerpt,sources!content_source_id_fkey(name)")
    .order("published_at",{ascending:false})
    .limit(20)

  if(cursor) query=query.lt("published_at",cursor)

  const {data,error}=await query
  if(error) return httpErrors.server("Failed to load feed",error)

  const items:ContentItem[]=(data ?? []).map(row => ({
    id:row.id,
    sourceId:row.source_id,
    source:row.sources?.name ?? null,
    url:row.url,
    title:row.title,
    image:row.image,
    topics:row.topics ?? [],
    readTime:row.read_time ?? 5,
    publishedAt:row.published_at,
    excerpt:row.excerpt,
  }))

  let interests:string[]=[]
  const {data:{user}}=await supabase.auth.getUser()
  if(user){
    const {data:profile}=await supabase
      .from("profiles")
      .select("interests")
      .eq("id",user.id)
      .maybeSingle()
    interests=(profile?.interests ?? []).filter(Boolean)
  }

  const ranked=rankFeed(items,{interests})
  const nextCursor=data?.length === 20 ? data[data.length-1]?.published_at : null
  return jsonOk({items:ranked,nextCursor})
}
