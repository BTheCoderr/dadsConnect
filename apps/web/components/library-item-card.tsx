"use client"

import Image from "next/image"
import { Card,CardContent,CardDescription,CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon,ExternalLinkIcon,Share2Icon,Trash2Icon } from "lucide-react"

interface LibraryItemCardProps {
  id:string
  source:string
  title:string
  image:string
  excerpt:string
  readTime:string
  readStatus:boolean
  url:string
  savedAt:string
  busy?:boolean
  onToggleReadStatus:(id:string) => void
  onShare:(id:string) => void
  onDelete:(id:string) => void
}

export default function LibraryItemCard({
  id,source,title,image,excerpt,readTime,readStatus,url,savedAt,busy=false,
  onToggleReadStatus,onShare,onDelete,
}:LibraryItemCardProps){
  return (
    <Card className="flex w-full flex-col overflow-hidden rounded-lg shadow-sm md:flex-row">
      <div className="relative h-32 w-full flex-shrink-0 md:h-auto md:w-40">
        <Image src={image || "/placeholder.svg"} alt={title} fill style={{objectFit:"cover"}}
          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none" sizes="(max-width: 768px) 100vw, 160px" />
      </div>
      <CardContent className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{source || "DadConnect"}</p>
          <CardTitle className="text-lg font-bold leading-tight">{title}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-sm">{excerpt}</CardDescription>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>{readTime} read</span>
            <span>Saved {new Date(savedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant={readStatus ? "default" : "outline"} size="sm" disabled={busy}
            onClick={() => onToggleReadStatus(id)} className={readStatus ? "" : "bg-transparent"}>
            <CheckCircleIcon className="mr-2 h-4 w-4" />{readStatus ? "Read" : "Mark as read"}
          </Button>
          {url && <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <a href={url} target="_blank" rel="noreferrer"><ExternalLinkIcon className="mr-2 h-4 w-4" />Open</a>
          </Button>}
          <Button variant="outline" size="sm" disabled={busy} onClick={() => onShare(id)} className="bg-transparent">
            <Share2Icon className="mr-2 h-4 w-4" />Share
          </Button>
          <Button variant="destructive" size="sm" disabled={busy} onClick={() => onDelete(id)}>
            <Trash2Icon className="mr-2 h-4 w-4" />Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
