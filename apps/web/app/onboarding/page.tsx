"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, MinusIcon } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

const commonInterests=["Parenting Tips","Child Development","Work-Life Balance","Mental Health","Outdoor Activities","Travel with Kids","Gear Reviews","Productivity","Finance","Education","Health & Fitness","Hobbies"]
const stepMeta=[
  {eyebrow:"YOUR SEASON",title:"What does dad life look like right now?",copy:"Age ranges help us surface useful conversations without asking for your kids' names.",emoji:"👟"},
  {eyebrow:"YOUR PEOPLE",title:"What could you talk about all day?",copy:"Pick a few things you care about. This helps DadConnect put the right conversations in front of you.",emoji:"💬"},
  {eyebrow:"YOUR AREA",title:"Want to find dads nearby?",copy:"Location is optional. You decide whether your city is used to surface local groups and meetups.",emoji:"📍"},
]

export default function OnboardingPage(){
  const router=useRouter(); const [step,setStep]=useState(1); const [kidAges,setKidAges]=useState<string[]>([""]); const [interests,setInterests]=useState<string[]>([]); const [city,setCity]=useState(""); const [state,setState]=useState(""); const [shareCity,setShareCity]=useState(false); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState<string | null>(null)
  useEffect(()=>{let cancelled=false;(async()=>{const supabase=getSupabaseBrowserClient();const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/login");return}const [{data:profile},{data:privateProfile}]=await Promise.all([supabase.from("profiles").select("interests").eq("id",user.id).maybeSingle(),supabase.from("profile_private").select("kids_ages,city,state,city_opt_in").eq("user_id",user.id).maybeSingle()]);if(cancelled)return;if(profile)setInterests(profile.interests);if(privateProfile){if(privateProfile.kids_ages.length)setKidAges(privateProfile.kids_ages);setCity(privateProfile.city||"");setState(privateProfile.state||"");setShareCity(privateProfile.city_opt_in)}setLoading(false)})();return()=>{cancelled=true}},[router])
  const next=()=>{const ages=kidAges.map(v=>v.trim()).filter(Boolean);if(step===1&&ages.length===0){setError("Add at least one kid age range.");return}if(step===2&&interests.length===0){setError("Choose at least one interest.");return}setError(null);setStep(c=>Math.min(3,c+1))}
  const save=async()=>{setSaving(true);setError(null);const supabase=getSupabaseBrowserClient();const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/login");return}const [profileUpdate,privateUpdate]=await Promise.all([supabase.from("profiles").update({interests}).eq("id",user.id),supabase.from("profile_private").upsert({user_id:user.id,kids_ages:kidAges.map(v=>v.trim()).filter(Boolean),city:city.trim()||null,state:state.trim()||null,city_opt_in:Boolean(shareCity&&city.trim())},{onConflict:"user_id"})]);const updateError=profileUpdate.error||privateUpdate.error;if(updateError){setError(updateError.message);setSaving(false);return}router.replace("/feed");router.refresh()}
  const updateAge=(index:number,value:string)=>setKidAges(c=>c.map((age,i)=>i===index?value:age))
  if(loading)return <div className="flex min-h-screen items-center justify-center bg-[#f4f1e9] text-sm font-semibold text-[#667187]">Getting your crew ready…</div>
  const meta=stepMeta[step-1]
  return (
    <main className="min-h-screen bg-[#f4f1e9] px-4 py-8 text-[#10213d] sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-9 flex items-center justify-between"><div className="flex items-center gap-3 font-black"><span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary text-xs text-white shadow-[0_4px_0_#173b93]">DC</span>DadConnect</div><span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#697386]">STEP {step} / 3</span></div>
        <div className="mb-8 grid grid-cols-3 gap-2">{[1,2,3].map(n=><div key={n} className={`h-2 rounded-full ${n<=step?"bg-primary":"bg-[#d9d3c8]"}`} />)}</div>
        <section className="relative rounded-[32px] border-2 border-[#d8d1c4] bg-white p-6 shadow-[0_12px_0_rgba(16,33,61,.08)] sm:p-10">
          <div className="absolute -right-3 -top-5 flex h-16 w-16 rotate-6 items-center justify-center rounded-[20px] bg-[#f5c85b] text-3xl shadow-[0_4px_0_#d7a52d]">{meta.emoji}</div>
          <p className="text-xs font-black tracking-[.18em] text-primary">{meta.eyebrow}</p><h1 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">{meta.title}</h1><p className="mt-3 max-w-xl leading-7 text-[#697386]">{meta.copy}</p>
          <div className="mt-9">
            {step===1&&<div className="space-y-4">{kidAges.map((age,index)=><div key={index} className="flex items-end gap-2"><div className="flex-1 space-y-2"><Label htmlFor={`kid-age-${index}`} className="font-bold">Kid {index+1} age range</Label><Input id={`kid-age-${index}`} value={age} onChange={e=>updateAge(index,e.target.value)} placeholder="e.g. 0-1, 2-5, 6-10" className="h-12 rounded-xl bg-[#fbfaf7]" /></div>{kidAges.length>1&&<Button type="button" variant="outline" size="icon" onClick={()=>setKidAges(c=>c.filter((_,i)=>i!==index))}><MinusIcon className="h-4 w-4"/><span className="sr-only">Remove age</span></Button>}</div>)}<Button type="button" variant="outline" className="h-12 w-full rounded-xl border-2 bg-transparent font-bold" onClick={()=>setKidAges(c=>[...c,""])}><PlusIcon className="mr-2 h-4 w-4"/>Add another</Button></div>}
            {step===2&&<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{commonInterests.map(interest=>{const checked=interests.includes(interest);return <button key={interest} type="button" onClick={()=>setInterests(c=>checked?c.filter(i=>i!==interest):[...c,interest])} className={`min-h-20 rounded-2xl border-2 p-3 text-left text-sm font-bold transition ${checked?"border-primary bg-primary text-white shadow-[0_3px_0_#173b93]":"border-[#ddd8cf] bg-[#fbfaf7] hover:border-primary"}`}><Checkbox checked={checked} className="mr-2" tabIndex={-1}/>{interest}</button>})}</div>}
            {step===3&&<div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="city" className="font-bold">City</Label><Input id="city" value={city} onChange={e=>setCity(e.target.value)} placeholder="Optional" className="h-12 rounded-xl bg-[#fbfaf7]"/></div><div className="space-y-2"><Label htmlFor="state" className="font-bold">State</Label><Input id="state" value={state} onChange={e=>setState(e.target.value)} placeholder="Optional" className="h-12 rounded-xl bg-[#fbfaf7]"/></div></div><label className="flex items-start gap-3 rounded-2xl border-2 border-[#ddd8cf] bg-[#fff8df] p-4"><Checkbox checked={shareCity} onCheckedChange={v=>setShareCity(v===true)} disabled={!city.trim()}/><span><strong className="block text-sm">Use my city for local discovery</strong><span className="mt-1 block text-xs leading-5 text-[#697386]">Surface nearby groups and meetups. Your exact address is never part of your profile.</span></span></label></div>}
          </div>
          {error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
          <div className="mt-8 flex gap-3">{step>1&&<Button type="button" variant="outline" className="h-12 w-full rounded-xl border-2 font-bold" onClick={()=>{setError(null);setStep(c=>c-1)}}>Back</Button>}{step<3?<Button type="button" className="h-12 w-full rounded-xl font-extrabold shadow-[0_4px_0_#173b93]" onClick={next}>Keep going →</Button>:<Button type="button" className="h-12 w-full rounded-xl font-extrabold shadow-[0_4px_0_#173b93]" onClick={save} disabled={saving}>{saving?"Saving…":"Take me to my crew →"}</Button>}</div>
        </section>
        <p className="mt-7 text-center text-xs font-semibold text-[#7b8494]">Only share what helps DadConnect work for you. You stay in control of local discovery.</p>
      </div>
    </main>
  )
}
