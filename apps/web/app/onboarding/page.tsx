"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, MinusIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

const commonInterests=[
  "Parenting Tips","Child Development","Work-Life Balance","Mental Health",
  "Outdoor Activities","Travel with Kids","Gear Reviews","Productivity",
  "Finance","Education","Health & Fitness","Hobbies",
]

export default function OnboardingPage(){
  const router=useRouter()
  const [step,setStep]=useState(1)
  const [kidAges,setKidAges]=useState<string[]>([""])
  const [interests,setInterests]=useState<string[]>([])
  const [city,setCity]=useState("")
  const [state,setState]=useState("")
  const [shareCity,setShareCity]=useState(false)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
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
      const [{data:profile},{data:privateProfile}]=await Promise.all([
        supabase.from("profiles").select("interests").eq("id",user.id).maybeSingle(),
        supabase.from("profile_private").select("kids_ages,city,state,city_opt_in").eq("user_id",user.id).maybeSingle(),
      ])
      if(cancelled) return
      if(profile) setInterests(profile.interests)
      if(privateProfile){
        if(privateProfile.kids_ages.length) setKidAges(privateProfile.kids_ages)
        setCity(privateProfile.city || "")
        setState(privateProfile.state || "")
        setShareCity(privateProfile.city_opt_in)
      }
      setLoading(false)
    })()
    return () => { cancelled=true }
  },[router])

  const next=() => {
    const ages=kidAges.map(value => value.trim()).filter(Boolean)
    if(step === 1 && ages.length === 0){
      setError("Add at least one kid age range.")
      return
    }
    if(step === 2 && interests.length === 0){
      setError("Choose at least one interest.")
      return
    }
    setError(null)
    setStep(current => Math.min(3,current+1))
  }

  const save=async () => {
    setSaving(true)
    setError(null)
    const supabase=getSupabaseBrowserClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){
      router.replace("/login")
      return
    }

    const [profileUpdate,privateUpdate]=await Promise.all([
      supabase.from("profiles").update({interests}).eq("id",user.id),
      supabase.from("profile_private").upsert({
        user_id:user.id,
        kids_ages:kidAges.map(value => value.trim()).filter(Boolean),
        city:city.trim() || null,
        state:state.trim() || null,
        city_opt_in:Boolean(shareCity && city.trim()),
      },{onConflict:"user_id"}),
    ])

    const updateError=profileUpdate.error || privateUpdate.error
    if(updateError){
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.replace("/feed")
    router.refresh()
  }

  const updateAge=(index:number,value:string) => {
    setKidAges(current => current.map((age,i) => i === index ? value : age))
  }

  if(loading){
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading your profile…</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Step {step} of 3</p>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Your family stage"}
            {step === 2 && "What are you into?"}
            {step === 3 && "Your local community"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Age ranges help surface useful conversations without asking for your kids' names."}
            {step === 2 && "Choose the topics you want DadConnect to prioritize."}
            {step === 3 && "Location is optional. You control whether your city is used for local discovery."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              {kidAges.map((age,index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`kid-age-${index}`}>Kid {index+1} age range</Label>
                    <Input id={`kid-age-${index}`} value={age} onChange={event => updateAge(index,event.target.value)} placeholder="e.g. 0-1, 2-5, 6-10" />
                  </div>
                  {kidAges.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => setKidAges(current => current.filter((_,i) => i !== index))}>
                      <MinusIcon className="h-4 w-4" /><span className="sr-only">Remove age</span>
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => setKidAges(current => [...current,""])}>
                <PlusIcon className="mr-2 h-4 w-4" />Add another
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {commonInterests.map(interest => {
                const checked=interests.includes(interest)
                return (
                  <button key={interest} type="button" onClick={() => setInterests(current => checked ? current.filter(item => item !== interest) : [...current,interest])}
                    className={`flex items-center rounded-lg border p-3 text-left text-sm font-medium transition-colors ${checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-accent"}`}>
                    <Checkbox checked={checked} className="mr-2" tabIndex={-1} />
                    <span>{interest}</span>
                  </button>
                )
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Optional" /></div>
                <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={state} onChange={e => setState(e.target.value)} placeholder="Optional" /></div>
              </div>
              <label className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox checked={shareCity} onCheckedChange={value => setShareCity(value === true)} disabled={!city.trim()} />
                <span><strong className="block text-sm">Use my city for local discovery</strong><span className="text-xs text-muted-foreground">DadConnect can use your city to surface nearby groups and meetups. Exact addresses are not part of your profile.</span></span>
              </label>
            </div>
          )}

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            {step > 1 && <Button type="button" variant="outline" className="w-full" onClick={() => {setError(null);setStep(current => current-1)}}>Back</Button>}
            {step < 3
              ? <Button type="button" className="w-full" onClick={next}>Next</Button>
              : <Button type="button" className="w-full" onClick={save} disabled={saving}>{saving ? "Saving…" : "Finish setup"}</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
