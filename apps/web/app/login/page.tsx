"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function LoginPage() {
  const router=useRouter()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string | null>(null)

  useEffect(() => {
    const params=new URLSearchParams(window.location.search)
    if(params.get("error") === "confirmation"){
      setError("We could not confirm that email link. Try signing in or create the account again.")
    }
  },[])

  const handleSubmit=async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const form=new FormData(event.currentTarget)
    const email=String(form.get("email") || "").trim().toLowerCase()
    const password=String(form.get("password") || "")
    const supabase=getSupabaseBrowserClient()

    const {error:signInError}=await supabase.auth.signInWithPassword({email,password})
    if(signInError){
      setError(signInError.message)
      setLoading(false)
      return
    }

    const {data:{user}}=await supabase.auth.getUser()
    if(!user){
      setError("Your session could not be created. Please try again.")
      setLoading(false)
      return
    }

    const {data:profile}=await supabase
      .from("profiles")
      .select("kids_ages,interests")
      .eq("id",user.id)
      .maybeSingle()

    const needsOnboarding=!profile || (profile.kids_ages.length === 0 && profile.interests.length === 0)
    router.replace(needsOnboarding ? "/onboarding" : "/feed")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to DadConnect.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New to DadConnect?{" "}
            <Link href="/signup" className="font-medium text-foreground underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
