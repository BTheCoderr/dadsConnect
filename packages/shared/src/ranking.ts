import type { ContentItem } from "./types"

export interface RankingContext {
  interests: string[]
  mutedSourceIds?: string[]
}

export function rankFeed(items: ContentItem[], ctx: RankingContext): ContentItem[] {
  const muted = new Set(ctx.mutedSourceIds ?? [])
  const scored = items
    .filter((i) => !muted.has(i.sourceId))
    .map((i) => ({
      item: i,
      score:
        (i.topics?.some((t) => ctx.interests.includes(t)) ? 10 : 0) +
        Math.max(0, 5 - Math.min(5, ageInDays(i.publishedAt) / 2)),
    }))
  return scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item)
}

function ageInDays(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}


