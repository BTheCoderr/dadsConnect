"use client"

import { useEffect,useMemo,useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkIcon,MessageSquareIcon,UsersIcon,CalendarDaysIcon } from "lucide-react"
import ContentCard from "@/components/content-card"
import ArticleModal from "@/components/article-modal"
import type { ContentItem,Meetup,Thread } from "@dadsconnect/shared"

type FeedCard={
  id:string
  source:string
  title:string
  image:string
  excerpt:string
  readTime:string
  url:string
  topics:string[]
}

type SuggestedGroup={
  id:string
  name:string
  topics:string[]
  memberCount:number
  visibility:"public"|"private"
}

export default function FeedPage(){
  const [content,setContent]=useState<FeedCard[]>([])
  const [threads,setThreads]=useState<Thread[]>([])
  const [meetups,setMeetups]=useState<Meetup[]>([])
  const [groups,setGroups]=useState<SuggestedGroup[]>([])
  const [currentIndex,setCurrentIndex]=useState(0)
  const [savedIds,setSavedIds]=useState<Set<string>>(new Set())
  const [savedCount,setSavedCount]=useState(0)
  const [selectedArticle,setSelectedArticle]=useState<FeedCard | null>(null)
  const [error,setError]=useState<string | null>(null)
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    ;(async () => {
      try{
        const [feedResponse,threadResponse,meetupResponse,groupResponse,libraryResponse]=await Promise.all([
          fetch("/api/feed",{credentials:"include"}),
          fetch("/api/threads?limit=4",{credentials:"include"}),
          fetch("/api/meetups",{credentials:"include"}),
          fetch("/api/groups/suggested",{credentials:"include"}),
          fetch("/api/library",{credentials:"include"}),
        ])

        if(threadResponse.status === 401 || meetupResponse.status === 401){
          window.location.href="/login"
          return
        }

        const [feedData,threadData,meetupData,groupData,libraryData]=await Promise.all([
          feedResponse.json().catch(() => ({})),
          threadResponse.json().catch(() => ({})),
          meetupResponse.json().catch(() => ({})),
          groupResponse.json().catch(() => ({})),
          libraryResponse.json().catch(() => ({})),
        ])

        if(!feedResponse.ok) throw new Error(feedData.error || "Failed to load feed")

        setContent((feedData.items || []).map((item:ContentItem) => ({
          id:item.id,
          source:item.source || "DadConnect",
          title:item.title,
          image:item.image || "/placeholder-vk2kx.png",
          excerpt:item.excerpt || "",
          readTime:`${item.readTime || 5} min`,
          url:item.url,
          topics:item.topics || [],
        })))
        if(threadResponse.ok) setThreads(threadData.threads || [])
        if(meetupResponse.ok) setMeetups((meetupData.meetups || []).slice(0,4))
        if(groupResponse.ok) setGroups((groupData.items || []).slice(0,5))
        if(libraryResponse.ok) setSavedCount((libraryData.items || []).length)
      }catch(error){
        setError(error instanceof Error ? error.message : "Failed to load DadConnect")
      }finally{
        setLoading(false)
      }
    })()
  },[])

  const currentCard=content[currentIndex]
  const topics=useMemo(() => {
    const counts=new Map<string,number>()
    content.flatMap(item => item.topics).forEach(topic => counts.set(topic,(counts.get(topic) || 0)+1))
    return [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0,6).map(([topic]) => topic)
  },[content])

  const moveNext=() => {
    if(!content.length) return
    setCurrentIndex(index => index >= content.length-1 ? 0 : index+1)
  }

  const save=async (id:string) => {
    setError(null)
    try{
      const response=await fetch("/api/save",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contentId:id}),
      })
      if(response.status === 401){
        window.location.href="/login"
        return
      }
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || "Failed to save item")
      setSavedIds(current => {
        if(current.has(id)) return current
        const next=new Set(current)
        next.add(id)
        setSavedCount(count => count+1)
        return next
      })
      moveNext()
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to save item")
    }
  }

  if(loading) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">Loading DadConnect…</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-900">DadConnect</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link href="/library"><BookmarkIcon className="mr-2 h-4 w-4" />{savedCount}</Link></Button>
            <Button variant="outline" asChild><Link href="/profile">Profile</Link></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="space-y-5">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2"><MessageSquareIcon className="h-5 w-5 text-blue-600" /><h2 className="font-semibold">Recent discussions</h2></div>
            <div className="space-y-3">
              {threads.length ? threads.map(thread => <Link key={thread.id} href="/discussions" className="block rounded-lg border p-3 hover:bg-gray-50"><strong className="line-clamp-2 text-sm">{thread.title}</strong><span className="mt-1 block text-xs text-gray-500">{thread.group?.name || "Group discussion"}</span></Link>) : <p className="text-sm text-gray-500">No discussions yet.</p>}
            </div>
            <Link href="/discussions" className="mt-3 block text-sm font-medium text-blue-600">View discussions →</Link>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Feed topics</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.length ? topics.map(topic => <span key={topic} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{topic}</span>) : <span className="text-sm text-gray-500">Topics will appear as content is added.</span>}
            </div>
          </Card>
        </aside>

        <section>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your feed</h2>
            <p className="mt-2 text-gray-600">Useful reading plus what is happening in your DadConnect communities.</p>
          </div>

          {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          {currentCard ? (
            <>
              <div className="mx-auto max-w-sm">
                <ContentCard {...currentCard} saved={savedIds.has(currentCard.id)} onSave={save} onSkip={() => moveNext()} onTap={() => setSelectedArticle(currentCard)} />
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">Item {currentIndex+1} of {content.length}</div>
            </>
          ) : (
            <Card className="p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-900">No reading items yet</h3>
              <p className="mt-2 text-sm text-gray-600">The content catalog is empty, but the community areas below are live.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild><Link href="/discussions">Discussions</Link></Button>
                <Button variant="outline" asChild><Link href="/groups">Groups</Link></Button>
                <Button variant="outline" asChild><Link href="/meetups">Meetups</Link></Button>
              </div>
            </Card>
          )}

          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2"><CalendarDaysIcon className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold">Upcoming meetups</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {meetups.length ? meetups.map(meetup => <Link key={meetup.id} href={`/meetups/${meetup.id}`} className="rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"><strong className="block">{meetup.title}</strong><span className="mt-1 block text-xs text-gray-500">{new Date(meetup.startTime).toLocaleString()} · {meetup.currentAttendees} going</span></Link>) : <p className="text-sm text-gray-500">No upcoming meetups yet.</p>}
            </div>
          </section>
        </section>

        <aside className="space-y-5">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2"><UsersIcon className="h-5 w-5 text-blue-600" /><h2 className="font-semibold">Suggested groups</h2></div>
            <div className="space-y-3">
              {groups.length ? groups.map(group => <div key={group.id} className="rounded-lg border p-3"><strong className="block text-sm">{group.name}</strong><span className="mt-1 block text-xs text-gray-500">{group.memberCount} members · {group.topics.slice(0,2).join(", ") || "community"}</span></div>) : <p className="text-sm text-gray-500">No groups yet.</p>}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild><Link href="/groups">Explore groups</Link></Button>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Your activity</h2>
            <div className="mt-3 flex items-center justify-between text-sm"><span className="text-gray-600">Saved items</span><strong>{savedCount}</strong></div>
            <p className="mt-3 text-xs text-gray-500">Activity numbers come from your account data, not demo counters.</p>
          </Card>
        </aside>
      </div>

      <ArticleModal isOpen={Boolean(selectedArticle)} onClose={() => setSelectedArticle(null)} article={selectedArticle} />
    </main>
  )
}
