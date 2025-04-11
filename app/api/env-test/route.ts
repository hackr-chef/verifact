import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  // Return environment variable information (without revealing the full keys)
  return new Response(
    JSON.stringify({
      environment: process.env.NODE_ENV,
      openai_key_set: !!process.env.OPENAI_API_KEY,
      openai_key_prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : null,
      serpapi_key_set: !!process.env.SERPAPI_API_KEY,
      serpapi_key_prefix: process.env.SERPAPI_API_KEY ? process.env.SERPAPI_API_KEY.substring(0, 10) + '...' : null,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
