import { jsonOk } from "@/lib/http"

export async function GET() {
  return jsonOk({ version: "0.1.0", requestId: crypto.randomUUID() })
}


