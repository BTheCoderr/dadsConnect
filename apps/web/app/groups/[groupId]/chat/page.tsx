"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { DadGroup, GroupMessage, Meetup } from "@dadsconnect/shared"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function GroupChatPage(){
  const params=useParams<{groupId:string}>()
  const router=useRouter()
  const groupId=params.groupId
  const [group,setGroup]=useState<DadGroup | null>(null)
  const [messages,setMessages]=useState<GroupMessage[]>([])
  const [meetups,setMeetups]=useState<Meetup[]>([])
  const [userId,setUserId]=useState<string | null>(null)
  const [draft,setDraft]=useState("")
  const [loading,setLoading]=useState(true)
  const [sending,setSending]=useState(false)
  const [loadError,setLoadError]=useState<string | null>(null)
  const [sendError,setSendError]=useState<string | null>(null)
  const bottomRef=useRef<HTMLDivElement | null>(null)

  const loadMessages=useCallback(async () => {
    setLoadError(null)
    const supabase=getSupabaseBrowserClient()
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){
      router.replace("/login")
      return false
    }

    const {data:membership,error:membershipError}=await supabase
      .from("group_members")
      .select("group_id")
      .eq("group_id",groupId)
      .eq("user_id",user.id)
      .maybeSingle()

    if(membershipError || !membership){
      setLoadError("Join this group before opening its chat.")
      return false
    }

    const {data,error}=await supabase
      .from("group_messages")
      .select(`
        *,
        profiles!group_messages_author_id_fkey(id,name,avatar_url)
      `)
      .eq("group_id",groupId)
      .order("created_at",{ascending:false})
      .limit(100)

    if(error) throw new Error(error.message || "Failed to load messages")

    const next:GroupMessage[]=(data || []).slice().reverse().map(message => ({
      id:message.id,
      groupId:message.group_id,
      authorId:message.author_id,
      content:message.content,
      messageType:message.message_type as GroupMessage["messageType"],
      metadata:message.metadata,
      createdAt:message.created_at,
      author:message.profiles ? {
        id:message.profiles.id,
        name:message.profiles.name,
        avatarUrl:message.profiles.avatar_url,
        city:null,
        state:null,
        bio:null,
        interests:[],
        kidsAges:[],
        createdAt:"",
      } : undefined,
    }))

    setMessages(next)
    return true
  },[groupId,router])

  useEffect(() => {
    let active=true
    const supabase=getSupabaseBrowserClient()
    let channel:ReturnType<typeof supabase.channel> | null=null

    ;(async () => {
      const {data:{user}}=await supabase.auth.getUser()
      if(!user){
        router.replace("/login")
        return
      }
      if(!active) return
      setUserId(user.id)

      const {data:groupRow,error:groupError}=await supabase
        .from("dad_groups")
        .select("*")
        .eq("id",groupId)
        .maybeSingle()

      if(groupError || !groupRow){
        setLoadError(groupError?.message || "Group not found.")
        setLoading(false)
        return
      }

      setGroup({
        id:groupRow.id,
        name:groupRow.name,
        description:groupRow.description,
        category:groupRow.category as DadGroup["category"],
        topics:groupRow.topics,
        city:groupRow.city,
        state:groupRow.state,
        visibility:groupRow.visibility as DadGroup["visibility"],
        memberCount:groupRow.member_count,
        createdBy:groupRow.created_by,
        createdAt:groupRow.created_at,
        isMember:true,
      })

      try{
        const allowed=await loadMessages()
        if(!allowed || !active) return
        const meetupResponse=await fetch(`/api/meetups?group_id=${groupId}`,{credentials:"include"})
        if(meetupResponse.ok){
          const meetupData=await meetupResponse.json()
          if(active) setMeetups(meetupData.meetups || [])
        }
        channel=supabase
          .channel(`group-chat-${groupId}`)
          .on("postgres_changes",{event:"INSERT",schema:"public",table:"group_messages",filter:`group_id=eq.${groupId}`},() => {
            void loadMessages()
          })
          .subscribe()
      }catch(error){
        setLoadError(error instanceof Error ? error.message : "Failed to load chat")
      }finally{
        if(active) setLoading(false)
      }
    })()

    return () => {
      active=false
      if(channel) void supabase.removeChannel(channel)
    }
  },[groupId,loadMessages,router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  const send=async (event:React.FormEvent) => {
    event.preventDefault()
    const content=draft.trim()
    if(!content || sending) return
    setSending(true)
    setSendError(null)
    try{
      const response=await fetch(`/api/groups/${groupId}/messages`,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({content}),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || "Failed to send message")
      setDraft("")
      setMessages(current => current.some(item => item.id === data.message.id) ? current : [...current,data.message].slice(-100))
    }catch(error){
      setSendError(error instanceof Error ? error.message : "Failed to send message")
    }finally{
      setSending(false)
    }
  }

  if(loading) return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Opening chat…</div>

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-4">
        <Link href="/groups" className="text-sm text-blue-600">← All groups</Link>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-gray-900">{group?.name || "Group chat"}</h1><p className="text-sm text-gray-500">{group?.memberCount || 0} members</p></div>
          <div className="flex items-center gap-2">
            <Link href={`/meetups/create?groupId=${groupId}`} className="rounded-lg border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-700">Plan meetup</Link>
            <span className="text-xs text-gray-400">Live chat</span>
          </div>
        </div>
      </header>

      {loadError && <div role="alert" className="m-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{loadError}</div>}

      <section className="border-b bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Upcoming group meetups</h2>
          <Link href={`/meetups/create?groupId=${groupId}`} className="text-sm text-blue-600">+ Plan one</Link>
        </div>
        {meetups.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {meetups.slice(0,4).map(meetup => (
              <Link key={meetup.id} href={`/meetups/${meetup.id}`} className="rounded-xl border p-3 hover:bg-gray-50">
                <strong className="block text-sm text-gray-900">{meetup.title}</strong>
                <span className="mt-1 block text-xs text-gray-500">{new Date(meetup.startTime).toLocaleString()} · {meetup.currentAttendees} going</span>
              </Link>
            ))}
          </div>
        ) : <p className="text-sm text-gray-500">Nothing scheduled yet. Turn the chat into a real plan.</p>}
      </section>

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {!messages.length && !loadError && <div className="py-16 text-center text-gray-500">No messages yet. Start the conversation.</div>}
        {messages.map(message => {
          const own=message.authorId === userId
          return (
            <article key={message.id} className={`max-w-[82%] rounded-2xl px-4 py-3 ${own ? "ml-auto bg-blue-600 text-white" : "bg-white text-gray-900 shadow-sm"}`}>
              {!own && <p className="mb-1 text-xs font-semibold text-blue-700">{message.author?.name || "DadConnect member"}</p>}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <time className={`mt-1 block text-[11px] ${own ? "text-blue-100" : "text-gray-400"}`}>{new Date(message.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</time>
            </article>
          )
        })}
        <div ref={bottomRef} />
      </section>

      <form onSubmit={send} className="sticky bottom-16 border-t bg-white p-4 md:bottom-0">
        {sendError && <p role="alert" className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">{sendError}</p>}
        <div className="flex gap-2">
          <textarea value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} rows={2}
            className="min-h-12 flex-1 resize-none rounded-xl border px-3 py-2 text-sm" placeholder="Message the group…" />
          <button type="submit" disabled={sending || !draft.trim() || Boolean(loadError)} className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white disabled:bg-gray-300">
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </main>
  )
}
