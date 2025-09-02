"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function CollegeSavingsPage() {
  const [childAge, setChildAge] = useState("")
  const [currentSavings, setCurrentSavings] = useState("")
  const [monthlyContribution, setMonthlyContribution] = useState("")
  const [collegeType, setCollegeType] = useState("public")
  const [results, setResults] = useState<any>(null)

  const collegeCosts = {
    public: { current: 25000, inflation: 0.05 },
    private: { current: 55000, inflation: 0.05 }
  }

  const handleCalculate = () => {
    const age = parseFloat(childAge)
    const savings = parseFloat(currentSavings) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const yearsToCollege = 18 - age
    const cost = collegeCosts[collegeType as keyof typeof collegeCosts]

    if (age && yearsToCollege > 0) {
      // Calculate future college cost
      const futureCost = cost.current * Math.pow(1 + cost.inflation, yearsToCollege)
      
      // Calculate total savings with compound interest (assuming 7% annual return)
      const annualReturn = 0.07
      const monthlyReturn = annualReturn / 12
      const totalMonths = yearsToCollege * 12
      
      // Future value of current savings
      const futureValueOfCurrentSavings = savings * Math.pow(1 + annualReturn, yearsToCollege)
      
      // Future value of monthly contributions
      const futureValueOfMonthlyContributions = monthly * 
        (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn
      
      const totalSavings = futureValueOfCurrentSavings + futureValueOfMonthlyContributions
      const shortfall = Math.max(0, futureCost - totalSavings)
      const monthlyNeeded = shortfall > 0 ? 
        shortfall / ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) : 0

      setResults({
        yearsToCollege,
        futureCost: Math.round(futureCost),
        totalSavings: Math.round(totalSavings),
        shortfall: Math.round(shortfall),
        monthlyNeeded: Math.round(monthlyNeeded),
        coverage: Math.round((totalSavings / futureCost) * 100)
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
              <h1 className="text-2xl font-bold text-gray-900">College Savings Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">College Planning Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Child's Current Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 5"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="savings">Current College Savings ($)</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="e.g., 5000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="monthly">Monthly Contribution ($)</Label>
                <Input
                  id="monthly"
                  type="number"
                  placeholder="e.g., 200"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="college-type">College Type</Label>
                <select
                  id="college-type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={collegeType}
                  onChange={(e) => setCollegeType(e.target.value)}
                >
                  <option value="public">Public University (~$25,000/year)</option>
                  <option value="private">Private University (~$55,000/year)</option>
                </select>
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Calculate College Savings Plan
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Savings Analysis</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Years to College: {results.yearsToCollege}</h3>
                  <p className="text-sm text-blue-700">Time to save</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Projected College Cost: ${results.futureCost.toLocaleString()}</h3>
                  <p className="text-sm text-green-700">Total 4-year cost in future dollars</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Projected Savings: ${results.totalSavings.toLocaleString()}</h3>
                  <p className="text-sm text-purple-700">What you'll have saved</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">Coverage: {results.coverage}%</h3>
                  <p className="text-sm text-yellow-700">Percentage of college costs covered</p>
                </div>
                
                {results.shortfall > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-medium text-red-900">Additional Monthly Needed: ${results.monthlyNeeded.toLocaleString()}</h3>
                    <p className="text-sm text-red-700">To fully fund college education</p>
                  </div>
                )}
                
                {results.shortfall <= 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900">🎉 You're on track!</h3>
                    <p className="text-sm text-green-700">Your current plan should cover college costs</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your information to see college savings analysis</p>
              </div>
            )}
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="p-4 mt-8 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This calculator provides estimates based on current college costs and assumes a 7% annual return on investments. 
            Actual costs and returns may vary. Consider consulting with a financial advisor for personalized planning.
          </p>
        </Card>
      </div>
    </div>
  )
}
