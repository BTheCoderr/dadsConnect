"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { DadGroup, GroupMessage } from "@dadsconnect/shared"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function GroupChatPage(){
  const params=useParams<{groupId:string}>()
  const router=useRouter()
  const groupId=params.groupId
  const [group,setGroup]=useState<DadGroup | null>(null)
  const [messages,setMessages]=useState<GroupMessage[]>([])
  const [userId,setUserId]=useState<string | null>(null)
  const [draft,setDraft]=useState("")
  const [loading,setLoading]=useState(true)
  const [sending,setSending]=useState(false)
  const [error,setError]=useState<string | null>(null)
  const bottomRef=useRef<HTMLDivElement | null>(null)

  const loadMessages=useCallback(async () => {
    const response=await fetch(`/api/groups/${groupId}/messages`,{credentials:"include"})
    if(response.status === 401){
      router.replace("/login")
      return false
    }
    if(response.status === 403){
      setError("Join this group before opening its chat.")
      return false
    }
    const data=await response.json().catch(() => ({}))
    if(!response.ok) throw new Error(data.error || "Failed to load messages")
    setMessages(data.messages || [])
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
        setError(groupError?.message || "Group not found.")
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
        channel=supabase
          .channel(`group-chat-${groupId}`)
          .on("postgres_changes",{event:"INSERT",schema:"public",table:"group_messages",filter:`group_id=eq.${groupId}`},() => {
            void loadMessages()
          })
          .subscribe()
      }catch(error){
        setError(error instanceof Error ? error.message : "Failed to load chat")
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
    setError(null)
    try{
      const response=await fetch(`/api/groups/${groupId}/messages`,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({content,messageType:"text"}),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || "Failed to send message")
      setDraft("")
      setMessages(current => current.some(item => item.id === data.message.id) ? current : [...current,data.message])
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to send message")
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
          <span className="text-xs text-gray-400">Live chat</span>
        </div>
      </header>

      {error && <div role="alert" className="m-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {!messages.length && !error && <div className="py-16 text-center text-gray-500">No messages yet. Start the conversation.</div>}
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

      {!error && (
        <form onSubmit={send} className="sticky bottom-0 flex gap-2 border-t bg-white p-4">
          <textarea value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} rows={2}
            className="min-h-12 flex-1 resize-none rounded-xl border px-3 py-2 text-sm" placeholder="Message the group…" />
          <button type="submit" disabled={sending || !draft.trim()} className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white disabled:bg-gray-300">
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      )}
    </main>
  )
}
