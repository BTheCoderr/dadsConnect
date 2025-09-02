'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'support',
    topics: '',
    city: '',
    state: '',
    visibility: 'public'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          topics: formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic),
          city: formData.city,
          state: formData.state,
          visibility: formData.visibility,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert('Group created successfully!')
        // Redirect to groups page
        window.location.href = '/groups'
      } else {
        const error = await response.json()
        alert(`Failed to create group: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Failed to create group. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/groups" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Groups
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Group</h1>
            <p className="text-gray-600 mb-8">Start a community for dads with similar interests and experiences.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SF New Dads, Tech Dad Hackers"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what your group is about and what members can expect..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="support">Support</option>
                    <option value="sports">Sports</option>
                    <option value="activities">Activities</option>
                    <option value="local">Local</option>
                    <option value="interests">Interests</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., new dad, sleep training, work-life balance"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CA"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Link
                  href="/groups"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
