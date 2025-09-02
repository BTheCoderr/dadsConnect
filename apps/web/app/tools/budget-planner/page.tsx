"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function BudgetPlannerPage() {
  const [income, setIncome] = useState("")
  const [housing, setHousing] = useState("")
  const [food, setFood] = useState("")
  const [transportation, setTransportation] = useState("")
  const [childcare, setChildcare] = useState("")
  const [results, setResults] = useState<any>(null)

  const handleCalculate = () => {
    const monthlyIncome = parseFloat(income)
    const housingCost = parseFloat(housing)
    const foodCost = parseFloat(food)
    const transportCost = parseFloat(transportation)
    const childcareCost = parseFloat(childcare)

    if (monthlyIncome > 0) {
      const totalExpenses = housingCost + foodCost + transportCost + childcareCost
      const remainingIncome = monthlyIncome - totalExpenses
      const savingsRate = (remainingIncome / monthlyIncome) * 100

      // Calculate recommended allocations (50/30/20 rule)
      const needs = housingCost + foodCost + transportCost + childcareCost
      const wants = remainingIncome * 0.3
      const savings = remainingIncome * 0.2

      setResults({
        totalExpenses,
        remainingIncome,
        savingsRate: savingsRate.toFixed(1),
        needsPercentage: ((needs / monthlyIncome) * 100).toFixed(1),
        recommendedWants: wants.toFixed(2),
        recommendedSavings: savings.toFixed(2),
        monthlyIncome
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
              <h1 className="text-2xl font-bold text-gray-900">Family Budget Planner</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Monthly Income & Expenses</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Monthly Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 5000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="housing">Housing (Rent/Mortgage) ($)</Label>
                <Input
                  id="housing"
                  type="number"
                  placeholder="e.g., 1500"
                  value={housing}
                  onChange={(e) => setHousing(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="food">Food & Groceries ($)</Label>
                <Input
                  id="food"
                  type="number"
                  placeholder="e.g., 600"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="transportation">Transportation ($)</Label>
                <Input
                  id="transportation"
                  type="number"
                  placeholder="e.g., 400"
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="childcare">Childcare ($)</Label>
                <Input
                  id="childcare"
                  type="number"
                  placeholder="e.g., 800"
                  value={childcare}
                  onChange={(e) => setChildcare(e.target.value)}
                />
              </div>
              
              <Button onClick={handleCalculate} className="w-full">
                Calculate Budget
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Budget Analysis</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Total Expenses: ${results.totalExpenses.toLocaleString()}</h3>
                  <p className="text-sm text-blue-700">Monthly fixed costs</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Remaining Income: ${results.remainingIncome.toLocaleString()}</h3>
                  <p className="text-sm text-green-700">Available for wants and savings</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Savings Rate: {results.savingsRate}%</h3>
                  <p className="text-sm text-purple-700">Percentage of income saved</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">Needs: {results.needsPercentage}% of income</h3>
                  <p className="text-sm text-yellow-700">Essential expenses</p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-medium text-indigo-900">Recommended Wants: ${results.recommendedWants}</h3>
                  <p className="text-sm text-indigo-700">30% of remaining income</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900">Recommended Savings: ${results.recommendedSavings}</h3>
                  <p className="text-sm text-red-700">20% of remaining income</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your income and expenses to see budget analysis</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">Budgeting Tips for Families</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Track all expenses for at least one month</li>
            <li>• Build an emergency fund of 3-6 months expenses</li>
            <li>• Review and adjust your budget monthly</li>
            <li>• Involve the whole family in budget discussions</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
