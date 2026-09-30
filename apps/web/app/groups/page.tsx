'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { DadGroup } from '@dadsconnect/shared'
import { ArrowLeftIcon } from 'lucide-react'

export default function GroupsPage() {
  const [groups,setGroups]=useState<DadGroup[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string | null>(null)
  const [filter,setFilter]=useState('all')
  const [joining,setJoining]=useState<string | null>(null)

  const loadGroups=async () => {
    setError(null)
    try{
      const response=await fetch('/api/groups',{credentials:'include'})
      const data=await response.json()
      if(!response.ok) throw new Error(data.error || 'Failed to load groups')
      setGroups(data.groups || [])
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to load groups')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void loadGroups() },[])

  const joinGroup=async (groupId:string) => {
    setJoining(groupId)
    setError(null)
    try{
      const response=await fetch(`/api/groups/${groupId}/join`,{method:'POST',credentials:'include'})
      if(response.status === 401){
        window.location.href='/login'
        return
      }
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || 'Failed to join group')
      await loadGroups()
    }catch(error){
      setError(error instanceof Error ? error.message : 'Failed to join group')
    }finally{
      setJoining(null)
    }
  }

  const filteredGroups=useMemo(
    () => filter === 'all' ? groups : groups.filter(group => group.category === filter),
    [filter,groups],
  )

  const categoryClass=(category:string) => ({
    support:'bg-green-100 text-green-800',
    sports:'bg-orange-100 text-orange-800',
    activities:'bg-blue-100 text-blue-800',
    local:'bg-purple-100 text-purple-800',
    interests:'bg-gray-100 text-gray-800',
  }[category] || 'bg-gray-100 text-gray-800')

  if(loading){
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">Loading groups…</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />Back to home
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dad groups</h1>
            <p className="mt-2 text-gray-600">Find public communities and any private groups you already belong to.</p>
          </div>
          <Link href="/groups/create" className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700">Create group</Link>
        </div>

        <div className="mb-8 flex gap-1 overflow-x-auto rounded-lg bg-white p-1 shadow-sm">
          {[
            ['all','All'],['support','Support'],['sports','Sports'],['activities','Activities'],['local','Local'],['interests','Interests'],
          ].map(([key,label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${filter === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {label}
            </button>
          ))}
        </div>

        {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map(group => (
            <article key={group.id} className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${categoryClass(group.category)}`}>{group.category.toUpperCase()}</span>
                    {group.visibility === 'private' && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">PRIVATE</span>}
                    {group.city && <span className="text-sm text-gray-500">📍 {group.city}{group.state ? `, ${group.state}` : ''}</span>}
                  </div>
                </div>
                <div className="text-right"><strong className="block text-2xl text-blue-600">{group.memberCount}</strong><span className="text-xs text-gray-500">members</span></div>
              </div>

              <p className="mb-4 line-clamp-3 text-gray-600">{group.description || 'No description yet.'}</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {group.topics.slice(0,4).map(topic => <span key={topic} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{topic}</span>)}
              </div>

              {group.isMember ? (
                <div className="flex gap-3">
                  <span className="flex-1 rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700">Joined</span>
                  <Link href={`/groups/${group.id}/chat`} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700">Open chat</Link>
                </div>
              ) : (
                <button onClick={() => joinGroup(group.id)} disabled={joining === group.id || group.visibility === 'private'}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300">
                  {joining === group.id ? 'Joining…' : group.visibility === 'private' ? 'Private group' : 'Join group'}
                </button>
              )}
            </article>
          ))}
        </div>

        {!filteredGroups.length && (
          <div className="py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No groups here yet</h2>
            <p className="mt-2 text-gray-600">Start one around a place, parenting stage, activity, or shared interest.</p>
            <Link href="/groups/create" className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">Create the first group</Link>
          </div>
        )}
      </div>
    </div>
  )
}
