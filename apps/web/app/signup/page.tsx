"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup submitted")
    // Simulate successful signup and redirect to onboarding
    router.push("/onboarding")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign Up for DadConnect</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline" prefetch={false}>
              Login
            </Link>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full bg-transparent">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <AppleIcon className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4.2 1.24-4.94 2.72C11.3 5.71 9.3 4 7 4c-2.06 0-4 2-4 4.5 0 2.46 2.77 4.82 5 4.82 2 0 3-2 3-2.5s-1.14-1.48-2.82-2.94C8.18 6.8 6 6 6 4.5c0-.68.65-1 1.5-1 1.2 0 2.4.62 3.6 1.82 1.2 1.2 2.4 1.82 3.6 1.82 1.2 0 2.4-.62 3.6-1.82z" />
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4.2 1.24-4.94 2.72C11.3 5.71 9.3 4 7 4c-2.06 0-4 2-4 4.5 0 2.46 2.77 4.82 5 4.82 2 0 3-2 3-2.5s-1.14-1.48-2.82-2.94C8.18 6.8 6 6 6 4.5c0-.68.65-1 1.5-1 1.2 0 2.4.62 3.6 1.82 1.2 1.2 2.4 1.82 3.6 1.82 1.2 0 2.4-.62 3.6-1.82z" />
    </svg>
  )
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}
