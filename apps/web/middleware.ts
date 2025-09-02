import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

function corsResponse(req: NextRequest) {
  const origin = req.headers.get("origin") || "*"
  const res = new NextResponse(null, { status: 204 })
  res.headers.set("Access-Control-Allow-Origin", origin)
  res.headers.set("Vary", "Origin")
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", req.headers.get("access-control-request-headers") || "*")
  res.headers.set("Access-Control-Allow-Credentials", "true")
  return res
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return corsResponse(req)
    }
    const res = NextResponse.next()
    const origin = req.headers.get("origin") || "*"
    res.headers.set("Access-Control-Allow-Origin", origin)
    res.headers.set("Vary", "Origin")
    res.headers.set("Access-Control-Allow-Credentials", "true")
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}


