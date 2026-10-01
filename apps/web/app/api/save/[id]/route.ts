import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase-server"

const patchSchema=z.object({
  readStatus:z.enum(["read","unread"]).optional(),
  note:z.string().trim().max(2000).nullable().optional(),
}).refine(value => value.readStatus !== undefined || value.note !== undefined,{message:"No changes supplied"})

async function getUser(req:Request){
  const supabase=await getSupabaseServerClient()
  const authHeader=req.headers.get("authorization") || req.headers.get("Authorization")
  const token=authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
  const {data:{user},error}=token ? await supabase.auth.getUser(token) : await supabase.auth.getUser()
  return {supabase,user,error}
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  const {supabase,user,error:userError}=await getUser(req)
  if(userError || !user) return NextResponse.json({error:"Unauthorized"},{status:401})

  const { id } = await params
  const parsed=patchSchema.safeParse(await req.json().catch(() => ({})))
  if(!parsed.success) return NextResponse.json({error:"Invalid update"},{status:400})

  const updates:{read_status?:"read"|"unread";note?:string | null}={}
  if(parsed.data.readStatus !== undefined) updates.read_status=parsed.data.readStatus
  if(parsed.data.note !== undefined) updates.note=parsed.data.note

  const {data,error}=await supabase.from("saves").update(updates).eq("id",id).eq("user_id",user.id).select("id,read_status,note,ts").maybeSingle()
  if(error) return NextResponse.json({error:error.message},{status:500})
  if(!data) return NextResponse.json({error:"Saved item not found"},{status:404})

  return NextResponse.json({id:data.id,readStatus:data.read_status,note:data.note,savedAt:data.ts})
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  const {supabase,user,error:userError}=await getUser(req)
  if(userError || !user) return NextResponse.json({error:"Unauthorized"},{status:401})

  const { id } = await params
  const {data,error}=await supabase.from("saves").delete().eq("id",id).eq("user_id",user.id).select("id").maybeSingle()
  if(error) return NextResponse.json({error:error.message},{status:500})
  if(!data) return NextResponse.json({error:"Saved item not found"},{status:404})

  return new NextResponse(null,{status:204})
}
