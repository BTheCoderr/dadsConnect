"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function LoginPage() {
  const router=useRouter()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string | null>(null)

  useEffect(() => {
    const params=new URLSearchParams(window.location.search)
    if(params.get("error") === "confirmation") setError("We could not confirm that email link. Try signing in or create the account again.")
  },[])

  const handleSubmit=async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(null)
    const form=new FormData(event.currentTarget)
    const email=String(form.get("email") || "").trim().toLowerCase()
    const password=String(form.get("password") || "")
    const supabase=getSupabaseBrowserClient()
    const {error:signInError}=await supabase.auth.signInWithPassword({email,password})
    if(signInError){setError(signInError.message);setLoading(false);return}
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){setError("Your session could not be created. Please try again.");setLoading(false);return}
    const [{data:profile},{data:privateProfile}]=await Promise.all([
      supabase.from("profiles").select("interests").eq("id",user.id).maybeSingle(),
      supabase.from("profile_private").select("kids_ages").eq("user_id",user.id).maybeSingle(),
    ])
    const needsOnboarding=!profile || !privateProfile || (privateProfile.kids_ages.length === 0 && profile.interests.length === 0)
    router.replace(needsOnboarding ? "/onboarding" : "/feed"); router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#10213d]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <section className="hidden lg:block">
          <Link href="/" className="mb-14 flex items-center gap-3 text-xl font-black"><span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary text-sm text-white shadow-[0_5px_0_#173b93]">DC</span>DadConnect</Link>
          <p className="mb-4 inline-block -rotate-2 rounded-full bg-[#f5c85b] px-4 py-2 text-sm font-extrabold shadow-[0_3px_0_#d7a52d]">👊 Good to see you, dad.</p>
          <h1 className="max-w-lg text-6xl font-black leading-[.96] tracking-[-.055em]">Your crew is on the other side.</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#667187]">Pick up the conversation, see what the guys are planning, or get something off your chest.</p>
          <div className="mt-9 max-w-md rounded-[24px] border-2 border-[#d9d2c5] bg-white/70 p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-primary">DadConnect reminder</p><p className="mt-2 font-bold leading-6">No performance. No follower count. Just useful conversations and people you can actually connect with.</p></div>
        </section>

        <section className="relative mx-auto w-full max-w-lg">
          <Link href="/" className="mb-8 flex items-center gap-3 text-xl font-black lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary text-xs text-white shadow-[0_4px_0_#173b93]">DC</span>DadConnect</Link>
          <div className="absolute -right-3 -top-4 h-20 w-20 rotate-12 rounded-[25px] bg-[#f5c85b]" />
          <div className="relative rounded-[30px] border-2 border-[#d8d1c4] bg-white p-6 shadow-[0_12px_0_rgba(16,33,61,.08)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Back to the crew</p><h2 className="mt-2 text-4xl font-black tracking-[-.04em]">Welcome back.</h2><p className="mt-2 text-[#6a7485]">Sign in and see what&apos;s happening.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2"><Label htmlFor="email" className="font-bold">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required className="h-12 rounded-xl bg-[#fbfaf7]" /></div>
              <div className="space-y-2"><Label htmlFor="password" className="font-bold">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 rounded-xl bg-[#fbfaf7]" /></div>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
              <Button type="submit" className="h-12 w-full rounded-xl text-base font-extrabold shadow-[0_4px_0_#173b93]" disabled={loading}>{loading ? "Signing in…" : "Sign in →"}</Button>
            </form>
            <p className="mt-7 text-center text-sm text-[#697386]">New around here? <Link href="/signup" className="font-extrabold text-primary underline decoration-2 underline-offset-4">Find your crew</Link></p>
          </div>
        </section>
      </div>
    </main>
  )
}
