'use client'

import { useEffect,useMemo,useState } from 'react'
import Link from 'next/link'
import type { Meetup,MeetupAttendee } from '@dadsconnect/shared'

const filters=[
  ['all','All meetups'],['watch_party','Watch parties'],['outdoor','Outdoor'],
  ['sports','Sports'],['coffee','Coffee'],['playdate','Playdates'],['other','Other'],
] as const

const labels:Record<Meetup['activityType'],string>={
  watch_party:'Watch party',outdoor:'Outdoor',sports:'Sports',coffee:'Coffee',playdate:'Playdate',other:'Other',
}

export default function MeetupsPage(){
  const [meetups,setMeetups]=useState<Meetup[]>([])
  const [filter,setFilter]=useState('all')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string | null>(null)
  const [saving,setSaving]=useState<string | null>(null)

  const loadMeetups=async () => {
    setError(null)
    try{
      const response=await fetch('/api/meetups',{credentials:'include'})
      if(response.status === 401){
        window.location.href='/login'
        return
      }
      const data=await response.json()
      if(!response.ok) throw new Error(data.error || 'Failed to load meetups')
      setMeetups(data.meetups || [])
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to load meetups')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void loadMeetups() },[])

  const setRsvp=async (meetupId:string,status:MeetupAttendee['status']) => {
    setSaving(meetupId)
    setError(null)
    try{
      const response=await fetch(`/api/meetups/${meetupId}/attend`,{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({status}),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || 'Failed to update RSVP')
      setMeetups(current => current.map(meetup => meetup.id === meetupId ? {
        ...meetup,
        userRsvp:status,
        currentAttendees:data.currentAttendees ?? meetup.currentAttendees,
      } : meetup))
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to update RSVP')
    }finally{
      setSaving(null)
    }
  }

  const filtered=useMemo(
    () => filter === 'all' ? meetups : meetups.filter(meetup => meetup.activityType === filter),
    [filter,meetups],
  )

  if(loading) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">Loading meetups…</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-3xl font-bold text-gray-900">Dad meetups</h1><p className="mt-2 text-gray-600">Turn an online connection into something real.</p></div>
          <Link href="/meetups/create" className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700">Create meetup</Link>
        </div>

        <div className="mb-8 flex gap-1 overflow-x-auto rounded-lg bg-white p-1 shadow-sm">
          {filters.map(([key,label]) => <button key={key} onClick={() => setFilter(key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${filter === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{label}</button>)}
        </div>

        {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(meetup => {
            const full=meetup.maxAttendees !== null && meetup.maxAttendees !== undefined && meetup.currentAttendees >= meetup.maxAttendees
            return (
              <article key={meetup.id} className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div><span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{labels[meetup.activityType]}</span><h2 className="mt-1 text-xl font-semibold text-gray-900">{meetup.title}</h2></div>
                  <div className="text-right"><strong className="block text-2xl text-emerald-600">{meetup.currentAttendees}</strong><span className="text-xs text-gray-500">{meetup.maxAttendees ? `of ${meetup.maxAttendees} going` : 'going'}</span></div>
                </div>
                <p className="mb-4 line-clamp-3 text-gray-600">{meetup.description || 'No description yet.'}</p>
                <div className="mb-5 space-y-1 text-sm text-gray-600">
                  <p>🗓 {new Date(meetup.startTime).toLocaleString()}</p>
                  {(meetup.location || meetup.city) && <p>📍 {[meetup.location,meetup.city,meetup.state].filter(Boolean).join(' · ')}</p>}
                  {meetup.creator && <p>Hosted by {meetup.creator.name}</p>}
                </div>
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {([
                    ['going','Going'],['maybe','Maybe'],['not_going',"Can't go"],
                  ] as [MeetupAttendee['status'],string][]).map(([status,label]) => (
                    <button key={status} onClick={() => setRsvp(meetup.id,status)}
                      disabled={saving === meetup.id || (status === 'going' && full && meetup.userRsvp !== 'going')}
                      className={`rounded-lg border px-2 py-2 text-sm font-medium disabled:opacity-40 ${meetup.userRsvp === status ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {full && meetup.userRsvp !== 'going' && <p className="mb-3 text-xs text-amber-700">This meetup is currently full.</p>}
                <Link href={`/meetups/${meetup.id}`} className="block rounded-lg bg-gray-900 px-4 py-2 text-center font-medium text-white">View details</Link>
              </article>
            )
          })}
        </div>

        {!filtered.length && <div className="py-16 text-center"><h2 className="text-lg font-semibold">No meetups yet</h2><p className="mt-2 text-gray-600">Create one around an activity, group, or neighborhood.</p></div>}
      </div>
    </main>
  )
}
