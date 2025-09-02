"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, MinusIcon } from "lucide-react" // Using Lucide React icons

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [kidAges, setKidAges] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const router = useRouter()

  const handleNext = () => {
    if (step === 1 && kidAges.length === 0) {
      alert("Please enter at least one kid's age.")
      return
    }
    if (step === 2 && interests.length === 0) {
      alert("Please select at least one interest.")
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleFinish = () => {
    // In a real app, you'd send this data to your backend
    console.log("Onboarding finished!")
    console.log("Kid Ages:", kidAges)
    console.log("Interests:", interests)
    router.push("/feed") // Redirect to the main feed after onboarding
  }

  const handleKidAgeChange = (index: number, value: string) => {
    const newKidAges = [...kidAges]
    newKidAges[index] = value
    setKidAges(newKidAges.filter((age) => age !== "")) // Remove empty inputs
  }

  const addKidAgeInput = () => {
    setKidAges([...kidAges, ""])
  }

  const removeKidAgeInput = (index: number) => {
    const newKidAges = kidAges.filter((_, i) => i !== index)
    setKidAges(newKidAges)
  }

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const commonInterests = [
    "Parenting Tips",
    "Child Development",
    "Work-Life Balance",
    "Mental Health",
    "Outdoor Activities",
    "Travel with Kids",
    "Gear Reviews",
    "Productivity",
    "Finance",
    "Education",
    "Health & Fitness",
    "Hobbies",
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Tell Us About Your Kids"}
            {step === 2 && "What Are Your Interests?"}
            {step === 3 && "All Set!"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Help us personalize your experience by telling us about your children."}
            {step === 2 && "Select topics that interest you to get relevant content."}
            {step === 3 && "You're ready to connect with other dads and discover great content!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              {kidAges.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add your kid's age range (e.g., "0-1", "2-5", "6-10", "11-18").
                </p>
              )}
              {kidAges.map((age, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`kid-age-${index}`}>Kid {index + 1} Age Range</Label>
                    <Input
                      id={`kid-age-${index}`}
                      type="text"
                      placeholder="e.g., 0-1, 2-5, 6-10, 11-18"
                      value={age}
                      onChange={(e) => handleKidAgeChange(index, e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => removeKidAgeInput(index)}>
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Remove kid age</span>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" onClick={addKidAgeInput}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Kid
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {commonInterests.map((interest) => (
                <div
                  key={interest}
                  className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                    className="mr-2"
                  />
                  <Label htmlFor={interest} className="cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-lg font-semibold">Welcome to DadConnect!</p>
              <p className="text-muted-foreground">
                We've set up your profile based on your preferences. You can always update these later in your settings.
              </p>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-4">
            {step > 1 && step < 3 && (
              <Button variant="outline" onClick={handleBack} className="w-full bg-transparent">
                Back
              </Button>
            )}
            {step < 3 && (
              <Button onClick={handleNext} className="w-full">
                Next
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleFinish} className="w-full">
                Go to Feed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
