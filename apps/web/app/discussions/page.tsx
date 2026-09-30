"use client"

import type React from "react"
import { useEffect,useMemo,useState } from "react"
import Link from "next/link"
import type { DadGroup,Thread } from "@dadsconnect/shared"

export default function DiscussionsPage(){
  const [threads,setThreads]=useState<Thread[]>([])
  const [groups,setGroups]=useState<DadGroup[]>([])
  const [selectedGroup,setSelectedGroup]=useState("all")
  const [composerOpen,setComposerOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState<string | null>(null)

  const loadThreads=async () => {
    setError(null)
    try{
      const query=selectedGroup === "all" ? "" : `?group_id=${encodeURIComponent(selectedGroup)}`
      const response=await fetch("/api/threads" + query,{credentials:"include"})
      if(response.status === 401){
        window.location.href="/login"
        return
      }
      const data=await response.json()
      if(!response.ok) throw new Error(data.error || "Failed to load discussions")
      setThreads(data.threads || [])
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to load discussions")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void loadThreads() },[selectedGroup])

  useEffect(() => {
    ;(async () => {
      const response=await fetch("/api/groups",{credentials:"include"})
      if(!response.ok) return
      const data=await response.json()
      setGroups((data.groups || []).filter((group:DadGroup) => group.isMember))
    })()
  },[])

  const createDiscussion=async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const form=new FormData(event.currentTarget)
    const payload={
      groupId:String(form.get("groupId") || ""),
      title:String(form.get("title") || ""),
      body:String(form.get("body") || ""),
    }

    try{
      const response=await fetch("/api/threads",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || "Failed to start discussion")
      setComposerOpen(false)
      setSelectedGroup(payload.groupId || "all")
      await loadThreads()
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to start discussion")
    }finally{
      setSaving(false)
    }
  }

  const visibleGroups=useMemo(
    () => [{id:"all",name:"All visible groups"} as Pick<DadGroup,"id"|"name">,...groups],
    [groups],
  )

  if(loading) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">Loading discussions…</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link href="/" className="text-sm text-blue-600">← Home</Link>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">Discussions</h1>
            <p className="mt-2 text-gray-600">Longer-form conversations inside the groups you can see.</p>
          </div>
          <button onClick={() => setComposerOpen(current => !current)} disabled={!groups.length}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:bg-gray-300">
            {composerOpen ? "Close composer" : "Start discussion"}
          </button>
        </div>

        {!groups.length && <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">Join a group before starting a discussion. You can still read discussions from groups visible to your account.</div>}
        {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {composerOpen && (
          <form onSubmit={createDiscussion} className="mb-8 space-y-4 rounded-xl bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
              <label className="text-sm font-medium">Group
                <select name="groupId" required className="mt-2 w-full rounded-lg border px-3 py-2">
                  <option value="">Choose a joined group</option>
                  {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Title
                <input name="title" required maxLength={160} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="What do you want to talk about?" />
              </label>
            </div>
            <label className="block text-sm font-medium">Discussion
              <textarea name="body" required maxLength={10000} rows={6} className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="Add context, what you have tried, or what kind of perspective would help." />
            </label>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Posting…" : "Post discussion"}</button>
          </form>
        )}

        <div className="mb-5 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Show
            <select value={selectedGroup} onChange={event => setSelectedGroup(event.target.value)} className="ml-2 rounded-lg border bg-white px-3 py-2">
              {visibleGroups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label>
        </div>

        <section className="space-y-4">
          {threads.map(thread => {
            const initials=(thread.author?.name || "DadConnect").split(" ").map(part => part[0]).join("").slice(0,2).toUpperCase()
            return (
              <article key={thread.id} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">{thread.title}</h2>
                      {thread.group && <Link href={`/groups/${thread.group.id}/chat`} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{thread.group.name}</Link>}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">{thread.body}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>{thread.author?.name || "DadConnect member"}</span>
                      <time>{new Date(thread.ts).toLocaleString()}</time>
                      {thread.reactions && Object.keys(thread.reactions).length > 0 && <span>{Object.values(thread.reactions).reduce((sum,value) => sum + Number(value || 0),0)} reactions</span>}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
          {!threads.length && <div className="rounded-xl bg-white p-10 text-center text-gray-500">No discussions yet in this view. Start one from a group you belong to.</div>}
        </section>
      </div>
    </main>
  )
}
