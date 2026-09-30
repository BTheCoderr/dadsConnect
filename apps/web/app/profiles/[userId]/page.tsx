"use client"

import { useEffect,useState } from "react"
import { useParams,useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar"
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import type { Tables } from "@dadsconnect/shared"

type Profile=Pick<Tables<"profiles">,"id"|"name"|"avatar_url"|"bio"|"interests"|"created_at">

export default function MemberProfilePage(){
  const {userId}=useParams<{userId:string}>()
  const router=useRouter()
  const [profile,setProfile]=useState<Profile | null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const supabase=getSupabaseBrowserClient()
      const {data:{user}}=await supabase.auth.getUser()
      if(!user){
        router.replace("/login")
        return
      }

      const {data,error:profileError}=await supabase
        .from("profiles")
        .select("id,name,avatar_url,bio,interests,created_at")
        .eq("id",userId)
        .maybeSingle()

      if(profileError) setError(profileError.message)
      setProfile(data)
      setLoading(false)
    })()
  },[router,userId])

  if(loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading member…</div>
  if(!profile) return <div className="mx-auto max-w-lg p-8"><p>{error || "Member not found."}</p><Link className="text-blue-600" href="/feed">Back to DadConnect</Link></div>

  const initials=profile.name.split(" ").map(part => part[0]).join("").slice(0,2).toUpperCase()

  return (
    <main className="min-h-screen bg-gray-100 p-4 py-12 dark:bg-gray-950">
      <Card className="mx-auto max-w-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
            <AvatarFallback>{initials || "DC"}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-2xl">{profile.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{profile.bio || "DadConnect member"}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <section><h2 className="font-semibold">Interests</h2><div className="mt-2 flex flex-wrap gap-2">{profile.interests.length ? profile.interests.map(item => <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs">{item}</span>) : <span className="text-sm text-muted-foreground">No public interests yet.</span>}</div></section>
          <p className="text-xs text-muted-foreground">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">Family-stage and location preference data are private and are not shown on member profile cards.</p>
          <Link href="/feed" className="block text-center text-sm font-medium text-blue-600">← Back to DadConnect</Link>
        </CardContent>
      </Card>
    </main>
  )
}
