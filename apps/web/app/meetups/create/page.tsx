'use client'

import type React from 'react'
import { useEffect,useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { DadGroup,Meetup } from '@dadsconnect/shared'

const activities:[Meetup['activityType'],string][]=[
  ['coffee','Coffee'],['playdate','Playdate'],['outdoor','Outdoor'],
  ['sports','Sports'],['watch_party','Watch party'],['other','Other'],
]

export default function CreateMeetupPage(){
  const router=useRouter()
  const [groups,setGroups]=useState<DadGroup[]>([])
  const [selectedGroupId,setSelectedGroupId]=useState('')
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const response=await fetch('/api/groups',{credentials:'include'})
      if(response.status === 401){
        router.replace('/login')
        return
      }
      if(response.ok){
        const data=await response.json()
        const joined=(data.groups || []).filter((group:DadGroup) => group.isMember)
        setGroups(joined)
        const requestedGroup=new URLSearchParams(window.location.search).get('groupId')
        if(requestedGroup && joined.some((group:DadGroup) => group.id === requestedGroup)){
          setSelectedGroupId(requestedGroup)
        }
      }
    })()
  },[router])

  const submit=async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const form=new FormData(event.currentTarget)
    const localStart=String(form.get('startTime') || '')
    const localEnd=String(form.get('endTime') || '')

    const payload={
      title:String(form.get('title') || ''),
      description:String(form.get('description') || ''),
      activityType:String(form.get('activityType') || ''),
      location:String(form.get('location') || ''),
      city:String(form.get('city') || ''),
      state:String(form.get('state') || ''),
      startTime:localStart ? new Date(localStart).toISOString() : '',
      endTime:localEnd ? new Date(localEnd).toISOString() : '',
      maxAttendees:String(form.get('maxAttendees') || ''),
      groupId:selectedGroupId || null,
    }

    try{
      const response=await fetch('/api/meetups',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
      })
      if(response.status === 401){
        router.replace('/login')
        return
      }
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || 'Failed to create meetup')
      router.push(`/meetups/${data.meetup.id}`)
      router.refresh()
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to create meetup')
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/meetups" className="text-sm text-blue-600">← Back to meetups</Link>
        <div className="mt-4 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a meetup</h1>
          <p className="mt-2 text-gray-600">Keep the plan simple enough that people can actually show up. During beta, use a public venue or general meeting place rather than an exact private address.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium">Title<input name="title" required maxLength={120} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Saturday park meetup" /></label>
            <label className="block text-sm font-medium">Description<textarea name="description" rows={4} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="What should dads know before coming?" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Activity<select name="activityType" required className="mt-2 w-full rounded-lg border px-3 py-2">{activities.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="text-sm font-medium">Group<select name="groupId" value={selectedGroupId} onChange={event => setSelectedGroupId(event.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2"><option value="">Standalone meetup</option>{groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Starts<input name="startTime" type="datetime-local" required className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
              <label className="text-sm font-medium">Ends<input name="endTime" type="datetime-local" className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Venue / place<input name="location" className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Roger Williams Park" /></label>
              <label className="text-sm font-medium">Max going<input name="maxAttendees" type="number" min={1} max={10000} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Optional" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">City<input name="city" className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
              <label className="text-sm font-medium">State<input name="state" className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
            </div>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Creating…' : 'Create meetup'}</button>
          </form>
        </div>
      </div>
    </main>
  )
}
