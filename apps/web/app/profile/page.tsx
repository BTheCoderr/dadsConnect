"use client" // Make this a client component to use useRouter

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PencilIcon, LogOutIcon } from "lucide-react" // Import LogOutIcon
import { useRouter } from "next/navigation" // Import useRouter

export default function ProfilePage() {
  const router = useRouter()

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out from profile page")
    // In a real app, you'd clear session/token and redirect to login
    router.push("/login") // Redirect to login page
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 p-4 md:min-h-screen md:mt-0 mt-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/diverse-user-avatars.png" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">John Doe</CardTitle>
          <CardDescription className="text-center">
            New Dad Nick (28) - Interests: Parenting Tips, Outdoor Activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Kid Ages</h3>
            <p className="text-muted-foreground">0-1 year, 3-5 years</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">City</h3>
            <p className="text-muted-foreground">New York, NY (Optional)</p>
          </div>
          <Button className="w-full">
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
