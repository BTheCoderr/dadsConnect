"use client"
import Image from "next/image"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, XIcon } from "lucide-react"

interface ContentCardProps {
  id: string
  source: string
  title: string
  image: string
  excerpt: string
  readTime: string
  onSave: (id: string) => void
  onSkip: (id: string) => void
  onTap: (id: string) => void
}

export default function ContentCard({
  id,
  source,
  title,
  image,
  excerpt,
  readTime,
  onSave,
  onSkip,
  onTap,
}: ContentCardProps) {
  return (
    <Card className="relative flex h-[400px] w-full flex-col overflow-hidden rounded-xl shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg?height=200&width=400"}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-medium">{source}</p>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <CardDescription className="text-sm line-clamp-3">{excerpt}</CardDescription>
          <p className="text-xs text-muted-foreground">{readTime} read</p>
        </div>
        <div className="flex justify-between gap-2 pt-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onSkip(id)}>
            <XIcon className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <Button className="flex-1" onClick={() => onSave(id)}>
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
        <Button variant="link" className="mt-2 w-full text-center" onClick={() => onTap(id)}>
          Tap to Read
        </Button>
      </CardContent>
    </Card>
  )
}
