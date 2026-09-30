import { jsonOk } from "@/lib/http"

// Portfolio deploy refresh: keeps the deployed web build aligned with main.
export async function GET() {
  return jsonOk({ version: "0.1.0", requestId: crypto.randomUUID() })
}


