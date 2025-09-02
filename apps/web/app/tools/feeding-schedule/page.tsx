"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function FeedingSchedulePage() {
  const [babyAge, setBabyAge] = useState("")
  const [feedingType, setFeedingType] = useState("formula")
  const [wakeTime, setWakeTime] = useState("07:00")
  const [results, setResults] = useState<any>(null)

  const getFeedingSchedule = (age: number, type: string) => {
    if (age <= 1) {
      // Newborn (0-1 month)
      return {
        frequency: "Every 2-3 hours",
        amount: type === "formula" ? "2-3 oz" : "On demand",
        totalFeedings: 8,
        nightFeedings: 2,
        schedule: [
          "7:00 AM - Morning feeding",
          "10:00 AM - Mid-morning feeding", 
          "1:00 PM - Afternoon feeding",
          "4:00 PM - Late afternoon feeding",
          "7:00 PM - Evening feeding",
          "10:00 PM - Late evening feeding",
          "1:00 AM - Night feeding",
          "4:00 AM - Early morning feeding"
        ]
      }
    } else if (age <= 3) {
      // 1-3 months
      return {
        frequency: "Every 3-4 hours",
        amount: type === "formula" ? "4-5 oz" : "On demand",
        totalFeedings: 6,
        nightFeedings: 1,
        schedule: [
          "7:00 AM - Morning feeding",
          "11:00 AM - Late morning feeding",
          "3:00 PM - Afternoon feeding", 
          "7:00 PM - Evening feeding",
          "11:00 PM - Late evening feeding",
          "3:00 AM - Night feeding"
        ]
      }
    } else if (age <= 6) {
      // 3-6 months
      return {
        frequency: "Every 4-5 hours",
        amount: type === "formula" ? "6-7 oz" : "On demand",
        totalFeedings: 5,
        nightFeedings: 1,
        schedule: [
          "7:00 AM - Morning feeding",
          "12:00 PM - Midday feeding",
          "5:00 PM - Afternoon feeding",
          "9:00 PM - Evening feeding", 
          "2:00 AM - Night feeding"
        ]
      }
    } else if (age <= 12) {
      // 6-12 months (starting solids)
      return {
        frequency: "Every 4-6 hours + solids",
        amount: type === "formula" ? "6-8 oz" : "On demand",
        totalFeedings: 4,
        nightFeedings: 0,
        schedule: [
          "7:00 AM - Morning feeding + breakfast",
          "12:00 PM - Midday feeding + lunch",
          "5:00 PM - Afternoon feeding + dinner",
          "8:00 PM - Evening feeding"
        ]
      }
    } else {
      // 12+ months
      return {
        frequency: "3 meals + 2 snacks",
        amount: "Table foods + milk",
        totalFeedings: 3,
        nightFeedings: 0,
        schedule: [
          "7:00 AM - Breakfast + milk",
          "12:00 PM - Lunch + milk",
          "3:00 PM - Afternoon snack",
          "6:00 PM - Dinner + milk",
          "8:00 PM - Evening snack"
        ]
      }
    }
  }

  const handleCalculate = () => {
    const age = parseFloat(babyAge)
    
    if (age >= 0) {
      const schedule = getFeedingSchedule(age, feedingType)
      const wakeTimeDate = new Date(`2000-01-01T${wakeTime}:00`)
      
      // Adjust schedule based on wake time
      const adjustedSchedule = schedule.schedule.map((item, index) => {
        const timeMatch = item.match(/(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          const originalTime = new Date(`2000-01-01T${timeMatch[1]}:${timeMatch[2]}:00`)
          const timeDiff = originalTime.getTime() - new Date(`2000-01-01T07:00:00`).getTime()
          const newTime = new Date(wakeTimeDate.getTime() + timeDiff)
          const timeStr = newTime.toTimeString().slice(0, 5)
          return item.replace(/\d{1,2}:\d{2}/, timeStr)
        }
        return item
      })

      setResults({
        ...schedule,
        schedule: adjustedSchedule,
        age: age
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
              <h1 className="text-2xl font-bold text-gray-900">Feeding Schedule Planner</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Baby's Feeding Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Baby's Age (months)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 3"
                  value={babyAge}
                  onChange={(e) => setBabyAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="feeding-type">Feeding Type</Label>
                <select
                  id="feeding-type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={feedingType}
                  onChange={(e) => setFeedingType(e.target.value)}
                >
                  <option value="formula">Formula Feeding</option>
                  <option value="breast">Breastfeeding</option>
                  <option value="mixed">Mixed Feeding</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="wake-time">Typical Wake Time</Label>
                <Input
                  id="wake-time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Generate Feeding Schedule
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recommended Schedule</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Feeding Frequency: {results.frequency}</h3>
                  <p className="text-sm text-blue-700">For a {results.age}-month-old baby</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Amount: {results.amount}</h3>
                  <p className="text-sm text-green-700">Per feeding</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Total Feedings: {results.totalFeedings} per day</h3>
                  <p className="text-sm text-purple-700">Including {results.nightFeedings} night feeding(s)</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">Daily Schedule</h3>
                  <div className="mt-2 space-y-1">
                    {results.schedule.map((item: string, index: number) => (
                      <p key={index} className="text-sm text-yellow-700">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your baby's information to generate a feeding schedule</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">Feeding Tips</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Watch for hunger cues (rooting, sucking motions, fussiness)</li>
            <li>• Burp your baby after each feeding</li>
            <li>• Keep track of wet and dirty diapers</li>
            <li>• Consult your pediatrician about feeding concerns</li>
            <li>• Every baby is different - adjust as needed</li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This tool provides general feeding guidelines. Always consult with your pediatrician for personalized feeding advice based on your baby's specific needs and growth.
          </p>
        </Card>
      </div>
    </div>
  )
}
