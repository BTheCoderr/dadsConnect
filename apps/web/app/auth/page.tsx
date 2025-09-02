"use client"

import type React from "react"

import { useState } from "react"

export default function AuthPage() {
  const [showEmail, setShowEmail] = useState(false)

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    window.location.href = "/feed"
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = "/feed"
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Join DadConnect</h2>

        {!showEmail ? (
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("Apple")}
              className="w-full py-3 px-4 border rounded-lg hover:bg-gray-50"
            >
              Continue with Apple
            </button>
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full py-3 px-4 border rounded-lg hover:bg-gray-50"
            >
              Continue with Google
            </button>
            <div className="text-center">
              <button onClick={() => setShowEmail(true)} className="text-blue-600 hover:underline">
                Use Email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" />
            <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg" />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Continue
            </button>
            <button type="button" onClick={() => setShowEmail(false)} className="w-full text-gray-600 hover:underline">
              Back
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
