"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function BabyNameGeneratorPage() {
  const [gender, setGender] = useState("both")
  const [origin, setOrigin] = useState("all")
  const [length, setLength] = useState("any")
  const [names, setNames] = useState<string[]>([])

  const nameDatabase = {
    boy: {
      english: ["James", "William", "Benjamin", "Henry", "Alexander", "Samuel", "Daniel", "Matthew", "Luke", "Noah"],
      spanish: ["Diego", "Carlos", "Miguel", "Antonio", "Francisco", "Jose", "Manuel", "Rafael", "Sergio", "Alejandro"],
      french: ["Pierre", "Louis", "Antoine", "François", "Charles", "Henri", "Jean", "Paul", "Michel", "André"],
      italian: ["Marco", "Luca", "Giovanni", "Francesco", "Alessandro", "Andrea", "Matteo", "Leonardo", "Gabriele", "Tommaso"]
    },
    girl: {
      english: ["Emma", "Olivia", "Sophia", "Isabella", "Charlotte", "Amelia", "Mia", "Harper", "Evelyn", "Abigail"],
      spanish: ["Sofia", "Isabella", "Camila", "Valentina", "Ximena", "Luciana", "Victoria", "Martina", "Natalia", "Regina"],
      french: ["Marie", "Sophie", "Camille", "Claire", "Emma", "Léa", "Chloé", "Manon", "Sarah", "Julie"],
      italian: ["Giulia", "Sofia", "Aurora", "Alice", "Ginevra", "Beatrice", "Emma", "Giorgia", "Greta", "Anna"]
    }
  }

  const generateNames = () => {
    let selectedNames: string[] = []
    
    if (gender === "both") {
      selectedNames = [
        ...nameDatabase.boy[origin as keyof typeof nameDatabase.boy] || nameDatabase.boy.english,
        ...nameDatabase.girl[origin as keyof typeof nameDatabase.girl] || nameDatabase.girl.english
      ]
    } else {
      selectedNames = nameDatabase[gender as keyof typeof nameDatabase][origin as keyof typeof nameDatabase.boy] || 
                    nameDatabase[gender as keyof typeof nameDatabase].english
    }

    // Filter by length if specified
    if (length !== "any") {
      const targetLength = parseInt(length)
      selectedNames = selectedNames.filter(name => name.length === targetLength)
    }

    // Shuffle and take 10 random names
    const shuffled = selectedNames.sort(() => 0.5 - Math.random())
    setNames(shuffled.slice(0, 10))
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
              <h1 className="text-2xl font-bold text-gray-900">Baby Name Generator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Name Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="both">Both</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="origin">Origin</Label>
                <select
                  id="origin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                >
                  <option value="all">All Origins</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="italian">Italian</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="length">Name Length</Label>
                <select
                  id="length"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  <option value="any">Any Length</option>
                  <option value="3">3 letters</option>
                  <option value="4">4 letters</option>
                  <option value="5">5 letters</option>
                  <option value="6">6 letters</option>
                  <option value="7">7 letters</option>
                  <option value="8">8+ letters</option>
                </select>
              </div>
              
              <Button onClick={generateNames} className="w-full">
                Generate Names
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Suggested Names</h2>
            
            {names.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {names.map((name, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                    <span className="font-medium text-blue-900">{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Click "Generate Names" to see suggestions</p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">Name Selection Tips</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Consider how the name sounds with your last name</li>
            <li>• Think about potential nicknames</li>
            <li>• Check the meaning and origin of names</li>
            <li>• Consider how easy it is to spell and pronounce</li>
            <li>• Make sure both parents love the name</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
