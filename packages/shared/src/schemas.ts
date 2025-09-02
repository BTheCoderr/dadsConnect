import { z } from "zod"

export const paginationCursorSchema = z.object({
  cursor: z.string().optional(),
})

export const saveCreateSchema = z.object({
  contentId: z.string(),
  note: z.string().optional(),
})

export const reportSchema = z.object({
  targetType: z.enum(["user", "content", "thread", "reply"]).default("content"),
  targetId: z.string(),
  reason: z.string().min(3),
})


