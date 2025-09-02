'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DadGroup } from '@dadsconnect/shared'
import { ArrowLeftIcon } from 'lucide-react'

export default function GroupsPage() {
  const [groups, setGroups] = useState<DadGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])
      }
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
      })
      if (response.ok) {
        alert('Successfully joined the group!')
        loadGroups() // Refresh the list
      } else {
        alert('Failed to join group')
      }
    } catch (error) {
      console.error('Error joining group:', error)
      alert('Failed to join group')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return 'bg-green-100 text-green-800'
      case 'sports': return 'bg-orange-100 text-orange-800'
      case 'activities': return 'bg-blue-100 text-blue-800'
      case 'local': return 'bg-purple-100 text-purple-800'
      case 'interests': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredGroups = filter === 'all' 
    ? groups 
    : groups.filter(group => group.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dad Groups</h1>
            <p className="text-gray-600 mt-2">Join communities of dads with similar interests and experiences</p>
          </div>
          <Link
            href="/groups/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Group
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'all', label: 'All Groups' },
            { key: 'support', label: 'Support' },
            { key: 'sports', label: 'Sports' },
            { key: 'activities', label: 'Activities' },
            { key: 'local', label: 'Local' },
            { key: 'interests', label: 'Interests' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(group.category)}`}>
                      {group.category.toUpperCase()}
                    </span>
                    {group.city && (
                      <span className="text-sm text-gray-500">📍 {group.city}, {group.state}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{group.memberCount}</div>
                  <div className="text-xs text-gray-500">members</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{group.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {group.topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
                {group.topics.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                    +{group.topics.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => joinGroup(group.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Join Group
                </button>
                <Link
                  href={`/groups/${group.id}/chat`}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "There are no groups available yet." 
                : `No ${filter} groups found.`}
            </p>
            <Link
              href="/groups/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create the First Group
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
