import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import type { Thread } from "@dadsconnect/shared"

const createThreadSchema=z.object({
  groupId:z.string().uuid(),
  title:z.string().trim().min(1).max(160),
  body:z.string().trim().min(1).max(10000),
})

export async function GET(req:NextRequest){
  try{
    const supabase=await getSupabaseServerClient()
    const {data:{user},error:authError}=await supabase.auth.getUser()
    if(authError || !user) return NextResponse.json({error:"Unauthorized"},{status:401})

    const {searchParams}=new URL(req.url)
    const limit=Math.min(50,Math.max(1,Number(searchParams.get("limit") || 30)))
    const cursor=searchParams.get("cursor")
    const groupId=searchParams.get("group_id")

    let query=supabase
      .from("threads")
      .select(`
        id,
        group_id,
        author_id,
        title,
        body,
        ts,
        reactions,
        dad_groups!threads_group_id_fkey(id,name,category),
        profiles!threads_author_id_fkey(id,name,avatar_url)
      `)
      .order("ts",{ascending:false})
      .limit(limit)

    if(cursor) query=query.lt("ts",cursor)
    if(groupId) query=query.eq("group_id",groupId)

    const {data,error}=await query
    if(error){
      console.error("Error loading discussions:",error)
      return NextResponse.json({error:"Failed to load discussions"},{status:500})
    }

    const threads:Thread[]=(data || []).map(row => ({
      id:row.id,
      groupId:row.group_id,
      authorId:row.author_id,
      title:row.title,
      body:row.body,
      ts:row.ts,
      reactions:(row.reactions as Record<string,number> | null) || undefined,
      author:row.profiles ? {
        id:row.profiles.id,
        name:row.profiles.name,
        avatarUrl:row.profiles.avatar_url,
      } : undefined,
      group:row.dad_groups ? {
        id:row.dad_groups.id,
        name:row.dad_groups.name,
        category:row.dad_groups.category as Thread["group"] extends infer G ? G extends {category:infer C} ? C : never : never,
      } : undefined,
    }))

    return NextResponse.json({
      threads,
      nextCursor:threads.length === limit ? threads[threads.length-1]?.ts : null,
    })
  }catch(error){
    console.error("Error in discussions API:",error)
    return NextResponse.json({error:"Internal server error"},{status:500})
  }
}

export async function POST(req:NextRequest){
  try{
    const supabase=await getSupabaseServerClient()
    const {data:{user},error:authError}=await supabase.auth.getUser()
    if(authError || !user) return NextResponse.json({error:"Unauthorized"},{status:401})

    const parsed=createThreadSchema.safeParse(await req.json().catch(() => ({})))
    if(!parsed.success){
      return NextResponse.json({error:"Invalid discussion",details:parsed.error.flatten()},{status:400})
    }

    const {data,error}=await supabase
      .from("threads")
      .insert({
        group_id:parsed.data.groupId,
        author_id:user.id,
        title:parsed.data.title,
        body:parsed.data.body,
      })
      .select("id,group_id,author_id,title,body,ts,reactions")
      .single()

    if(error){
      console.error("Error creating discussion:",error)
      const status=error.code === "42501" ? 403 : 500
      return NextResponse.json({error:status === 403 ? "Join this group before starting a discussion." : "Failed to create discussion"},{status})
    }

    return NextResponse.json({
      thread:{
        id:data.id,
        groupId:data.group_id,
        authorId:data.author_id,
        title:data.title,
        body:data.body,
        ts:data.ts,
        reactions:(data.reactions as Record<string,number> | null) || undefined,
      } satisfies Thread,
    },{status:201})
  }catch(error){
    console.error("Error in create discussion API:",error)
    return NextResponse.json({error:"Internal server error"},{status:500})
  }
}
