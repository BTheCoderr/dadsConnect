"use client"

import Image from "next/image"
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon,XIcon } from "lucide-react"

interface ArticleModalProps {
  isOpen:boolean
  onClose:() => void
  article:{
    id:string
    source:string
    title:string
    image:string
    excerpt:string
    readTime:string
    url:string
  } | null
}

export default function ArticleModal({isOpen,onClose,article}:ArticleModalProps){
  if(!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 sm:max-w-lg md:max-w-2xl">
        <DialogHeader className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image src={article.image || "/placeholder.svg?height=200&width=600"} alt={article.title} fill style={{objectFit:"cover"}} priority sizes="(max-width: 768px) 100vw, 700px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-100">{article.source || "DadConnect"}</DialogDescription>
            <p className="text-xs text-gray-200">{article.readTime} read</p>
          </div>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-white hover:bg-white/20 hover:text-white" onClick={onClose}>
            <XIcon className="h-5 w-5" /><span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="space-y-5 p-5 sm:p-6">
          <p className="leading-7 text-gray-700 dark:text-gray-200">{article.excerpt || "No summary is available for this item yet."}</p>
          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a href={article.url} target="_blank" rel="noreferrer"><ExternalLinkIcon className="mr-2 h-4 w-4" />Open source</a>
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
