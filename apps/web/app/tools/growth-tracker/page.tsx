"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function GrowthTrackerPage() {
  const [childAge, setChildAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [results, setResults] = useState<any>(null)

  const handleCalculate = () => {
    // Simple calculation logic (in a real app, you'd use proper growth charts)
    const age = parseFloat(childAge)
    const heightCm = parseFloat(height)
    const weightKg = parseFloat(weight)

    if (age && heightCm && weightKg) {
      const bmi = weightKg / ((heightCm / 100) ** 2)
      
      setResults({
        bmi: bmi.toFixed(1),
        heightPercentile: "75th", // Mock data
        weightPercentile: "60th", // Mock data
        recommendation: bmi > 18.5 ? "Your child is growing well!" : "Consider consulting with a pediatrician."
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
              <h1 className="text-2xl font-bold text-gray-900">Growth Tracker</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Enter Your Child's Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Child's Age (months)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 24"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 85"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 12.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Calculate Growth Metrics
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Growth Analysis</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">BMI: {results.bmi}</h3>
                  <p className="text-sm text-blue-700">Body Mass Index</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Height Percentile: {results.heightPercentile}</h3>
                  <p className="text-sm text-green-700">Compared to other children of the same age</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Weight Percentile: {results.weightPercentile}</h3>
                  <p className="text-sm text-purple-700">Compared to other children of the same age</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">Recommendation</h3>
                  <p className="text-sm text-yellow-700">{results.recommendation}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your child's information to see growth analysis</p>
              </div>
            )}
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="p-4 mt-8 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. 
            Always consult with your pediatrician for accurate growth assessments.
          </p>
        </Card>
      </div>
    </div>
  )
}
