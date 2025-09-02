'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Meetup } from '@dadconnect/shared'

export default function MeetupsPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadMeetups()
  }, [])

  const loadMeetups = async () => {
    try {
      const response = await fetch('/api/meetups')
      if (response.ok) {
        const data = await response.json()
        setMeetups(data.meetups || [])
      }
    } catch (error) {
      console.error('Error loading meetups:', error)
    } finally {
      setLoading(false)
    }
  }

  const attendMeetup = async (meetupId: string, status: 'going' | 'maybe' | 'not_going') => {
    try {
      const response = await fetch(`/api/meetups/${meetupId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        alert(`Successfully marked as ${status}!`)
        loadMeetups() // Refresh the list
      } else {
        alert('Failed to update attendance')
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Failed to update attendance')
    }
  }

  const getActivityTypeColor = (activityType: string) => {
    switch (activityType) {
      case 'watch_party': return 'bg-orange-100 text-orange-800'
      case 'outdoor': return 'bg-green-100 text-green-800'
      case 'sports': return 'bg-blue-100 text-blue-800'
      case 'coffee': return 'bg-yellow-100 text-yellow-800'
      case 'playdate': return 'bg-pink-100 text-pink-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityTypeIcon = (activityType: string) => {
    switch (activityType) {
      case 'watch_party': return '📺'
      case 'outdoor': return '🌲'
      case 'sports': return '⚽'
      case 'coffee': return '☕'
      case 'playdate': return '👶'
      case 'other': return '🎯'
      default: return '🎯'
    }
  }

  const filteredMeetups = filter === 'all' 
    ? meetups 
    : meetups.filter(meetup => meetup.activityType === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meetups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dad Meetups</h1>
            <p className="text-gray-600 mt-2">Join activities, watch parties, and hangouts with fellow dads</p>
          </div>
          <Link
            href="/meetups/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Meetup
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'all', label: 'All Meetups' },
            { key: 'watch_party', label: 'Watch Parties' },
            { key: 'outdoor', label: 'Outdoor' },
            { key: 'sports', label: 'Sports' },
            { key: 'coffee', label: 'Coffee' },
            { key: 'playdate', label: 'Playdates' },
            { key: 'other', label: 'Other' },
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

        {/* Meetups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetups.map((meetup) => (
            <div key={meetup.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{meetup.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(meetup.activityType)}`}>
                      {getActivityTypeIcon(meetup.activityType)} {meetup.activityType.replace('_', ' ').toUpperCase()}
                    </span>
                    {meetup.city && (
                      <span className="text-sm text-gray-500">📍 {meetup.city}, {meetup.state}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{meetup.currentAttendees}</div>
                  <div className="text-xs text-gray-500">
                    {meetup.maxAttendees ? `/${meetup.maxAttendees}` : ''} dads
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{meetup.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {meetup.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(meetup.startTime).toLocaleDateString()} at {new Date(meetup.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {meetup.creator && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Organized by {meetup.creator.name}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => attendMeetup(meetup.id, 'going')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Going
                </button>
                <button
                  onClick={() => attendMeetup(meetup.id, 'maybe')}
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Maybe
                </button>
                <button
                  onClick={() => attendMeetup(meetup.id, 'not_going')}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Can't Go
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMeetups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetups found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "There are no meetups scheduled yet." 
                : `No ${filter.replace('_', ' ')} meetups found.`}
            </p>
            <Link
              href="/meetups/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create the First Meetup
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
