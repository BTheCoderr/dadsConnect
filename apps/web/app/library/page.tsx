"use client"
import { useEffect, useState } from "react"
import LibraryItemCard from "@/components/library-item-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

interface SavedContentItem {
  id: string
  source: string
  title: string
  image: string
  excerpt: string
  readTime: string
  readStatus: boolean
}

export default function LibraryPage() {
  const [savedItems, setSavedItems] = useState<SavedContentItem[]>([])
  useEffect(() => {
    fetch(`/api/library`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const normalized: SavedContentItem[] = (data.items ?? []).map((i: any) => ({
          id: i.id,
          source: i.source ?? "",
          title: i.title ?? "",
          image: i.image ?? "/placeholder-vk2kx.png",
          excerpt: i.excerpt ?? "",
          readTime: `${i.read_time ?? 5} min`,
          readStatus: (i.read_status ?? "unread") === "read",
        }))
        setSavedItems(normalized)
      })
      .catch(() => {})
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest") // 'newest', 'oldest', 'read', 'unread'

  const filteredAndSortedItems = savedItems
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.id.localeCompare(a.id) // Simple ID comparison for demo
      } else if (sortBy === "oldest") {
        return a.id.localeCompare(b.id)
      } else if (sortBy === "read") {
        return a.readStatus === b.readStatus ? 0 : a.readStatus ? -1 : 1
      } else if (sortBy === "unread") {
        return a.readStatus === b.readStatus ? 0 : a.readStatus ? 1 : -1
      }
      return 0
    })

  const handleToggleReadStatus = (id: string) => {
    setSavedItems((prev) => prev.map((item) => (item.id === id ? { ...item, readStatus: !item.readStatus } : item)))
  }

  const handleShare = (id: string) => {
    const itemToShare = savedItems.find((item) => item.id === id)
    if (itemToShare) {
      alert(`Sharing: ${itemToShare.title}`)
      // In a real app, you'd use the Web Share API or a custom share modal
    }
  }

  const handleDelete = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id))
    alert(`Deleted item: ${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 md:mt-0 mt-16">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Your Saved Library</h2>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search saved items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4">
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item) => (
            <LibraryItemCard
              key={item.id}
              {...item}
              onToggleReadStatus={handleToggleReadStatus}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No saved items found.</p>
        )}
      </div>
    </div>
  )
}
