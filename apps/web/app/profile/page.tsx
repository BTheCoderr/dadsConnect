"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar"
import { PencilIcon,LogOutIcon,SaveIcon,XIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import type { Tables } from "@dadsconnect/shared"

type PublicProfile=Tables<"profiles">
type PrivateProfile=Tables<"profile_private">

export default function ProfilePage(){
  const router=useRouter()
  const [profile,setProfile]=useState<PublicProfile | null>(null)
  const [privateProfile,setPrivateProfile]=useState<PrivateProfile | null>(null)
  const [stats,setStats]=useState({groups:0,meetups:0,discussions:0})
  const [editing,setEditing]=useState(false)
  const [name,setName]=useState("")
  const [bio,setBio]=useState("")
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState<string | null>(null)

  const load=async () => {
    const supabase=getSupabaseBrowserClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){
      router.replace("/login")
      return
    }

    const [profileResult,privateResult,groupsResult,meetupsResult,threadsResult]=await Promise.all([
      supabase.from("profiles").select("*").eq("id",user.id).maybeSingle(),
      supabase.from("profile_private").select("*").eq("user_id",user.id).maybeSingle(),
      supabase.from("group_members").select("*",{count:"exact",head:true}).eq("user_id",user.id),
      supabase.from("meetup_attendees").select("*",{count:"exact",head:true}).eq("user_id",user.id),
      supabase.from("threads").select("*",{count:"exact",head:true}).eq("author_id",user.id),
    ])

    if(profileResult.error || privateResult.error){
      setError(profileResult.error?.message || privateResult.error?.message || "Failed to load profile")
    }

    setProfile(profileResult.data)
    setPrivateProfile(privateResult.data)
    setName(profileResult.data?.name || "")
    setBio(profileResult.data?.bio || "")
    setStats({
      groups:groupsResult.count || 0,
      meetups:meetupsResult.count || 0,
      discussions:threadsResult.count || 0,
    })
    setLoading(false)
  }

  useEffect(() => { void load() },[])

  const saveIdentity=async () => {
    if(!profile) return
    const trimmedName=name.trim()
    if(trimmedName.length < 2){
      setError("Name must be at least 2 characters.")
      return
    }

    setSaving(true)
    setError(null)
    const supabase=getSupabaseBrowserClient()
    const {data,error:updateError}=await supabase
      .from("profiles")
      .update({
        name:trimmedName.slice(0,120),
        bio:bio.trim().slice(0,500) || null,
      })
      .eq("id",profile.id)
      .select("*")
      .single()

    if(updateError){
      setError(updateError.message)
      setSaving(false)
      return
    }

    setProfile(data)
    setName(data.name)
    setBio(data.bio || "")
    setEditing(false)
    setSaving(false)
  }

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
  const location=privateProfile?.city
    ? `${privateProfile.city}${privateProfile.state ? `, ${privateProfile.state}` : ""}`
    : "Not added"

  return (
    <main className="min-h-screen bg-gray-100 p-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl space-y-5">
        <Card>
          <CardHeader className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
              <AvatarFallback>{initials || "DC"}</AvatarFallback>
            </Avatar>
            {editing ? (
              <div className="w-full space-y-4">
                <div className="space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" value={name} onChange={event => setName(event.target.value)} maxLength={120} /></div>
                <div className="space-y-2"><Label htmlFor="profile-bio">Bio</Label><textarea id="profile-bio" value={bio} onChange={event => setBio(event.target.value)} maxLength={500} rows={4} className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="A little about you, your interests, or the kind of dad community you're looking for." /></div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={saveIdentity} disabled={saving}><SaveIcon className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>
                  <Button variant="outline" className="flex-1" onClick={() => {setEditing(false);setName(profile.name);setBio(profile.bio || "")}}><XIcon className="mr-2 h-4 w-4" />Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
                <CardDescription className="max-w-lg text-center">{profile.bio || "DadConnect member"}</CardDescription>
                <Button variant="outline" onClick={() => setEditing(true)}><PencilIcon className="mr-2 h-4 w-4" />Edit public profile</Button>
              </>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["Groups",stats.groups],["Meetups",stats.meetups],["Discussions",stats.discussions],
          ].map(([label,value]) => <Card key={label} className="p-4 text-center"><strong className="block text-2xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></Card>)}
        </div>

        <Card>
          <CardHeader><CardTitle>Private preferences</CardTitle><CardDescription>These fields are stored in your self-only profile record and are not part of member profile cards.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <section><h3 className="font-semibold">Family stage</h3><p className="text-sm text-muted-foreground">{privateProfile?.kids_ages.length ? privateProfile.kids_ages.join(", ") : "Not added yet"}</p></section>
            <section><h3 className="font-semibold">Interests</h3><div className="mt-2 flex flex-wrap gap-2">{profile.interests.length ? profile.interests.map(item => <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs">{item}</span>) : <span className="text-sm text-muted-foreground">Not added yet</span>}</div></section>
            <section><h3 className="font-semibold">Location</h3><p className="text-sm text-muted-foreground">{location}{privateProfile?.city ? (privateProfile.city_opt_in ? " · enabled for local discovery" : " · saved privately") : ""}</p></section>
            <Button className="w-full" onClick={() => router.push("/onboarding")}><PencilIcon className="mr-2 h-4 w-4" />Edit family, interests & discovery</Button>
          </CardContent>
        </Card>

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button variant="outline" className="w-full bg-transparent" onClick={logout}><LogOutIcon className="mr-2 h-4 w-4" />Sign out</Button>
      </div>
    </main>
  )
}
