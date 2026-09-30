"use client"

import { useEffect,useMemo,useState } from "react"
import Link from "next/link"
import LibraryItemCard from "@/components/library-item-card"
import { Input } from "@/components/ui/input"
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

interface SavedContentItem {
  id:string
  contentId:string
  source:string
  title:string
  image:string
  excerpt:string
  readTime:string
  readStatus:boolean
  url:string
  savedAt:string
}

export default function LibraryPage(){
  const [savedItems,setSavedItems]=useState<SavedContentItem[]>([])
  const [searchTerm,setSearchTerm]=useState("")
  const [sortBy,setSortBy]=useState("newest")
  const [loading,setLoading]=useState(true)
  const [pendingId,setPendingId]=useState<string | null>(null)
  const [message,setMessage]=useState<string | null>(null)
  const [error,setError]=useState<string | null>(null)

  const load=async () => {
    setError(null)
    try{
      const response=await fetch("/api/library",{credentials:"include"})
      if(response.status === 401){
        window.location.href="/login"
        return
      }
      const data=await response.json()
      if(!response.ok) throw new Error(data.error || "Failed to load library")
      setSavedItems((data.items || []).map((item:any) => ({
        id:item.id,
        contentId:item.content_id,
        source:item.source || "",
        title:item.title || "",
        image:item.image || "/placeholder-vk2kx.png",
        excerpt:item.excerpt || "",
        readTime:`${item.read_time || 5} min`,
        readStatus:(item.read_status || "unread") === "read",
        url:item.url || "",
        savedAt:item.saved_at,
      })))
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to load library")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void load() },[])

  const filteredAndSortedItems=useMemo(() => {
    const term=searchTerm.trim().toLowerCase()
    return [...savedItems]
      .filter(item => !term || item.title.toLowerCase().includes(term) || item.source.toLowerCase().includes(term))
      .sort((a,b) => {
        if(sortBy === "newest") return new Date(b.savedAt).getTime()-new Date(a.savedAt).getTime()
        if(sortBy === "oldest") return new Date(a.savedAt).getTime()-new Date(b.savedAt).getTime()
        if(sortBy === "read") return Number(b.readStatus)-Number(a.readStatus)
        if(sortBy === "unread") return Number(a.readStatus)-Number(b.readStatus)
        return 0
      })
  },[savedItems,searchTerm,sortBy])

  const toggleRead=async (id:string) => {
    const item=savedItems.find(saved => saved.id === id)
    if(!item) return
    setPendingId(id);setError(null);setMessage(null)
    try{
      const response=await fetch(`/api/save/${id}`,{
        method:"PATCH",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({readStatus:item.readStatus ? "unread" : "read"}),
      })
      const data=await response.json().catch(() => ({}))
      if(!response.ok) throw new Error(data.error || "Failed to update saved item")
      setSavedItems(current => current.map(saved => saved.id === id ? {...saved,readStatus:data.readStatus === "read"} : saved))
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to update saved item")
    }finally{setPendingId(null)}
  }

  const share=async (id:string) => {
    const item=savedItems.find(saved => saved.id === id)
    if(!item) return
    setMessage(null);setError(null)
    try{
      if(navigator.share && item.url){
        await navigator.share({title:item.title,text:item.excerpt,url:item.url})
        setMessage("Shared.")
      }else if(item.url){
        await navigator.clipboard.writeText(item.url)
        setMessage("Link copied.")
      }else{
        setMessage("This saved item does not have a source link yet.")
      }
    }catch(error){
      if(error instanceof DOMException && error.name === "AbortError") return
      setError("Could not share this item.")
    }
  }

  const remove=async (id:string) => {
    const item=savedItems.find(saved => saved.id === id)
    if(!item) return
    if(!window.confirm(`Remove “${item.title}” from your library?`)) return
    setPendingId(id);setError(null);setMessage(null)
    try{
      const response=await fetch(`/api/save/${id}`,{method:"DELETE",credentials:"include"})
      if(!response.ok && response.status !== 204){
        const data=await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to delete saved item")
      }
      setSavedItems(current => current.filter(saved => saved.id !== id))
      setMessage("Removed from your library.")
    }catch(error){
      setError(error instanceof Error ? error.message : "Failed to delete saved item")
    }finally{setPendingId(null)}
  }

  if(loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading your library…</div>

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your saved library</h1><p className="mt-2 text-sm text-muted-foreground">Everything here is tied to your DadConnect account.</p></div>
        <Link href="/feed" className="text-sm font-medium text-blue-600">← Back to feed</Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search title or source…" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} className="w-full pl-9" />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="read">Read first</SelectItem>
            <SelectItem value="unread">Unread first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      <div className="grid gap-4">
        {filteredAndSortedItems.length
          ? filteredAndSortedItems.map(item => <LibraryItemCard key={item.id} {...item} busy={pendingId === item.id} onToggleReadStatus={toggleRead} onShare={share} onDelete={remove} />)
          : <div className="rounded-xl border border-dashed p-10 text-center"><p className="text-muted-foreground">{savedItems.length ? "No saved items match that search." : "Your library is empty."}</p>{!savedItems.length && <Link href="/feed" className="mt-3 inline-block text-sm font-medium text-blue-600">Browse the feed →</Link>}</div>}
      </div>
    </main>
  )
}
