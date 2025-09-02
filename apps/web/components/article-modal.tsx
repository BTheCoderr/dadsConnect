"use client"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: {
    id: string
    source: string
    title: string
    image: string
    excerpt: string
    readTime: string
  } | null
}

export default function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <DialogHeader className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={article.image || "/placeholder.svg?height=200&width=600"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>
            <DialogDescription className="text-sm font-medium">{article.source}</DialogDescription>
            <p className="text-xs text-gray-200">{article.readTime} read</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-white/20 hover:text-white"
            onClick={onClose}
          >
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="p-4 sm:p-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>{article.excerpt}</p>
            <p>
              This is a simulated article content. In a real application, you would fetch the full article text or embed
              a webview here.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
          <div className="mt-6 text-center">
            <Button onClick={onClose}>Close Article</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
