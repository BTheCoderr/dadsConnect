"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function SignupPage() {
  const router = useRouter()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string | null>(null)
  const [message,setMessage]=useState<string | null>(null)

  const handleSubmit=async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const form=new FormData(event.currentTarget)
    const name=String(form.get("name") || "").trim()
    const email=String(form.get("email") || "").trim().toLowerCase()
    const password=String(form.get("password") || "")

    if(name.length < 2){
      setError("Please enter your name.")
      setLoading(false)
      return
    }
    if(password.length < 8){
      setError("Use at least 8 characters for your password.")
      setLoading(false)
      return
    }

    const supabase=getSupabaseBrowserClient()
    const {data,error:signUpError}=await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{name},
        emailRedirectTo:`${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if(signUpError){
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if(data.session){
      router.replace("/onboarding")
      router.refresh()
      return
    }

    setMessage("Check your email to confirm your DadConnect account, then continue onboarding.")
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create your DadConnect account</CardTitle>
          <CardDescription>Join groups, meet dads nearby, and build your community.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required />
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
