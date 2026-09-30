"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PencilIcon, LogOutIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import type { Tables } from "@dadsconnect/shared"

type Profile=Tables<"profiles">

export default function ProfilePage(){
  const router=useRouter()
  const [profile,setProfile]=useState<Profile | null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string | null>(null)

  useEffect(() => {
    let cancelled=false
    ;(async () => {
      const supabase=getSupabaseBrowserClient()
      const {data:{user}}=await supabase.auth.getUser()
      if(!user){
        router.replace("/login")
        return
      }
      const {data,error:profileError}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle()
      if(cancelled) return
      if(profileError) setError(profileError.message)
      setProfile(data)
      setLoading(false)
    })()
    return () => {cancelled=true}
  },[router])

  const logout=async () => {
    const supabase=getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace("/login")
    router.refresh()
  }

  if(loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading profile…</div>

  if(!profile){
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4"><p>{error || "Your profile is not available yet."}</p><Button onClick={() => router.push("/onboarding")}>Finish setup</Button></div>
  }

  const initials=profile.name.split(" ").map(part => part[0]).join("").slice(0,2).toUpperCase()

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-950 md:min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
            <AvatarFallback>{initials || "DC"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
          <CardDescription className="text-center">{profile.bio || "DadConnect member"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <section><h3 className="font-semibold">Family stage</h3><p className="text-sm text-muted-foreground">{profile.kids_ages.length ? profile.kids_ages.join(", ") : "Not added yet"}</p></section>
          <section><h3 className="font-semibold">Interests</h3><div className="mt-2 flex flex-wrap gap-2">{profile.interests.length ? profile.interests.map(item => <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs">{item}</span>) : <span className="text-sm text-muted-foreground">Not added yet</span>}</div></section>
          <section><h3 className="font-semibold">Location</h3><p className="text-sm text-muted-foreground">{profile.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ""}${profile.city_opt_in ? " · used for local discovery" : " · private"}` : "Not added"}</p></section>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" onClick={() => router.push("/onboarding")}>
            <PencilIcon className="mr-2 h-4 w-4" />Edit profile
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
