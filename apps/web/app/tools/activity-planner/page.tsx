"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function ActivityPlannerPage() {
  const [childAge, setChildAge] = useState("")
  const [weather, setWeather] = useState("sunny")
  const [timeAvailable, setTimeAvailable] = useState("30")
  const [location, setLocation] = useState("home")
  const [results, setResults] = useState<any>(null)

  const activities = {
    indoor: {
      "0-12": [
        "Tummy time with colorful toys",
        "Sensory play with different textures",
        "Reading board books together",
        "Singing nursery rhymes",
        "Playing with soft blocks"
      ],
      "12-24": [
        "Building with large blocks",
        "Finger painting (washable)",
        "Playing with musical instruments",
        "Simple puzzles (2-4 pieces)",
        "Dancing to music"
      ],
      "24-36": [
        "Arts and crafts projects",
        "Pretend play with dolls/toys",
        "Simple cooking activities",
        "Building forts with blankets",
        "Playing hide and seek"
      ],
      "36+": [
        "Board games (age-appropriate)",
        "Science experiments",
        "Craft projects",
        "Indoor obstacle course",
        "Storytelling and acting"
      ]
    },
    outdoor: {
      "0-12": [
        "Stroller walks in the park",
        "Outdoor tummy time on blanket",
        "Sitting in the grass",
        "Watching birds and nature",
        "Gentle swinging"
      ],
      "12-24": [
        "Playing in sandbox",
        "Blowing bubbles",
        "Playing with balls",
        "Exploring playground equipment",
        "Nature walks"
      ],
      "24-36": [
        "Riding tricycles",
        "Playing in sprinklers",
        "Gardening activities",
        "Outdoor scavenger hunts",
        "Playing tag"
      ],
      "36+": [
        "Sports activities",
        "Hiking and nature exploration",
        "Bike riding",
        "Outdoor games",
        "Camping activities"
      ]
    }
  }

  const getAgeGroup = (age: number) => {
    if (age <= 12) return "0-12"
    if (age <= 24) return "12-24"
    if (age <= 36) return "24-36"
    return "36+"
  }

  const handleGenerate = () => {
    const age = parseFloat(childAge)
    const time = parseFloat(timeAvailable)
    
    if (age >= 0 && time > 0) {
      const ageGroup = getAgeGroup(age)
      const activityType = location === "home" ? "indoor" : "outdoor"
      const availableActivities = activities[activityType][ageGroup as keyof typeof activities.indoor]
      
      // Filter activities by time available
      const timeFilteredActivities = availableActivities.filter(activity => {
        if (time <= 15) return activity.includes("reading") || activity.includes("singing") || activity.includes("tummy time")
        if (time <= 30) return !activity.includes("hiking") && !activity.includes("camping")
        return true
      })
      
      // Select random activities
      const selectedActivities = timeFilteredActivities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(3, timeFilteredActivities.length))

      setResults({
        ageGroup,
        activityType,
        selectedActivities,
        timeAvailable: time,
        weather,
        location
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/tools">
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Activity Planner</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Activity Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Child's Age (months)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 18"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time Available (minutes)</Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="e.g., 30"
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="home">Indoor (Home)</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="weather">Weather (if outdoor)</Label>
                <select
                  id="weather"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option value="sunny">Sunny</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rainy">Rainy</option>
                  <option value="snowy">Snowy</option>
                </select>
              </div>
              
              <Button onClick={handleGenerate} className="w-full">
                Generate Activities
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Suggested Activities</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Age Group: {results.ageGroup} months</h3>
                  <p className="text-sm text-blue-700">Activities suitable for this age</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Location: {results.location === "home" ? "Indoor" : "Outdoor"}</h3>
                  <p className="text-sm text-green-700">Perfect for {results.timeAvailable} minutes</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Recommended Activities</h3>
                  <div className="mt-2 space-y-2">
                    {results.selectedActivities.map((activity: string, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-purple-400">
                        <p className="text-sm text-purple-800">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {results.weather && results.location === "outdoor" && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-900">Weather: {results.weather}</h3>
                    <p className="text-sm text-yellow-700">Activities adapted for current weather</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your preferences to generate activity suggestions</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Activity Tips</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Always supervise children during activities</li>
            <li>• Adapt activities based on your child's interests</li>
            <li>• Keep activities age-appropriate and safe</li>
            <li>• Let your child lead and explore at their own pace</li>
            <li>• Have fun and be flexible with the plan</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
