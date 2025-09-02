import type { ContentItem } from "./types"

export interface RankingContext {
  interests: string[]
  mutedSourceIds?: string[]
}

export function rankFeed(items: ContentItem[], ctx: RankingContext): ContentItem[] {
  const muted = new Set(ctx.mutedSourceIds ?? [])
  const scored = items
    .filter((i) => !muted.has(i.id)) // Use id instead of sourceId
    .map((i) => ({
      item: i,
      score:
        (i.type && ctx.interests.includes(i.type) ? 10 : 0) + // Use type instead of topics
        Math.max(0, 5 - Math.min(5, ageInDays(i.createdAt) / 2)), // Use createdAt instead of publishedAt
    }))
  return scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item)
}

function ageInDays(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}


