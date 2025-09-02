"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function DiaperCalculatorPage() {
  const [babyAge, setBabyAge] = useState("")
  const [diaperBrand, setDiaperBrand] = useState("premium")
  const [results, setResults] = useState<any>(null)

  const diaperCosts = {
    premium: { cost: 0.35, name: "Premium (Pampers, Huggies)" },
    midrange: { cost: 0.25, name: "Mid-range (Luvs, Up&Up)" },
    budget: { cost: 0.15, name: "Budget (Parent's Choice, Kirkland)" }
  }

  const calculateDiaperUsage = (age: number) => {
    if (age <= 1) return 10 // Newborn: 10-12 per day
    if (age <= 2) return 8  // 1-2 months: 8-10 per day
    if (age <= 6) return 6  // 2-6 months: 6-8 per day
    if (age <= 12) return 5 // 6-12 months: 5-6 per day
    if (age <= 18) return 4 // 12-18 months: 4-5 per day
    return 3 // 18+ months: 3-4 per day
  }

  const handleCalculate = () => {
    const age = parseFloat(babyAge)
    
    if (age >= 0) {
      const dailyUsage = calculateDiaperUsage(age)
      const monthlyUsage = dailyUsage * 30
      const yearlyUsage = dailyUsage * 365
      
      const brand = diaperCosts[diaperBrand as keyof typeof diaperCosts]
      const dailyCost = dailyUsage * brand.cost
      const monthlyCost = monthlyUsage * brand.cost
      const yearlyCost = yearlyUsage * brand.cost
      
      // Calculate until potty training (typically 2.5-3 years)
      const monthsUntilPottyTraining = Math.max(0, (30 - age) * 12)
      const totalDiaperCost = (monthsUntilPottyTraining * monthlyCost) + (age < 30 ? yearlyCost : 0)

      setResults({
        dailyUsage,
        monthlyUsage,
        yearlyUsage,
        dailyCost: dailyCost.toFixed(2),
        monthlyCost: monthlyCost.toFixed(2),
        yearlyCost: yearlyCost.toFixed(2),
        totalCost: totalDiaperCost.toFixed(2),
        brandName: brand.name,
        monthsRemaining: Math.round(monthsUntilPottyTraining)
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
              <h1 className="text-2xl font-bold text-gray-900">Diaper Cost Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Baby Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Baby's Age (months)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 6"
                  value={babyAge}
                  onChange={(e) => setBabyAge(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Diaper Brand Preference</Label>
                <select
                  id="brand"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={diaperBrand}
                  onChange={(e) => setDiaperBrand(e.target.value)}
                >
                  <option value="premium">Premium ($0.35/diaper)</option>
                  <option value="midrange">Mid-range ($0.25/diaper)</option>
                  <option value="budget">Budget ($0.15/diaper)</option>
                </select>
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Calculate Diaper Costs
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Cost Analysis</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Daily Usage: {results.dailyUsage} diapers</h3>
                  <p className="text-sm text-blue-700">Average per day</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Monthly Cost: ${results.monthlyCost}</h3>
                  <p className="text-sm text-green-700">Based on {results.monthlyUsage} diapers</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Yearly Cost: ${results.yearlyCost}</h3>
                  <p className="text-sm text-purple-700">Based on {results.yearlyUsage} diapers</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900">Total Until Potty Training: ${results.totalCost}</h3>
                  <p className="text-sm text-red-700">Estimated {results.monthsRemaining} months remaining</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Brand: {results.brandName}</h3>
                  <p className="text-sm text-gray-700">Cost per diaper</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your baby's information to see diaper cost analysis</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3">Diaper Saving Tips</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>• Buy in bulk to save money</li>
            <li>• Consider cloth diapers for long-term savings</li>
            <li>• Look for sales and coupons</li>
            <li>• Try different brands to find the best fit</li>
            <li>• Change diapers promptly to prevent rashes</li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 mt-4 bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-800">
            <strong>Note:</strong> These are estimates based on average usage patterns. Actual costs may vary based on your baby's individual needs and local pricing.
          </p>
        </Card>
      </div>
    </div>
  )
}
