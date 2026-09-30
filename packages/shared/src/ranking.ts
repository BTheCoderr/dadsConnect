import type { ContentItem } from "./types"

export interface RankingContext {
  interests: string[]
  mutedSourceIds?: string[]
}

export function rankFeed(items: ContentItem[], ctx: RankingContext): ContentItem[] {
  const muted=new Set(ctx.mutedSourceIds ?? [])
  const normalizedInterests=new Set(ctx.interests.map(value => value.trim().toLowerCase()).filter(Boolean))

  return items
    .filter(item => !item.sourceId || !muted.has(item.sourceId))
    .map(item => {
      const matchingTopics=item.topics.filter(topic => normalizedInterests.has(topic.trim().toLowerCase())).length
      const agePenalty=Math.min(5,ageInDays(item.publishedAt)/2)
      return {item,score:(matchingTopics*10)+Math.max(0,5-agePenalty)}
    })
    .sort((a,b) => b.score-a.score || new Date(b.item.publishedAt).getTime()-new Date(a.item.publishedAt).getTime())
    .map(entry => entry.item)
}

function ageInDays(iso:string):number {
  const time=new Date(iso).getTime()
  if(Number.isNaN(time)) return 3650
  return Math.max(0,Math.floor((Date.now()-time)/(1000*60*60*24)))
}
