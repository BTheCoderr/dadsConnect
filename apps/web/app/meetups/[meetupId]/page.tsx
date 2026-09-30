'use client'

import { useEffect,useState } from 'react'
import Link from 'next/link'
import { useParams,useRouter } from 'next/navigation'
import type { Meetup,MeetupAttendee } from '@dadsconnect/shared'

export default function MeetupDetailPage(){
  const {meetupId}=useParams<{meetupId:string}>()
  const router=useRouter()
  const [meetup,setMeetup]=useState<Meetup | null>(null)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState<string | null>(null)

  const load=async () => {
    try{
      const response=await fetch(`/api/meetups/${meetupId}`,{credentials:'include'})
      if(response.status === 401){router.replace('/login');return}
      const data=await response.json()
      if(!response.ok) throw new Error(data.error || 'Failed to load meetup')
      setMeetup(data.meetup)
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to load meetup')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void load() },[meetupId])

  const rsvp=async (status:MeetupAttendee['status']) => {
    setSaving(true);setError(null)
    try{
      const response=await fetch(`/api/meetups/${meetupId}/attend`,{
        method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({status}),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || 'Failed to update RSVP')
      setMeetup(current => current ? {...current,userRsvp:status,currentAttendees:data.currentAttendees ?? current.currentAttendees} : current)
      await load()
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to update RSVP')
    }finally{setSaving(false)}
  }

  if(loading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading meetup…</div>
  if(!meetup) return <div className="mx-auto max-w-xl p-8"><p>{error || 'Meetup not found.'}</p><Link href="/meetups" className="text-blue-600">Back to meetups</Link></div>

  const full=meetup.maxAttendees !== null && meetup.maxAttendees !== undefined && meetup.currentAttendees >= meetup.maxAttendees
  const going=meetup.attendees?.filter(item => item.status === 'going') || []
  const maybe=meetup.attendees?.filter(item => item.status === 'maybe') || []

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/meetups" className="text-blue-600">← All meetups</Link>
          {meetup?.groupId && <Link href={`/groups/${meetup.groupId}/chat`} className="text-blue-600">Open group chat</Link>}
        </div>
        <article className="mt-4 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div><span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{meetup.activityType.replace('_',' ')}</span><h1 className="mt-1 text-3xl font-bold">{meetup.title}</h1>{meetup.creator && <p className="mt-2 text-gray-500">Hosted by {meetup.creator.name}</p>}</div>
            <div className="text-left sm:text-right"><strong className="block text-3xl text-emerald-600">{meetup.currentAttendees}</strong><span className="text-sm text-gray-500">{meetup.maxAttendees ? `of ${meetup.maxAttendees} going` : 'going'}</span></div>
          </div>

          <div className="my-6 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
            <p>🗓 {new Date(meetup.startTime).toLocaleString()}</p>
            {meetup.endTime && <p>⏱ Ends {new Date(meetup.endTime).toLocaleString()}</p>}
            {(meetup.location || meetup.city) && <p>📍 {[meetup.location,meetup.city,meetup.state].filter(Boolean).join(' · ')}</p>}
            {meetup.address && <p>🧭 {meetup.address}</p>}
          </div>

          {meetup.description && <p className="whitespace-pre-wrap leading-7 text-gray-700">{meetup.description}</p>}
          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <section className="mt-8">
            <h2 className="font-semibold">Your RSVP</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([
                ['going','Going'],['maybe','Maybe'],['not_going',"Can't go"],
              ] as [MeetupAttendee['status'],string][]).map(([status,label]) => (
                <button key={status} onClick={() => rsvp(status)} disabled={saving || (status === 'going' && full && meetup.userRsvp !== 'going')}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40 ${meetup.userRsvp === status ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200'}`}>{label}</button>
              ))}
            </div>
            {full && meetup.userRsvp !== 'going' && <p className="mt-2 text-xs text-amber-700">This meetup is currently full.</p>}
          </section>

          <section className="mt-8 grid gap-6 sm:grid-cols-2">
            <div><h2 className="font-semibold">Going · {going.length}</h2><div className="mt-3 space-y-2">{going.length ? going.map(item => <div key={item.userId} className="rounded-lg border p-3 text-sm">{item.user?.name || 'DadConnect member'}</div>) : <p className="text-sm text-gray-500">Nobody yet.</p>}</div></div>
            <div><h2 className="font-semibold">Maybe · {maybe.length}</h2><div className="mt-3 space-y-2">{maybe.length ? maybe.map(item => <div key={item.userId} className="rounded-lg border p-3 text-sm">{item.user?.name || 'DadConnect member'}</div>) : <p className="text-sm text-gray-500">Nobody yet.</p>}</div></div>
          </section>
        </article>
      </div>
    </main>
  )
}
