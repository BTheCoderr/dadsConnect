"use client"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, Share2Icon, Trash2Icon } from "lucide-react"

interface LibraryItemCardProps {
  id: string
  source: string
  title: string
  image: string
  excerpt: string
  readTime: string
  readStatus: boolean
  onToggleReadStatus: (id: string) => void
  onShare: (id: string) => void
  onDelete: (id: string) => void
}

export default function LibraryItemCard({
  id,
  source,
  title,
  image,
  excerpt,
  readTime,
  readStatus,
  onToggleReadStatus,
  onShare,
  onDelete,
}: LibraryItemCardProps) {
  return (
    <Card className="flex w-full flex-col overflow-hidden rounded-lg shadow-sm md:flex-row">
      <div className="relative h-32 w-full flex-shrink-0 md:h-auto md:w-40">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 15vw"
        />
      </div>
      <CardContent className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{source}</p>
          <CardTitle className="text-lg font-bold leading-tight">{title}</CardTitle>
          <CardDescription className="mt-1 text-sm line-clamp-2">{excerpt}</CardDescription>
          <p className="mt-2 text-xs text-muted-foreground">{readTime} read</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={readStatus ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleReadStatus(id)}
            className={readStatus ? "" : "bg-transparent"}
          >
            <CheckCircleIcon className="mr-2 h-4 w-4" />
            {readStatus ? "Read" : "Mark as Read"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onShare(id)} className="bg-transparent">
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
