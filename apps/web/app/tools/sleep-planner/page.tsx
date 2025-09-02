"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function SleepPlannerPage() {
  const [childAge, setChildAge] = useState("")
  const [wakeTime, setWakeTime] = useState("07:00")
  const [napCount, setNapCount] = useState("2")
  const [results, setResults] = useState<any>(null)

  const sleepRequirements = {
    0: { total: 16, naps: 4, napDuration: 1.5 },
    3: { total: 14, naps: 3, napDuration: 1.5 },
    6: { total: 13, naps: 2, napDuration: 1.5 },
    12: { total: 12, naps: 2, napDuration: 1.5 },
    18: { total: 11, naps: 1, napDuration: 2 },
    24: { total: 11, naps: 1, napDuration: 1.5 },
    36: { total: 10, naps: 1, napDuration: 1.5 },
    48: { total: 10, naps: 0, napDuration: 0 }
  }

  const getSleepRequirements = (age: number) => {
    const ages = Object.keys(sleepRequirements).map(Number).sort((a, b) => a - b)
    for (let i = ages.length - 1; i >= 0; i--) {
      if (age >= ages[i]) {
        return sleepRequirements[ages[i] as keyof typeof sleepRequirements]
      }
    }
    return sleepRequirements[0]
  }

  const handleCalculate = () => {
    const age = parseFloat(childAge)
    const napCountNum = parseFloat(napCount)

    if (age >= 0) {
      const requirements = getSleepRequirements(age)
      const wakeTimeDate = new Date(`2000-01-01T${wakeTime}:00`)
      
      // Calculate bedtime (wake time - total sleep + nap time)
      const totalNapTime = napCountNum * requirements.napDuration
      const nightSleep = requirements.total - totalNapTime
      const bedtime = new Date(wakeTimeDate.getTime() - (nightSleep * 60 * 60 * 1000))
      
      // Calculate nap times
      const napTimes = []
      if (napCountNum > 0) {
        const napInterval = (24 - nightSleep) / (napCountNum + 1)
        for (let i = 0; i < napCountNum; i++) {
          const napTime = new Date(wakeTimeDate.getTime() + ((i + 1) * napInterval * 60 * 60 * 1000))
          napTimes.push(napTime.toTimeString().slice(0, 5))
        }
      }

      setResults({
        totalSleep: requirements.total,
        nightSleep: nightSleep,
        napCount: napCountNum,
        napDuration: requirements.napDuration,
        bedtime: bedtime.toTimeString().slice(0, 5),
        napTimes: napTimes,
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
              <h1 className="text-2xl font-bold text-gray-900">Sleep Schedule Planner</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Child's Sleep Information</h2>
            
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
                <Label htmlFor="wake-time">Desired Wake Time</Label>
                <Input
                  id="wake-time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="naps">Number of Naps</Label>
                <select
                  id="naps"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={napCount}
                  onChange={(e) => setNapCount(e.target.value)}
                >
                  <option value="0">No naps</option>
                  <option value="1">1 nap</option>
                  <option value="2">2 naps</option>
                  <option value="3">3 naps</option>
                </select>
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Generate Sleep Schedule
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recommended Sleep Schedule</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Total Sleep Needed: {results.totalSleep} hours</h3>
                  <p className="text-sm text-blue-700">For a {results.age}-month-old child</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Bedtime: {results.bedtime}</h3>
                  <p className="text-sm text-green-700">Recommended bedtime</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Night Sleep: {results.nightSleep} hours</h3>
                  <p className="text-sm text-purple-700">Continuous nighttime sleep</p>
                </div>
                
                {results.napCount > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-900">Nap Schedule</h3>
                    <div className="mt-2 space-y-1">
                      {results.napTimes.map((time: string, index: number) => (
                        <p key={index} className="text-sm text-yellow-700">
                          Nap {index + 1}: {time} ({results.napDuration} hours)
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Sample Daily Schedule</h3>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>🌅 Wake up: {wakeTime}</p>
                    {results.napTimes.map((time: string, index: number) => (
                      <p key={index}>😴 Nap {index + 1}: {time}</p>
                    ))}
                    <p>🌙 Bedtime: {results.bedtime}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your child's information to generate a sleep schedule</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Sleep Tips for Better Rest</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Maintain consistent sleep and wake times</li>
            <li>• Create a calming bedtime routine</li>
            <li>• Keep the bedroom cool, dark, and quiet</li>
            <li>• Avoid screens 1 hour before bedtime</li>
            <li>• Be patient - sleep schedules can take time to establish</li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This tool provides general sleep recommendations. Every child is different, and you should consult with your pediatrician for personalized sleep advice.
          </p>
        </Card>
      </div>
    </div>
  )
}
