import { NextResponse } from "next/server"

type ErrorPayload = { ok: false; code: string; message: string; requestId?: string }
type OkPayload<T> = T & { requestId?: string }

function rid() {
  try {
    return crypto.randomUUID()
  } catch {
    return undefined
  }
}

export function jsonOk<T extends object>(data: T, init?: ResponseInit) {
  return NextResponse.json<OkPayload<T>>({ ...data, requestId: rid() }, init)
}

function jsonError(code: string, message: string, status: number, cause?: unknown) {
  // eslint-disable-next-line no-console
  if (cause) console.error(`[${code}]`, message, cause)
  return NextResponse.json<ErrorPayload>({ ok: false, code, message, requestId: rid() }, { status })
}

export const httpErrors = {
  badRequest: (msg = "Bad request") => jsonError("bad_request", msg, 400),
  unauthorized: (msg = "Unauthorized") => jsonError("unauthorized", msg, 401),
  forbidden: (msg = "Forbidden") => jsonError("forbidden", msg, 403),
  notFound: (msg = "Not found") => jsonError("not_found", msg, 404),
  tooMany: (msg = "Too many requests") => jsonError("rate_limited", msg, 429),
  server: (msg = "Server error", cause?: unknown) => jsonError("server_error", msg, 500, cause),
}


